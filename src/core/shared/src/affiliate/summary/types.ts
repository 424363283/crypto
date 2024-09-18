// 币种数组
export const currencyAll = ['USDT', 'BTC', 'ETH', 'XRP', 'DOGE', 'DOT'];

export type AffiliateBalanceItem = {
  balance: number;
  withdrawableBalance: number;
  currency: string;
};

export enum BarGraphDataType {
  Direct = 1,
  All = 2,
}

export type BarGraphDataItem = {
  value1: number;
  value2: number;
  date: string;
};

export enum BarGraphType {
  Invite = 1,
  Deposit = 2,
  Trade = 3,
  Income = 4,
}

export enum TradeTab {
  Spot = 2,
  Swap = 3,
}

export type TradeListItem = {
  /**
   * 交易日期
   */
  date: string;
  /**
   * 交易量
   */
  amount: number;
  /**
   * 佣金收入
   */
  commission: number;
  /**
   * 交易笔数
   */
  count: number;
  /**
   * 交易人数
   */
  trading: number;
};
