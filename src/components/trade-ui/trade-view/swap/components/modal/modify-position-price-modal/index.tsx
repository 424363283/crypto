import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useEditOrder } from '@/components/trade-ui/order-list/swap/components/modal/edit-order-spsl-modal/hook';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope } from '@/core/utils';
import { message } from '@/core/utils/src/message';

import css from 'styled-jsx/css';

const ModifyPositionMriceModal = () => {
  const { isDark } = useTheme();
  const { isUsdtType, quoteName, priceUnitText } = Swap.Trade.base;
  const pending = Swap.Order.getPending(isUsdtType);
  const visible = Swap.Trade.store.modal.modifyPositionMriceModalVisible;
  const modalData = Swap.Trade.store.modal.modifyPositionMriceModalData;
  let { orderId, triggerPrice, price } = modalData;
  const { editOrder } = useEditOrder();
  // 判断操作类型
  const handlePricekey = triggerPrice ? 'triggerPrice' : 'price';
  const currentPendng = pending.find((item) => item.orderId === orderId) || (false as any);

  const onClose = () => {
    Swap.Trade.setModal({
      modifyPositionMriceModalVisible: false,
      modifyPositionMriceModalData: {
        orderId: null,
        price: null,
        triggerPrice: null,
      },
    });
  };

  if (!currentPendng && orderId) {
    onClose();
    return message.warning(LANG('订单更新请重试'));
  }

  const isBuy = currentPendng.side === '1';

  const formatItemVolume = (v: any, item: any) => {
    const isSpslType = ['2', '1'].includes(`${item['strategyType']}`);
    const isLimit = ['1', '4'].includes(item['type']);
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: isSpslType && !isLimit ? item.triggerPrice : item.price,
    });
  };

  const onConfirm = () => {
    const editParams: {
      volume?: number | undefined;
      price?: number | undefined;
      triggerPrice?: number | undefined;
    } = {};
    let isLimit = ['1', '4'].includes(currentPendng['type']);
    if (price) {
      editParams.price = Number(price);
      isLimit = true;
    } else if (triggerPrice) {
      editParams.triggerPrice = Number(triggerPrice);
    }

    editOrder({
      onDone: () => {
        onClose();
      },
      data: currentPendng,
      editParams,
      isLimit,
    });
  };

  return (
    <>
      <Modal className={clsx('modal-content', !isDark && 'light')} visible={visible} onClose={onClose}>
        <ModalTitle border onClose={onClose} title={LANG('下单确认')} />

        <div className={clsx('content')}>
          <div className={clsx('row')}>
            <div className={clsx('code')}>{quoteName}</div>
            <div className={clsx(isBuy ? 'main-green' : 'main-red')}>
              <span>{isBuy ? LANG('买入') : LANG('卖出')}</span>
            </div>
          </div>
          <div className={clsx('row')}>
            <div>{LANG('价格(修改前)')}</div>
            <div>
              {Number(currentPendng[handlePricekey]).toFixed(Number(currentPendng.baseShowPrecision))} {priceUnitText}
            </div>
          </div>

          <div className={clsx('row')}>
            <div>{LANG('价格(修改后)')}</div>
            <div>
              {modalData[handlePricekey]} {priceUnitText}
            </div>
          </div>

          <div className={clsx('row')}>
            <div>{`${LANG('数量')}/${LANG('完成度')}`}</div>
            <div className={clsx('row-wrap')}>
              <div>{formatItemVolume(currentPendng.volume, currentPendng)}</div>
              <div className={clsx('inline-block')} style={{ color: 'var(--skin-primary-color)' }}>
                ({formatItemVolume(currentPendng.dealVolume, currentPendng)})
              </div>
              &nbsp;
              <div className={clsx('inline-block')}>
                {Swap.Info.getUnitText({ symbol: currentPendng.symbol, withHooks: false })}
              </div>
            </div>
          </div>
        </div>

        <ModalFooter onCancel={onClose} onConfirm={onConfirm} />
      </Modal>
      {styles}
    </>
  );
};

export default ModifyPositionMriceModal;

const { className, styles } = css.resolve`
  .modal-body {
    width: 459px !important;
    background-color: red;
  }
  .content {
    padding: 20px 0;
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      &:last-child {
        margin-bottom: 0;
      }

      .row-wrap {
        display: flex;
      }

      > :global(*):first-child {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-3);
        &.code {
          color: var(--theme-trade-text-color-1);
        }
      }
      > :global(*):last-child {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-1);
      }
    }
    .danger {
      color: var(--const-color-error);
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      padding: 9px 0;
    }
    .remind {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 22px;
      .checkbox {
        cursor: pointer;
        width: 15px;
        height: 15px;
        overflow: hidden;
        line-height: 0;
        &.active {
          border: 0;
        }
      }
      .text {
        margin-left: 5px;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-3);
      }
    }
  }
`;
const clsx = clsxWithScope(className);
