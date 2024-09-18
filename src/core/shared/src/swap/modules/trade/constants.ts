// 下单开仓模式 open: 开仓模式, close: 平仓模式
export const POSITION_MODE = {
    OPEN: 'open',
    CLOSE: 'close',
  };
  
  export const ORDER_TRADE_TYPE = {
    /// 限价
    LIMIT: 'limit',
  
    /// 市价
    MARKET: 'market',
  
    /// 限价止盈止损
    LIMIT_SPSL: 'limitSpsl',
  
    /// 市价止盈止损
    MARKET_SPSL: 'marketSpsl',
  };
  
  export const PRICE_TYPE = {
    FLAG: 'flag',
    NEW: 'new',
  };
  
  export const DEFAULT_QUOTE_ID = {
    SWAP: 'BTC-USD',
    SWAP_U: 'BTC-USDT',
  };
  