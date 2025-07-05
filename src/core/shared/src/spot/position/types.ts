import { SideType, SpotOrderType } from '../trade/types';

/**
 * 列表类型
 */
export enum SpotTabType {
  /**
   * 当前委托
   */
  ORDER = 'order',
  /**
   * 历史委托
   */
  ORDER_HISTORY = 'order_history',
  /**
   * 历史成交
   */
  TRADE_HISTORY = 'trade_history',
  /**
   * 资产管理
   */
  FUNDS = 'funds',
  /**
   * 网格运行中
   */
  GRID_RUNNING = 'grid_running',
  /**
   * 网格已停止
   */
  GRID_STOP = 'grid_stop',
  /**
   * 定投运行中
   */
  INVEST_RUNNING = 'invest_running',
  /**
   * 定投已停止
   */
  INVEST_STOP = 'invest_stop',
}

/**
 * 是否显示列表加载的 loading 状态
 */
export enum LoadingType {
  /**
   * 不显示
   */
  Hide = 0,
  /**
   * 显示
   */
  Show = 1,
}

/**
 * 是否显示列表加载的 loading 状态
 */
export enum CommissionType {
  /**
   * 全部
   */
  All = 2,
  /**
   * 限价
   */
  Limit = 0,
  /**
   * 市价
   */
  Market = 1,
}

/**
 * 持仓列表数据
 */
export type SpotPositionListItem = {
  /**
   * 订单id
   */
  id: string;
  /**
   * 下单时间
   */
  orderTime: number;
  /**
   * 交易对
   */
  symbol: string;
  /**
   * 交易类型
   */
  side: SideType;
  /**
   * 订单类型
   */
  type: SpotOrderType;
  /**
   * 委托价
   */
  price: number;
  /**
   * 委托量
   */
  volume: number;
  /**
   * 已成交量
   */
  dealVolume: number;
  /**
   * 成交价
   */
  dealPrice: number | string;
  /**
   * 成交额
   */
  dealAmount: number | string;
  /**
   * 委托金额
   */
  amount: number;
  /**
   * 状态
   */
  state: number;
  /**
   * 目标币种
   */
  targetCoin: string;
  /**
   * 源币种
   */
  sourceCoin: string;
  /**
   * 手续费
   */
  fee: number;
  /**
   * 订单类型
   */
  openType: number;
  /**
   * 成交时间
   */
  dealTime?: number;
};

export enum HistoryRange {
  /**
   * 本日
   */
  DAY,
  /**
   * 本周
   */
  WEEK,
  /**
   * 本月
   */
  MONTH,
  /**
   * 近3月
   */
  THREE_MONTH,
}

/**
 * 现货表格数据定义
 */
export type SpotListItem = {
  /**
   * 余额
   */
  balance: number;
  /**
   * 货币符号
   */
  currency: string;
  /**
   * 冻结资产
   */
  frozen: number;
  /**
   * 全名
   */
  fullname: string;
  /**
   * 精度
   */
  scale: number;
  /**
   * 是否打开交易
   */
  trade: boolean;
};
/**
 * 列表类型
 */
export enum SpotGridPositionType {
  /**
   * 运行中
   */
  RUNNING,
  /**
   * 已停止
   */
  STOP,
}

export enum LIST_TYPE {
  GRID,
  INVEST,
  MARTIN,
}
