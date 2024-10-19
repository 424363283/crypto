import { digits } from '@/utils/common/digit';
import * as mathjs from 'mathjs';
import { cost, usdtToCont, coinToCont } from '@/utils/futures';
import { getGlobalState } from '@/store/global';
import { EXCHANGE_ID } from '@/constants';
import { GlobalConfiguration, format } from '@/utils/index';
import { getFutureLatestPrice, operator } from '@/service';
import { PositionUnitTypes, contToCoin, contToUSDT } from '@/utils/futures';
// 配给 buyMarginRatio 和 sellMarginRatio
interface SymbolInfo {
  maintainMargin?: number;
}

const { symbolSwapId } = getGlobalState();

// 获取最新价
export const getNewestPrice = (aggTradeDigits: any) => {
  const tokenQuote = operator.getData('symbol_quote_source')[symbolSwapId] || {};
  const maxDigits = aggTradeDigits;
  return digits(tokenQuote.c, maxDigits);
};

// 预估强平价风险评估
export const getSymbolInfoGear = (num: any, symbolsMap: any) => {
  let gear = {};
  const result = symbolsMap.futures[symbolSwapId];
  const symbol_info_reversed = result && result?.baseTokenFutures?.riskLimits; // 这一行很重要，决定一切
  const symbol_info = [...symbol_info_reversed].reverse();
  // console.log('infoooooooo', symbol_info);
  if (symbol_info.length === 0) {
    return;
  }
  if (Number(num) == 0) {
    gear = symbol_info[symbol_info.length - 1];
    return gear;
  }
  if (isNaN(Number(num))) {
    gear = symbol_info[symbol_info.length - 1];
    return gear;
  }
  // console.log('555555', symbol_info);
  symbol_info?.forEach((element: any, index: any, arr: any) => {
    if (Number(num) <= Number(arr[arr.length - 1]?.riskLimitAmount)) {
      gear = arr[arr.length - 1];
      return gear;
    }
    if (Number(num) > Number(arr[index]?.riskLimitAmount) && num <= Number(arr[index + 1]?.riskLimitAmount)) {
      gear = arr[index];
      // console.log('2');
      return gear;
    } else if (Number(num) >= Number(arr[index]?.riskLimitAmount)) {
      gear = arr[index];
      // console.log('3');
      return gear;
    }
    //  else {
    //   // console.log("4")
    //   gear = arr[arr.length - 1];
    //   return gear;
    // }
  });
  // console.log('GEARRRRRRR', gear);
  return gear;
};

// 用户输入的 张 币 U 数量 转 张
export const convertQuantityAccordingly = (
  quantity: any,
  contractMultiplier: any,
  latestPrice: any,
  positionUnitType: any
) => {
  let buyCont = 0;
  if (quantity > 0) {
    // 不变
    if (positionUnitType == 0) {
      // 张
      buyCont = quantity;
    } else if (positionUnitType == 1) {
      // 币 -> 张
      buyCont = coinToCont(quantity, contractMultiplier);
    } else if (positionUnitType == 2) {
      // U -> 张
      buyCont = usdtToCont(quantity, contractMultiplier, latestPrice);
    }
    return buyCont;
  }
};

// 计算预估强平价
export const estimatedLiquidationPrice = (
  latestPrice: any,
  symbolInfo: any,
  aggTradeDigits: any,
  orderSide: any,
  orderChoose: any,
  positionType: any,
  positionList: any,
  positionUnitType: any,
  totalCount: any,
  contractMultiplier: any,
  symbolsMap: any,
  futureTradeable: any,
  futureBalances: any,
  priceType: any,
  leverageLong: any,
  leverageShort: any
) => {
  const datas = operator.getData('mergedDepth_source');
  const data = datas[EXCHANGE_ID + '.' + symbolSwapId + aggTradeDigits];
  const sellHandicap = data?.a;
  const buyHandicap = data?.b;
  const thePositionDirection = orderSide == 'BUY' ? 1 : -1;

  if (orderChoose == 1) {
    return '';
  }
  let price = 0;
  if (positionType == 2) {
    if (latestPrice && orderSide == 'BUY' && sellHandicap && sellHandicap[0] && latestPrice >= sellHandicap[0][0]) {
      // 买单
      price = sellHandicap[0][0] * (1 + thePositionDirection * 0.001);
    } else if (latestPrice && orderSide == 'SELL' && buyHandicap && buyHandicap[0] && latestPrice < buyHandicap[0][0]) {
      // 卖单
      price = buyHandicap[0][0] * (1 + thePositionDirection * 0.001);
    } else {
      price = latestPrice;
    }
  }

  /* 市价单 价格以最新价为准 */
  if (positionType == 1) {
    price = Number(getNewestPrice(aggTradeDigits));
  }

  let p = 0;

  const positionListActive = positionList?.filter((item: any) => {
    return item.symbolId === symbolSwapId;
  });
  // isLong 0空仓，1多仓
  const findBuy = positionListActive?.find((item: any) => item.isLong == 1);
  const findSell = positionListActive?.find((item: any) => item.isLong == 0);
  // 定义常量变量
  const _findBuyPrice = findBuy?.avgPrice || 0;
  const _findSellPrice = findSell?.avgPrice || 0;
  const buyTotal = findBuy?.total ? findBuy?.total : 0;
  const sellTotal = findSell?.total ? findSell?.total : 0;
  const b =
    orderSide == 'BUY'
      ? Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType))
      : 0;
  const s =
    orderSide !== 'BUY'
      ? Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType))
      : 0;
  const buyPositions = b + Number(buyTotal); //当前多持仓张数
  const sellPositions = s + Number(sellTotal); //当前空持仓张数
  const buyQuantity =
    orderSide == 'BUY' ? convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType) : 0;
  const sellQuantity =
    orderSide == 'SELL' ? convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType) : 0;
  const numBuyPriceInfo = (_findBuyPrice * buyTotal + price * (buyQuantity || 0)) / buyPositions;
  // 当前仓位多仓开仓均价=合约1多仓开仓均价】= （【合约1多仓开仓均价】* 【合约1多仓持仓张数】+本次Open Long下单价格*本次Open Long下单张数
  let buypriceVal = isFinite(numBuyPriceInfo) ? numBuyPriceInfo : 0;
  const numSellPrice = (_findSellPrice * sellTotal + price * (sellQuantity || 0)) / sellPositions;
  // 当前空仓限价的价格=合约1多仓开仓均价】= （【合约1多仓开仓均价】* 【合约1多仓持仓张数】+本次Open Long下单价格*本次Open Long下单张数
  const sellpriceVal = isFinite(numSellPrice) ? numSellPrice : 0;
  //合约1空仓维持保证金比率
  const buyMarginRatio = (getSymbolInfoGear(buyPositions, symbolsMap) as SymbolInfo | undefined)?.maintainMargin;
  //合约1多仓维持保证金比率
  const sellMarginRatio = (getSymbolInfoGear(sellPositions, symbolsMap) as SymbolInfo | undefined)?.maintainMargin;

  if (Object.keys(futureTradeable).length <= 0 || !futureTradeable[symbolSwapId]) {
    return '';
  }
  let token2_name = '';
  token2_name = symbolInfo.quoteTokenName;
  const balances = futureBalances.filter((list: any) => token2_name == list.tokenName);
  /* 全仓钱包余额 - TMM1 +UPNL1 */

  let marginTotal = 0; // 计算逐仓类型的仓位

  let maintainMarginCalcTotal = 0; // Σ全仓仓位维持保证金
  let selfMaintainMarginTotal = 0; // 合约1多空持仓的维持保证金
  let UPL1Total = 0;
  let selfUPL1Total = 0;
  //   - UPNL1为其它全仓模式合约币对下的全部未实现盈亏（除合约1多空持仓外）
  // - UPL 接口提供，字段 unrealisedPnl
  // - UPL1 = Σ全仓UPL - 合约1多空持仓的UPL

  positionList?.forEach((item: any) => {
    const {
      symbolId,
      positionType,
      margin,
      maintainMargin, //
      indices, // 标记价
      unrealisedPnl, // UPL
      futuresMultiplier,
      total
    } = item; // positionType 1 逐仓 2 全仓
    if (positionType == 1) {
      marginTotal = Number(marginTotal) + Number(margin);
    }
    if (positionType == 2) {
      if (symbolSwapId == symbolId) {
        /*  合约1多空持仓的维持保证金 */
        selfMaintainMarginTotal =
          Number(selfMaintainMarginTotal) + maintainMargin * indices * total * Number(futuresMultiplier);
        selfUPL1Total = Number(selfUPL1Total) + Number(unrealisedPnl);
      }
      // 维持保证金计算公式= 维持保证金比例 * 标记价格 *张数*合约乘数
      const maintainMarginCalc = maintainMargin * indices * total * Number(futuresMultiplier);
      maintainMarginCalcTotal = Number(maintainMarginCalcTotal) + Number(maintainMarginCalc);

      UPL1Total = Number(UPL1Total) + Number(unrealisedPnl);
    }
  });
  const wallet_balance_cross = balances[0]?.total - marginTotal; //全仓钱包余额 - Σ当前逐仓仓位margin

  const TMM1 = maintainMarginCalcTotal - selfMaintainMarginTotal; // TMM1

  const UPNL1 = UPL1Total - selfUPL1Total;
  // TMM1
  // - TMM1为其它全仓模仓合约币对下的全部维持保证金（除合约1多空持仓外）
  // - 前端遍历计算所有全仓模式持仓的维持保证金
  // - 维持保证金计算公式= 维持保证金比例 * 标记价格 *张数*合约乘数
  // - TMM1 = Σ全仓仓位维持保证金 - 合约1多空持仓的维持保证金

  const amount = Number(wallet_balance_cross) - Number(TMM1) + Number(UPNL1); // 全仓钱包余额 - TMM1 +UPNL1

  //全仓仓位预估强平价 =
  //  (全仓钱包余额 - TMM1 +UPNL1 - 合约1多仓开仓均价 * 合约1多仓持仓张数*合约乘数 +
  // 合约1空仓开仓均价 * 合约1空仓持仓张数*合约乘数)
  //  /
  //  (合约1多仓维持保证金比率 * 合约1多仓持仓张数*合约乘数+ 合约1空仓维持保证金比率 * 合约1空仓持仓张数*合约乘数
  // + 合约1空仓持仓张数*合约乘数 - 合约1多仓持仓张数*合约乘数 )
  if (positionType == 2) {
    //全仓强平
    // if (order_side == 0) {
    if (priceType == 1) {
      buypriceVal = latestPrice;
    }
    // case 1
    const buy = Number(buypriceVal) * Number(buyPositions) * Number(contractMultiplier);
    const sell = Number(sellpriceVal) * Number(sellPositions) * Number(contractMultiplier);
    const molecularCaseOne = Number(amount) - Number(buy) + Number(sell);
    const denominatorCaseOne =
      Number(buyMarginRatio) * Number(buyPositions) * Number(contractMultiplier) +
      Number(sellMarginRatio) * Number(sellPositions) * Number(contractMultiplier) +
      Number(sellPositions) * Number(contractMultiplier) -
      Number(buyPositions) * Number(contractMultiplier);
    p = molecularCaseOne / denominatorCaseOne;

    if (p > 0) {
      if (`${p}`.indexOf('e') > -1) {
        p = Number(mathjs.chain(p).format({ notation: 'fixed' }).done());
      }
      const minPricePrecision = (aggTradeDigits || 8) + 1;
      p = Number(digits(p, minPricePrecision));

      const pow1 = Math.pow(10, minPricePrecision - 1);
      p = orderChoose == 0 ? Math.ceil(p * pow1) / pow1 : Math.floor(p * pow1) / pow1;
    }

    return p > 0 ? p : '--';
  } else {
    // 逐仓钱包余额=  开仓单数量张* 合约乘数* 挂单价格 +  逐仓仓位保证金
    // 开仓均价 =  （【持仓开仓均价】* 【持仓张数】+本次下单价格*本次下单张数）/（ 【持仓张数】+下单张数）
    //逐买仓位
    const _stepBuyTotal = buyTotal || 0;
    const _stepSellTotal = sellTotal || 0;
    const _stepBuyPrice = findBuy?.avgPrice || 0;
    const _stepSellPrice = findSell?.avgPrice || 0;
    const buy_leverage_long = leverageLong;
    const buy_leverage_short = leverageShort;
    const _buyMargin = findBuy?.margin || 0;
    // const _sellMargin = findSell?.margin || 0;
    const _contractMultiplier = Number(contractMultiplier);
    const thePositionDirection = orderSide == 'BUY' ? 1 : -1; //持仓方向 0 位买/-1为卖
    if (latestPrice && orderSide == 'BUY' && sellHandicap && sellHandicap[0] && latestPrice > sellHandicap[0][0]) {
      // 买单
      price = sellHandicap[0][0] * (1 + thePositionDirection * 0.001);
    } else if (latestPrice && orderSide == 'SELL' && buyHandicap && buyHandicap[0] && latestPrice < buyHandicap[0][0]) {
      // 卖单
      price = buyHandicap[0][0] * (1 + thePositionDirection * 0.001);
    } else {
      price = latestPrice;
    }

    /* 市价单 价格取最新价 */
    if (priceType == 1) {
      price = latestPrice;
    }

    /* 2023年09月09日14:51:02 重新计算 逐仓钱包余额 */
    let marginTotal = 0;

    const defineIsLong = orderChoose == 0 && orderSide == 'BUY' ? 1 : 0;
    positionList?.forEach((item: any) => {
      const { symbolId, positionType, margin } = item; // positionType 1 逐仓 2 全仓
      /*
       *  @order_side == 0 ? "买入" : "卖出"
       *  @order_choose == 0 ? "开仓" : "平仓"
       *  @isLong 1 多仓 0 空仓
       */
      if (positionType == 1) {
        if (symbolSwapId == symbolId && item.isLong == defineIsLong) {
          marginTotal = Number(marginTotal) + Number(margin) * 1;
        }
      }
    });
    const theAmount = Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType));
    const isolatedMarginBalance =
      (theAmount * Number(contractMultiplier) * Number(price)) / Number(buy_leverage_long) + Number(_buyMargin); //逐仓钱包余额=开仓单数量张 * 合约乘数 * 挂单价格 +  逐仓仓位保证金
    const sellIsolatedMarginBalance =
      (theAmount * Number(contractMultiplier) * Number(price)) / Number(buy_leverage_short) + Number(marginTotal); // 待修改

    const stepBuyTotal =
      Number(_stepBuyTotal) +
      Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType)); //持仓 buy 张数
    const stepSellTotal =
      Number(_stepSellTotal) +
      Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType)); //持仓 sell 张数
    const _buyMaintainMargin = (getSymbolInfoGear(buyPositions, symbolsMap) as SymbolInfo | undefined)?.maintainMargin;
    const _sellMaintainMargin = (getSymbolInfoGear(sellPositions, symbolsMap) as SymbolInfo | undefined)
      ?.maintainMargin;
    const openBuyPrice =
      (Number(_stepBuyPrice) * Number(_stepBuyTotal) +
        Number(price) *
          Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType))) /
      Number(stepBuyTotal); //开仓 buy 均价
    const openSellPrice =
      (Number(_stepSellPrice) * Number(_stepSellTotal) +
        Number(price) *
          Number(convertQuantityAccordingly(totalCount, contractMultiplier, latestPrice, positionUnitType))) /
      Number(stepSellTotal); //开仓 sell 均价
    // case 2
    if (orderSide == 'BUY') {
      // 买
      const molecularCaseTwo =
        Number(isolatedMarginBalance) -
        Number(thePositionDirection) * Number(openBuyPrice) * Number(stepBuyTotal) * Number(_contractMultiplier);
      const denominatorCaseTwo =
        Number(_buyMaintainMargin) * Number(stepBuyTotal) * Number(_contractMultiplier) -
        Number(thePositionDirection) * Number(stepBuyTotal) * Number(_contractMultiplier);
      p = molecularCaseTwo / denominatorCaseTwo;
    } else {
      // case 3
      // 卖
      const molecularCaseThree =
        Number(sellIsolatedMarginBalance) -
        Number(thePositionDirection) * Number(openSellPrice) * Number(stepSellTotal) * Number(_contractMultiplier);
      const denominatorCaseThree =
        Number(_sellMaintainMargin) * Number(stepSellTotal) * Number(_contractMultiplier) -
        Number(thePositionDirection) * Number(stepSellTotal) * Number(_contractMultiplier);
      p = molecularCaseThree / denominatorCaseThree;
    }
  }

  if (p > 0) {
    if (`${p}`.indexOf('e') > -1) {
      p = Number(mathjs.chain(p).format({ notation: 'fixed' }).done());
    }
    const minPricePrecision = (aggTradeDigits || 8) + 1;
    /* 
          预估强平价
          1.开多向上取整
          2.开空向下取整
        */
    const pow1 = Math.pow(10, minPricePrecision - 1);
    p = Number(digits(p, minPricePrecision));
    p = orderChoose == 0 && orderSide == 'BUY' ? Math.ceil(p * pow1) / pow1 : Math.floor(p * pow1) / pow1;
  }
  return p > 0 ? p : '--';
};

// 计算占用保证金
export const computedSecurity = (
  totalCount: any,
  orderSide: any,
  price: any,
  symbolSwapId: any,
  leverage: any,
  positionUnitType: any,
  contractMultiplier: any
) => {
  const values = cost({
    quantity:
      positionUnitType == 0
        ? totalCount
        : positionUnitType == 1
          ? coinToCont(totalCount, contractMultiplier)
          : usdtToCont(totalCount, contractMultiplier, price),
    sideType: orderSide,
    price: price,
    symbolSwapId: symbolSwapId,
    leverage: leverage
  });
  return values[0];
};

// 计算止盈止损
export const getProfitAndLoss = (
  orderChoose: any,
  orderSide: any,
  positionList: any,
  totalCount: any,
  symbolInfo: any
) => {
  let profitAndLoss = 0;
  const symbolId = symbolSwapId;
  const defineIsLong = orderChoose == 1 && orderSide == 'SELL' ? 1 : 0; // @isLong 1 多仓 0 空仓
  const openPrice = positionList?.filter((item: any) => item.isLong == defineIsLong && item.symbolId == symbolId)[0]
    ?.avgPrice;
  const count = totalCount;

  const { minPricePrecision } = symbolInfo;
  const maxDigits = GlobalConfiguration.depth[minPricePrecision as keyof typeof GlobalConfiguration.depth];
  const newPrice: any = digits(getFutureLatestPrice(symbolId), maxDigits);

  const subtract =
    orderChoose == 1 && orderSide == 'SELL'
      ? newPrice - Number(openPrice)
        ? openPrice
        : 0
      : openPrice
        ? openPrice
        : 0 - newPrice;
  profitAndLoss = mathjs.multiply(Number(subtract), Number(count));
  return profitAndLoss;
};
//获取当前杠杆可开最大张数
export const getRiskLimits = (
  leverage: any,
  positionUnitType: number,
  lastestPrice: any,
  contractMultiplier: string
) => {
  const { baseTokenFutures, usdtUnitLen, coinUnitLen } = getGlobalState();
  const riskLimits =
    baseTokenFutures &&
    baseTokenFutures.riskLimits
      .reduce((results, item: RiskLimit) => {
        results.push({
          ...item,
          leverage: Math.floor(
            +mathjs.chain(mathjs.bignumber(1)).divide(+item.initialMargin).format({ notation: 'fixed' }).done()
          ).toString()
        });
        return results;
      }, [] as any)
      .sort((a: RiskLimit, b: RiskLimit) => +b.riskLimitAmount - Number(a.riskLimitAmount));
  let riskLimitAmount: number = 0;
  for (let i = 0; i < riskLimits.length; i++) {
    const item = riskLimits[i];
    if (i !== 0) {
      const beforeItem = riskLimits[i - 1];
      if (leverage <= parseInt(item.leverage) && leverage > parseInt(beforeItem.leverage)) {
        riskLimitAmount = +item.riskLimitAmount;
        break;
      }
    } else {
      riskLimitAmount = +item.riskLimitAmount;
    }
  }
  if (positionUnitType == PositionUnitTypes.CONT) {
    return riskLimitAmount;
  } else if (positionUnitType == PositionUnitTypes.COIN) {
    return contToCoin(riskLimitAmount, contractMultiplier, coinUnitLen);
  } else {
    return format(contToUSDT(riskLimitAmount, contractMultiplier, usdtUnitLen, lastestPrice), usdtUnitLen);
  }
};
