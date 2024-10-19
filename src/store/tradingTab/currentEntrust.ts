import { StoreApi, UseBoundStore, create } from 'zustand';

interface TokenStore {
  ordinaryList: [];
  stopLossList: [];
  planList: [];
  storeCurrentEntrustType: any;

  setOrdinaryList: (symbol: string) => void;
  setStopLossList: (symbol: string) => void;
  setPlanList: (symbol: string) => void;
  setStoreCurrentEntrustType: (symbol: string) => void;
}

export const useCurrentEntrustStore: UseBoundStore<StoreApi<TokenStore>> = create(set => ({
  ordinaryList: [],
  stopLossList: [],
  planList: [],
  storeCurrentEntrustType: 'LIMIT',

  setStoreCurrentEntrustType: (data: any) =>
    set((state: any) => ({
      ...state,
      storeCurrentEntrustType: data
    })),

  setOrdinaryList: (data: any) =>
    set((state: any) => ({
      ...state,
      ordinaryList: data
    })),

  setStopLossList: (data: any) =>
    set((state: any) => ({
      ...state,
      stopLossList: data
    })),

  setPlanList: (data: any) =>
    set((state: any) => ({
      ...state,
      planList: data
    }))
}));
