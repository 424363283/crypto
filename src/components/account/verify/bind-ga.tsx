// 由于短信邮箱验证码是一次验证即失效，所以需要拆分GA验证码UI
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Button } from '@/components/button';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account } from '@/core/shared/src/account';
import { clsx } from '@/core/utils/src/clsx';
import { message } from '@/core/utils/src/message';
import { isCaptcha } from '@/core/utils/src/regexp';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { ACCOUNT_ROUTE_PATH } from '../constants';
import { Size } from '@/components/constants';
import { MediaInfo } from '@/core/utils';

type GaVerifyProps = {
  token: string;
  secret: string;
  prev?: (num?: number) => void;
};
export const BindGaVerify = (props: GaVerifyProps) => {
  const { token, secret, prev } = props;
  const router = useRouter();
  const { state: routerState, routerStore } = router || {};
  const [gaCode, setGaCode] = useState('');
  const [shouldDisableBtn, setShouldDisableBtn] = useState(true);

  useEffect(() => {
    return () => routerStore.clearCache('state');
  }, []);

  const onGaInputChange = (code: string) => {
    setGaCode(code);
    if (!isCaptcha(code)) {
      setShouldDisableBtn(true);
    } else {
      setShouldDisableBtn(false);
    }
  };
  const handleVerifyGaCode = async () => {
    const res = await Account.googleSecret.bindGoogleSecret({
      code: gaCode,
      token: token,
      secret: secret || '',
      reset: false,
    });
    // ga错误是500, token错误是515
    // 515是是token错误, 需要重新走安全认证, 4001是通过了安全认证生成了谷歌secret二维码, 但是绑定的时候secret错误
    if (res.code === 515 || res.code === 4001) {
      message.error(res.message);
      // vHash过期，返回上一步
      if (prev) {
        prev(3);
      } else {
        router.back();
      }
      return;
    }
    if (res.code !== 200) {
      message.error(res.message);
      return;
    } else {
      message.success(LANG('操作成功'));
      await router.push(
        {
          pathname: ACCOUNT_ROUTE_PATH.SECURITY_SETTING.PATHNAME,
          query: ACCOUNT_ROUTE_PATH.SECURITY_SETTING.QUERY,
        },
        undefined,
        { shallow: true }
      );
    }
    if (routerState?.reset) {
      await Account.logout();
      router.replace('/login');
    }
    return res;
  };
  return (
    <div className='ga-verification-item'>
      <BasicInput
        label={LANG('谷歌验证码')}
        placeholder={LANG('请输入Google验证码')}
        type={INPUT_TYPE.CAPTCHA}
        value={gaCode}
        size={Size.XL}
        withBorder
        onInputChange={onGaInputChange}
      />
      <Button
        type='primary'
        className={clsx('ga-confirm-btn')}
        disabled={shouldDisableBtn}
        width='100%'
        onClick={handleVerifyGaCode}
      >
        {LANG('确定')}
      </Button>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .ga-verification-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    :global(.basic-input-box){
      input{
        height:56px;
        line-height:56px;
        @media ${MediaInfo.mobileOrTablet} {
          height:48px;
          line-height:48px;
        }
      }
    }
    :global(.common-button){
      height:56px;
      line-height:56px;
      border-radius: 28px;
    }
  }
`;
