import { EntrustPriceTypes, PriceTypes, getFutureSymbolInfo } from '.';
import { getFutureLatestPrice } from '@/service';
import * as mathjs from 'mathjs';

/**
 * 根据保证金余额计算可开张数
 *
 * @param {*} options {@link FutureTradeableOption}
 *
 * @returns Number
 */
type CalcQuantityOptions = {
  side: 'BUY' | 'SELL';
  leverage: number;
  available: number;
  symbolId: string;
  priceType: PriceTypes;
  price?: string;
  currentList: OpenOrderItem[];
  positionList: PositionItem[];
  currentEntrustPriceType?: number;
  triggerPrice?: any;
};
export function calcQuantity(options: CalcQuantityOptions) {
  const {
    side,
    leverage,
    available,
    symbolId,
    priceType,
    price,
    currentList = [],
    positionList = [],
    currentEntrustPriceType,
    triggerPrice
  } = options;

  if (!available || !leverage) return 0;

  // 合约信息
  const symbolInfo = getFutureSymbolInfo(symbolId);
  if (!symbolInfo.baseTokenFutures) return 0;

  /**
   * 合约乘数 contractMultiplier
   * Taker费率 takerBuyFee
   * 风险限额 riskLimits
   */
  const { contractMultiplier, feeConfig: { takerBuyFee } = {}, riskLimits } = symbolInfo.baseTokenFutures;
  if (!contractMultiplier || !takerBuyFee || !Array.isArray(riskLimits) || !riskLimits.length) return 0;

  const isLong = side == 'BUY' ? '1' : '0';

  const leverageRiskLimits: RiskLimit[] = [...riskLimits];
  leverageRiskLimits.sort((a, b) => Number(b.initialMargin) - Number(a.initialMargin));

  const initialMargin = mathjs.chain(mathjs.bignumber(1)).divide(leverage).done().toString();
  let riskLimitCont = 0;
  if (leverageRiskLimits.length) {
    // 杠杆对应档位
    let riskIdx = 0;
    for (let i = 0, len = leverageRiskLimits.length; i < len; i++) {
      if (initialMargin >= leverageRiskLimits[i].initialMargin) {
        riskIdx = i;
        break;
      }
    }
    const tarInitialMargin = leverageRiskLimits[riskIdx].initialMargin;
    // 获取相同杠杆值中的最大可开张数
    riskLimitCont = Math.max(
      ...leverageRiskLimits
        .filter(item => item.initialMargin == tarInitialMargin)
        .reduce((values, { riskLimitAmount }) => {
          (values as string[]).push(riskLimitAmount);
          return values;
        }, []),
      0
    );
  }
  if (!riskLimitCont) return 0;

  /**
   * 当前持仓张数
   * isLong
   *  0     卖出开空
   *  1     买入开多
   */
  const positionCont = Array.isArray(positionList)
    ? positionList
        .filter(item => item.symbolId == symbolId && item.isLong == isLong)
        .reduce((result, item) => {
          result += parseInt(item.total);
          return result;
        }, 0)
    : 0;

  /**
   * 限价委托张数
   */
  const currentCont = Array.isArray(currentList)
    ? currentList
        .filter(
          item => item.baseTokenId == symbolId && item.side === `${side}_OPEN`.toUpperCase() && item.type == 'LIMIT'
        )
        .reduce((result, item) => {
          result += parseInt(item.origQty);
          return result;
        }, 0)
    : 0;

  // 最新价
  const latestPrice = getFutureLatestPrice(symbolId);

  // 如果输入价格或触发价<=0, 都使用最新价计算
  let targetPrice = Number(price && +price > 0 ? price : latestPrice);
  switch (+priceType) {
    case PriceTypes.INPUT:
      // 限价
      if (side == 'SELL') {
        // 卖出开空
        targetPrice = Math.max(targetPrice, latestPrice);
      }
      break;
    case PriceTypes.MARKET_PRICE:
      // 市价
      targetPrice = latestPrice;
      break;
    case PriceTypes.PLAN:
      // 计划委托

      if (currentEntrustPriceType == EntrustPriceTypes.MARKET) {
        // 市价
        targetPrice = Number(+triggerPrice > 0 ? triggerPrice : latestPrice);
      } else if (side == 'SELL') {
        // 卖出开空 最新价和触发价取最大值
        targetPrice = Math.max(+latestPrice, +triggerPrice);
      }
      break;
    case PriceTypes.MAKER:
      // 只做Maker
      break;
  }
  // 最大理论可开空张数 = int[(可用保证金* 空仓杠杆倍数)/ (最新价 *（1+用户实际taker费率*2*杠杆倍数)*合约乘数)]
  const contNumerator: number = available * leverage; // 分子
  const contDenominator: number = targetPrice * (1 + +takerBuyFee * 2 * leverage) * +contractMultiplier; // 分母
  const tradeAbleCont = parseInt(String(contNumerator / contDenominator)); // 理论可开张数

  // 可开张数 = min[最大理论可开张数, max(0, 当前币对空头杠杆所在档位的风险限额张数- 持仓张数–  ∑限价委托张数)]
  const avaiableTradeCont = Math.min(tradeAbleCont, Math.max(0, riskLimitCont - positionCont - currentCont));

  return avaiableTradeCont;
}
