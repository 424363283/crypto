import * as math from 'mathjs';
import { fixDigits } from '@/utils/common';
import { getFutureLatestPrice, operator } from '@/service';
import { getOrderSetting } from '@/store';
import { PriceTypes } from '.';

// fixDigits
export function getDepthPriceData(
  exchange_id: string | number,
  symbol_id: string | number,
  aggTrade_digits: string | number
) {
  const merged_depth = operator.getData('mergedDepth_source');

  const aggTrade_data = merged_depth[exchange_id + '.' + symbol_id + aggTrade_digits] || {};

  const sell = aggTrade_data.a || [];

  const buy = aggTrade_data.b || [];

  return { buy, sell };
}


/** 是否显示二次确认弹窗 */
export function checkOrderModal(
  /** ex: BTC-SWAP-USDT */
  symbolSwapId: string,
  /** 下单价格类型 */
  priceType: PriceTypes,
  /** 价格 */
  price: number,
  /** 触发价格 */
  triggerPrice: number,
  /** 方向 BUY=做多 SELL=做空*/
  side: 'BUY' | 'SELL'
) {
  const lastestPrice = getFutureLatestPrice(symbolSwapId);

  // 设置下单确认
  const confirm1 = getOrderSetting().settings[symbolSwapId]?.orderSetting?.isConfirm;

  // 普通委托 买入价格高于最新价20%
  const confirm2 =
    priceType == PriceTypes.INPUT && lastestPrice && price && price / lastestPrice > 1.2;

  // 普通委托 卖出价格低于最新价20%
  const confirm3 =
    priceType == PriceTypes.INPUT && lastestPrice && lastestPrice * 0.8 - Number(price) > 0;

  // 计划委托 买入价格高于触发价格20%
  const confirm4 =
    priceType == PriceTypes.PLAN && side == 'BUY' && triggerPrice && price / triggerPrice > 1.2;

  // 计划委托 卖出价格低于触发价格20%
  const confirm5 =
    priceType == PriceTypes.PLAN && triggerPrice && triggerPrice * 0.8 > price;


  return {
    /** 下单确认 */
    confirm1,
    /** 普通委托 买入价格高于最新价20% */
    confirm2,
    /** 普通委托 卖出价格低于最新价20% */
    confirm3,
    /** 计划委托 买入价格高于触发价格20% */
    confirm4,
    /** 计划委托 卖出价格低于触发价格20% */
    confirm5,
  };
}

export function checkPlaceOrderLimit(
  buy_type: string | number,
  buy_price: string | number,
  order_side: string | number,
  exchange_id: string | number,
  symbol_id: string | number,
  aggTrade_digits?: any
) {
  if (!(buy_type === 0 || buy_type === '0')) {
    return { limitPriceConfirm: false };
  }

  const { sell, buy } = getDepthPriceData(exchange_id, symbol_id, aggTrade_digits);

  if (sell[0] && (order_side === 0 || order_side === '0')) {
    if (+buy_price / (+sell[0][0] || 1) >= 1.02) {
      const sellPrice = math.chain(1.02).multiply(math.bignumber(sell[0][0])).done();
      return { limitPriceConfirm: true, type: '1', sellPrice: fixDigits(sellPrice, aggTrade_digits) };
    }
    if (+buy_price / (+sell[0][0] || 1) >= 1.01) {
      return { limitPriceConfirm: true, type: '2' };
    }
  }

  if (buy[0] && order_side == 1) {
    if (+buy_price / (+buy[0][0] || 1) <= 0.98) {
      const buyPrice = math.chain(0.98).multiply(math.bignumber(buy[0][0])).done();

      return { limitPriceConfirm: true, type: '3', buyPrice: fixDigits(buyPrice, aggTrade_digits) };
    }

    if (+buy_price / (+buy[0][0] || 1) <= 0.99) {
      return { limitPriceConfirm: true, type: '4' };
    }
  }

  return { limitPriceConfirm: false };
}
