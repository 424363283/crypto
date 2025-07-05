import { AlertFunction, IdentityVerificationModal } from '@/components/modal';
import { getAccountKoreaKycStatus } from '@/core/api';
import { useRequestData, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useState } from 'react';

export const CheckKoreaKyc = () => {
  const router = useRouter();
  const [showIdVerifyModal, setIdVerifyModal] = useState(false);
  useRequestData(getAccountKoreaKycStatus, {
    enableCache: false,
    successCallback(data) {
      if (data.required) {
        AlertFunction({
          width: 376,
          centered: true,
          closable: false,
          onCancel() {
            router.replace('/');
          },
          content: LANG('根据监管要求，请先完成kyc认证'),
          onOk() {
            setIdVerifyModal(true);
          },
        });
      }
    },
  });
  return <IdentityVerificationModal open={showIdVerifyModal} onCancel={() => setIdVerifyModal(false)} />;
};
