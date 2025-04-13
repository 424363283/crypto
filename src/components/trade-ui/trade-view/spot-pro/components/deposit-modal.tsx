import CommonIcon from '@/components/common-icon';
import { ModalClose } from '@/components/mobile-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Modal } from 'antd';
import css from 'styled-jsx/css';
import Modal2, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onTransferClicked: () => void;
}

const DepositModal = ({ open, onClose, onTransferClicked }: Props) => {
  const router = useRouter();
  const routerId = router.query.id as string;
  const [baseCoin] = routerId.split('_');
  const content = (
    <div className='deposit-modal-content'>
      <div className='text'>{LANG('您可以选择最合适的方式来为您的账户入金')}</div>
      <div className='link-wrap'>
        <div onClick={onTransferClicked}>
          <div className='icon-wrap'>
            <CommonIcon name='common-deposit-transfer-0' size={20} />
          </div>
          <div>
            <div className='title'>{LANG('划转')}</div>
            <div className='subtitle'>{LANG('从您的内部账户划转资金')}</div>
          </div>
        </div>
        {/* <TrLink href='/convert'>
          <div className='icon-wrap'>
            <CommonIcon name='common-deposit-buy-0' size={20} />
          </div>
          <div>
            <div className='title'>{LANG('闪兑')}</div>
            <div className='subtitle'>{LANG('0交易费、0滑点、0等待，快捷换取您想要的加密货币')}</div>
          </div>
        </TrLink> */}
        <TrLink href='/account/fund-management/asset-account/recharge' query={{ code: baseCoin }}>
          <div className='icon-wrap'>
            <CommonIcon name='common-deposit-recharge-0' size={20} />
          </div>
          <div>
            <div className='title'>{LANG('充值')}</div>
            <div className='subtitle'>
              {LANG('如果您已经拥有加密货币，您可以使用充值功能将其从其他交易平台或钱包充值到您的YMEX账户。')}
            </div>
          </div>
        </TrLink>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
  return (
    <>
      <Modal2 visible={open} onClose={onClose}>
        <ModalTitle title={LANG('账户入金')} onClose={onClose} />
        {content}
      </Modal2>
    </>
  );
};
const styles = css`
  .deposit-modal-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
    align-self: stretch;
    .text {
      color: var(--theme-font-color-3);
      font-size: 12px;
      font-weight: 500;
    }
    .link-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 40px;
      align-self: stretch;
      > :global(a),
      > div {
        display: flex;
        padding: 16px;
        align-items: center;
        gap: 16px;
        align-self: stretch;
        border-radius: 16px;
        background: var(--fill-3);
        cursor: pointer;
        :global(.icon-wrap) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 9.5px;
          background: var(--fill-projection);
        }
        :global(.icon-wrap + div) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          flex: 1 0 0;
        }
        .title {
          color: var(--text-primary);
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          align-self: stretch;
        }
        .subtitle {
          color: var(--text-secondary);
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 18px */
          align-self: stretch;
        }
      }
    }
  }
`;

export default DepositModal;
