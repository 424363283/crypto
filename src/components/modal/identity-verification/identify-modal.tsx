import { useKycState, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { BasicModal } from '..';
import { BasicProps } from '../basic-modal';
import { OnfidoModalContent } from './components/onfido';
import { ResultCard } from './components/result-card';
import { SelectCountryContent } from './components/select-country';
import { UploadSelfie } from './components/upload-selfie';
import { UploadIDInfo } from './components/upload-user-info';
import { useApiContext } from './context';
import { useKycResult } from './useKycResult';
const InitialInfoModalContent = dynamic(() => import('./components/initial-info-content'), { ssr: false });

// 相当于旧的kyc认证页面
type IProps = {
  onVerifiedDone?: () => void;
  remainAmount?: number;
  unit?: string;
} & BasicProps;
const IdentityVerificationModal = (props: IProps) => {
  const { open, onCancel, onVerifiedDone, remainAmount = 0, unit = 'BTC' } = props;
  const router = useRouter();
  const { isLoadingKycState, updateKYCAsync } = useKycState();
  const { showUploadFile } = useKycResult();
  const { apiState, setApiState } = useApiContext();
  const { showUploadPage, pageStep } = apiState;
  const STEP_CONTENT_MAP: any = {
    init: <InitialInfoModalContent remainAmount={remainAmount} unit={unit} />,
    result: <ResultCard />,
    'select-country': <SelectCountryContent />,
    'onfido-verify': <OnfidoModalContent />,
    'upload-identify': <UploadIDInfo />,
    'upload-selfie': <UploadSelfie onVerifiedDone={onVerifiedDone} />,
  };
  useEffect(() => {
    setApiState((draft) => {
      draft.showUploadPage = showUploadFile;
    });
  }, [showUploadFile]);

  const STEP_TITLE_MAP: any = {
    init: LANG('身份认证'),
    'select-country': LANG('选择国家'),
    'upload-identify': LANG('上传身份信息'),
    'upload-selfie': LANG('上传身份信息'),
  };
  if (!open) return null;
  if (!Account.isLogin) {
    router.push('/login');
    return null;
  }

  const onCloseModal = (evt: any) => {
    setApiState((draft) => {
      draft.pageStep = showUploadFile ? 'init' : 'result';
    });
    updateKYCAsync();
    onCancel?.(evt);
  };
  const renderModalContent = () => {
    if (isLoadingKycState) return null;
    if (showUploadPage) {
      return STEP_CONTENT_MAP[pageStep];
    }
    return <ResultCard />;
  };
  return (
    <BasicModal
      open={open}
      title={STEP_TITLE_MAP[pageStep]}
      closable
      className='user-verify-modal'
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
      {...props}
      onCancel={onCloseModal}
      destroyOnClose
    >
      {renderModalContent()}
      <style jsx>{styles}</style>
    </BasicModal>
  );
};
const styles = css`
  :global(.basic-modal.user-verify-modal) {
    :global(.ant-modal-header .ant-modal-title) {
      font-size: 14px;
      font-weight: 500;
    }
    :global(.footer-button) {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 30px;
      margin-bottom: 0px;
      :global(.ok-button) {
        width: 100%;
        height: 40px;
      }
      :global(.cancel-button) {
        width: 100%;
        height: 40px;
        margin-right: 12px;
      }
    }
  }
`;
export default IdentityVerificationModal;
