import { formatDefaultText } from '@/core/utils/src/format';

export class MarketItem {
  /**
   * @description 是否是数据推送填充
   * @example true false
   */
  public onLine: boolean;
  /**
   * @description 商品的id
   * @example BTCUSDT BTC-USDT BTC_USDT
   */
  public id: string;
  /**
   * @description 商品的全名
   * @example BTCUSDT
   */
  public name: string; // 商品的全名
  /**
   * @description 商品的计价货币
   * @example USDT
   */
  public quoteCoin: string;
  /**
   * @description 商品的行情code
   * @example USDT
   */
  public quoteCode: string;
  /**
   * @description 币种
   * @example BTC
   */
  public coin: string;
  /**
   * @description 价格小数位数
   * @example 2
   */
  public digit: number; // 价格小数位数
  /**
   * @description 当前价格
   * @example 123.456
   */
  public price: string;
  /**
   * @description 最高价
   * @example 123.456
   */
  public maxPrice: string;
  /**
   * @description 最低价
   * @example 123.456
   */
  public minPrice: string;
  /**
   * @description 前一个价格
   * @example 123.456
   */
  public prevPrice: string;
  /**
   * @description 涨跌幅度百分比
   * @example +25 -25
   */
  public rate: string;
  /**
   * @description 24小时成交量
   * @example 123.456
   */
  public volume: string;
  /**
   * @description 交易额
   * @example 123.456
   */
  public total: string;
  /**
   * @description 是否涨跌
   * @example true false
   */
  public isUp: boolean;

  /**
   * @description 分组
   * @example
   */
  public zone: string;
  /**
   * @description 类型
   * @example
   */
  public type: string;
  /**
   * @description 分区
   * @example
   */
  public unit: string;
  /**
   * @description 是否支持带单商品
   * @param copy 带单
   */
  public copy: boolean;

  public onlineTime: number;

  /**
   * @description 是否开盘
   * @example true false
   */
  public isOpen: boolean;
  public fullName: string;

  public constructor(data: any) {
    this.isOpen = Date.now() > data.onlineTime;
    this.onLine = data.onLine || false;
    this.id = data.id;
    this.name = data.name;
    this.quoteCoin = data.quoteCoin;
    this.coin = data.coin;
    this.quoteCode = data.quoteCode;
    this.digit = data.digit || 0;
    this.onlineTime = data.onlineTime || 0;
    this.price = formatDefaultText(data.price, this.isOpen);
    this.maxPrice = formatDefaultText(data.maxPrice, this.isOpen);
    this.minPrice = formatDefaultText(data.minPrice, this.isOpen);
    this.prevPrice = formatDefaultText(data.prevPrice, this.isOpen);
    this.rate = formatDefaultText(data.rate, this.isOpen);
    this.volume = formatDefaultText(data.volume, this.isOpen);
    this.total = formatDefaultText(data.total, this.isOpen);
    this.isUp = data.isUp || false;
    this.zone = data.zone || '';
    this.type = data.type || '';
    this.unit = data.unit || '';
    this.copy = data.copy || false;
    this.fullName = data.fullname || '';
  }

  // public update(data: any) {
  //   // 指定更新的字段
  //   const updateKeys = ['copy', 'zone', 'type', 'unit'];
  //   for (let key in data) {
  //     if (updateKeys.includes(key)) {
  //       this[key as keyof typeof this] = data[key];
  //     }
  //   }
  // }
}
