import { StoreApi, UseBoundStore, create } from 'zustand';
export enum ORDERBOOK_TRADING_TYPE {
  BUY = 1, //买
  SELL = 0 //卖
}
export enum _TRADING_UNIT_TYPE {
  ZERO = 0, //张
  ONE = 1, //币
  TWO = 2 //USDT
}

const GlobalStore: UseBoundStore<StoreApi<GlobalStore>> = create(() => ({
  minPricePrecision: '',
  symbol_id: 'BTC-SWAP-USDT',
  indexToken: 'BTCUSDT',
  symbolSwapId: 'BTC-SWAP-USDT',
  contractMultiplier: '0.001', //当前交易对合约系数
  unitLen: '', //交易对成交量小数位
  U_precision: '4', //USDT精度 默认4
  max_digits: '', //价格精度 例如：37,982.0 ，精度为1
  base_precision: '',
  tradingUnitType: _TRADING_UNIT_TYPE.ZERO, //当前交易单位类型
  orderbookTradingType: ORDERBOOK_TRADING_TYPE.BUY, //盘口交易方向
  priceUnitLen: 2,
  coinUnitLen: 2,
  usdtUnitLen: 4
}));

//设置币对全局配置
export function setSymbolConfig(data: FutureSymbolInfo) {
  GlobalStore.setState(state => ({
    ...state,
    ...data
  }));
}

//合约单位设置 默认币
export function setTradingUnitType(data: any) {
  GlobalStore.setState(state => ({
    ...state,
    tradingUnitType: data.tradingUnitType
  }));
}

export function getGlobalState() {
  return GlobalStore.getState();
}
