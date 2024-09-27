import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, resso } from '@/core/store';

const handleColorObjToStr = (obj: rgbaType, isBorder?: boolean) => {
  const { r, g, b, a } = obj;
  if (isBorder) {
    return `rgba(${r}, ${g}, ${b}, ${0.1})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const Chart_MAP = [
  {
    icon: 'kline-lazhu-chart',
    name: LANG('蜡烛图'),
    value: 'kline-lazhu-chart',
    key: 'candle',
  },
  {
    icon: 'kline-zhexian-chart',
    name: LANG('折线图'),
    value: 'kline-zhexian-chart',
    key: 'line',
  },
  {
    icon: 'kline-meiguo-chart',
    name: LANG('美国图'),
    value: 'kline-meiguo-chart',
    key: 'us_line',
  },
  {
    icon: 'kline-mianji-chart',
    name: LANG('面积图'),
    value: 'kline-mianji-chart',
    key: 'area',
  },
];

type rgbaType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type P = {
  iconType: string;
  kType: string;
  color: rgbaType[];
  pillar: rgbaType[];
  border: rgbaType[];
  shadow: rgbaType[];
  width: string;
  mark: string;
};

type StoreType = P & {
  setStore: (k: keyof P, value: any) => void;
  onDefaultData: () => void;
  onChangeChart: () => void;
};

const defaultData = {
  // 图标类型
  iconType: 'kline-lazhu-chart',
  // K 线阳线
  kType: 'solid',
  // 颜色
  color: [
    { r: 67, g: 188, b: 156, a: 1 },
    { r: 240, g: 76, b: 63, a: 1 },
  ],
  width: '1',
  // 柱子
  pillar: [
    { r: 67, g: 188, b: 156, a: 1 },
    { r: 240, g: 76, b: 63, a: 1 },
  ],
  // 边框
  border: [
    { r: 67, g: 188, b: 156, a: 1 },
    { r: 240, g: 76, b: 63, a: 1 },
  ],
  // 阴影
  shadow: [
    { r: 67, g: 188, b: 156, a: 1 },
    { r: 240, g: 76, b: 63, a: 1 },
  ],
  // 交易标记
  mark: 'bs',
};

export const kSettingColor = resso<StoreType>(
  {
    ...defaultData,
    setStore(key, value) {
      kSettingColor[key] = value;
    },
    onDefaultData() {
      kSettingColor.iconType = defaultData.iconType;
      kSettingColor.kType = defaultData.kType;
      kSettingColor.color = defaultData.color;
      kSettingColor.width = defaultData.width;
      kSettingColor.pillar = defaultData.pillar;
      kSettingColor.border = defaultData.border;
      kSettingColor.shadow = defaultData.shadow;
      kSettingColor.mark = defaultData.mark;
    },
    onChangeChart() {
      const { iconType, kType, mark, color, width, pillar, border, shadow } = kSettingColor;
      const chartType = Chart_MAP.find((e) => e.icon === iconType)?.key;
      let obj = {};
      switch (chartType) {
        case 'candle':
          obj = {
            chartType,
            bullishCandleStick: kType,
            upColor: handleColorObjToStr(pillar[0]),
            downColor: handleColorObjToStr(pillar[1]),
            borderUpColor: handleColorObjToStr(border[0], true),
            borderDownColor: handleColorObjToStr(border[1], true),
            wickUpColor: handleColorObjToStr(shadow[0]),
            wickDownColor: handleColorObjToStr(shadow[1]),
            tradeMarker: mark,
          };
          break;
        case 'line':
          obj = {
            chartType,
            lineWidth: width,
            lineColor: handleColorObjToStr(color[0]),
            tradeMarker: mark,
          };
          break;
        case 'us_line':
          obj = {
            chartType,
            upColor: handleColorObjToStr(color[0]),
            downColor: handleColorObjToStr(color[1]),
            tradeMarker: mark,
          };
          break;

        case 'area':
          obj = {
            chartType,
            areaColor: handleColorObjToStr(color[0]),
            areaBackgroundColor1: handleColorObjToStr(color[0]),
            areaBackgroundColor2: handleColorObjToStr(color[0], true),
            tradeMarker: mark,
          };
          break;
      }
      kChartEmitter.emit(kChartEmitter.K_CHART_UPDATE_SETTING, obj);
    },
  },
  { nameSpace: LOCAL_KEY.SWAP_SETTING_COLOR, nossr: true }
);

export { Chart_MAP };

export type { P, rgbaType };
