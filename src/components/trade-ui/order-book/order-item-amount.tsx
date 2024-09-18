/**
 * 数量显示组件，永续需要单独计算目标值
 */
import { FORMULAS } from '@/core/formulas';
import { useRouter } from '@/core/hooks';
import { OrderBookItem, Swap, SwapTradeItem, TradeMap } from '@/core/shared';
import {
  clsx,
  formatDefaultText,
  formatNumber2Ceil,
  isSwap,
  isSwapCoin,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
} from '@/core/utils';
import { useEffect, useRef, useState } from 'react';

interface OrderItemAmountProps {
  item: OrderBookItem;
}

export const OrderItemAmount = ({ item }: OrderItemAmountProps) => {
  const { query } = useRouter();
  const id = query.id as string;
  const [swapTradeItem, setSwapTradeItem] = useState<SwapTradeItem | undefined>({} as SwapTradeItem);
  const refamount = useRef<number>(0);
  const [isUp, setIsUp] = useState('');

  const isUsdtType = Swap.Info.getIsUsdtType(id);
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const flagPrice = Swap.Socket.getFlagPrice(id);
  const swapDigit = Swap.Info.getVolumeDigit(id);

  useEffect(() => {
    if (isSwap(id)) {
      (async () => {
        const swapTradeItem = await TradeMap.getSwapById(id);
        setSwapTradeItem(swapTradeItem);
      })();
    }
  }, [id]);

  useEffect(() => {
    const isUp =
      refamount.current == +item.amount
        ? ''
        : refamount.current > +item.amount
        ? 'red'
        : refamount.current < +item.amount
        ? 'green'
        : '';
    setIsUp(isUp);
    refamount.current = +item.amount;
  }, [item.amount]);

  let rendertext = formatDefaultText(item.amount.toFormatUnit(item.amountDigit));

  // USDT永续
  if (isSwapUsdt(id) || isSwapSLUsdt(id)) {
    if (swapTradeItem && 'contractFactor' in swapTradeItem) {
      const text = isVolUnit
        ? FORMULAS.SWAP.usdt.usdtCoinVol(item.amount, swapTradeItem.contractFactor, item.price)
        : FORMULAS.SWAP.usdt.coinVol(item.amount, swapTradeItem.contractFactor);
      const fixed = swapDigit;

      rendertext = formatDefaultText(formatNumber2Ceil(text, fixed).toFormatUnit(fixed));
    }
  }
  if (isSwapCoin(id) || isSwapSLCoin(id)) {
    if (swapTradeItem && 'contractFactor' in swapTradeItem) {
      const text = isVolUnit
        ? item.amount.toFormatUnit()
        : formatNumber2Ceil(
            FORMULAS.SWAP.coin.coinVol(item.amount, swapTradeItem.contractFactor, flagPrice),
            swapDigit
          ).toFormatUnit(swapDigit);
      rendertext = formatDefaultText(text);
    }
  }

  return (
    <>
      <span className={clsx('vol', isUp)}>{rendertext}</span>
      <style jsx>{`
        .vol {
          flex: 1;
          display: flex;
          text-align: right;
          height: 100%;
          align-items: center;
          justify-content: flex-end;
          &.red {
            animation: vol-red 0.7s;
            @keyframes vol-red {
              0% {
                background-color: rgba(var(--color-red-rgb), 0.12);
              }
              100% {
                background-color: rgba(var(--color-red-rgb), 0);
              }
            }
          }
          &.green {
            animation: vol-green 0.7s;
            @keyframes vol-green {
              0% {
                background-color: rgba(var(--color-green-rgb), 0.12);
              }
              100% {
                background-color: rgba(var(--color-green-rgb), 0);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
