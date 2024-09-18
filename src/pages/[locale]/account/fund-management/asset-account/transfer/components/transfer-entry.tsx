import { AlertFunction } from '@/components/modal/alert-function';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { useEffect } from 'react';
import { Transfer } from './transfer';

export const TransferEntry = ({
  hasQueryCode,
  getTransferHistoryData,
}: {
  hasQueryCode: boolean;
  getTransferHistoryData: () => void;
}) => {
  const router = useRouter();
  const checkBindEmailAlert = async () => {
    const users = await Account.getUserInfo();
    if (!users?.bindEmail) {
      AlertFunction({
        hideHeaderIcon: false,
        title: LANG('安全提示'),
        centered: true,
        content: LANG('为了您的账户安全，请先绑定邮箱再进行提币操作'),
        onOk() {
          router.replace('/account/dashboard?type=security-setting&option=bind-email');
        },
        onCancel() {
          router.replace('/account/fund-management/assets-overview');
        },
      });
    }
  };
  useEffect(() => {
    checkBindEmailAlert();
  }, []);

  return <Transfer getTransferHistoryData={getTransferHistoryData} hasQueryCode={hasQueryCode} />;
};
