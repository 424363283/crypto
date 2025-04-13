import { useKycState, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { clsx } from '@/core/utils';
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
import { MediaInfo } from '@/core/utils';
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
  const { isLoadingKycState, updateKYCAsync, kycState,disabled } = useKycState();
  const { showUploadFile } = useKycResult();
  const { apiState, setApiState } = useApiContext();
  const { showUploadPage, pageStep } = apiState;

  const { kyc } = kycState;
  const STEP_CONTENT_MAP: any = {
    init: <InitialInfoModalContent remainAmount={remainAmount} unit={unit} />,
    result: <ResultCard />,
    'select-country': <SelectCountryContent />,
    'onfido-verify': <OnfidoModalContent />,
    'upload-identify': <UploadIDInfo />,
    'upload-selfie': <UploadSelfie onVerifiedDone={onVerifiedDone} />
  };
  useEffect(() => {
    setApiState(draft => {
      draft.showUploadPage = showUploadFile;
    });
  }, [showUploadFile]);

  const STEP_TITLE_MAP: any = {
    init: LANG('身份认证'),
    'select-country': LANG('选择国家/地区'),
    'upload-identify': LANG('上传身份信息'),
    'upload-selfie': LANG('Upload a selfie photo')
  };

  const STATUS_TITLE_MAP: any = {
    1: LANG('审核中'),
    2: LANG('认证失败'),
    3: LANG('认证成功')
  };

  if (!open) return null;
  if (!Account.isLogin) {
    router.push('/login');
    return null;
  }

  const onCloseModal = (evt: any) => {
    setApiState(draft => {
      draft.pageStep = showUploadFile ? 'init' : 'result';
    });
    updateKYCAsync(true);
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
    <>
      <BasicModal
        width={'480px'}
        open={open}
        title={kyc > 0 && !showUploadPage ? STATUS_TITLE_MAP[kyc] : STEP_TITLE_MAP[pageStep]}
        closable
        className={clsx(
          'user-verify-modal',
          kyc > 0 && !showUploadPage ? 'kycStatus' : '',
          showUploadPage ? '' : `kycStatus${kyc}`
        )}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={onCloseModal}
        {...props}
        destroyOnClose
        hasFooter={false}
      >
        {renderModalContent()}
        <style jsx>{styles}</style>
      </BasicModal>
    </>
  );
};
const styles = css`
  :global(.basic-modal.user-verify-modal) {
    :global(.basic-content) {
      padding: 8px 0 !important;
    }
    :global(.ant-modal-content) {
      padding: 24px;
    }
    :global(.ant-modal-header .ant-modal-title) {
      padding: 0;
      font-size: 14px;
      font-weight: 500;

      color: var(--text-primary);
      text-align: justify;
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 100% */
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
  :global(.basic-modal.kycStatus) {

    :global(.ant-modal-header .ant-modal-title) {
      padding: 0 0 18px;
      font-family: 'HarmonyOS Sans SC';
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 100% */
    }
  }

  :global(.basic-modal.kycStatus1) {
 
    :global(.result-box .main .prompt) {
      background-color: var(--yellow_tips, rgba(240, 186, 48, 0.1)) !important;
      color: var(--yellow, #f0ba30) !important;
      
    }
  }

  :global(.basic-modal.kycStatus2) {
    :global(.basic-content) {
      padding: 0 !important;
    }
    :global(.result-box .main .prompt) {
      background: var(--red_light, rgba(239, 69, 74, 0.1)) !important;
      color: var(--red, #f0ba30);
    }
  }

  :global(.basic-modal.kycStatus3) {
    :global(.basic-content) {
      padding: 0 !important;
    }
    :global(.result-box .main .prompt) {
      background-color: rgba(7,130,139,0.2) !important;
      color: var(--red-light, #07828B);
    }
  }


  :global(.custom-bottom-content){

    :global(.common-button) {
      @media ${MediaInfo.mobileOrTablet} {
      width: 100%;
      }
    }
  }

 


  
`;
export default IdentityVerificationModal;
