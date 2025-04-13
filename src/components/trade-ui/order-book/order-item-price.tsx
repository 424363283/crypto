/**
 * 数量显示组件，永续需要单独计算目标值
 */

import { OrderBookItem } from '@/core/shared';
import { clsx, formatDefaultText } from '@/core/utils';
import { useRef } from 'react';

interface OrderItemPriceProps {
  item: OrderBookItem;
}

export const OrderItemPrice = ({ item }: OrderItemPriceProps) => {
  const refamount = useRef<number>(0);
  // const [isUp, setIsUp] = useState('');
  const isUp = '';
  // useEffect(() => {
  //   const isUp =
  //     refamount.current == +item.amount
  //       ? ''
  //       : refamount.current > +item.amount
  //       ? 'red'
  //       : refamount.current < +item.amount
  //       ? 'green'
  //       : '';
  //   setIsUp(isUp);
  //   refamount.current = +item.amount;
  // }, [item.amount]);

  return (
    <>
      <span className={clsx('vol', isUp)}>{formatDefaultText(item.price.toFormat(item.priceDigit))}</span>
      <style jsx>{`
        .vol {
          flex: 1;
          display: flex;
          text-align: left;
          height: 100%;
          align-items: center;
          justify-content: flex-start;
          &.red {
            animation: vol-red 0.7s;
            @keyframes vol-red {
              0% {
                background-color: rgba(var(--text-primary), 0.12);
              }
              100% {
                background-color: rgba(var(--text-error), 0);
              }
            }
          }
          &.green {
            animation: vol-green 0.7s;
            @keyframes vol-green {
              0% {
                background-color: rgba(var(--text-true), 0.12);
              }
              100% {
                background-color: rgba(var(--text-true), 0);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
