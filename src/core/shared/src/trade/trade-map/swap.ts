import { isSwapSLUsdt, isSwapUsdt } from '@/core/utils';
import { Public } from './public';

export class SwapTradeItem implements Public {
  public id: string; // 交易ID
  public symbol: string; // 交易ID
  public isUsdtType: boolean; // u本位
  public name: string; // 交易名称
  public coin: string; // 交易币种
  public iconCoin: string; // 交易币种图标
  public baseSymbol: string; // 交易币种
  public quoteCoin?: string; // 商品的计价货币
  public digit: number; // 价格小数位数
  public settleCoin: string; // 基础币符号
  public leverageLevel: number; // 最大杠杆
  public leverageConfig: number[]; // 最大杠杆
  public contractFactor: number; // 合约乘数
  public depthConfig: number[]; // 深度配置 [0.5,1,1.5]
  public fundRate: number; // 资金费率
  public nextFundRateTime: number; // 下次资金费率时间
  public flagPrice: number; // 标记价格
  public indexPrice: number; // 指数价格
  public minChangePrice: number; // 最小跳
  public baseShowPrecision: number; // 价格精度
  public volumePrecision: number; // 数量输入精度
  public openBuyLimitRateMax: number; // 买 限价上限
  public openSellLimitRateMax: number; // 卖 限价上限
  public openBuyLimitRateMin: number; // 买 限价下限
  public openSellLimitRateMin: number; // 卖 限价上限
  public feeRateTaker: number; // taker 手续费
  public feeRateMaker: number; //  maker 手续费
  public maxDelegateNum: number; // 限价单单笔最大数量
  public maxMarketDelegateNum: number; // 市价单单笔最大数量

  public basePrecision: number; // 数量精度
  public liqFeeRate: number; // 平仓手续费
  public alias: string; // 别名
  public priceOrderPrecision: number; // 下单价格精度
  public minDelegateNum: number; // 最小下单数量
  public minMarketDelegateNum: number; // 市价最小下单数量
  public pricePrecision: number; // 价格精度
  public fundRatePeriod: number; // 资金费率时间间隔
  public maximumDelegation: number; // 最大挂单数量
  public onlineTime: any; // 上市时间
  public currentPricePrecision: number;
  public deviationRate: number; // 价差保护阈值
  public lower: number; // 模拟盘最低充币值
  public supportBouns: boolean; // 是否支持体验金
  public experienceLeverageConfig: number[]; //  体验金 杠杆选项数组
  public experienceMaxLeverage: number; //   体验金 最大杠杆
  public partition: string; //  分区
  public maxCallBackRate: number; // 追踪止损比例最大值

  // public currentPricePrecision: number;

  constructor(data?: any) {
    this.id = data.symbol?.toUpperCase();
    this.symbol = data.alias || '';
    this.isUsdtType = isSwapUsdt(data.symbol) || isSwapSLUsdt(data.symbol);
    this.name = data.alias || '';
    this.coin = data.baseSymbol || '';
    this.iconCoin = (data.alias || '').replace(data.priceSymbol || '', '');
    this.baseSymbol = data.baseSymbol || '';
    this.quoteCoin = data.priceSymbol || '';
    this.digit = data.baseShowPrecision || 0;
    this.settleCoin = data.settleCoin;
    this.leverageLevel = data.leverageLevel || 0;
    this.leverageConfig = data.leverageConfig?.split(',')?.map(Number) || [];
    this.contractFactor = data.contractFactor;
    this.depthConfig = data.depthConfig?.split(',').map(Number) || [];
    this.fundRate = data.fundRate || 0;
    this.nextFundRateTime = data.nextFundRateTime || 0;
    this.flagPrice = data.flagPrice || 0;
    this.indexPrice = data.indexPrice || 0;
    this.minChangePrice = data.minChangePrice || 0;
    this.baseShowPrecision = data.baseShowPrecision || 0;
    this.basePrecision = data.basePrecision || 0;
    this.volumePrecision = data.volumePrecision || 0;
    this.openBuyLimitRateMax = data.openBuyLimitRateMax || 0;
    this.openSellLimitRateMax = data.openSellLimitRateMax || 0;
    this.openBuyLimitRateMin = data.openBuyLimitRateMin || 0;
    this.openSellLimitRateMin = data.openSellLimitRateMin || 0;
    this.feeRateTaker = data.feeRateTaker || 0;
    this.feeRateMaker = data.feeRateMaker || 0;
    this.maxDelegateNum = data.maxDelegateNum || 0;
    this.liqFeeRate = data.liqFeeRate || 0;
    this.alias = data.alias || '';
    this.priceOrderPrecision = data.priceOrderPrecision || '';
    this.currentPricePrecision = data.currentPricePrecision || '';
    this.minDelegateNum = data.minDelegateNum || 0;
    this.pricePrecision = data.pricePrecision || 0;
    this.fundRatePeriod = data.fundRatePeriod || 0;
    this.maximumDelegation = data.maximumDelegation || 0;
    this.onlineTime = data.onlineTime;
    this.deviationRate = data.deviationRate;
    this.lower = data.lower || 0;
    this.supportBouns = data.supportBonus;
    this.experienceMaxLeverage = data.experienceMaxLeverage || 0;
    this.experienceLeverageConfig = data.experienceLeverageConfig?.split(',')?.map(Number) || [];
    this.minMarketDelegateNum = ![null, undefined].includes(data.minMarketDelegateNum) ? data.minMarketDelegateNum : data.minDelegateNum;
    this.maxMarketDelegateNum = ![null, undefined].includes(data.maxMarketDelegateNum) ? data.maxMarketDelegateNum : data.maxDelegateNum;
    this.partition = data.partition || '';
    this.maxCallBackRate = data.maxCallBackRate || 0;
  }
}
