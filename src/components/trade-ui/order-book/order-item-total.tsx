/**
 * 数量显示组件，永续需要单独计算目标值
 */

import { FORMULAS } from '@/core/formulas';
import { useRouter } from '@/core/hooks';
import { OrderBookItem, Swap, SwapTradeItem, TradeMap } from '@/core/shared';
import {
  formatDefaultText,
  formatNumber2Ceil,
  isSwap,
  isSwapCoin,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
} from '@/core/utils';
import { useEffect, useState } from 'react';

interface OrderItemAmountProps {
  item: OrderBookItem;
  accAmount: number;
}

export const OrderItemTotal = ({ item, accAmount }: OrderItemAmountProps) => {
  const { query } = useRouter();
  const id = query.id as string;
  const [swapTradeItem, setSwapTradeItem] = useState<SwapTradeItem | undefined>({} as SwapTradeItem);

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

  // USDT永续
  if (isSwapUsdt(id) || isSwapSLUsdt(id)) {
    if (swapTradeItem) {
      const text = isVolUnit
        ? FORMULAS.SWAP.usdt.usdtCoinVol(accAmount, swapTradeItem.contractFactor, flagPrice)
        : FORMULAS.SWAP.usdt.coinVol(accAmount, swapTradeItem.contractFactor);
      const fixed = swapDigit;

      return <>{formatDefaultText(formatNumber2Ceil(text, fixed).toFormatUnit(fixed))}</>;
    }
  }
  if (isSwapCoin(id) || isSwapSLCoin(id)) {
    if (swapTradeItem && 'contractFactor' in swapTradeItem) {
      const text = isVolUnit
        ? accAmount.toFormatUnit()
        : formatNumber2Ceil(
            FORMULAS.SWAP.coin.coinVol(accAmount, swapTradeItem.contractFactor, flagPrice),
            swapDigit
          ).toFormatUnit(swapDigit);
      return <>{formatDefaultText(text)}</>;
    }
  }

  const maxDigit = Math.max(item.priceDigit, item.amountDigit);
  const digit = maxDigit > 5 ? 5 : maxDigit;

  return <>{formatDefaultText(item.price.mul(item.amount).toFormatUnit(digit))}</>;
};
