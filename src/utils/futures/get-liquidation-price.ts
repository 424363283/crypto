import { DEPTH, EXCHANGE_ID } from '@/constants';
import { getFutureLatestPrice, operator } from '@/service';
import { ChooseTypes, PositionTypes, PriceTypes, getFutureSymbolInfo } from '.';
import { getPositionOrder } from '@/store/tradingTab/positionOrder';
import * as mathjs from 'mathjs';
import { getFutureStore } from '@/store/future';

export function getSymbolInfoGear(num: any, riskLimits: any) {
  let gear: any = {};
  if (riskLimits.length === 0) {
    return;
  }
  if (isNaN(Number(num))) num = 0;

  riskLimits.sort((r1: any, r2: any) => r1.riskLimitAmount - r2.riskLimitAmount); 
  for (let i = 0; i < riskLimits.length; i++) {
    if (num <= +riskLimits[i].riskLimitAmount) {
      gear = riskLimits[i];
      break;
    }
  }
  return gear;
}

export function getLiquidationPrice(option: LiquidationOptions) {
  let liquidatePrice: any = '';

  const { symbolSwapId, orderChoose, orderSide, positionType, priceType, inputPrice, leverage, totalCont } = option;
  if (orderChoose == ChooseTypes.CLOSE) return '';

  const positionList = getPositionOrder().positionList;
  const symbolInfo = getFutureSymbolInfo(symbolSwapId);
  const { baseTokenFutures, minPricePrecision, quoteTokenName } = symbolInfo;
  const { contractMultiplier } = baseTokenFutures as any;

  const riskLimits = []
    .concat(baseTokenFutures?.riskLimits as any)
    .sort((a: any, b: any) => a.maintainMargin - b.maintainMargin);

  const latestPrice = getFutureLatestPrice(symbolSwapId);
  const priceUnitLen = DEPTH[minPricePrecision];

  const datas = operator.getData('mergedDepth_source');
  const data = datas[EXCHANGE_ID + '.' + symbolSwapId + priceUnitLen];
  const sellHandicap = data?.a;
  const buyHandicap = data?.b;
  const direction = orderSide == 'BUY' ? 1 : -1; //持仓方向 0位买/-1为卖

  let price: any = '';
  /* 市价单 价格取最新价 */
  if (priceType == PriceTypes.MARKET_PRICE) {
    price = latestPrice;
  } else {
    if (
      inputPrice &&
      orderSide == 'BUY' &&
      (
        (sellHandicap && sellHandicap[0] && inputPrice > sellHandicap[0][0]) ||
        !sellHandicap ||
        !sellHandicap[0]
      )
    ) {
      // 买单
      price = latestPrice * (1 + direction * 0.001);
    } else if (
      inputPrice &&
      orderSide == 'SELL' &&
      (
        (buyHandicap && buyHandicap[0] && inputPrice < buyHandicap[0][0]) ||
        !buyHandicap ||
        !buyHandicap[0]
      )
    ) {
      // 卖单
      price = latestPrice * (1 + direction * 0.001);
    } else {
      price = inputPrice;
    }
  }

  if (positionType == PositionTypes.CROSS) {
    const longPosition: any = positionList?.find((item: any) => (item.isLong == '1' && item.symbolId === symbolSwapId) ) || { avgPrice: 0, total: 0 };
    const shortPosition: any = positionList?.find((item: any) => (item.isLong == '0' && item.symbolId === symbolSwapId)) || { avgPrice: 0, total: 0 };

    const longIncreaseQuantity = orderSide === 'BUY' ? totalCont : 0;
    const shortIncreaseQuantity = orderSide !== 'BUY' ? totalCont : 0;

    const longTotal = Number(longPosition.total);
    const shortTotal = Number(shortPosition.total);

    const newLongTotal = longIncreaseQuantity + longTotal;
    const newShortTotal = shortIncreaseQuantity + shortTotal;

    const longMaintainMarginRatio = getSymbolInfoGear(newLongTotal, riskLimits)?.maintainMargin;
    const shortMaintainMarginRatio = getSymbolInfoGear(newShortTotal, riskLimits)?.maintainMargin;

    let newLongAvgPrice = 0;
    if (newLongTotal > 0) {
      newLongAvgPrice = (longPosition.avgPrice * longTotal + price * longIncreaseQuantity) / newLongTotal;
    }

    let newShortAvgPrice = 0;
    if (newShortTotal > 0) {
      newShortAvgPrice = (shortPosition.avgPrice * shortTotal + price * shortIncreaseQuantity) / newShortTotal;
    }

    let crossMaintainMargin = 0; // Σ全仓仓位维持保证金
    let selfMaintainMargin = 0; // 合约1多空持仓的维持保证金
    let crossUnrealisedPnl = 0;
    let selfUnrealisedPnl = 0;
    let isolatedMargin = 0;
    //   - UPNL1为其它全仓模式合约币对下的全部未实现盈亏（除合约1多空持仓外）
    // - UPL 接口提供，字段 unrealisedPnl
    // - UPL1 = Σ全仓UPL - 合约1多空持仓的UPL
    positionList?.forEach((item: any) => {
      const {
        symbolId,
        positionType,
        maintainMargin,
        indices, // 标记价
        unrealisedPnl, // UPL
        futuresMultiplier,
        total,
        margin
      } = item;

      if (positionType == PositionTypes.CROSS) {
        /*  合约1多空持仓的维持保证金 */
        const maintainMarginValue = maintainMargin * indices * total * Number(futuresMultiplier);
        // 维持保证金计算公式= 维持保证金比例 * 标记价格 *张数*合约乘数;
        if (symbolId === symbolSwapId) {
          selfMaintainMargin += maintainMarginValue;
          selfUnrealisedPnl += Number(unrealisedPnl);
        }
        crossMaintainMargin += maintainMarginValue;
        crossUnrealisedPnl += Number(unrealisedPnl);
      } else {
        isolatedMargin += (+margin);
      }
    });

    const tmm1 = crossMaintainMargin - selfMaintainMargin; // TMM1

    const upnl1 = crossUnrealisedPnl - selfUnrealisedPnl;

    const { futureBalances } = getFutureStore();
    const balance = futureBalances.find((item: any) => quoteTokenName == item.tokenName);
    let available = 0;
    if (balance) {
      // total = 0
      // 全仓保证金余额 = 冻结金额 + 可用余额 + 全仓未实现盈亏 + 负债 - 逐仓保证金
      // total !== 0
      // 全仓保证金余额 = 钱包余额 + 全仓未实现盈亏 + 负债 - 逐仓保证金
      const total = +balance.total;
      const originTotal = +balance.originTotal;
      const locked = +balance.locked;
      const availableMargin = +balance.availableMargin;
      const indebted = +balance.indebted;
      if (total === 0) {
        available = locked + availableMargin + indebted - isolatedMargin;
      } else {
        available = originTotal + indebted - isolatedMargin;
      }
    }

    const numerator = available - tmm1 + upnl1 - newLongAvgPrice * newLongTotal * contractMultiplier + newShortAvgPrice * newShortTotal * contractMultiplier;
    const denominator = longMaintainMarginRatio * newLongTotal * contractMultiplier + shortMaintainMarginRatio * newShortTotal * contractMultiplier + newShortTotal * contractMultiplier - newLongTotal * contractMultiplier;

    liquidatePrice = numerator / denominator;
  } else {
    //  逐仓钱包余额 = 开仓单数量张* 合约乘数* 挂单价格 +  逐仓仓位保证金
    //  开仓均价 = （【持仓开仓均价】* 【持仓张数】+本次下单价格*本次下单张数）/（ 【持仓张数】+下单张数）
    const isLong = orderChoose == ChooseTypes.OPEN && orderSide == 'BUY' ? 1 : 0;
    const positionItem: any = positionList?.filter(
      (item: any) => symbolSwapId == item.symbolId && item.isLong == isLong
    )[0] || { margin: 0, total: 0, avgPrice: 0 };

    //  逐仓钱包余额= (本次下单张数* 合约乘数* 本次下单价格)/leverage + 当前逐仓仓位保证金
    // 当前逐仓仓位保证金 为 已有逐仓仓位的 margin字段；如果没有对应逐仓仓位时，当前逐仓仓位保证金=0

    // 逐仓钱包余额=开仓单数量张* 合约乘数* 挂单价格 +  逐仓仓位保证金
    const amountMondy = (totalCont * contractMultiplier * Number(price)) / leverage + Number(positionItem.margin);

    const allCont = (+positionItem.total) + totalCont;
    
    const maintainMargin = getSymbolInfoGear(allCont, riskLimits).maintainMargin;

    const newPrice = (positionItem.avgPrice * positionItem.total + Number(price) * totalCont) / Number(allCont); //开仓buy均价
    const molecular = amountMondy - direction * newPrice * allCont * contractMultiplier;
    const denominator = maintainMargin * allCont * contractMultiplier - direction * allCont * contractMultiplier;

    liquidatePrice = molecular / denominator;
  }

  if (liquidatePrice > 0) {
    if (`${liquidatePrice}`.indexOf('e') > -1) {
      liquidatePrice = mathjs.chain(liquidatePrice).format({ notation: 'fixed' }).done();
    }
    /* 
      预估强平价
      1.开多向上取整
      2.开空向下取整
    */
    const pow = Math.pow(10, priceUnitLen);
    liquidatePrice =
      orderSide == 'BUY'
        ? Math.ceil(liquidatePrice * pow) / pow
        : Math.floor(liquidatePrice * pow) / pow;
  }
  return liquidatePrice > 0 ? liquidatePrice : '--';
}
