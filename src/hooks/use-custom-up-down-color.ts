import { useCustomSettingStore } from '@/store';
import { hexToRgba } from '@/utils';
import { useMemo } from 'react';

export function useCustomUpDownColor() {
  const { customSetting } = useCustomSettingStore();
  const greenColor = '#2AB26C';
  const redColor = '#EF454A';

  return useMemo(() => {
    // TODO 系统目前均是绿涨红跌, 等后期全局统一后再打开
    if (true || customSetting.up_down == 0) {
      // 绿涨🟩📈 红跌🟥📉
      return {
        upColor: greenColor,
        upRgbaColor: (alpha: number = 1) => hexToRgba(greenColor, alpha),
        downColor: redColor,
        downRgbaColor: (alpha: number = 1) => hexToRgba(redColor, alpha),
        upName: 'green',
        downName: 'red'
      };
    }
    // 红涨🟥📈 绿跌🟩📉
    return {
      upColor: redColor,
      upRgbaColor: (alpha: number = 1) => hexToRgba(redColor, alpha),
      downColor: greenColor,
      downRgbaColor: (alpha: number = 1) => hexToRgba(greenColor, alpha),
      upName: 'red',
      downName: 'green'
    };
  }, [customSetting]);
}
