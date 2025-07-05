import { Button } from '@/components/button';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account } from '@/core/shared/src/account';
import { message } from '@/core/utils/src/message';
import { store } from '../store';
import { ACCOUNT_TAB_KEY } from '../constants';

export const ForgetButton = (props: any) => {
  const { shouldDisableBtn } = props;
  const handleEmailForget = async () => {
    if (shouldDisableBtn) {
      return;
    }
    const { phone, countryCode, email, curTab } = store;
    const newPhone = countryCode + (phone || '').replace(/^0*/, '');
    const account = curTab === ACCOUNT_TAB_KEY.EMAIL ? email : newPhone;
    try {
      const result = await Account.securityVerify.accountVerify(account);
      if (result?.code !== 200) {
        store.showForgetEntry = true;
        message.error(result?.message);
      } else {
        store.showForgetEntry = false;
        store.showForgetStep = true;

        store.showGaVerify = result.data.verify_ga;
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  return (
    <Button
      type='primary'
      height={56}
      style={{ marginTop: '16px', width: '100%', padding: '14px 0', borderRadius: '56px' }}
      onClick={handleEmailForget}
      disabled={shouldDisableBtn}
    >
      {LANG('下一步')}
    </Button>
  );
};
