import { AlertFunction } from '@/components/modal/alert-function';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { useEffect } from 'react';
import { Withdraw } from './withdraw';

export const WithdrawEntry = ({
  hasQueryCode,
  getWithdrawHistoryData,
}: {
  hasQueryCode: boolean;
  getWithdrawHistoryData: () => void;
}) => {
  const router = useRouter();
  const checkBindEmailAlert = async () => {
    const users = await Account.getUserInfo();
    if (!users?.bindEmail) {
      const locale = router?.query?.locale;
      AlertFunction({
        hideHeaderIcon: false,
        title: LANG('安全提示'),
        centered: true,
        content: LANG('为了您的账户安全，请先绑定邮箱再进行提币操作'),
        onOk() {
          // router.push 的形式页面会pending住 ，生产环境才会，尚不清楚原因
          window.location.href = `/${locale}/account/dashboard?type=security-setting&option=bind-email`;
        },
        onCancel() {
          window.location.href = `/${locale}/account/fund-management/assets-overview`;
        },
      });
    }
  };
  useEffect(() => {
    checkBindEmailAlert();
  }, []);

  return <Withdraw getWithdrawHistoryData={getWithdrawHistoryData} hasQueryCode={hasQueryCode} />;
};
