import { StoreApi, UseBoundStore, create } from 'zustand';

interface SettingStore {
  userSettings: object;
  ctStoreUserInfo: any;
  setUserSettings: (item: any) => void;
  setStoreCTUserInfo: (item: Trader) => void;
}

export const useCopyTradingStore: UseBoundStore<StoreApi<SettingStore>> = create(set => ({
  userSettings: {},
  ctStoreUserInfo: {},

  setUserSettings: (data: any) =>
    set((state: any) => ({
      ...state,
      userSettings: Object.assign({}, state.userSettings, data)
    })),

  setStoreCTUserInfo: (data: Trader) =>
    set((state: any) => ({
      ...state,
      ctStoreUserInfo: Object.assign({}, state.ctStoreUserInfo, data)
    }))
}));
