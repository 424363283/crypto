// 由于短信邮箱验证码是一次验证即失效，所以需要拆分GA验证码UI
import { InputVerificationCode } from '@/components/account/components/verification-code';
import { store } from '@/components/account/store';
import { Button } from '@/components/button';
import { postAccountBindPhoneApi } from '@/core/api';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n/src/page-lang';
import { LOCAL_KEY } from '@/core/store';
import { message } from '@/core/utils/src/message';
import { isCaptcha } from '@/core/utils/src/regexp';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { ACCOUNT_ROUTE_PATH } from '../constants';
import { hidePartialOfPhoneOrEmail } from '@/core/utils';

type PhoneVerifyProps = {
  token: string;
};
export const BindPhoneVerify = (props: PhoneVerifyProps) => {
  const { token } = props;
  const router = useRouter();
  const { state: routerState, routerStore } = router || {};
  const [shouldDisableBtn, setShouldDisableBtn] = useState(true);
  const { smsCode } = store;
  const { sence: _sence, countryCode, phone, countryId } = routerState || {};

  useEffect(() => {
    if (!isCaptcha(smsCode)) {
      setShouldDisableBtn(true);
    } else {
      setShouldDisableBtn(false);
    }
    return () => routerStore.clearCache('state');
  }, [smsCode]);

  const onVerifyPhoneCode = async () => {
    const res = await postAccountBindPhoneApi({
      code: smsCode,
      token: token,
      phone: countryCode + phone,
      countryId,
      reset: false,
    });
    if (res.code === 515) {
      message.error(res.message);
      // vHash过期，返回上一步
      router.back();
      return;
    }
    if (res.code !== 200) {
      message.error(res.message || LANG('短信验证码错误'));
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
    return res;
  };
  return (
    <div className='phone-verification-item'>
      <InputVerificationCode
        type={LOCAL_KEY.INPUT_VERIFICATION_PHONE}
        scene={_sence} withBorder autoSend={false}
        label={<p
          className='agree-item'
          dangerouslySetInnerHTML={{
            __html: LANG(`请输入发送至{type} {target} 的6位验证码`, { type: LANG('手机'), target: `<span class='varify-target'>${hidePartialOfPhoneOrEmail(countryCode + phone)}</span>` })
          }}
        ></p>}
      />
      <Button type='primary' disabled={shouldDisableBtn} height={50} width='100%' onClick={onVerifyPhoneCode}>
        {LANG('确定')}
      </Button>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .phone-verification-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
