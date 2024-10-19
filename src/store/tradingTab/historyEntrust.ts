// http ws =>  data
// get use

import { StoreApi, UseBoundStore, create } from 'zustand';

interface TokenStore {
  historyEntrustList: PositionItem[];
  historyEntrustLoading: false;
  hasHistoryEntrustMore: false;
  setHistoryEntrustMore: (symbol: boolean) => void;
  setHistoryEntrustLoading: (symbol: boolean) => void;
  setHistoryEntrustList: (symbol: string) => void;
  setWSHistoryEntrustList: (symbol: string) => void;
}

export const useHistoryEntrusStore: UseBoundStore<StoreApi<TokenStore>> = create(set => ({
  historyEntrustList: [],
  historyEntrustLoading: false,
  hasHistoryEntrustMore: false,
  setHistoryEntrustMore: (data: any) => {
    set((state: any) => ({
      ...state,
      hasHistoryEntrustMore: data
    }));
  },
  setHistoryEntrustLoading: (data: any) =>
    set((state: any) => ({
      ...state,
      historyEntrustLoading: data
    })),
  setHistoryEntrustList: (data: any) => {
    set((state: any) => ({
      ...state,
      historyEntrustList: data
    }));
  },
  setWSHistoryEntrustList: (data: any) =>
    set((state: any) => ({
      ...state,
      historyEntrustList: data
    }))
}));
