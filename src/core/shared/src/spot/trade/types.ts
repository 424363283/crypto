/**
 * 交易类型
 */
export enum SideType {
  BUY = 1,
  SELL = 2,
}

/**
 * 订单类型
 */
export enum SpotOrderType {
  /**
   * 限价单
   */
  LIMIT = 0,
  /**
   * 市价单
   */
  MARKET = 1,
  /**
   * 限价止盈止损单
   */
  LIMIT_PLAN = 2,
  /**
   * 市价止盈止损单
   */
  MARKET_PLAN = 3,
  /**
   * OCO(One-Cancels-the-Other)
   */
  OCO = 4,
}
/**
 * 交易类型
 */
export enum TRADE_TAB {
  SPOT,
  STRATEGY,
}
