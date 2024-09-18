import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';

export const useOrderData = ({ hide }: { hide: boolean }) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const originPending = Swap.Order.getPending(isUsdtType);
  const originPositions = Swap.Order.getPosition(isUsdtType);

  let pending = originPending;
  let positions = originPositions;

  if (hide) {
    pending = originPending.filter((item) => item.symbol.toUpperCase() === quoteId);
    positions = originPositions.filter((item) => item.symbol.toUpperCase() === quoteId);
  }

  if (!useAppContext().isLogin) {
    pending = [];
    positions = [];
  }

  return { pending, positions, originPending, originPositions };
};
