
import { contToUSDT, PositionUnitTypes, U_Precision } from '@/utils/futures';
import { digits } from '@/utils';
import Datafeed from './Datafeed';

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

export function volumeConversion(
  type: PositionUnitTypes,
  multiplier: number,
  volume: number,
  price: number,
  coinPrecision: number
) {
  switch (type) {
    case PositionUnitTypes.CONT: return +volume;
    case PositionUnitTypes.COIN: return digits(volume * multiplier, coinPrecision);
    default: return contToUSDT(volume, multiplier, U_Precision, price);
  }
}

export function createSymbolName (name: string, fullName: string, priceScale: number, volumePrecision: number, volumeMultiplier: number) {
  return `${name}@${fullName}@${priceScale || 10}@${volumePrecision || 10}@${volumeMultiplier}`;
}

export const Color = {
  Red: '#EF454A',
  Green: '#2AB26C'
};
