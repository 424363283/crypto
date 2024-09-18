import { AccountBox } from '@/components/account/components/account-box';
import { LANG } from '@/core/i18n';
import { ResetPwdForm } from './components/form';

export function ResetLoginPassword() {
  return (
    <AccountBox title={LANG('修改登录密码')}>
      <ResetPwdForm />
    </AccountBox>
  );
}
