import { Swap } from '@/core/shared';
import { LOCAL_KEY, resso, useResso } from '@/core/store';
import { isSwapDemo } from '@/core/utils/src/is';

export const store = resso(
  {
    tabIndex: 0,
    hide: false,
    showAllOrders: true,
  },
  {
    whileList: ['showAllOrders'],
    nameSpace: !isSwapDemo() ? LOCAL_KEY.SHARED_SWAP_ORDER_LIST : LOCAL_KEY.SHARED_SWAP_DEMO_ORDER_LIST,
  }
);

export const useListByStore = (data: any) => {
  const { hide, showAllOrders } = useResso(store);
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  if (!hide && showAllOrders) {
    return data;
  }
  return data.filter((item: any) => {
    const states = [];
    if (hide) {
      states.push(item.symbol?.toUpperCase() === quoteId);
    }
    if (!showAllOrders) {
      states.push(item.subWallet === walletId);
    }

    return states.every((v) => v);
  });
};
