import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { GoVerifyBtn } from './go-verify-btn';

const InitialInfoModalContent = ({ remainAmount, unit }: { remainAmount: number; unit: string }) => {
  const { setApiState } = useApiContext();
  const { disabled } = useKycState();
  return (
    <div className='first-id-card'>
      <section className='top-user-auth'>
        <p className='title'>{LANG('用户权益')}</p>
        <div className='tips-item'>
          <CommonIcon name='common-verified-icon-0' size={14} className='verified-icon' enableSkin />
          {LANG('Withdraw')}: {remainAmount} {unit} {LANG('per day')}
        </div>
        <div className='tips-item'>
          <CommonIcon name='common-verified-icon-0' size={14} className='verified-icon' enableSkin />
          {LANG('Other: Many other bonuses')}
        </div>
      </section>
      <section className='bottom-cert-requirement'>
        <p className='title'>{LANG('Certification requirement')}</p>
        <div className='tips-item'>
          <Image enableSkin src='/static/images/account/dashboard/id-small-icon.svg' width={14} height={14} />
          <span>{LANG('Identity Document')}</span>
        </div>
        <div className='tips-item'>
          <Image enableSkin src='/static/images/account/dashboard/selfie-icon.svg' width={14} height={14} />
          <span>{LANG('Selfie')}</span>
        </div>
      </section>
      <GoVerifyBtn
        onBtnClick={() => {
          setApiState((draft) => {
            draft.pageStep = 'select-country';
          });
        }}
        disabled={disabled}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  :global(.basic-modal.user-verify-modal) {
    :global(.ant-modal-footer) {
      margin-top: 30px;
    }
    :global(.basic-content) {
      :global(.first-id-card) {
        :global(.top-user-auth) {
          background-color: var(--theme-background-color-3-2);
          padding: 14px 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          :global(.title) {
            color: var(--const-color-grey);
            font-size: 12px;
            margin-bottom: 13px;
          }
          :global(.tips-item) {
            background-color: var(--theme-background-color-2-3);
            padding: 8px 12px;
            color: var(--theme-font-color-1);
            margin-bottom: 10px;
            border-radius: 6px;
            :global(.verified-icon) {
              margin-right: 8px;
            }
          }
        }
        :global(.bottom-cert-requirement) {
          background-color: var(--theme-background-color-3-2);
          padding: 14px 15px;
          border-radius: 8px;
          :global(.title) {
            font-weight: 500;
            font-size: 16px;
            color: var(--theme-font-color-1);
            margin-bottom: 16px;
          }
          :global(.tips-item) {
            color: var(--theme-font-color-1);
            font-size: 14px;
            display: flex;
            align-items: center;
            :global(img) {
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
`;
export default InitialInfoModalContent;
