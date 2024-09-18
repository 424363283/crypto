import { ModalClose } from '@/components/mobile-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { LANG } from '@/core/i18n';
import { formatDefaultText } from '@/core/utils';
import { Modal } from 'antd';
import css from 'styled-jsx/css';
import { NS } from '../../spot';

interface Props {
  open: boolean;
  baseCoin: string;
  quoteCoin: string;
  priceMin: NS;
  priceMax: NS;
  scale: number;
  gridCount: number;
  gridLowProfit: NS;
  gridHighProfit: NS;
  triggerPrice: NS;
  tpPrice: NS;
  slPrice: NS;
  amount: NS;
  stopSell: boolean;
  onClose: () => void;
  onOk: () => void;
}

export const CreateConfirmModal = ({
  open,
  onClose,
  onOk,
  baseCoin,
  quoteCoin,
  priceMin,
  priceMax,
  scale,
  gridCount,
  gridLowProfit,
  gridHighProfit,
  triggerPrice,
  tpPrice,
  slPrice,
  stopSell,
  amount,
}: Props) => {
  return (
    <>
      <Modal
        title={LANG('创建{baseCoin}/{quoteCoin}现货网格', { baseCoin, quoteCoin })}
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
            {LANG(
              '执行{baseCoin}/{quoteCoin}现货网格需要买入一定数量的{baseCoin},确定创建后将以市场最优价格执行下单，下单过程中价格波动可能产生价差。',
              { baseCoin, quoteCoin }
            )}
          </div>
          <div className='content'>
            <div>
              <div>{LANG('价格区间')}</div>
              <div>
                {priceMin?.toFormat(scale)} - {priceMax?.toFormat(scale)} {quoteCoin}
              </div>
            </div>
            <div>
              <div>{LANG('网格数量')}</div>
              <div>{gridCount}</div>
            </div>
            <div>
              <div>{LANG('每格利润率')}</div>
              <div className='main-green'>
                {gridLowProfit} - {gridHighProfit}
              </div>
            </div>
            <div>
              <div>{LANG('触发价')}</div>
              <div>
                {formatDefaultText(triggerPrice)} {quoteCoin}
              </div>
            </div>
            <div>
              <div>{LANG('止盈止损')}</div>
              <div>
                {formatDefaultText(tpPrice)}/{formatDefaultText(slPrice)} {quoteCoin}
              </div>
            </div>
            <div>
              <div>{LANG('停止时卖出所有基础币')}</div>
              <div>{stopSell ? LANG('启用') : LANG('关闭')}</div>
            </div>
          </div>
          <div className='price-wrapper'>
            <div>{LANG('投入金额')}</div>
            <div>
              {amount?.toFormat(scale)} {quoteCoin}
            </div>
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
