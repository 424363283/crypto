import { AccountBox } from '@/components/account/components/account-box';
import { InputEmail } from '@/components/account/components/input-email';
import { InputVerificationCode } from '@/components/account/components/verification-code';
import { store } from '@/components/account/store';
import { postAccountBindEmailApi } from '@/core/api';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { Account, SENCE } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { MediaInfo, clsx, isEmail, message } from '@/core/utils';
import css from 'styled-jsx/css';

export default function ResetEmail() {
  const { email, emailCode } = store;
  const router = useRouter();
  const shouldDisableBtn = !isEmail(email);
  const handleNewEmail = async () => {
    if (shouldDisableBtn) return;
    const result = await postAccountBindEmailApi({
      code: emailCode,
      token: router.state.token,
      email,
      reset: true,
    });
    if (result.code === 200) {
      await Account.logout();
      router.replace('/login');
    } else {
      message.error(result.message);
    }
  };
  return (
    <AccountBox title={LANG('开启邮箱验证')} prompt={LANG('邮箱验证用于提现和修改安全设置，开启后不可修改跟关闭')}>
      <div className='reset-email-container'>
        <InputEmail withBorder label={LANG('新邮箱地址')} placeholder={LANG('请输入邮箱地址')} />
        <InputVerificationCode
          label={LANG('新邮箱验证码')}
          type={LOCAL_KEY.INPUT_REGISTER_EMAIL}
          scene={SENCE.BIND_EMAIL}
          withBorder
        />
        <button
          className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
          onClick={handleNewEmail}
          style={{ marginTop: '10px' }}
        >
          {LANG('下一步')}
        </button>
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .reset-email-container {
    width: 530px;
    button {
      width: 100%;
    }
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
