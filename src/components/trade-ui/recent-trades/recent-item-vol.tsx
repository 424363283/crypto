import { FORMULAS } from '@/core/formulas';
import { useRouter } from '@/core/hooks';
import { RecentTradeItem, Swap, SwapTradeItem, TradeMap } from '@/core/shared';
import {
  formatDefaultText,
  formatNumber2Ceil,
  isSwap,
  isSwapCoin,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
  MediaInfo
} from '@/core/utils';
import { useEffect, useState } from 'react';

export const RecentItemVol = ({ item }: { item: RecentTradeItem }) => {
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

  let text: string = item.amount;

  // USDT永续
  if (isSwapUsdt(id) || isSwapSLUsdt(id)) {
    if (swapTradeItem && 'contractFactor' in swapTradeItem) {
      const next = isVolUnit
        ? FORMULAS.SWAP.usdt.usdtCoinVol(item.amount, swapTradeItem.contractFactor, item.amount)
        : FORMULAS.SWAP.usdt.coinVol(item.amount, swapTradeItem.contractFactor);
      const fixed = swapDigit;

      text = formatDefaultText(formatNumber2Ceil(next, fixed).toFormat(fixed));
    }
  } else if (isSwapCoin(id) || isSwapSLCoin(id)) {
    if (swapTradeItem && 'contractFactor' in swapTradeItem) {
      const next = isVolUnit
        ? item.amount.toFormat()
        : formatNumber2Ceil(
            FORMULAS.SWAP.coin.coinVol(item.amount, swapTradeItem.contractFactor, flagPrice),
            swapDigit
          ).toFormat(swapDigit);
      text = formatDefaultText(next);
    }
  } else {
    text = text.toFormatUnit();
  }
  return (
    <>
      <div className="recent-item-right">{text}</div>
      <style jsx>{`
        .recent-item-right {
          padding-right: 12px;
          color: var(--theme-trade-text-color-1);
          flex: 1;
          text-align: right;
          @media ${MediaInfo.mobile} {
            padding-right: 1rem;
          }
        }
      `}</style>
    </>
  );
};
