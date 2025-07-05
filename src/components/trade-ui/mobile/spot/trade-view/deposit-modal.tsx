import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { LANG, TrLink } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';

interface DepositModalProps {
  coin: string;
  visible: boolean;
  onClose: () => void;
  openTransfer: () => void;
}

const DepositModal = (props: DepositModalProps) => {
  const { coin, visible, onClose, openTransfer } = props;
  return (
    <MobileModal visible={visible} onClose={onClose} type="bottom">
      <BottomModal title={LANG('账户入金')} displayConfirm={false} className='deposit-modal'>
        <div className="deposit-container">
          <span className="hint">{LANG('您可以选择最合适的方式来为您的账户入金')}</span>
          <div className="action-wrapper" onClick={() => openTransfer()}>
            <div className="icon-wrap">
              <CommonIcon name="common-deposit-transfer-0" size={20} />
            </div>
            <div className="text-wrap">
              <div className="title">{LANG('划转')}</div>
              <div className="subtitle">{LANG('从您的内部账户划转资金')}</div>
            </div>
          </div>
          <TrLink
            href="/account/fund-management/asset-account/recharge"
            query={{ code: coin }}
            className="action-wrapper"
          >
            <div className="icon-wrap">
              <CommonIcon name="common-deposit-recharge-0" size={20} />
            </div>
            <div className="text-wrap">
              <div className="title">{LANG('充值')}</div>
              <div className="subtitle">
                {LANG('如果您已经拥有加密货币，您可以使用充值功能将其从其他交易平台或钱包充值到您的YMEX账户。')}
              </div>
            </div>
          </TrLink>
        </div>
      </BottomModal>
      <style jsx>{`
        :global(.deposit-container) {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 1rem;
          padding: 0 0.5rem;
          font-size: 14px;
          font-weight: 400;
          color: var(--text_1);
          .action-wrapper,
          :global(.action-wrapper) {
            display: flex;
            align-items: center;
            padding: 1rem;
            gap: 1rem;
            border-radius: 1rem;
            background: var(--fill_3);
            .icon-wrap {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              width: 38px;
              height: 38px;
              border-radius: 9.5px;
              background: var(--fill_shadow);
            }
            .text-wrap {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              gap: 8px;
            }
            .title {
              color: var(--text_1);
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              align-self: stretch;
            }
            .subtitle {
              color: var(--text_2);
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: 150%;
              align-self: stretch;
            }
          }
        }
      `}</style>
    </MobileModal>
  );
};

export default DepositModal;
