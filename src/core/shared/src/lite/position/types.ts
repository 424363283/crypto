/**
 * Tab 类型
 */
export enum LiteTabType {
  /**
   * 实盘持仓
   */
  REAL,
  /**
   * 模拟持仓
   */
  SIMULATED,
  /**
   * 计划委托
   */
  PENDING,
  /**
   * 历史成交
   */
  HISTORY,
  /**
   * 资金流水
   */
  FUNDS,
}

/**
 * 是否在资产页面使用
 */
export enum InAssetsType {
  /**
   * 不在资产页面使用
   */
  NotInAssets = 0,
  /**
   * 在资产页面使用
   */
  InAssets = 1,
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

export type LiteListItem = {
  /**
   * 订单号
   */
  id: string;
  /**
   * 被跟单者的名字
   */
  traderUsername: string | null;
  /**
   * 被跟单的数量
   */
  followCount: number | null;
  /**
   * 开仓方式
   */
  placeSource: string;
  /**
   * 商品标识
   */
  commodity: string; 
  /**
  * 合约标识
  */
  contract: string;
  /**
   * 商品名称
   */
  commodityName: string;
  /**
   * 商品类型
   */
  commodityType: string;
  /**
   * 货币符号
   */
  currency: string;
  /**
   * 杠杆
   */
  lever: number;
  /**
   * 做多还是做空
   */
  buy: boolean;
  /**
   * 仓位
   */
  volume: number;
  /**
   * 保证金
   */
  margin: number;
  /**
   * 开仓价
   */
  opPrice: number;
  /**
   * 平仓价
   */
  cpPrice: number;
  /**
   * 价格小数位
   */
  priceDigit: number;
  /**
   * 订单盈亏
   */
  income: number;
  /**
   * 止盈
   */
  takeProfit: number;
  /**
   * 止损
   */
  stopLoss: number;
  /**
   * 开仓时间
   */
  createTime: number;
  /**
   * 平仓时间
   */
  tradeTime: number;
  /**
   * 已使用的体验金ID
   */
  bonusId: string;
  /**
   * 资金费用
   */
  fundingFee: number;
  /**
   * 是否为模拟盘数据， true: 实盘数据， false: 模拟盘数据
   */
  standard: boolean;
  /**
   * 是否自动追加保证金
   */
  addMarginAuto: boolean;
  /**
   * 移动止损价格
   */
  trailPrice: number | string;
  /**
   * 移动止损偏移量
   */
  trailOffset: number | string;

  deferDays?: number;
  deferFee?: number;
};
