import { isServerSideRender } from '@/utils';
import { StoreApi, UseBoundStore, create } from 'zustand';

type ISetting = {
  [key: string]: {
    [key: string]: string
  }
};

interface SettingStore {
  settings: { [key: string]: any };
  setOrderSettings: (rates: ISetting) => void;
  quickCloseConfirm: boolean;
  /** 快捷下单 */
  enableQuickOrder: boolean;
  /** 启/停用快捷下单 */
  setEnableQuickOrder: (enable: boolean) => void;
}
export const useOrderSettingStore: UseBoundStore<StoreApi<SettingStore>> = create((set) => {
  let enableQuickOrder = true;
  if (!isServerSideRender()) {
    const isQuickOrderOn = localStorage.getItem('isQuickOrderOn');
    enableQuickOrder = isQuickOrderOn ? !!JSON.parse(isQuickOrderOn) : true;
  }

  return {
    settings: {},
    quickCloseConfirm: false,
    enableQuickOrder,
    setEnableQuickOrder: (enable: boolean) => set((state) => {
      if (!isServerSideRender()) localStorage.setItem('isQuickOrderOn', '' + !!enable);
      return { ...state, enableQuickOrder: enable };
    }),
    setOrderSettings: (settings: ISetting) => set((state) => ({ ...state, settings })),
    setQuickCloseConfirm: (quickCloseConfirm: boolean) => set((state) => ({ ...state, quickCloseConfirm })),
  };
});

export function getOrderSetting() {
  return useOrderSettingStore.getState();
}