import { resso } from '@/core/resso';
import { AccountType, OrderType, PositionSide } from './types';

const _state = {
  /**
   * 商品ID
   */
  id: '',
  /**
   * 交易名称
   */
  name: '',
  /**
   * 交易币种
   */
  coin: '',
   /**
   * 商品合约
   */
   contract: '' as string | undefined,
  /**
   * 是否登录
   */
  isLogin: false,
  /**
   * 是否带单商品
   */
  isFollow: false,
  /**
   * 是否未开启带单交易
   */
  traderActive: false,
  /**
   * 账户类型
   */
  accountType: AccountType.REAL,
  /**
   * 账户余额(可用保证金)
   */
  balance: 0,
  /**
   * 现货挂单冻结金额
   */
  frozen: 0,
  /**
   * 账户持仓金额
   */
  holdings: 0,
  /**
   * 简易合约挂单冻结金额
   */
  plan: 0,
  /**
   * 用户输入保证金
   */
  margin: '' as string | number,
  /**
   * 仓位
   */
  position: '' as string | number,
  /**
   * 仓位方向
   */
  positionSide: PositionSide.LONG,
  /**
   * 订单类型
   */
  orderType: OrderType.MARKET,
  /**
   * 默認止盈比例
   */
  defaultStopProfitRate: '' as string | number,
  /**
   * 默認止损比例
   */
  defaultStopLossRate: '' as string | number,
  /**
   * 交易手续费
   */
  tradeFee: 0 as string | number,
  /**
   * 交易手续费率(因子)
   */
  feex: 0,
  /**
   * 平仓确认
   */
  closeConfirm: false,
  /**
   * 下单确认
   */
  orderConfirm: false,
  /**
   * 杠杆倍数
   */
  leverage: 1,
  /**
   * 合计保证金 = 保证金 + 交易手续费 + 抵扣金額
   */
  totalMargin: 0 as string | number,
  /**
   * 当前抵扣金額
   */
  deductionAmount: 0,
  /**
   * 抵扣金总额
   */
  deductionTotal: 0,
  /**
   * 佔用保證金
   */
  occupiedMargin: 0,
  /**
   * 浮動盈虧
   */
  floatingProfit: 0,
  /**
   * 保证金范围（下單）
   */
  marginRange: [] as number[],
  /**
   * 杠杆范围（下單）
   */
  leverageRange: [] as number[],
  /**
   * 數量范围（下單）
   */
  amountRange: [] as number[],
  /**
   * 止损范围
   */
  stopLossRange: [] as number[],
  /**
   * 止盈范围
   */
  stopProfitRange: [] as number[],
  /**
   * 点差
   */
  spread: 0,
  /**
   * 用户是否KYC
   */
  isKyc: false as boolean,
  /**
   * 带单的最大杠杆
   */
  copyMaxLeverage: 0 as number,
  /**
   * 仓位数量精度
   */
  positionPrecision: 0 as number,
  /**
   * 市价做多价格
   */
  marketBuyPrice: '' as string | number,
  /**
   * 市价做空价格
   */
  marketSellPrice: '' as string | number,
  /**
   * 限价价格 - 委托输入价
   */
  limitPrice: '' as string | number,
  /**
   * 仓位币种
   */
  positionCurrency: '' as string,
  /**
   * bonusId 体验金ID
   */
  bonusId: '' as string,
  /**
   * 选中的体验金卡片所支持的杠杆
   */
  selectedBonusLever: 0,
  /**
   * 保证金追加列表
   */
  marginAddList: ['+10', '+50', '+100', '+500', 'All'] as string[],
  /**
   * 用户自定义止损比例
   */
  stopLoss: 0 as number | string,
  /**
   * 用户自定义止盈比例
   */
  stopProfit: 0 as number | string,
  /**
   * 用户自定义止盈價：
   */
  stopProfitPrice: 0 as number | string,
  /**
   * 用户自定义止损價：
   */
  stopLossPrice: 0 as number | string,
  /**
   * 根据比例计算盈利保证金
   */
  FMargin: 0 as number | string,
  /**
   * 根据比例计算亏损保证金
   */
  LMargin: 0 as number | string,
  /**
   * 止盈价格区间
   */
  FPriceRange: [] as string[],
  /**
   * 止损价格区间
   */
  LPriceRange: [] as string[],
  /**
   * 是否持仓过夜
   */
  overnight: true as boolean,
  /**
   * 限价下单价格区间
   */
  limitPriceRange: [] as string[],
  /**
   * 限价成交价
   */
  limitPriceDeal: '' as string | number,
  /**
   * 委託成交價
   */
  limitFinalPrice: '' as string | number,
  /**
   * 体验金卡券列表
   */
  bonusList: [] as any[],
  /**
   * 当前商品可持有的最大金额
   */
  maxAmountOne: 0,
  /**
   * 简单合约可以使用的抵扣金比例
   */
  liteLuckyRate: 0,
  /**
   * USDT 精度
   */
  USDTScale: 0,
  /**
   * 当前商品的精度
   */
  currentCommodityDigit: 0,
  /**
   * 递延api配置
   */
  defer: false,
  /**
   * 递延最大天数
   */
  deferDays: 0,
  /**
   * 递延手续费
   */
  deferFee: 0,
  /**
   * 仓位显示精度
   */
  volumeDigit: 8,
  /**
   * 递延偏好设置
   */
  deferPref: false,
  /**
   * 下单递延开关设置
   */
  deferOrderChecked: false,
  /**
   * 是否开启委托价格范围限制
   */
  isPriceRangeLimited: false,
  /**
   * 是否保证金范围限制
   */
  isMarginRangeLimited: false,
};

export const state = resso(_state);

export const logState = () => {
  const obj: any = {};
  Object.keys(_state).forEach((key) => {
    if (['subscribe', 'unsubscribe'].includes(key)) return;
    obj[key] = state[key];
  });
  return obj;
};
