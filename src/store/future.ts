import { UnrealisedPnlPriceTypes } from '@/constants';
import { StoreApi, UseBoundStore, create } from 'zustand';

/**
 * 合约Store
 *
 *  unrealisedPnlPriceType 未实现盈亏计价方式
 */
interface FutureStore {
  unrealisedPnlPriceType: UnrealisedPnlPriceTypes;
  futureBalances: FutureBalance[];
  futureTradeable: FutureTradeable;
  updateFutureBalances: (balances: FutureBalance[]) => void;
  updateFutureTradeable: (tradeable: FutureTradeable) => void;
  updateFutureStore: (store: Partial<FutureStore>) => void;
  setUnrealisedPnlPriceType: (symbol: any) => void;
}

export const useFutureStore: UseBoundStore<StoreApi<FutureStore>> = create(set => ({
  unrealisedPnlPriceType: UnrealisedPnlPriceTypes.MARKET,
  futureBalances: [],
  futureTradeable: {},
  updateFutureBalances: (balances: FutureBalance[]) => set(state => ({ ...state, futureBalances: balances })),
  updateFutureTradeable: (tradeable: FutureTradeable) => set(state => ({ ...state, futureTradeable: tradeable })),
  updateFutureStore: (store: Partial<FutureStore>) => set(state => ({ ...state, ...store })),
  setUnrealisedPnlPriceType: (data: any) => set(state => ({ ...state, unrealisedPnlPriceType: data }))
}));


export function getFutureStore() {
  return useFutureStore.getState();
}