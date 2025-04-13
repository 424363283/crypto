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
  public limitAskPriceRate: number; // 限价卖价格最大比例
  public limitBidPriceRate: number; // 限价买价格最小比例
  public depthConfig: number[]; // 深度分组
  public fullname: string; // 交易名全称
  // add latest
  public icon: string;
  public type: number;
  public tags: string;
  public visible: boolean;
  public canBuy: boolean;
  public canSell: boolean;
  public canGrid: boolean;
  public volumeMin: number;
  public amountMin: number;
  public marketVolumeMax: number;
  public marketAmountMax: number;
  // public limitPlan: boolean;
  // public marketPlan: boolean;
  // public oco: boolean;
  public triggerPriceMax: number;
  public triggerPriceMin: number;
  public zones: string[];

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

    // add latest
    this.icon = data.icon;
    this.type = data.type;
    this.tags = data.tags;
    this.visible = data.visible;
    this.canBuy = data.canBuy;
    this.canSell = data.canSell;
    this.canGrid = data.canGrid;
    this.volumeMin = data.volumeMin;
    this.amountMin = data.amountMin;
    this.marketVolumeMax = data.marketVolumeMax;
    this.marketAmountMax = data.marketAmountMax;
    // this.limitPlan = data.limitPlan;
    // this.marketPlan = data.marketPlan;
    // this.oco = data.oco;
    this.triggerPriceMax = data.triggerPriceMax;
    this.triggerPriceMin = data.triggerPriceMin;
    this.zones = data.zones;
  }
}
