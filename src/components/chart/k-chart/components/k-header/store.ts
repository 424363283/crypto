import { resso } from '@/core/store';
import { ResolutionType } from './resolution/config';

export enum KTYPE {
  'K_LINE_CHART',
  'TRADING_VIEW',
  'DEEP_CHART',
}

const qtys: any = {} as any;

export const kHeaderStore = (qty: number) => {
  if (qtys[qty]) return qtys[qty];
  qtys[qty] = resso(
    {
      isLoading: false,
      setting: {
        pendingOrder: true,
        positionOrder: true,
        transactionManagement: true,
        paintOrder: true,
        countdown: true,
        newPrice: true,
        orderBookPrice: true,
        revesePreview: false,
        priceType: 0,
      },
      kType: KTYPE.K_LINE_CHART,
      // 选中的分辨率
      resolution: <ResolutionType>{
        key: '1m',
        value: '1m',
        resolution: '1',
        active: true,
        show: true,
      },
      // 分辨率列表
      resolutions: <ResolutionType[]>[
        {
          key: 'Line',
          value: 'Line',
          resolution: '1',
          show: true,
        },
        {
          key: '1m',
          value: '1m',
          resolution: '1',
          show: true,
        },
        {
          key: '3m',
          value: '3m',
          resolution: '3',
          show: false,
        },
        {
          key: '5m',
          value: '5m',
          resolution: '5',
          show: true,
        },
        {
          key: '15m',
          value: '15m',
          resolution: '15',
          show: true,
        },
        {
          key: '30m',
          value: '30m',
          resolution: '30',
          show: false,
        },
        {
          key: '1H',
          value: '1H',
          resolution: '60',
          show: true,
        },
        {
          key: '2H',
          value: '2H',
          resolution: '120',
          show: false,
        },
        {
          key: '4H',
          value: '4H',
          resolution: '240',
          active: false,
          show: true,
        },
        {
          key: '6H',
          value: '6H',
          resolution: '360',
          show: false,
        },
        {
          key: '12H',
          value: '12H',
          resolution: '720',
          show: false,
        },
        {
          key: '1D',
          value: '1D',
          resolution: '1D',
          show: true,
        },
        {
          key: '1W',
          value: '1W',
          resolution: '1W',
          show: false,
        },
        {
          key: '1M',
          value: '1M',
          resolution: '1M',
          show: false,
        },
      ],

      // 图的类型
      tvChartType: 1,
      // !!! 特意使用注释 提取翻译
      tvChartTypelist: {
        0: {
          icon: '/static/images/trade/kline/bars.svg',
          // LANG('bars')
          name: 'bars',
        },
        10: {
          icon: '/static/images/trade/kline/baseline.svg',
          // LANG('baseline'),
          name: 'baseline',
        },
        1: {
          icon: '/static/images/trade/kline/candles.svg',
          // LANG('candles')
          name: 'candles',
        },
        9: {
          icon: '/static/images/trade/kline/hollow_candles.svg',
          // LANG('hollow_candles')
          name: 'hollow_candles',
        },
        8: {
          icon: '/static/images/trade/kline/heikin_ashi.svg',
          //  LANG('heikin_ashi')
          name: 'heikin_ashi',
        },
        2: {
          icon: '/static/images/trade/kline/line.svg',
          // LANG('line')
          name: 'line',
        },
        3: {
          icon: '/static/images/trade/kline/area.svg',
          // LANG('area')
          name: 'area',
        },
        12: {
          icon: '/static/images/trade/kline/high_low.svg',
          // LANG('high_low')
          name: 'high_low',
        },
        13: {
          icon: '/static/images/trade/kline/columns.svg',
          // LANG('columns')
          name: 'columns',
        },
        14: {
          icon: '/static/images/trade/kline/line_with_markers.svg',
          // LANG('line_with_markers')
          name: 'line_with_markers',
        },
        15: {
          icon: '/static/images/trade/kline/step_line.svg',
          // LANG('step_line')
          name: 'step_line',
        },
        16: {
          icon: '/static/images/trade/kline/hlc_area.svg',
          // LANG('hlc_area')
          name: 'hlc_area',
        },
      },

      setTvChartType: (tvChartType: number) => {
        qtys[qty].tvChartType = tvChartType;
      },
      startLoading() {
        qtys[qty].isLoading = true;
      },

      endLoading() {
        qtys[qty].isLoading = false;
      },

      setkType: (kType: KTYPE) => {
        qtys[qty].kType = kType;
      },

      setResolution: (resolution: ResolutionType) => {
        qtys[qty].resolution = resolution;
      },
      setResolutions: (resolutions: ResolutionType[]) => {
        qtys[qty].resolutions = resolutions;
      },
      getShowResolutions: (resolutions: ResolutionType[]) => {
        return resolutions.filter((item) => item.show);
      },
      getHideResolutions: (resolutions: ResolutionType[]) => {
        return resolutions.filter((item) => !item.show);
      },
      getHideResolution: (resolutions: ResolutionType[], resolution: ResolutionType): ResolutionType | null => {
        const item = resolutions.filter((_) => !_.show).find((item) => item.value === resolution.value);
        if (item) {
          return item;
        } else {
          return null;
        }
      },
    },
    {
      nameSpace: 'k-header-v1' + qty,
      nossr: true,
      whileList: ['kType', 'resolution', 'resolutions', 'tvChartType', 'tvChartTypelist', 'setting'],
    }
  );
  return qtys[qty];
};
const globalKlineSetting = resso(
  { priceType: 0 },
  {
    nameSpace: 'k-header-global-setting-v1',
    nossr: true,
  }
);
export const setKLinePriceType = (qty: number, value: number) => {
  const store = kHeaderStore(qty);
  store.setting = {
    ...store.setting,
    priceType: value,
  };
  globalKlineSetting.priceType = value;
};
export const getKLinePriceType = (qty: number) => {
  // const { setting } = kHeaderStore(qty);
  // return setting.priceType || 0;
  return globalKlineSetting.priceType;
};
