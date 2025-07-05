import { ModalClose } from '@/components/mobile-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { LANG } from '@/core/i18n';
import { Spot } from '@/core/shared';
import { Modal } from 'antd';
import css from 'styled-jsx/css';

interface Props {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}

export const CreateMartinConfirmModal = ({ open, onClose, onOk }: Props) => {
  const {
    martinData: {
      symbol,
      triggerRate,
      tpRate,
      initQuote,
      safetyQuote,
      safetyCount,
      triggerPrice,
      safetyPriceRate,
      safetyQuoteRate,
      slRate,
    },
    investAmount,
  } = Spot.Martin.state;
  return (
    <>
      <Modal
        title={LANG('创建{symbol}现货马丁格尔', { symbol: symbol?.replace('_', '/') })}
        open={open}
        onCancel={onClose}
        className='base-modal no-header-border create-grid-modal'
        destroyOnClose
        closeIcon={null}
        closable={false}
        okText={LANG('创建')}
        cancelText={LANG('取消')}
        onOk={onOk}
        width={376}
        centered
      >
        <ModalClose className='close-icon' onClose={onClose} />
        <div className='create-content'>
          <div className='description'>
            {LANG('请您确认是否依照以下参数进行现货马丁格尔策略机器人，确认后将锁定您所投入的金额。')}
          </div>
          <div className='content'>
            <div>
              <div>{LANG('跌多少加仓')}</div>
              <div>{triggerRate}%</div>
            </div>
            <div>
              <div>{LANG('赚多少止盈')}</div>
              <div>{tpRate}%</div>
            </div>
            <div>
              <div>{LANG('首单金额')}</div>
              <div>{initQuote}USDT</div>
            </div>
            <div>
              <div>{LANG('加仓单金额')}</div>
              <div>{safetyQuote}USDT</div>
            </div>
            <div>
              <div>{LANG('最大加仓次数')}</div>
              <div>{safetyCount}</div>
            </div>
            <div>
              <div>{LANG('触发价格')}</div>
              <div>{Number(triggerPrice) > 0 ? triggerPrice : '--'}</div>
            </div>
            <div>
              <div>{LANG('加仓单价差/金额倍数')}</div>
              <div>
                {safetyPriceRate}/{safetyQuoteRate}
              </div>
            </div>
            <div>
              <div>{LANG('亏多少止损')}</div>
              <div>{slRate ? slRate + '%' : '--'}</div>
            </div>
          </div>
          <div className='price-wrapper'>
            <div>{LANG('投入金额')}</div>
            <div>{investAmount} USDT</div>
          </div>
        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.create-grid-modal) {
    .description {
      font-size: 12px;
      color: var(--theme-font-color-3);
      margin-top: 10px;
    }
    .content {
      margin-top: 19px;
      padding: 12px 16px;
      border-radius: 6px;
      background-color: var(--theme-background-color-8);
      color: var(--theme-font-color-3);
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        &:last-child {
          margin-bottom: 0;
        }
        > div {
          &:last-child {
            color: var(--theme-font-color-1);
          }
        }
      }
    }
    .price-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      margin-bottom: 28px;
      color: var(--theme-font-color-3);
      > div:last-child {
        color: var(--skin-main-font-color);
      }
    }
  }
`;
