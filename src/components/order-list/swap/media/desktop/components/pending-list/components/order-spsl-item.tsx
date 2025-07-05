import { LANG, TradeLink } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { LeverItem } from '../../lever-item';
import { WalletName } from '../../wallet-name';
import { MarginTypeItem } from '../../margin-type-item';
import { PendingItemType } from '@/core/shared/src/swap/modules/order/field';

const OrderSPSLItem = ({
  item,
}: {
  item: PendingItemType,
}) => {
  let stopProfit = '--';
  let stopLoss = '--';
  let baseShowPrecision = Number(item.baseShowPrecision);
  item.otocoOrder?.triggerOrders?.forEach((o: any) => {
    if (o.strategyType === '1') stopProfit = Number(o.triggerPrice).toFixed(baseShowPrecision);
    if (o.strategyType === '2') stopLoss = Number(o.triggerPrice).toFixed(baseShowPrecision);
  });

  return (
    <>
      <div className={clsx('spsl-price')}>
        <div className={clsx('text')}>
          <div className='positive-text'> {stopProfit}</div>
          <div className='negative-text'> {stopLoss}</div>
        </div>
      </div>
      <style jsx>
        {`
          .spsl-price {
            .text {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              gap: 4px;
            }
          }
        `}
      </style>
    </>
  );
};

export default OrderSPSLItem;
