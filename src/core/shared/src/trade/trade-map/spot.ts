import { Public } from './public';

export class SpotTradeItem implements Public {
  public id: string; // 交易ID
  public name: string; // 交易名称
  public coin: string; // 交易币种
  public iconCoin: string; // 交易币种图标
  public quoteCoin?: string; // 商品的计价货币
  public digit: number; // 价格小数位数
  public volumeDigit: number; // 体量精度
  public amountDigit: number; // 数量精度
  public onlineTime: any; // 上市时间
  public market: boolean; // 是否启用市价交易
  public makerRate: number; // 现货手续费
  public takerRate: number; // 现货手续费
  public limitAskPriceRate: number; // 限价交易价格最大比例
  public limitBidPriceRate: number; // 限价交易价格最小比例
  public depthConfig: number[]; // 限价交易价格最小比例
  public fullname: string; // 限价交易价格最小比例

  constructor(data: any) {
    this.id = data.symbol;
    this.name = data.alias;
    this.fullname = data.fullname;
    this.coin = data.baseCoin;
    this.iconCoin = data.baseCoin;
    this.quoteCoin = data.quoteCoin;
    this.digit = data.priceScale;
    this.volumeDigit = data.volumeScale;
    this.amountDigit = data.amountScale;
    this.onlineTime = data.onlineTime;
    this.market = data.market;
    this.makerRate = data.makerRate;
    this.takerRate = data.takerRate;
    this.limitAskPriceRate = data.limitAskPriceRate;
    this.limitBidPriceRate = data.limitBidPriceRate;
    this.depthConfig = data.depth?.split(',').map(Number) || [];
  }
}
