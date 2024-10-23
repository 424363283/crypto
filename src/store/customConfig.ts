import { isServerSideRender } from '@/utils';
import { StoreApi, UseBoundStore, create } from 'zustand';

type ICustomSetting = {
  quickCloseConfirm: boolean;
  lang: string;
  unit: string;
  up_down: number;
} & any;

interface SettingStore {
  customSetting: ICustomSetting;
  setCustom: (rates: ICustomSetting) => void;
}

export const useCustomSettingStore: UseBoundStore<StoreApi<SettingStore>> = create(set => ({
  customSetting: {
    // 闪电平仓
    quickCloseConfirm: true,
    // 默认语言
    lang: isServerSideRender() ? '' : window.localStorage.lang,
    // 默认法币
    unit: isServerSideRender() ? '' : window.localStorage.unit,
    // 行情颜色方案,  0 = 绿涨红跌; 1 = 红涨绿跌
    up_down: 0
  },
  setCustom: (settings: ICustomSetting) =>
    set(state => ({ ...state, customSetting: { ...state.customSetting, ...settings } }))
}));

export function getCustomSetting() {
  return useCustomSettingStore.getState();
}
