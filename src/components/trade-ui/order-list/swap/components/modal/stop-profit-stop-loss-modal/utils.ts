import { postSwapEditSpslApi, postSwapSetSpslApi } from '@/core/api';
import { Swap } from '@/core/shared';
import { POSITION_TYPE } from '@/core/shared/src/constants/order';
import { resso } from '@/core/store';
import { formatNumber2Ceil } from '@/core/utils';

export const TYPES = {
  NEWS_PRICE: 'news',
  FLAG_PRICE: 'flag'
};

export const store = resso({
  stopProfit: '',
  stopProfitType: TYPES.NEWS_PRICE,
  stopLoss: '',
  stopLossType: TYPES.NEWS_PRICE,
  defaultStopProfit: '',
  defaultStopLoss: '',
  quoteList: [],
  // 平仓
  price: '',
  triggerPrice: '',
  triggerPriceType: TYPES.NEWS_PRICE,
  triggerPriceRoe: '',

  stopTriggerPrice: '', // 部分仓位止损触发价
  stopTriggerPriceRoe: '', // 部分仓位止损百分比
  volume: '',
  stopVolume: '',
  isLimit: false,
  stopIsLimit: false,
  volumeIndex: null,
  stopVolumeIndex: null,
  incomeStandard1: 0,
  incomeStandard2: 0,
  incomeStandard3: 0,
  stopLossRoe: '',
  stopProfitRoe: 0,
  volumePercent: 0,
  stopVolumePercent: 0,
  stopLossLimitPrice: '',

  stopProfitLimitType: TYPES.NEWS_PRICE,
  stopLossLimitType: TYPES.NEWS_PRICE
});
export const useLiquidation = ({ data }: { data: any }) => {
  const { isLimit } = store;
  const { priceUnitText, isUsdtType } = Swap.Trade.base;
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const volumeDigit = Swap.Info.getVolumeDigit(data?.symbol);
  // const { minDelegateNum } = Swap.Info.getCryptoData(data?.symbol);
  // const getMarketPrice = () => Swap.Socket.getFlagPrice(data?.symbol, { withHooks: false });

  const formatPositionNumber = (num?: any, fixed?: any, flagPrice?: any, isRoundup?: boolean) => {
    return data
      ? Swap.Calculate.formatPositionNumber({
          usdt: isUsdtType,
          code: data.symbol,
          value: num || 0,
          fixed: fixed || volumeDigit,
          flagPrice,
          isRoundup
        })
      : 0;
  };

  const calculateIncome = () => {
    const scale = isUsdtType ? 2 : Number(data.basePrecision);
    const volume = store.getSnapshot('volume');
    let value: any = volume;
    if (!volume || !data.symbol) {
      return (0).toFixed(scale);
    }
    if (isUsdtType ? true : !isVolUnit) {
      value = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value,
        code: data.symbol
      });
    }

    let income = Swap.Calculate.income({
      usdt: isUsdtType,
      code: data.symbol,
      isBuy: data.side === '1',
      flagPrice: isLimit ? store.getSnapshot('price') : store.getSnapshot('triggerPrice'),
      avgCostPrice: Number(data.avgCostPrice),
      volume: value || 0
    });

    income = formatNumber2Ceil(income, scale, false);
    return income?.toFixed(scale);
  };
  const onChangePrice = (e: any) => {
    store.price = e;
  };
  const onChangeVolume = (e: any, index: any, rate?: number, type?: string) => {
    let volumeDigit = Swap.Info.getVolumeDigit(data.symbol);
    const isMarginUnit = Swap.Info.getIsMarginUnit(isUsdtType);
    const balanceDigit = Swap.Assets.getBalanceDigit({ code: data.symbol });
    if (isMarginUnit) {
      volumeDigit = balanceDigit;
    }

    const max = formatPositionNumber(data?.availPosition, volumeDigit, data.avgCostPrice);
    if (e * 1 > max) {
      e = max;
    }
    if (type === 'partialPositionStop') {
      store.stopVolume = e;
      if (rate) {
        store.stopVolumePercent = Number(rate);
      } else {
        store.stopVolumePercent = Number(((e / max) * 100).toFixed(volumeDigit));
      }
      return;
    }
    store.volume = e.toString();
    store.volumeIndex = index;
    if (rate) {
      store.volumePercent = Number(rate);
    } else {
      store.volumePercent = Number(((e / max) * 100).toFixed(volumeDigit));
    }
  };

  const maxVolume = formatPositionNumber(Number(data.availPosition || 0));

  return { formatPositionNumber, maxVolume, onChangePrice, onChangeVolume, calculateIncome };
};

export const SubmitStopProfitStopLoss = async ({
  position,
  flagPrice,
  stopProfit,
  stopLoss,
  stopProfitType,
  stopLossType,
  defaultStopProfit,
  defaultStopLoss,
  priceNow,
  isUsdtType,
  balanceData,
  cryptoData,
  edit,
  params
}: any) => {
  // const {
  //   buyMinPrice: openBuyLimitRateMin,
  //   buyMaxPrice: openBuyLimitRateMax,
  //   sellMinPrice: openSellLimitRateMin,
  //   sellMaxPrice: openSellLimitRateMax,
  // } = Swap.Utils.formatCryptoPriceRange(flagPrice, cryptoData);
  // let price1 = stopProfitType === TYPES.NEWS_PRICE ? priceNow : flagPrice;
  // let price2 = stopLossType === TYPES.NEWS_PRICE ? priceNow : flagPrice;
  // let isBuy = position.side === '1' ? true : false; //1:多  2：空

  // const liquidationPrice = getCalculateLiquidationPrice({
  //   data: position,
  //   isUsdtType,
  //   balanceData,
  // });

  // if (isBuy) {
  //   if (stopProfit) {
  //     if (stopProfit <= price1) {
  //       message.error(LANG(stopProfitType === TYPES.NEWS_PRICE ? '止盈价需大于最新价格' : '止盈价需大于标记价格'));
  //       return;
  //     }
  //     if (stopProfit >= openBuyLimitRateMax) {
  //       message.error(LANG('止盈价需小于买入限价委托最高价格'));
  //       return;
  //     }
  //   }
  //   if (stopLoss) {
  //     if (stopLoss >= price2) {
  //       message.error(LANG(stopLossType === TYPES.NEWS_PRICE ? '止损价需小于最新价格' : '止损价需小于标记价格'));
  //       return;
  //     }
  //     if (stopLoss <= openBuyLimitRateMin) {
  //       message.error(LANG('止损价需大于买入限价委托最低价格'));
  //       return;
  //     }
  //     if (liquidationPrice && stopLoss < liquidationPrice) {
  //       message.error(LANG('止损价需大于强平价格'));
  //       return;
  //     }
  //   }
  // } else {
  //   if (stopProfit) {
  //     if (stopProfit >= price1) {
  //       message.error(LANG(stopProfitType === TYPES.NEWS_PRICE ? '止盈价需小于最新价格' : '止盈价需小于标记价格'));
  //       return;
  //     }
  //     if (stopProfit <= openSellLimitRateMin) {
  //       message.error(LANG('止盈价需大于卖出限价委托最低价格'));
  //       return;
  //     }
  //   }
  //   if (stopLoss) {
  //     if (stopLoss <= price2) {
  //       message.error(LANG(stopLossType === TYPES.NEWS_PRICE ? '止损价需大于最新价格' : '止损价需大于标记价格'));
  //       return;
  //     }
  //     if (stopLoss >= openSellLimitRateMax) {
  //       message.error(LANG('止损价需小于卖出限价委托最高价格'));
  //       return;
  //     }
  //     if (liquidationPrice && stopLoss >= liquidationPrice) {
  //       message.error(LANG('止损价需小于强平价格'));
  //       return;
  //     }
  //   }
  // }

  const query = [];
  const newMarginMode = Swap.Info._newMarginMode;
  const twoWayMode = position.positionType === POSITION_TYPE.TWO || Swap.Trade.twoWayMode;
  const extraParams =
    newMarginMode && twoWayMode ? { marginType: position.marginType, leverage: position.leverage } : {};
  const defaultData = {
    // 'positionId': data['positionId'],
    type: 5, //1 limit 2 market 4 limit_close 5 market_close
    subWallet: position['subWallet'],
    symbol: position['symbol'], //币对
    source: Swap.Utils.getSource(),
    side: position['side'] == '1' ? '2' : '1', // 1 买  2 卖
    opType: 1, // 1 仓位止盈止损  2 普通止盈止损
    positionId: position['positionId'],
    ...extraParams
  };

  if (edit) {
    const orders = position['orders'] ?? [];
    const _items = [{ strategyType: '1' }, { strategyType: '2' }];
    for (let _item of _items) {
      const item = params.find((e: any) => `${e['strategyType']}` == (_item as any)['strategyType']);
      const order = orders.find((e: any) => `${e['strategyType']}` == (_item as any)['strategyType']);
      if (order && !item) {
        query.push({
          ...defaultData,
          priceType: order['priceType'],
          triggerPrice: order['triggerPrice'],
          strategyType: order['strategyType'],
          orderId: order['orderId'],
          status: 4
        });
      } else if (item) {
        const next: any = {
          ...defaultData,
          priceType: item['priceType'], //价格类型：1:市场价格，2:标记价格，3:指数价格
          triggerPrice: item['triggerPrice'], //触发价格
          strategyType: item['strategyType'] // 1=止盈 2 = 止损
        };
        if (order) {
          next['orderId'] = order['orderId'];
        }
        query.push(next);
      }
    }
  } else {
    for (var item of params) {
      query.push({
        ...defaultData,
        ...(item as any)
        // "priceType": item['priceType'], //价格类型：1:市场价格，2:标记价格，3:指数价格
        // 'triggerPrice': item['price'], //触发价格
        // 'strategyType': item['strategyType'], // 1=止盈 2 = 止损
      });
    }
  }

  return await (!edit ? postSwapSetSpslApi(query, isUsdtType) : postSwapEditSpslApi(query, isUsdtType));
};

// 止盈
const SubmitStopProfit = ({ stopProfit, stopProfitType, position }: any) => {
  let isBuy = position.side === '1' ? true : false; //1:多  2：空
  return {
    positionId: position.positionId,
    isNewPrice: stopProfitType === TYPES.NEWS_PRICE,
    isBuy: isBuy,
    symbol: position.symbol,
    triggerPrice: Number(stopProfit), //触发价格
    stopProfit: true // 1=止盈 2 = 止损
  };
};
// 止损
const SubmitStopLoss = ({ stopLoss, stopLossType, position }: any) => {
  let isBuy = position.side === '1' ? true : false; //1:多  2：空

  return {
    positionId: position.positionId,
    isNewPrice: stopLossType === TYPES.NEWS_PRICE,
    isBuy: isBuy,
    symbol: position.symbol,
    triggerPrice: Number(stopLoss), //触发价格
    stopProfit: false
  };
};

// const getCalculateLiquidationPrice = ({ data, isUsdtType, balanceData }: any) => {
//   if (!isUsdtType) {
//     return data.liquidationPrice ? Number(data.liquidationPrice) : 0;
//   }
//   const { allCrossIncomeLoss, allMargin } = Swap.Calculate.positionData({
//     usdt: true,
//     data: Swap.Order.getPosition(isUsdtType),
//   });
//   const usdtAccb = balanceData.accb - Number(allMargin) - balanceData.frozen + allCrossIncomeLoss;
//   const income = Swap.Calculate.income({
//     usdt: isUsdtType,
//     code: data.symbol,
//     isBuy: data.side === '1',
//     avgCostPrice: Number(data.avgCostPrice),
//     volume: Number(data.currentPosition),
//   });
//   const incomeLoss = income < 0 ? income : 0;

//   return Swap.Calculate.liquidationPrice({
//     usdt: isUsdtType,
//     code: data.symbol,
//     lever: data.leverage,
//     volume: Number(data.currentPosition),
//     openPrice: Number(data.avgCostPrice),
//     accb: usdtAccb - incomeLoss,
//     margin: Number(data.margin),
//     mmr: Number(data.mmr),
//     isBuy: data.side === '1',
//     isCross: data.marginType === 1,
//     fixed: data.baseShowPrecision * 1,
//     bonusAmount: Swap.Info.getTwoWayMode(isUsdtType) ? 0 : balanceData?.bonusAmount || 0,
//   });
// };

export const _calculateIncome = ({
  data,
  shouldSet = true,
  profit,
  loss
}: {
  data: any;
  shouldSet?: boolean;
  profit?: boolean;
  loss?: boolean;
}) => {
  const { isUsdtType } = Swap.Trade.base;
  const price = loss ? store.stopLoss : profit ? store.stopProfit : 0;
  if (price) {
    const value = Swap.Calculate.income({
      usdt: isUsdtType,
      code: data.symbol?.toUpperCase(),
      isBuy: data.side === '1',
      avgCostPrice: Number(data.avgCostPrice),
      volume: Number(data.availPosition),
      flagPrice: Number(price)
    });
    return `${value}`;
  } else {
    return '';
  }
};

export const setDefaultSpsl = ({ data, incomeLoss }: { data: any; incomeLoss: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const priceScale = Number(data.baseShowPrecision);
  if (!incomeLoss) {
    store.incomeStandard1 = 0;
    let stopProfit = null;
    let stopProfitType = TYPES.NEWS_PRICE;
    data.orders.forEach((o: any) => {
      if (o.strategyType === '1') {
        stopProfit = Number(o.newTriggerPrice || o.triggerPrice).toFixed(priceScale);
        stopProfitType = o.newTriggerPrice || o.priceType === '1' ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE;
      }
    });
    store.stopProfit = stopProfit !== null ? `${stopProfit}`.toFixed() : '';
    store.stopProfitType = stopProfitType;

    const stopProfitIncome = _calculateIncome({ data, profit: true });
    const newPrice = Swap.Utils.getNewPrice(data.symbol?.toUpperCase());

    const isStopProfit = data.positionSide === 'LONG'; // 做多并且止盈
    const spred = stopProfit ? (isStopProfit ? stopProfit.sub(newPrice) : newPrice.sub(stopProfit)) : 0;
    const percent = spred.div(newPrice).mul(100).toFixed(2);

    // const roe =
    // const roe = Swap.Calculate.positionROE({
    //   usdt: isUsdtType,
    //   data: data,
    //   income: stopProfitIncome,
    // }).toFixed(2);
    store.stopProfitRoe = percent > 0 ? percent : '';

    store.defaultStopProfit = stopProfit as any;
  } else {
    store.incomeStandard2 = 0;
    let stopLoss = null;
    let stopLossType = TYPES.NEWS_PRICE;

    data.orders.forEach((o: any) => {
      if (o.strategyType === '2') {
        stopLoss = Number(o.newTriggerPrice || o.triggerPrice).toFixed(priceScale);
        stopLossType = o.priceType === '1' ? TYPES.NEWS_PRICE : TYPES.FLAG_PRICE;
      }
    });

    store.stopLoss = stopLoss !== null ? `${stopLoss}`.toFixed() : '';
    const stopLossIncome = _calculateIncome({ data, loss: true });
    // const roe = Swap.Calculate.positionROE({
    //   usdt: isUsdtType,
    //   data: data,
    //   income:stopLossIncome,
    // });
    // store.stopLossRoe = Math.abs(roe).toFixed(2)

    const newPrice = Swap.Utils.getNewPrice(data.symbol?.toUpperCase());

    const isStopProfit = data.positionSide === 'LONG'; // 做多并且止盈
    const spred = stopLoss ? (isStopProfit ? stopLoss.sub(newPrice) : newPrice.sub(stopLoss)) : 0;
    const percent = spred ? spred.div(newPrice).mul(100).toFixed(2) : '';

    store.stopLossRoe = percent;

    store.stopLossType = stopLossType;
    store.defaultStopLoss = stopLoss as any;
  }
};

export const setStopLossRoe = (roe: any) => {
  store.stopLossRoe = roe;
};

export const setStopProfitRoe = (roe: any) => {
  store.stopProfitRoe = roe;
};

export const setStopfitPrice = (price: any) => {
  store.stopProfit = price;
};

export const setStopLossPrice = (price: any) => {
  store.stopLoss = price;
};

export const setTriggerPrice = (price: any) => {
  store.triggerPrice = price;
};

export const setTriggerPriceRoe = (roe: any) => {
  store.triggerPriceRoe = roe;
};

// 部分仓位止损触发价
export const setStopTriggerPrice = (price: any) => {
  store.stopTriggerPrice = price;
};

// 部分仓位止损收益率
export const setStopTriggerPriceRoe = (roe: any) => {
  store.stopTriggerPriceRoe = roe;
};

// 设置部分止盈止损限价
export const setstopLossLimitPrice = (price: any) => {
  store.stopLossLimitPrice = price;
};

export const resetFormData = data => {
  store.triggerPrice = '';
  store.triggerPriceRoe = '';
  store.volume = '';
  store.volumePercent = 0;
  store.stopTriggerPrice = '';
  store.stopTriggerPriceRoe = '';
  store.stopVolume = '';
  store.stopVolumePercent = 0;
  store.stopLossLimitPrice = 0;
  store.stopIsLimit = false;

  if (data && data.orders) {
    data.orders = data.orders.map(item => {
      if (item.newTriggerPrice) {
        delete item.newTriggerPrice;
      }
      return item;
    });
  }
};
