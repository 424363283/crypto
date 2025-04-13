/**
 * 现货网格列表项数据定义
 */
export type GridSymbolItem = {
  /**
   * 币对
   */
  symbol: string;
  /**
   * 币种
   */
  baseCoin: string;
  /**
   * 货币
   */
  quoteCoin: string;
  /**
   * 价格精度
   */
  priceScale: number;
  /**
   * 最小价格比例
   */
  priceMinRate: number;
  /**
   * 最大价格比例
   */
  priceMaxRate: number;
  /**
   * 最小网格数量
   */
  countMin: number;
  /**
   * 最大网格数量
   */
  countMax: number;
  /**
   * 挂单手续费
   */
  makerRate: 0;
  /**
   * 系数
   */
  factor: 0;
  /**
   * 最小可投入金额
   */
  amountMin: 0;
  /**
   * 最大可投入金额
   */
  amountMax: 0;
  /**
   * 最小网格利润率
   */
  profitRate: 0;
  /**
   * 金额精度
   */
  amountScale: 0;
};

/**
 * 网格最新下单数据
 */
export type GridRollItem = {
  /**
   * 策略id
   */
  strategyId: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 类型
   */
  type: string;
};

/**
 * 创建类型
 */
export enum CREATE_TYPE {
  /**
   * AI创建
   */
  AI,
  /**
   * 手动创建
   */
  MANUAL,
}

/**
 * 现货网格AI推荐列表数据定义
 */
export type GridAiItem = {
  /**
   * 策略id
   */
  id: string;
  /**
   * 回测时长
   */
  days: number;
  /**
   * 最低价格
   */
  priceMin: number;
  /**
   * 最高价格
   */
  priceMax: number;
  /**
   * 网格数
   */
  gridCount: number;
};
