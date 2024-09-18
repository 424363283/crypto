import { OrderBookEmitter } from '@/core/events';
import { useTheme } from '@/core/hooks';
import { OrderBookItem } from '@/core/shared';
import { memo } from 'react';
import { OrderItemAmount } from './order-item-amount';
import { OrderItemPrice } from './order-item-price';
import { OrderItemTotal } from './order-item-total';
import { OrderTypes } from './types';

const _OrderItem = ({
  item,
  accAmount,
  maxAmount,
  type,
  showDot,
}: {
  item: OrderBookItem;
  accAmount: number;
  maxAmount: number;
  type: OrderTypes;
  showDot: boolean;
}) => {
  const { isDark } = useTheme();
  return (
    <>
      <div
        className='order-item'
        onClick={() => {
          OrderBookEmitter.emit(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE, item.price);
        }}
      >
        {showDot && <div className='order-item-dot' />}
        <div className='order-item-left'>
          <OrderItemPrice item={item} />
        </div>
        <div className='order-item-center'>
          <OrderItemAmount item={item} />
        </div>
        <div className='order-item-right'>
          <OrderItemTotal item={item} accAmount={accAmount} />
          <div className='order-item-bg' style={{ width: `${(accAmount / maxAmount) * 100}%` }}></div>
        </div>
      </div>
      <style jsx>{`
        .order-item {
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          position: relative;
          color: ${isDark ? '#E5E5E4' : ' var(--theme-trade-text-color-1)'};

          &:hover {
            background: var(--theme-order-book-hover) !important;
          }

          .order-item-dot {
            width: 4px;
            height: 4px;
            border-radius: 2px;
            background-color: var(--color-active);
            position: absolute;
            left: 4px;
          }

          > div {
            height: var(--theme-trade-depth-height);
            display: flex;
            align-items: center;
          }
          .order-item-left {
            padding-left: 12px;
            color: var(${type == OrderTypes.BUY ? ' --color-green' : ' --color-red'});
            flex: 1;
            text-align: left;
          }
          .order-item-center {
            padding-right: 12px;
            flex: 1;
            display: flex;
          }
          .order-item-right {
            flex: 1;
            flex-direction: row-reverse;
            position: relative;
            padding-right: 12px;

            .order-item-bg {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background-color: var(${type == OrderTypes.BUY ? ' --color-green' : ' --color-red'});
              opacity: 0.1;
              transition: width 0.3s;
            }
          }
        }
      `}</style>
    </>
  );
};

// export const OrderItem = memo(_OrderItem, (prev, next) => {
//   return prev.item.price == next.item.price && prev.item.amount == next.item.amount;
// });

export const OrderItem = memo(_OrderItem);
