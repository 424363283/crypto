import { kChartEmitter } from '@/core/events/src/k-chart';
import { formatRgbStringToHex } from '@/core/utils';

export class RootColor {
  static KEY = 'root-color-index-v1';
  static MANUAL_TRIGGER = 'root-color-manual-trigger';

  private static rootColor = {
    1: { 'up-color-rgb': '67,188,156', 'down-color-rgb': '240,78,63', 'active-color-rgb': '120,44,232' }, // 绿涨红跌
    2: { 'up-color-rgb': '240,78,63', 'down-color-rgb': '67,188,156', 'active-color-rgb': '120,44,232' }, // 红涨绿跌
    3: { 'up-color-rgb': '253,55,75', 'down-color-rgb': '44,102,209', 'active-color-rgb': '23,114,248' }, // 红涨蓝跌 韩国品牌色
    4: { 'up-color-rgb': '204,120,60', 'down-color-rgb': '74,150,238', 'active-color-rgb': '120,44,232' }, //  视觉障碍
  };

  public static get getColorRGB() {
    if (typeof window !== 'undefined') {
      return this.rootColor[(localStorage[this.KEY] as keyof typeof this.rootColor) || 1];
    } else {
      return this.rootColor[1];
    }
  }
  /**
   * 上涨下跌包含韩国蓝色色值
   * 图表chart 色值和上涨下跌用这个，不要使用useTheme的skin字段去判断
   */
  public static get getColorHex() {
    if (typeof window !== 'undefined') {
      const colorRgb = this.rootColor[(localStorage[this.KEY] as keyof typeof this.rootColor) || 1];
      return {
        'down-color-hex': formatRgbStringToHex(colorRgb['down-color-rgb']),
        'up-color-hex': formatRgbStringToHex(colorRgb['up-color-rgb']),
        'active-color-hex': formatRgbStringToHex(colorRgb['active-color-rgb']),
      };
    } else {
      const defaultColor = this.rootColor[1];
      return {
        'down-color-hex': formatRgbStringToHex(defaultColor['down-color-rgb']),
        'up-color-hex': formatRgbStringToHex(defaultColor['up-color-rgb']),
        'active-color-hex': formatRgbStringToHex(defaultColor['active-color-rgb']),
      };
    }
  }

  public static get getColorIndex() {
    return +localStorage[this.KEY] || 1;
  }

  public static setColorRGB(index: number, manual = true) {
    localStorage[this.KEY] = index;
    if (manual) {
      localStorage[this.MANUAL_TRIGGER] = 1;
    }
    const rootColor = this.getColorRGB;
    document.documentElement.style.setProperty('--color-red', `rgb(${rootColor['down-color-rgb']})`);
    document.documentElement.style.setProperty('--color-green', `rgb(${rootColor['up-color-rgb']})`);
    document.documentElement.style.setProperty('--color-red-rgb', `${rootColor['down-color-rgb']}`);
    document.documentElement.style.setProperty('--color-green-rgb', `${rootColor['up-color-rgb']}`);
    document.documentElement.style.setProperty('--skin-color-active', `rgb(${rootColor['active-color-rgb']})`);
    document.documentElement.style.setProperty('--color-active-rgb', `${rootColor['active-color-rgb']}`);
    document.documentElement.style.setProperty('--color-active-2', `rgba(${rootColor['active-color-rgb']}, 0.1)`);
    document.documentElement.style.setProperty('--color-active-3', `rgba(${rootColor['active-color-rgb']}, 0.5)`);
    kChartEmitter.emit(kChartEmitter.K_CHART_SWITCH_COLOR, this.getColorRGB);
  }
}

export const rootColor = RootColor.getColorRGB;
