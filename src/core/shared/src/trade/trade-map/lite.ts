import { Public } from './public';

export class LiteTradeItem implements Public {
  public id: string; // 交易ID
  public name: string; // 交易名称
  public coin: string; // 交易币种
  public iconCoin: string; // 交易币种图标
  public quoteCoin?: string; // 商品的计价货币
  public digit: number; // 价格小数位数

  public positionPrecision: number; // 仓位精度
  public stopLossList: number[]; // 止损列表
  public takeProfitList: number[]; // 止盈列表
  public isFollow: boolean; // 是否带单
  public copyMaxLeverage: number; // 跟单最大杠杆

  public leverList: number[]; // 杠杆列表
  public lever0List: number[]; // 杠杆列表0
  public lever2List: number[]; // 杠杆列表2

  public margin0List: number[]; // 保证金列表0
  public margin2List: number[]; // 保证金列表2

  public amount0List: number[]; // 交易数量范围
  public amount2List: number[]; // 交易数量范围

  public planOpenUpper: number; // 计划开仓上限
  public planOpenLower: number; // 计划开仓下限

  public planSafeOffset: number; // 计划成交价安全偏移量

  public maxAmountOne: number; // 最大可持有金额
  public onlineTime: any; // 上市时间
  public trailRate: number; // 回撤价格限制（比例）

  constructor(data: any) {
    this.id = data.code;
    this.name = data.name;
    this.coin = data.code?.replace(data.currency, '');
    this.iconCoin = (data.alias || '').replace(data.currency || '', '');
    this.quoteCoin = data.currency;
    this.digit = data.priceDigit;
    this.positionPrecision = this.getPositionPrecision(data.priceTick);
    this.stopLossList = [-0.05, -0.1, -0.3, -0.5, -0.7, -1];
    this.takeProfitList = [0.05, 0.5, 1, 3, 5, 10];
    this.isFollow = data.follow;
    this.copyMaxLeverage = data.copyMaxLeverage;

    this.leverList = data.leverList;
    this.lever0List = data.lever0List;
    this.lever2List = data.lever2List;

    this.margin0List = data.margin0List;
    this.margin2List = data.margin2List;

    this.amount0List = data.amount0List;
    this.amount2List = data.amount2List;

    this.planOpenUpper = data.planOpenUpper;
    this.planOpenLower = data.planOpenLower;

    this.planSafeOffset = data.planSafeOffset;

    this.maxAmountOne = data.maxAmountOne;
    this.onlineTime = data.onlineTime;
    this.trailRate = data.trailRate;
  }

  getPositionPrecision(num: number): number {
    const str = num.toString();
    const index = str.indexOf('.');
    if (index === -1) {
      return 0;
    }
    return str.length - index - 1;
  }
}
