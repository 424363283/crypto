import { AccountBox } from '@/components/account/components/account-box';
import { LANG } from '@/core/i18n';
import { ResetFundPwdForm } from './components/form';

export function ResetFundsPassword() {
  return (
    <AccountBox title={LANG('忘记资金密码')} prompt={LANG('为了您的资产安全，修改密码后24h内不允许提币')}>
      <ResetFundPwdForm />
    </AccountBox>
  );
}
