import { ITransfer, IWitdraw, VerifyForm } from '@/components/account/verify';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { BasicModal, BasicProps } from '.';

interface Props extends BasicProps {
  visible: boolean;
  onCancel: () => void;
  onDone?: (success: boolean) => void;
  transferData?: ITransfer;
  withdrawData?: IWitdraw;
  sence?: SENCE;
}

const SafetyVerificationModal: React.FC<Props> = ({
  visible,
  onCancel,
  onDone,
  transferData,
  withdrawData,
  sence,
  ...rest
}) => {
  return (
    <BasicModal
      open={visible}
      onCancel={onCancel}
      title={LANG('安全验证')}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
      {...rest}
    >
      <div className='security-verify-content'>
        <div className='subtitle'>{LANG('为了您的资产安全，请完成以下验证操作')}</div>
        <VerifyForm
          modelSence={sence}
          onDone={onDone}
          transferData={transferData}
          withdrawData={withdrawData}
          autoSend
        />
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};
const styles = css`
  .security-verify-content {
    width: 440px;
    padding: 10px 10px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    :global(.verify-form) {
      width: 440px;
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
    }
    .subtitle {
      font-size: 15px;
      font-weight: 500;
      color: #798296;
      line-height: 21px;
      margin-bottom: 30px;
    }
    .submit {
      margin-top: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50px;
      background: var(--skin-primary-color);
      border-radius: 4px;
      font-size: 15px;
      font-weight: 500;
      color: #232e34;
      &.disabled {
        pointer-events: none;
        background: #d2d7e7;
        color: #fff;
      }
    }
    .full {
      width: 100%;
    }
  }
`;
export default SafetyVerificationModal;
