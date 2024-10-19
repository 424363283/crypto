import { StoreApi, UseBoundStore, create } from 'zustand';


type Pairs = {
  [key: string]: boolean
};
type TradeError = {
  title: string,
  content: string,
  onOk?: () => void,
  onCancel?: () => void,
} | null;
type TradeList = any[];

interface TradesStore {
  // 带单/跟单列表
  tradesList: TradeList;
  setTradeList: (data: TradeList) => void;
  // 交易员信息
  tradeUser: Trader | null,
  setTraderUser: (trader: Trader | null) => void;
  // 支持的交易对
  tradePairs: Pairs,
  setTraderPairs: (pair: Pairs) => void;
  // 交易限制弹窗
  tradeError: TradeError,
  setTradeError: (error: TradeError) => void;

}
export const useTradesStore: UseBoundStore<StoreApi<TradesStore>> = create(set => ({
  tradesList: [],
  tradeUser: null,
  tradePairs: {},
  tradeError: null,

  setTradeError: (error: TradeError) => set((state: any) => ({
    ...state,
    tradeError: error
  })),

  setTraderPairs: (pairs: Pairs) => set((state: any) => ({
    ...state,
    tradePairs: pairs
  })),

  setTraderUser: (trader: Trader | null) => set((state: any) => ({
    ...state,
    tradeUser: trader
  })),

  setTradeList: (data: TradeList) =>
    set((state: TradesStore) => ({
      ...state,
      tradesList: data
    }))
}));
