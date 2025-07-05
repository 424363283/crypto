import { AccountBox } from '@/components/account/components/account-box';
import { InputPhone } from '@/components/account/components/input-phone';
import { store } from '@/components/account/store';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { MediaInfo, clsx, isPhoneNumber } from '@/core/utils';
import css from 'styled-jsx/css';

export default function BindPhone() {
  const { phone, countryCode, countryId } = store;
  const router = useRouter();
  const shouldDisableBtn = !isPhoneNumber(phone);
  const handleNewPhone = () => {
    if (shouldDisableBtn) return;
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        sence: SENCE.BIND_PHONE,
        phone,
        countryCode,
        countryId,
      },
    });
  };
  return (
    <AccountBox title={LANG('绑定手机')} prompt={LANG('手机验证用于提现和修改安全设置，可以关闭手机验证和重新绑定')}>
      <div className='phone-container'>
        <InputPhone withBorder label={LANG('新手机号')} placeholder={LANG('请输入新手机号')} />
        <button
          className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
          onClick={handleNewPhone}
          style={{ marginTop: '10px', padding: 0 }}
        >
          {LANG('提交')}
        </button>
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .phone-container {
    width: 530px;
    margin:auto;
    button {
      width: 100%;
      background: var(--brand);
      color: #fff;
    }
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
