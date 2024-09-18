import { getSwapCalculateLpApi } from '@/core/api';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { Debounce, message } from '@/core/utils';
import { useMemo } from 'react';

export const TYPES = {
  ADD: 'add',
  MINUS: 'minus',
};

export const store = resso({
  type: TYPES.ADD,
  inputAmount: '',
  liquidationPrice: 0,
});

export const useMethods = ({ data, isUsdtType }: { data?: any; isUsdtType?: any }) => {
  const _calculateliquidationPricenDebounce = useMemo(() => new Debounce(() => {}, 200), []);

  const getDataIncome = () => {
    const income = Swap.Calculate.income({
      usdt: isUsdtType,
      code: data.symbol?.toUpperCase(),
      isBuy: data.side === '1',
      avgCostPrice: Number(data.avgCostPrice),
      volume: Number(data.currentPosition),
    });

    return income;
  };

  const getMaxSubMargin = () => {
    const income = getDataIncome();
    let next = data?.maxSubMargin || 0;

    next = next + Math.min(0, income);
    next = next < 0 ? 0 : next;

    return next;
  };

  const calculateliquidationPrice = () =>
    _calculateliquidationPricenDebounce.run(async () => {
      const type = store.getSnapshot('type');
      const inputAmount = store.getSnapshot('inputAmount');
      const value = Number(inputAmount);

      if (!data.symbol) return;
      if (!value) {
        store.liquidationPrice = 0;

        return;
      }
      try {
        const result = await getSwapCalculateLpApi(
          {
            positionId: data.positionId,
            changeMargin: (value * (type === TYPES.ADD ? 1 : -1)).toFixed(),
            symbol: data.symbol,
          },
          isUsdtType
        );
        store.liquidationPrice = result.data as number;
      } catch (e) {
        message.error(e);
      }
    });

  const onChangeAmount = (inputAmount: any) => {
    store.inputAmount = inputAmount;
    calculateliquidationPrice();
  };

  return { getMaxSubMargin, getDataIncome, onChangeAmount };
};
