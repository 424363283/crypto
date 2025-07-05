import { FORMULAS } from '@/core/formulas';
import { SUBSCRIBE_TYPES } from '@/core/network';
import { formatDefaultText } from '@/core/utils';
import { Group, GroupItem } from '../../group';

class DetailMap {
  /**
   * @description 商品的id
   * @example BTCUSDT BTC-USDT BTC_USDT
   */
  public id: string;
  /**
   * @description 商品的全名
   * @example BTCUSDT
   */
  public name: string;
  /**
   * @description 商品币种
   * @example BTC
   */
  public coin: string;
  /**
   * @description 商品的计价货币
   * @example USDT
   */
  public quoteCoin?: string;
  /**
   * @description 价格小数位数
   * @example 2
   */
  public digit: number;
  /**
   * @description 成交量小数位数
   * @example 2
   */
  public volumeDigit: number;
  /**
   * @description 涨跌幅度百分比
   * @example +25 -25
   */
  public rate: string;
  /**
   * @description 是否涨跌
   * @example true false
   */
  public isUp: boolean;
  /**
   * @description 是否带单
   * @example true false
   */
  public copy?: boolean;
  /**
   * @description 杠杆倍数，目前只有在现货的ETF商品才有
   * @example true false
   */
  public lever?: number;
  /**
   * @description 是否做多，目前只有在现货的ETF商品才有
   * @example true false
   */
  public isBuy?: boolean;
  /**
   * @description 商品类型
   * @example spot swap
   */
  public type?: string;
  /**
   * @description 商品分组
   * @example
   */
  public zone?: string;
  /**
   * @description 商品单位
   * @example
   */
  public unit?: string;
  /**
   * @description 最新价格
   * @example 123.45
   */
  public price: string;
  /**
   * @description 前一个价格,上次收盘价
   * @example 123.45
   */
  public prevPrice: string;
  /**
   * @description 涨跌额
   * @example 123.45
   */
  public ratePrice: string;
  /**
   * @description 委托买入一档价
   * @example 123.45
   */
  public buyPrice: string; //
  /**
   * @description 委托买入一档量
   * @example 123.45
   */
  public buyVolume: string;
  /**
   * @description 委托卖出一档价
   * @example 123.45
   */
  public sellPrice: string;
  /**
   * @description 委托卖出一档量
   * @example 123.45
   */
  public sellVolume: string;
  /**
   * @description 24H最高价格
   * @example 123.45
   */
  public maxPrice: string;
  /**
   * @description 24H最低价格
   * @example 123.45
   */
  public minPrice: string;
  /**
   * @description 24H成交量
   * @example 123.45
   */
  public volume: string;
  /**
   * @description 24H交易额
   * @example 123.45
   */
  public total: string;
  /**
   * @description 今日开盘价格
   * @example 123.45
   */
  public openPrice: string;
  /**
   * @description 昨日收盘价格
   * @example 123.45
   */
  public closePrice: string;
  /**
   * @description 昨日结算价格
   * @example 123.45
   */
  public settlementPrice: string;
  /**
   * @description etf 净值
   * @example 123.45
   */
  public netValue: string;
  /**
   * @description 开盘价
   * @example 123.45
   */
  public o: number;
  /**
   * @description 最高价
   * @example 123.45
   */
  public h: number;
  /**
   * @description 最低价
   * @example 123.45
   */
  public l: number;
  /**
   * @description  最新价
   * @example 123.45
   */
  public c: number;
  /**
   * @description  成交量
   * @example 123.45
   */
  public v: number;
  /**
   * @description 时间戳
   * @example 1234567890123
   */
  public t: number;
  public onlineTime: number;
  /**
   * @description 是否开盘
   * @example true false
   */
  public get isOpen(): boolean {
    return Date.now() > this.onlineTime;
  }

  constructor(data: any,symbol:any, item: GroupItem) {
    data = {
      ...data,
      price: data.price || 0,
      prev: data.prev || 0,
      buyPrice: data.buyPrice || 0,
      buyVolume: data.buyVolume || 0,
      sellPrice: data.sellPrice || 0,
      sellVolume: data.sellVolume || 0,
      max: data.max || 0,
      min: data.min || 0,
      volume: data.volume || 0,
      open: data.open || 0,
      close: data.close || 0,
      settle_price_yes: data.settle_price_yes || 0,
      net_value: data.net_value || 0,
      isUp: data.isUp || 0,
      o: data.o || 0,
      h: data.h || 0,
      l: data.l || 0,
      c: data.c || 0,
      v: data.v || 0,
      t: data.t || 0,
    };

    this.id = symbol;
    this.name = item.name;
    this.coin = item.coin;
    this.quoteCoin = item.quoteCoin;
    this.digit = item.digit;
    this.volumeDigit = item.volumeDigit;
    this.isUp = data.isUp === 1;
    this.onlineTime = item?.onlineTime || 0;
    this.copy = item.copy;
    this.lever = item.lever;
    this.isBuy = item.isBuy;
    this.type = item.type;
    this.zone = item.zone;
    this.unit = item.unit;
    this.rate = formatDefaultText(this.calculateRate(data.price, data.prev), this.isOpen);

    this.price = formatDefaultText(data.price.toFixed(this.digit), this.isOpen);
    this.prevPrice = formatDefaultText(data.prev.toFixed(this.digit));
    this.ratePrice = formatDefaultText(FORMULAS.MARKETS.getChangeValue(this.price, this.prevPrice).toFixed(this.digit), this.isOpen);
    this.buyPrice = formatDefaultText(data.buyPrice.toFixed(this.digit), this.isOpen);
    this.buyVolume = formatDefaultText(data.buyVolume.toFixed(this.digit), this.isOpen);
    this.sellPrice = formatDefaultText(data.sellPrice.toFixed(this.digit), this.isOpen);
    this.sellVolume = formatDefaultText(data.sellVolume.toFixed(this.digit), this.isOpen);
    this.maxPrice = formatDefaultText(data.max.toFixed(this.digit), this.isOpen);
    this.minPrice = formatDefaultText(data.min.toFixed(this.digit), this.isOpen);
    this.volume = formatDefaultText(data.volume.toFixed(this.digit), this.isOpen);
    this.total = formatDefaultText(data.volume.mul(data.price).toFixed(this.digit), this.isOpen);
    this.openPrice = formatDefaultText(data.open.toFixed(this.digit), this.isOpen);
    this.closePrice = formatDefaultText(data.close.toFixed(this.digit), this.isOpen);
    this.settlementPrice = formatDefaultText(data.settle_price_yes.toFixed(this.digit), this.isOpen);
    this.netValue = formatDefaultText(data.net_value.toFixed(this.digit), this.isOpen);

    this.o = data.o;
    this.h = data.h;
    this.l = data.l;
    this.c = data.c;
    this.v = data.v;
    this.t = data.t;
  }
  private calculateRate(price: string | number, prevPrice: string | number): string {
    const rate: string = FORMULAS.MARKETS.getChangeRate(price, prevPrice);
    const prefix: string = +rate > 0 ? '+' : '';
    return prefix + rate;
  }
}

class MarkteDetail {
  private static groupList: { [key: string]: GroupItem } = {};
  private static isGetGroupList: boolean = false;

  public static async getGroupList(): Promise<{ [key: string]: GroupItem }> {
    if (MarkteDetail.isGetGroupList) return MarkteDetail.groupList;
    const group = await Group.getInstance();
    group.getLiteList.forEach((item: GroupItem) => (MarkteDetail.groupList[item.quoteCode] = item));
    // group.getLiteList.forEach((item: GroupItem) => (MarkteDetail.groupList[item.id] = item));
    group.getSpotList.forEach((item: GroupItem) => (MarkteDetail.groupList[item.id] = item));
    group.getSwapList.forEach((item: GroupItem) => (MarkteDetail.groupList[item.id] = item));
    group.getSwapSLList.forEach((item: GroupItem) => (MarkteDetail.groupList[item.id] = item));
    group.getSwapIMList.forEach((item: GroupItem) => (MarkteDetail.groupList[item.id] = item));
    MarkteDetail.isGetGroupList = true;
    return MarkteDetail.groupList;
  }

  /**
   * @description 接收行情推送数据的方法
   */
  public static async onMessage(message: any): Promise<void> {
    const groupList = await MarkteDetail.getGroupList();
    const symbol = message.data.symbol;
    const data = new DetailMap(message.data,symbol, { ...groupList[symbol] });
    window.dispatchEvent(new CustomEvent(SUBSCRIBE_TYPES.ws4001, { detail: data }));
  }
}

export { DetailMap, MarkteDetail };
