export enum ChartType {
  Original = 0,
  TradingView = 1,
  Depth = 2
}

export enum KLinePriceType {
  Last = 0,
  Index = 1
}

export const STORAGE_K_LINE_RESOLUTION_KEY = 'bv_current_resolution';

export const STORAGE_CHART_TYPE_KEY = 'bv_contract_chart_type';

export const STORAGE_ORIGINAL_KLINE_STYLE = 'bv_original_kline_style';

export const STORAGE_SHOW_POSITION_LINE_KEY = 'bv_kline_show_position';

export const STORAGE_SHOW_HISTORY_MARK_KEY = 'bv_kline_show_history_order';

export const STORAGE_KLINE_PRICE_TYPE_KEY = 'bv_kline_price_type';

export const STORAGE_FAVORITE_RESOLUTION_KEY = 'bv_kline_favorite_resolution';

export const SUPPORT_RESOLUTIONS = ['Time', '1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '1W', '1M'];

export interface ResolutionInfo {
  slug: string;
  chartType?: number;
  resolution: string;
  res: string;
  tvRes: string;
  full: string;
  isDefault: boolean;
  index: number
}

export const ALL_RESOLUTION_INFO1: ResolutionInfo[] = [
  {
    slug: 'Time', // 窄屏展示
    resolution: 'Time', // 传给K线的参数
    chartType: 3, // 图表类型
    res: 'Time', // 区分分时与1m
    full: 'Time', // 宽屏展示
    isDefault: true,
    tvRes: '1m',
    index: 1
  },
  {
    slug: '1m',
    resolution: '1',
    res: '1',
    tvRes: '1m',
    full: '1m',
    isDefault: false,
    index: 2
  },
  {
    slug: '3m',
    resolution: '3',
    res: '3',
    tvRes: '3m',
    full: '3m',
    isDefault: false,
    index: 3
  },
  {
    slug: '5m',
    resolution: '5',
    res: '5',
    full: '5m',
    tvRes: '5m',
    isDefault: false,
    index: 4
  },
  {
    slug: '15m',
    resolution: '15',
    res: '15',
    full: '15m',
    tvRes: '15m',
    isDefault: true,
    index: 5
  },
  {
    slug: '30m',
    resolution: '30',
    res: '30',
    full: '30m',
    tvRes: '30m',
    isDefault: false,
    index: 6
  },
  {
    slug: '1H',
    resolution: '60',
    res: '60',
    tvRes: '1h',
    full: '1H',
    isDefault: true,
    index: 7
  },
  {
    slug: '2H',
    resolution: '120',
    res: '120',
    full: '2H',
    tvRes: '2h',
    isDefault: false,
    index: 8
  },
  {
    slug: '4H',
    resolution: '240',
    res: '240',
    full: '4H',
    tvRes: '4h',
    isDefault: true,
    index: 9
  },
  {
    slug: '6H',
    resolution: '360',
    res: '360',
    full: '6H',
    tvRes: '6h',
    isDefault: false,
    index: 10
  },
  {
    slug: '8H',
    resolution: '480',
    res: '480',
    full: '8H',
    tvRes: '8h',
    isDefault: false,
    index: 11
  },
  {
    slug: '12H',
    resolution: '720',
    res: '720',
    full: '12H',
    tvRes: '12h',
    isDefault: false,
    index: 12
  },
  {
    slug: '1D',
    // resolution: '1440',
    resolution: '1D',
    res: '1440',
    tvRes: '1d',
    isDefault: true,
    full: '1D',
    index: 13
  },
  {
    slug: '1W',
    // resolution: '10080',
    resolution: '1W',
    res: '10080',
    tvRes: '1w',
    isDefault: true,
    full: '1W',
    index: 14
  },
  {
    slug: '1M',
    // resolution: '44640',
    resolution: '1M',
    res: '44640',
    tvRes: '1M',
    isDefault: false,
    full: '1M',
    index: 15
  }
];

export const ALL_RESOLUTION_INFO: ResolutionInfo[] = [
  // {
  //   slug: 'Time', // 窄屏展示
  //   resolution: 'Time', // 传给K线的参数
  //   chartType: 3, // 图表类型
  //   res: 'Time', // 区分分时与1m
  //   full: 'Time', // 宽屏展示
  //   isDefault: false,
  //   tvRes: '1m',
  //   index: 1,
  // },
  {
    slug: '1m',
    resolution: '1',
    res: '1',
    tvRes: '1',
    full: '1m',
    isDefault: true,
    index: 2,
  },
  {
    slug: '3m',
    resolution: '3',
    res: '3',
    tvRes: '3',
    full: '3m',
    isDefault: false,
    index: 3,
  },
  {
    slug: '5m',
    resolution: '5',
    res: '5',
    full: '5m',
    tvRes: '5',
    isDefault: true,
    index: 4,
  },
  {
    slug: '15m',
    resolution: '15',
    res: '15',
    full: '15m',
    tvRes: '15',
    isDefault: true,
    index: 5,
  },
  {
    slug: '30m',
    resolution: '30',
    res: '30',
    full: '30m',
    tvRes: '30',
    isDefault: true,
    index: 6,
  },
  {
    slug: '1H',
    resolution: '60',
    res: '60',
    tvRes: '60',
    full: '1H',
    isDefault: true,
    index: 7,
  },
  {
    slug: '2H',
    resolution: '120',
    res: '120',
    full: '2H',
    tvRes: '2H',
    isDefault: false,
    index: 8,
  },
  {
    slug: '4H',
    resolution: '240',
    res: '240',
    full: '4H',
    tvRes: '4h',
    isDefault: true,
    index: 9,
  },
  {
    slug: '6H',
    resolution: '360',
    res: '360',
    full: '6H',
    tvRes: '6H',
    isDefault: false,
    index: 10,
  },
  {
    slug: '8H',
    resolution: '480',
    res: '480',
    full: '8H',
    tvRes: '8H',
    isDefault: false,
    index: 11,
  },
  {
    slug: '12H',
    resolution: '720',
    res: '720',
    full: '12H',
    tvRes: '12H',
    isDefault: false,
    index: 12,
  },
  {
    slug: '1D',
    // resolution: '1440',
    resolution: '1D',
    res: '1440',
    tvRes: '1D',
    isDefault: true,
    full: '1D',
    index: 13,
  },
  {
    slug: '1W',
    // resolution: '10080',
    resolution: '1W',
    res: '10080',
    tvRes: '1W',
    isDefault: true,
    full: '1W',
    index: 14,
  },
  {
    slug: '1M',
    // resolution: '44640',
    resolution: '1M',
    res: '44640',
    tvRes: '1M',
    isDefault: true,
    full: '1M',
    index: 15,
  },
];
