import { Public } from './public';

export class LiteTradeItem implements Public {
  public id: string; // 交易ID
  public name: string; // 交易名称
  public coin: string; // 交易币种
  public iconCoin: string; // 交易币种图标
  public quoteCoin?: string; // 商品的计价货币
  public quoteCode?: string; // 行情code
  public contract?: string; // contract
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
  public defer: boolean; // 是否递延开关
  public deferDays: number; // 递延最长天数
  public deferFee: number; // 递延手续费
  public deferType: number; // 默认是3, 固定不变
  public volumeDigit: number; // 仓位显示精度

  constructor(data: any) {
    this.id = data.code;
    this.name = data.name;
    this.coin = data.code?.replace(data.currency, '');
    this.iconCoin = (data.code || '').replace(data.currency || '', '');
    this.quoteCoin = data.currency;
    this.quoteCode = data.quoteCode;
    this.contract = data.contractCode;
    this.digit = data.priceDigit;
    this.positionPrecision = this.getPositionPrecision(data.priceChange);
    // this.stopLossList = [-0.05, -0.1, -0.3, -0.5, -0.7, -1];
    // this.takeProfitList = [0.05, 0.5, 1, 3, 5, 10];
    this.stopLossList = data.stopLossList;
    this.takeProfitList = data.stopProfitList;
    this.isFollow = data.follow;
    this.copyMaxLeverage = data.copyMaxLeverage;

    this.leverList = data.leverList;
    this.lever0List = data.leverList;
    this.lever2List = data.leverList;

    this.margin0List = data.depositList;
    this.margin2List = data.depositList;

    this.amount0List = data.depositList;
    this.amount2List = data.depositList;

    this.planOpenUpper = 2; //data.planOpenUpper;
    this.planOpenLower = 1; //data.planOpenLower;

    this.planSafeOffset = 0.001; //data.planSafeOffset;

    this.maxAmountOne = data.maxAmountOne;
    this.onlineTime = data.onlineTime;
    this.trailRate = 0; //data.trailRate;
    this.defer = data.defer;
    this.deferDays = data.deferDays;
    this.deferFee = data.deferFee;
    this.deferType = data.deferType;
    this.volumeDigit = data.volumeDigit;
  }

  getPositionPrecision(num: number): number {
    // 将科学计数法转换为普通数字字符串，使用 maximumFractionDigits 确保显示所有小数位
    const str = num.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
    const index = str.indexOf('.');
    if (index === -1) {
      return 0;
    }
    return str.length - index - 1;
  }
}
