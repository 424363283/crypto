
import Datafeed from './Datafeed';
import { RootColor } from '@/core/styles/src/theme/global/root';

export interface WidgetOptions<I = string, L = string, T = string> {
  symbol: string;
  interval: I;
  locale: L;
  theme: T;
  datafeed: Datafeed;
  container?: string;
  onIndicatorCountLimit?: () => void;
  onIndicatorChange?: () => void
}

export interface ChartRef {
  openSettingModal: () => void;
  openIndicatorModal: () => void;
}

export function createSymbolName (name: string, fullName: string, priceScale: number, volumePrecision: number, volumeMultiplier: number) {
  return `${name}@${fullName}@${priceScale || 10}@${volumePrecision || 10}@${volumeMultiplier}`;
}

const index = RootColor.getColorIndex as keyof typeof rootColor;

const rootColor = {
  1: { "up-color-rgb": "42,178,108", "down-color-rgb": "239,69,74", "active-color-rgb": "7,130,139" }, // 绿涨红跌
  2: { "up-color-rgb": "239,69,74", "down-color-rgb": "42,178,108", "active-color-rgb": "7,130,139" }, // 红涨绿跌
  3: { "up-color-rgb": "253,55,75", "down-color-rgb": "44,102,209", "active-color-rgb": "7,130,139" }, // 红涨蓝跌 韩国品牌色
  4: { "up-color-rgb": "204,120,60", "down-color-rgb": "74,150,238", "active-color-rgb": "7,130,139" }, //  视觉障碍
};

export const Color = {
  Red: `rgb(${rootColor[index]['down-color-rgb']})` 
  //  '#EF454A'
   ,
  Green: `rgb(${rootColor[index]['up-color-rgb']})` 
  // '#2AB26C'
};
