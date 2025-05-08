import { AccountBox } from '@/components/account/components/account-box';
import { InputPhone } from '@/components/account/components/input-phone';
import { InputVerificationCode } from '@/components/account/components/verification-code';
import { store } from '@/components/account/store';
import { postAccountBindPhoneApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SENCE } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { MediaInfo, clsx, isPhoneNumber, message } from '@/core/utils';
import css from 'styled-jsx/css';

export default function ResetPhone() {
  const { phone, countryCode, countryId, smsCode } = store;
  const shouldDisableBtn = !isPhoneNumber(phone);
  const router = useRouter();
  const handleNewPhone = async () => {
    if (shouldDisableBtn) return;
    const result = await postAccountBindPhoneApi({
      code: smsCode,
      token: router.state.token,
      phone: countryCode + phone,
      countryId,
      reset: true,
    });
    if (result.code === 200) {
      await Account.logout();
      router.replace('/login');
    } else {
      message.error(result?.message || LANG('验证码错误'));
    }
  };
  return (
    <AccountBox title={LANG('重置手机验证')} prompt={LANG('为了您的资产安全，重置成功后24h内不允许提币')}>
      <div className='reset-phone-container'>
        <InputPhone withBorder label={LANG('新手机号')} placeholder={LANG('请输入新手机号')} />
        <InputVerificationCode type={LOCAL_KEY.INPUT_REGISTER_PHONE} scene={SENCE.BIND_PHONE} withBorder />
        <button
          className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
          onClick={handleNewPhone}
          style={{ marginTop: '10px', padding: 0 }}
        >
          {LANG('确定')}
        </button>
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .reset-phone-container {
    width: 530px;
    button {
      width: 100%;
    }
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
