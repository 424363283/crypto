import { Markets } from '../../../markets';
import { SwapTradeItem } from '../../../trade/trade-map';
import { tradeInstance as Trade } from '../trade';

export class Utils {
  static newestPrice: number | null = null;
  /* 这个价格看起来是标记价 */
  static getNewPrice = (id: string) => {
    return Number(Markets.markets[id]?.price) || 0;
  };

  static setNewestPrice = (price:number) => {
    Utils.newestPrice = price;
    return price;
  }

  /* 获取最新价 */
  static getNewestPrice = () => {
    return Utils.newestPrice;
  };


  static minChangeFormat = (change: number, value: string | number) => {
    let str = value.div(change) + '';
    if (/\./.test(str)) {
      // 不能整除
      value = Number(str.replace(/\..*$/, '') || 0).mul(change);
    }
    return Number(value);
  };

  static formatCryptoPriceRange = (price: number, data: SwapTradeItem) => {
    const { openBuyLimitRateMin, openBuyLimitRateMax, openSellLimitRateMin, openSellLimitRateMax, minChangePrice } = data;

    const buyMinPrice = Math.ceil(Number((price * (1 - openBuyLimitRateMin)).div(minChangePrice))).mul(minChangePrice);
    const buyMaxPrice = Math.floor(Number((price * (1 + openBuyLimitRateMax)).div(minChangePrice))).mul(minChangePrice);
    const sellMinPrice = Math.ceil(Number((price * (1 - openSellLimitRateMin)).div(minChangePrice))).mul(minChangePrice);
    const sellMaxPrice = Math.floor(Number((price * (1 + openSellLimitRateMax)).div(minChangePrice))).mul(minChangePrice);

    return { buyMinPrice: Number(buyMinPrice), buyMaxPrice: Number(buyMaxPrice), sellMinPrice: Number(sellMinPrice), sellMaxPrice: Number(sellMaxPrice) };
  };
  static numberDisplayFormat = (value: string | number) => {
    // 可用余额 保证金 为0时，不保留小数位数了
    if (Number(value) === 0 || Number.isNaN(Number(value))) {
      return 0;
    }
    return value;
  };

  static getSource() {
    return 1;
  }

  static getSpslParams(stopProfit: boolean, { symbol, buy, volume, triggerPrice, priceType,price}: any) {
    return {
      priceType: priceType == Trade.PRICE_TYPE.FLAG ? 2 : 1, // 1:市场价格，2:标记价格，
      side: buy ? 2 : 1,
      source: Utils.getSource(),
      symbol: symbol,
      triggerPrice: triggerPrice,
      type: 5,
      strategyType: stopProfit ? 1 : 2,
      opType: 2,
      volume: volume,
      price
    };
  }
}
