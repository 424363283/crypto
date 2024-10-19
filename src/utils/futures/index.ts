import { getGlobalConfig } from '../config';
import { isServerSideRender } from '../validator';

export { contToCoin, contToUSDT, usdtToCoin, usdtToCont, coinToCont, coinToUSDT } from './covert';

export { toNum } from './toNum';

export { isPriceType } from './is-price-type';

export { isPositionUnitType } from './is-position-unit-type';

export { TPSL_CALC_TYPES, TPSL_PRICE_TYPES, calcTpslValue } from './tpsl';

export { calcQuantity } from './calcQuantity';

// 开仓保证金
export { cost } from './cost';

// 生成Slider Marks
export { generateSliderMarks } from './generate-slider-marks';

export { combineTpSlByPlanBatchId } from './combine-tpsl-by-plan-batch-id';

// 平仓预计盈亏
export { getClosePositionRealisedPnl } from './get-close-position-realised-pnl';

// 开仓预估强平价
export { getLiquidationPrice } from './get-liquidation-price';

// 未实现盈亏&收益率
export { getUnrealizedPnlRoi } from './get-unrealised-pnl-roi';

/** return eg. BTCUSDT or BTC/USDT */
export const getSymbolIdByPathname = (pathname: string) => {
  const match = pathname?.match(/\w{1,}(-[\s\S]{1,}-|\/)?USDT/i);
  return match ? match[0].replace(/-[\s\S]{1,}-/i, '') : '';
};

/**
 * 获取合约价格精度
 *
 * @param {*} e.g. "BTC-SWAP-USDT"
 */
export const getMinPricePrecision = (symbolId: string): string => getFutureSymbolInfo(symbolId).minPricePrecision;

/** USDT 精度 */
export const U_Precision: number = 4;

/**
 * 获取合约信息
 *
 * returns {@link FutureInfo}
 */
export const getFutureSymbolInfo = (function () {
  const futureSymbolMap = new Map();
  const initFutureSymbolMap = () => {
    if (futureSymbolMap.size || isServerSideRender()) return true;
    const futuresSymbol = getGlobalConfig('appConfig')?.futuresSymbol;

    if (Array.isArray(futuresSymbol)) {
      futuresSymbol.forEach(item => {
        futureSymbolMap.set(item.symbolId, item);
      });
    }
    return true;
  };
  /** e.g. "BTC-SWAP-USDT" */
  return (symbolId: string): FutureSymbolInfo => {
    let symbolInfo;
    if (initFutureSymbolMap()) symbolInfo = futureSymbolMap.get(symbolId);
    return Object.assign({ minPricePrecision: '0' }, symbolInfo);
  };
})();

/** 仓位单位*/
export enum PositionUnitTypes {
  /** 0 张 */
  CONT = 0,
  /** 1 币(BTC/ETH etc.) */
  COIN,
  /** 2 USDT */
  USDT
}

/**
 *
 * @param { string } symbolId
 * @returns []
 */
/** e.g. "BTC-SWAP-USDT" */
export const getBuePositionUnits = (
  symbolId: string
): Array<{
  name: string;
  type: number;
}> => [
    {
      name: '张',
      type: PositionUnitTypes.CONT
    },
    {
      name: getFutureSymbolInfo(symbolId).secondLevelUnderlyingName || '币',
      type: PositionUnitTypes.COIN
    },
    { name: 'USDT', type: PositionUnitTypes.USDT }
  ];

/**
 * 开平仓类型
 * 开仓 OPEN 0
 * 平仓 CLOSE 1
 */
export enum ChooseTypes {
  OPEN = 0,
  CLOSE
}

/**
 * 开平仓菜单
 */
export const ChooseMenus: Array<{
  label: string;
  value: ChooseTypes;
}> = [
    {
      label: '开仓',
      value: ChooseTypes.OPEN
    },
    {
      label: '平仓',
      value: ChooseTypes.CLOSE
    }
  ];

export enum PositionTypes {
  /** 逐仓 */
  ISOLATED = 1,
  /** 全仓 */
  CROSS
}

/**
 * 下单类型
 *
 *  INPUT 限价
 *
 *  MARKET_PRICE 市价
 *
 *  PLAN 计划委托
 *
 *  MAKER 只做Maker
 *
 */
export enum PriceTypes {
  INPUT,
  MARKET_PRICE,
  PLAN,
  MAKER
}

/**
 * 下单类型菜单
 */
export const PriceTypeMenus = [
  {
    label: '限价',
    value: 'INPUT',
    type: PriceTypes.INPUT
  },
  {
    label: '市价',
    value: 'INPUT',
    type: PriceTypes.MARKET_PRICE
  },
  {
    label: '计划委托',
    value: 'PLAN',
    type: PriceTypes.PLAN
  },
  {
    label: '只做Maker',
    value: 'PLAN',
    type: PriceTypes.MAKER
  }
];

/**
 * 生效时间
 */
export enum TimeInForceTypes {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK'
}

export enum EntrustPriceTypes {
  LIMIT = 0,
  MARKET,
}

/**
 * 触发价格类型
 */
export enum TriggerConditionTypes {
  /** 最新价格 */
  LatestPrice = 0,
  /** 标记价格 */
  MarketPrice
}
