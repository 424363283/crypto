import { isServerSideRender } from '@/utils';
/*
 * @Author: wade
 * @Date: 2023-12-20 12:22:56
 * @Description: 获取用户自定义配置
 * @PRD:
 * @UI:
 * @FilePath: /src/store/customConfig.ts
 * @LastEditTime: 2023-12-20 12:28:35
 * @LastEditors: wade
 */
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
