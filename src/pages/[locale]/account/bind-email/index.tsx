import { AccountBox } from '@/components/account/components/account-box';
import { InputEmail } from '@/components/account/components/input-email';
import { store } from '@/components/account/store';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { MediaInfo, clsx, isEmail } from '@/core/utils';
import css from 'styled-jsx/css';

export default function BindEmail() {
  const { email, countryCode, countryId } = store;
  const router = useRouter();
  const shouldDisableBtn = !isEmail(email);
  const handleNewEmail = () => {
    if (shouldDisableBtn) return;
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        sence: SENCE.BIND_EMAIL,
        email,
        countryCode,
        countryId,
      },
    });
  };
  return (
    <AccountBox title={LANG('开启邮箱验证')} prompt={LANG('邮箱验证用于提现和修改安全设置，开启后不可修改跟关闭')}>
      <div className='bind-email-container'>
        <InputEmail withBorder label={LANG('新邮箱地址')} placeholder={LANG('请输入邮箱地址')} />
        <button
          className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
          onClick={handleNewEmail}
          style={{ marginTop: '10px' }}
        >
          {LANG('确定')}
        </button>
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .bind-email-container {
    width: 530px;
    margin: auto;
    button {
      width: 100%;
    }
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
