import { isServerSideRender } from '@/utils';
// http ws =>  data
// get use

import { StoreApi, UseBoundStore, create } from 'zustand';

interface TokenStore {
  tempPositionList: PositionItem[];
  positionList: PositionItem[];
  crossUnrealisedPnl: number;
  isolatedUnrealisedPnl: number;
  setPositionList: (data: any) => void;
  setTempPositionList: (data: any) => void;
  setUnrealisedPnl: (crossPnl: number, isolatedPnl: number) => void;
  hideOtherOrder: Boolean; // 隐藏其他合约
  setHideOtherOrder: (symbol: string) => void;
  positionSetting: object;
  setPositionSetting: (symbol: string) => void;
}

export const usePositionStore: UseBoundStore<StoreApi<TokenStore>> = create(set => {
  let localSetting = {};
  if (!isServerSideRender()) {
    try {
      localSetting = JSON.parse(localStorage.getItem('positionSetting') || '{}');
    } catch (error) {
    }
  }


  return {
    positionList: [],
    tempPositionList: [],
    crossUnrealisedPnl: 0,
    isolatedUnrealisedPnl: 0,

    setPositionList: (data: any) =>
      set((state: any) => ({
        ...state,
        positionList: data
      })),

    hideOtherOrder: false,

    setTempPositionList: (dataList: any) => set((state) => ({ ...state, tempPositionList: dataList })),

    setHideOtherOrder: (data: any) =>
      set((state: any) => ({
        ...state,
        hideOtherOrder: data
      })),

    positionSetting: Object.assign({
      realisedPnl: false,
      amc: false,
      tpsl: true,
      riskRank: false
    }, localSetting),

    setPositionSetting: (data: any) =>
      set((state: any) => ({
        ...state,
        positionSetting: Object.assign({}, state.positionSetting, data)
      })),

    setUnrealisedPnl: (crossPnl: number, isolatedPnl: number) => {
      set((state: any) => ({
        ...state,
        crossUnrealisedPnl: crossPnl,
        isolatedUnrealisedPnl: isolatedPnl
      }));
    }
  };
});

export function getPositionOrder() {
  return usePositionStore.getState();
}