/**
 * 账户类型
 */
export enum AccountType {
  /**
   * 实盘账户
   */
  REAL = 'real',
  /**
   * 模拟盘账户
   */
  SIMULATED = 'simulated',
  /**
   * 体验金账户
   */
  TRIAL = 'trial',
}

/**
 * 仓位方向
 */
export enum PositionSide {
  /**
   * 做多
   */
  LONG = 'long',
  /**
   * 做空
   */
  SHORT = 'short',
}

/**
 * 订单类型
 */
export enum OrderType {
  /**
   * 市价单
   */
  MARKET = 'market',
  /**
   * 委托单
   */
  LIMIT = 'limit',
}

/**
 * 止盈止损类型
 */
export enum StopType {
  /**
   * 止盈
   * @description 价格达到止盈价时，系统自动平仓
   */
  STOP_PROFIT = 'stop_profit',
  /**
   * 止损
   * @description 价格达到止损价时，系统自动平仓
   */
  STOP_LOSS = 'stop_loss',
}

