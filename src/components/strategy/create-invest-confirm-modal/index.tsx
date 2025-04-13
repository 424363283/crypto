import CoinLogo from '@/components/coin-logo';
import { ModalClose } from '@/components/mobile-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { LANG } from '@/core/i18n';
import { Modal } from 'antd';
import css from 'styled-jsx/css';

interface Props {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  periodLabel: string;
  symbols: {
    symbol: string;
    amount: number | string;
  }[];
  oneCycleTotal: number;
}

export const CreateInvestConfirmModal = ({ open, onClose, onOk, periodLabel, symbols, oneCycleTotal }: Props) => {
  return (
    <>
      <Modal
        title={LANG('确认定投策略')}
        open={open}
        onCancel={onClose}
        className='base-modal no-header-border create-invest-modal'
        destroyOnClose
        closeIcon={null}
        closable={false}
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        onOk={onOk}
        width={376}
        centered
      >
        <ModalClose className='close-icon' onClose={onClose} />
        <div className='create-content'>
          <div className='small'>
            <div className='label'>{LANG('投资币种')}</div>
            USDT
          </div>
          <div className='small'>
            <div className='label'>{LANG('定投间隔')}</div>
            {periodLabel}
          </div>
          <div className='divider' />
          <div className='small'>
            <div className='label'>{LANG('定投币种')}</div>
          </div>
          {symbols?.map((item) => (
            <div key={item.symbol}>
              <div className='coin'>
                <CoinLogo coin={item.symbol.split('_')?.[0]} width={18} height={18} alt='base-coin' />
                <span>{item.symbol.split('_')?.[0]}</span>
              </div>
              {item.amount} USDT
            </div>
          ))}
          <div className='divider' />
          <div className='total'>
            {LANG('每期总额')}
            <span>{oneCycleTotal} USDT</span>
          </div>
        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.create-invest-modal) {
    .content {
      margin-top: 19px;
      padding: 12px 16px;
      border-radius: 6px;
      background-color: var(--theme-background-color-8);
      color: var(--theme-font-color-3);
    }
    .create-content {
      color: var(--theme-font-color-1);
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        &:first-child {
          margin-top: 0;
        }
        &.small {
          font-size: 12px;
        }
        .label {
          color: var(--theme-font-color-3);
        }
        .coin {
          display: flex;
          align-items: center;
          color: var(--theme-font-color-3);
        }
        span {
          margin-left: 4px;
        }
      }
      .divider {
        width: 100%;
        height: 1px;
        background-color: var(--theme-border-color-2);
        margin: 16px 0;
      }
      .total {
        margin-bottom: 20px;
        span {
          color: var(--skin-main-font-color);
        }
      }
    }
  }
`;
