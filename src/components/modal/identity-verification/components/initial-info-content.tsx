import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { GoVerifyBtn } from './go-verify-btn';
import YIcon from '@/components/YIcons';
import { MediaInfo } from '@/core/utils';

const InitialInfoModalContent = ({ remainAmount, unit }: { remainAmount: number; unit: string }) => {
  const { setApiState } = useApiContext();
  const { disabled } = useKycState();
  return (
    <div className="first-id-card">
      <section className="top-user-auth">
        <p className="title">{LANG('用户权益')}</p>
        <div className="tips-item">
          <YIcon.checkIcon />
          {LANG('提现额度')}: {remainAmount} {unit}/{LANG('天')}
        </div>
        <div className="tips-item">
          <YIcon.checkIcon />
          {LANG('Other: Many other bonuses')}
        </div>
      </section>
      <section className="bottom-cert-requirement">
        <p className="title">{LANG('Certification requirement')}</p>
        <div className="tips-item">
          <YIcon.idCard />
          <span>{LANG('Identity Document')}</span>
        </div>
        <div className="tips-item">
          <YIcon.photoIcon />
          <span>{LANG('Selfie')}</span>
        </div>
      </section>
      <GoVerifyBtn
        onBtnClick={() => {
          setApiState(draft => {
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
      padding: 0 !important;
      :global(.first-id-card) {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin: 24px 0 0;
        :global(.top-user-auth),
        :global(.bottom-cert-requirement) {
          border-radius: 8px;
          background: var(--fill_3);
          display: flex;
          padding: 12px 16px;
          flex-direction: column;
          justify-content: center;
          gap: 8px;

          :global(.title) {
            color: var(--text_2);
            font-family: 'HarmonyOS Sans SC';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
          }
          :global(.tips-item) {
            display: flex;
            padding: 12px;
            align-items: center;
            gap: 10px;
            align-self: stretch;
            border-radius: 8px;
            background: var(--fill_bg_1);

            color: var(--text_1);
            font-family: 'HarmonyOS Sans SC';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
          }
        }

        :global(.footer-button) {
          margin-top: 0;
          border-radius: 40px;
          background: var(--text_brand);
          display: flex;
          height: 48px;
          padding: 0px 16px;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
          :global(.nui-primary) {
            &:hover {
              background: none;
            }
          }
          @media ${MediaInfo.mobile} {
            padding: 0;
            background: rgba(0, 0, 0, 0);
            :global(button) {
              height: 48px;
              padding: 0;
              margin: 0;
              border-radius: 48px;
            }
          }
        }
      }
    }
  }
`;
export default InitialInfoModalContent;
