// http ws =>  data
// get use

import { StoreApi, UseBoundStore, create } from 'zustand';

interface AssetsListStore {
  assetsList: string[];
  setAssetsList: (symbol: string) => void;
}

export const useAssetsListStore: UseBoundStore<StoreApi<AssetsListStore>> = create(set => ({
  assetsList: [],

  setAssetsList: (data: any) =>
    set((state: any) => ({
      ...state,
      assetsList: data
    }))
}));
