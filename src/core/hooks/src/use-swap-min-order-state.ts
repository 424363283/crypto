import { Swap } from '@/core/shared';
import { orderInstance as Order } from '@/core/shared/src/swap/modules/order';
import { useCallback, useEffect, useState } from 'react';

export const useSwapMinOrderVolumeState = () => {
  const [minOrderVolume, setMinOrderVolume] = useState(0);
  const { twoWayMode, isOpenPositionMode } = Swap.Trade;
  const volumeUnitText = Swap.Trade.getUnitText();
  const { isUsdtType, quoteId } = Swap.Trade.base;

  const calcMinOrderVolume = () => {
    if (twoWayMode && !isOpenPositionMode) {
      const { buyPosition, sellPosition } = Order.getTwoWayPosition({
        usdt: isUsdtType,
        openPosition: false,
        code: quoteId,
      });

      if (buyPosition && sellPosition) {
        let buyVolume = Swap.Trade.getMinOrderVolume({ isBuy: true, code: quoteId, costMode: true });
        let sellVolume = Swap.Trade.getMinOrderVolume({ isBuy: false, code: quoteId, costMode: true });
        setMinOrderVolume(Math.min(buyVolume, sellVolume));

      } else if (buyPosition) {
        let buyVolume = Swap.Trade.getMinOrderVolume({ isBuy: true, code: quoteId, costMode: true });
        setMinOrderVolume(buyVolume);

      } else if (sellPosition) {
        let sellVolume = Swap.Trade.getMinOrderVolume({ isBuy: false, code: quoteId, costMode: true });
        setMinOrderVolume(sellVolume);

      } else {
        setMinOrderVolume(0);
      }

    } else {
      let buyVolume = Swap.Trade.getMinOrderVolume({ isBuy: true, code: quoteId, costMode: true });
      let sellVolume = Swap.Trade.getMinOrderVolume({ isBuy: false, code: quoteId, costMode: true });
      setMinOrderVolume(Math.min(buyVolume, sellVolume));
    }
  }
  useEffect(() => {
    calcMinOrderVolume();

  });
  return { minOrderVolume, volumeUnitText };
};
