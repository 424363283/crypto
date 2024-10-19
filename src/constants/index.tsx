export { default as routeMap } from './routeMap';

export const BvFuturesGuideFinishedKey = 'bv-futures-guide-finished';

export const BvCopyTradeGuideFinishedKey = 'bv-copy-trade-guide-finished';


export enum ORDERBOOK_TRADING_TYPE {
  BUY = 1, //买
  SELL = 0 //卖
}

export enum _TRADING_UNIT_TYPE {
  ZERO = 0, //张
  ONE = 1, //币
  TWO = 2 //USDT
}

// 默认exchange_id
export const EXCHANGE_ID = 301;

// 最新成交默认展示条数
export const LASTTRADING_SIZE = 60;

// KLINE 类型
export const KLINE_TYPE = ['1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '3D', '1W', '1M'];

// KLINE 按钮
export const KLINE_BUTTONS = [
  {
    slug: 'Time', // 窄屏展示
    resolution: '1', // 传给K线的参数
    chartType: 3, // 图表类型
    res: 'Time', // 区分分时与1m
    full: 'Time', // 宽屏展示
    isDefault: false,
    index: 1
  },
  {
    slug: '1m',
    resolution: '1',
    res: '1',
    full: '1m',
    isDefault: false,
    index: 2
  },
  {
    slug: '3m',
    resolution: '3',
    res: '3',
    full: '3m',
    isDefault: false,
    index: 3
  },
  {
    slug: '5m',
    resolution: '5',
    res: '5',
    full: '5m',
    isDefault: false,
    index: 4
  },
  {
    slug: '15m',
    resolution: '15',
    res: '15',
    full: '15m',
    isDefault: false,
    index: 5
  },
  {
    slug: '30m',
    resolution: '30',
    res: '30',
    full: '30m',
    isDefault: false,
    index: 6
  },
  {
    slug: '1H',
    resolution: '60',
    res: '60',
    full: '1H',
    isDefault: false,
    index: 7
  },
  {
    slug: '2H',
    resolution: '120',
    res: '120',
    full: '2H',
    isDefault: false,
    index: 8
  },
  {
    slug: '4H',
    resolution: '240',
    res: '240',
    full: '4H',
    isDefault: false,
    index: 9
  },
  {
    slug: '6H',
    resolution: '360',
    res: '360',
    full: '6H',
    isDefault: false,
    index: 10
  },
  {
    slug: '8H',
    resolution: '480',
    res: '480',
    full: '8H',
    isDefault: false,
    index: 11
  },
  {
    slug: '12H',
    resolution: '720',
    res: '720',
    full: '12H',
    isDefault: false,
    index: 12
  },
  {
    slug: '1D',
    resolution: '1D',
    res: '1D',
    full: '1D',
    isDefault: false,
    index: 13
  },
  {
    slug: '3D',
    resolution: '3D',
    res: '3D',
    full: '3D',
    isDefault: false,
    index: 14
  },
  {
    slug: '1W',
    resolution: '1W',
    res: '1W',
    full: '1W',
    isDefault: false,
    index: 15
  },
  {
    slug: '1M',
    resolution: '1M',
    res: '1M',
    full: '1M',
    isDefault: true,
    index: 16
  },
  {
    slug: '20L',
    resolution: '20L',
    res: '20L',
    full: '20L',
    isDefault: false,
    index: 17,
    option: [
      {
        slug: 'Time', // 窄屏展示
        resolution: '1', // 传给K线的参数
        chartType: 3, // 图表类型
        res: 'Time', // 区分分时与1m
        full: 'Time', // 宽屏展示
        isDefault: false,
        index: 1
      },
      {
        slug: '1m',
        resolution: '1',
        res: '1',
        full: '1m',
        isDefault: false,
        index: 2
      },
      {
        slug: '3m',
        resolution: '3',
        res: '3',
        full: '3m',
        isDefault: false,
        index: 3
      },
      {
        slug: '5m',
        resolution: '5',
        res: '5',
        full: '5m',
        isDefault: false,
        index: 4
      },
      {
        slug: '15m',
        resolution: '15',
        res: '15',
        full: '15m',
        isDefault: false,
        index: 5
      },
      {
        slug: '30m',
        resolution: '30',
        res: '30',
        full: '30m',
        isDefault: false,
        index: 6
      },
      {
        slug: '1H',
        resolution: '60',
        res: '60',
        full: '1H',
        isDefault: false,
        index: 7
      },
      {
        slug: '2H',
        resolution: '120',
        res: '120',
        full: '2H',
        isDefault: false,
        index: 8
      },
      {
        slug: '4H',
        resolution: '240',
        res: '240',
        full: '4H',
        isDefault: false,
        index: 9
      },
      {
        slug: '6H',
        resolution: '360',
        res: '360',
        full: '6H',
        isDefault: false,
        index: 10
      },
      {
        slug: '8H',
        resolution: '480',
        res: '480',
        full: '8H',
        isDefault: false,
        index: 11
      },
      {
        slug: '12H',
        resolution: '720',
        res: '720',
        full: '12H',
        isDefault: false,
        index: 12
      },
      {
        slug: '1D',
        resolution: '1D',
        res: '1D',
        full: '1D',
        isDefault: false,
        index: 13
      },
      {
        slug: '3D',
        resolution: '3D',
        res: '3D',
        full: '3D',
        isDefault: false,
        index: 14
      },
      {
        slug: '1W',
        resolution: '1W',
        res: '1W',
        full: '1W',
        isDefault: false,
        index: 15
      },
      {
        slug: '1M',
        resolution: '1M',
        res: '1M',
        full: '1M',
        isDefault: true,
        index: 16
      }
    ]
  }
];

// KLINE 按钮 excluding item with option key
export const NO_OPTION_KLINE_BUTTONS = [
  {
    slug: 'Time', // 窄屏展示
    resolution: '1', // 传给K线的参数
    chartType: 3, // 图表类型
    res: 'Time', // 区分分时与1m
    full: 'Time', // 宽屏展示
    isDefault: false,
    index: 1
  },
  {
    slug: '1m',
    resolution: '1',
    res: '1',
    full: '1m',
    isDefault: false,
    index: 2
  },
  {
    slug: '3m',
    resolution: '3',
    res: '3',
    full: '3m',
    isDefault: false,
    index: 3
  },
  {
    slug: '5m',
    resolution: '5',
    res: '5',
    full: '5m',
    isDefault: false,
    index: 4
  },
  {
    slug: '15m',
    resolution: '15',
    res: '15',
    full: '15m',
    isDefault: false,
    index: 5
  },
  {
    slug: '30m',
    resolution: '30',
    res: '30',
    full: '30m',
    isDefault: false,
    index: 6
  },
  {
    slug: '1H',
    resolution: '60',
    res: '60',
    full: '1H',
    isDefault: false,
    index: 7
  },
  {
    slug: '2H',
    resolution: '120',
    res: '120',
    full: '2H',
    isDefault: false,
    index: 8
  },
  {
    slug: '4H',
    resolution: '240',
    res: '240',
    full: '4H',
    isDefault: false,
    index: 9
  },
  {
    slug: '6H',
    resolution: '360',
    res: '360',
    full: '6H',
    isDefault: false,
    index: 10
  },
  {
    slug: '8H',
    resolution: '480',
    res: '480',
    full: '8H',
    isDefault: false,
    index: 11
  },
  {
    slug: '12H',
    resolution: '720',
    res: '720',
    full: '12H',
    isDefault: false,
    index: 12
  },
  {
    slug: '1D',
    resolution: '1D',
    res: '1D',
    full: '1D',
    isDefault: false,
    index: 13
  },
  {
    slug: '3D',
    resolution: '3D',
    res: '3D',
    full: '3D',
    isDefault: false,
    index: 14
  },
  {
    slug: '1W',
    resolution: '1W',
    res: '1W',
    full: '1W',
    isDefault: false,
    index: 15
  },
  {
    slug: '1M',
    resolution: '1M',
    res: '1M',
    full: '1M',
    isDefault: true,
    index: 16
  }
];

// KLINE 按钮 for new task
export const NEW_DEFAULT_KLINE_BUTTONS = [
  {
    slug: 'Time', // 窄屏展示
    resolution: '1', // 传给K线的参数
    chartType: 3, // 图表类型
    res: 'Time', // 区分分时与1m
    full: 'Time', // 宽屏展示
    isDefault: false,
    index: 1
  },
  {
    slug: '15m',
    resolution: '15',
    res: '15',
    full: '15m',
    isDefault: false,
    index: 5
  },
  {
    slug: '1H',
    resolution: '60',
    res: '60',
    full: '1H',
    isDefault: false,
    index: 7
  },
  {
    slug: '4H',
    resolution: '240',
    res: '240',
    full: '4H',
    isDefault: false,
    index: 9
  },
  {
    slug: '1D',
    resolution: '1D',
    res: '1D',
    full: '1D',
    isDefault: false,
    index: 13
  },
  {
    slug: '1W',
    resolution: '1W',
    res: '1W',
    full: '1W',
    isDefault: false,
    index: 15
  },
  {
    slug: '20L',
    resolution: '20L',
    res: '20L',
    full: '20L',
    isDefault: false,
    index: 17,
    option: [
      {
        slug: 'Time', // 窄屏展示
        resolution: '1', // 传给K线的参数
        chartType: 3, // 图表类型
        res: 'Time', // 区分分时与1m
        full: 'Time', // 宽屏展示
        isDefault: false,
        index: 1
      },
      {
        slug: '1m',
        resolution: '1',
        res: '1',
        full: '1m',
        isDefault: false,
        index: 2
      },
      {
        slug: '3m',
        resolution: '3',
        res: '3',
        full: '3m',
        isDefault: false,
        index: 3
      },
      {
        slug: '5m',
        resolution: '5',
        res: '5',
        full: '5m',
        isDefault: false,
        index: 4
      },
      {
        slug: '15m',
        resolution: '15',
        res: '15',
        full: '15m',
        isDefault: false,
        index: 5
      },
      {
        slug: '30m',
        resolution: '30',
        res: '30',
        full: '30m',
        isDefault: false,
        index: 6
      },
      {
        slug: '1H',
        resolution: '60',
        res: '60',
        full: '1H',
        isDefault: false,
        index: 7
      },
      {
        slug: '2H',
        resolution: '120',
        res: '120',
        full: '2H',
        isDefault: false,
        index: 8
      },
      {
        slug: '4H',
        resolution: '240',
        res: '240',
        full: '4H',
        isDefault: false,
        index: 9
      },
      {
        slug: '6H',
        resolution: '360',
        res: '360',
        full: '6H',
        isDefault: false,
        index: 10
      },
      {
        slug: '8H',
        resolution: '480',
        res: '480',
        full: '8H',
        isDefault: false,
        index: 11
      },
      {
        slug: '12H',
        resolution: '720',
        res: '720',
        full: '12H',
        isDefault: false,
        index: 12
      },
      {
        slug: '1D',
        resolution: '1D',
        res: '1D',
        full: '1D',
        isDefault: false,
        index: 13
      },
      {
        slug: '3D',
        resolution: '3D',
        res: '3D',
        full: '3D',
        isDefault: false,
        index: 14
      },
      {
        slug: '1W',
        resolution: '1W',
        res: '1W',
        full: '1W',
        isDefault: false,
        index: 15
      },
      {
        slug: '1M',
        resolution: '1M',
        res: '1M',
        full: '1M',
        isDefault: true,
        index: 16
      }
    ]
  }
];

// KLINE 按钮 exchange
export const EXCHANGE_KLINE_BUTTONS = [
  {
    slug: 'Time', // 窄屏展示
    resolution: '1', // 传给K线的参数
    chartType: 3, // 图表类型
    res: 'Time', // 区分分时与1m
    full: 'Time' // 宽屏展示
  },
  {
    slug: '1m',
    resolution: '1',
    res: '1',
    full: '1m'
  },
  {
    slug: '3m',
    resolution: '3',
    res: '3',
    full: '3m'
  },
  {
    resolution: '5',
    slug: '5m',
    full: '5m',
    res: '5'
  },
  {
    resolution: '15',
    slug: '15m',
    full: '15m',
    res: '15'
  },
  {
    resolution: '30',
    slug: '30m',
    full: '30m',
    res: '30'
  },
  {
    resolution: '60',
    slug: '1H',
    full: '1H',
    res: '60'
  },
  {
    resolution: '120',
    slug: '2H',
    full: '2H',
    res: '120'
  },
  {
    resolution: '240',
    slug: '4H',
    full: '4H',
    res: '240'
  },
  {
    resolution: '360',
    slug: '6H',
    full: '6H',
    res: '360'
  },
  {
    slug: '8H',
    resolution: '480',
    res: '480',
    full: '8H'
  },
  {
    resolution: '720',
    slug: '12H',
    full: '12H',
    res: '720'
  },
  {
    slug: '1D',
    resolution: '1D',
    res: '1D',
    full: '1D'
  },
  {
    slug: '3D',
    resolution: '3D',
    res: '3D',
    full: '3D'
  },
  {
    slug: '1W',
    resolution: '1W',
    res: '1W',
    full: '1W'
  },
  {
    slug: '1M',
    resolution: '1M',
    res: '1M',
    full: '1M'
  }
];

// 深度精度值，"0"跟K线价格精度0区别
export const DEPTH: { [key: string | number]: number } = {
  100000000: -8,
  10000000: -7,
  1000000: -6,
  100000: -5,
  10000: -4,
  1000: -3,
  100: -2,
  10: -1,
  1: 0,
  0: 0,
  0.1: 1,
  0.01: 2,
  0.001: 3,
  0.0001: 4,
  0.00001: 5,
  0.000001: 6,
  '0.0000001': 7,
  '0.00000001': 8,
  '0.000000001': 9,
  '0.0000000001': 10,
  '0.00000000001': 11,
  '0.000000000001': 12,
  '0.000000000000000001': 18
};

// k线价格精度
export const K = {
  0: 1,
  1: 10,
  2: 100,
  3: 1000,
  4: 10000,
  5: 100000,
  6: 1000000,
  7: 10000000,
  8: 100000000,
  9: 1000000000,
  10: 10000000000,
  11: 100000000000,
  12: 1000000000000
};

// 合约未实现盈亏计价方式
export enum UnrealisedPnlPriceTypes {
  MARKET = 1, // 标记价
  LATEST // 最新价
}

// 最大输入数量
export const InputMaxNum = 9999999999;

// ajax loading超时
export const LOADING_DELAY = 100;

export enum PullStatus {
  UPMORE = 'UPMORE',
  UPNOMORE = 'UPNOMORE',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  DOWNREFRESH = 'DOWNREFRESH',
  DOWNLOADING = 'DOWNLOADING',
  DOWNLOADED = 'DOWNLOADED',
  DOWNMORE = 'DOWNMORE',
  DOWNNOMORE = 'DOWNNOMORE'
}

export const MSGDATATYPE = {
  ALL: 1, //全量
  ADD: 0 //增量
};
