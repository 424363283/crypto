import { LANG } from '@/core/i18n';

//仓位模式 1=单向持仓 2=双向持仓
export enum POSITION_TYPE {
  ONE = 1,
  TWO = 2,
};

// 永续当前委托 状态
export const SWAP_PENDING_ORDER_STATUS = () => ({
  1: LANG('限价'),
  2: LANG('市价'),
  4: LANG('市价止盈'),
  5: LANG('市价止损'),
  100: LANG('追踪委托'),
});

// 永续成交委托 类型
export const SWAP_FINISHED_ORDER_TYPES = () => ({
  '1': LANG('限价'),
  '2': LANG('市价'),
  '3': LANG('强平'),
  '4': LANG('限价'),
  '5': LANG('市价'),
  // '1': LANG('限价'),
  // '2': LANG('市价'),
  // '4': LANG('市价止盈'),
  // '5': LANG('市价止损'),
  // '3': LANG('强平'),
  // '6': LANG('追踪委托'),
});

// 永续历史委托 类型
export const SWAP_HISTORY_ORDER_TYPES = () => ({
  1: LANG('限价'),
  2: LANG('市价'),
  3: LANG('强平'),
  4: LANG('限价'),
  5: LANG('市价'),
});

// 永续历史委托 状态
export const SWAP_HISTORY_ORDER_STATUS = () => ({
  0: LANG('下单中'),
  1: LANG('委托中'),
  2: LANG('已完成'),
  3: LANG('部分完成'),
  4: LANG('已取消'),
  5: LANG('委托取消'),
  6: LANG('已过期'),
  7: LANG('部分完成 部分取消'),
});
// 永续历史计划委托、止盈止损委托状态
export const SWAP_HISTORY_TRIGGER_ORDER_STATUS = () => ({
  0: LANG('下单中'),
  1: LANG('未触发'),
  2: LANG('已完成'),
  3: LANG('部分完成'),
  4: LANG('已取消'),
  5: LANG('委托取消'),
  6: LANG('已过期'),
  7: LANG('部分完成 部分取消'),
});
// 永续资金流水类型
export const SWAP_FUNDS_RECORD_TYPE: () => { [key: string]: string } = () => ({
  taker_fee: LANG('手续费'),
  maker_fee: LANG('手续费'),
  collectFundRate: LANG('资金费用'),
  liq_pnl: LANG('强平平仓结算'),
  liq_taker_fee: LANG('强平手续费'),
  trade: LANG('平仓盈亏'),
  transferTradeOutPerpetualIn: LANG('币币转永续'),
  transferPerpetualOutTradeIn: LANG('永续转币币'),
  // transferLiteOutPerpetualIn: LANG('简易合约转入永续'),
  transferPerpetualOutLiteIn: LANG('永续转入简易合约'),
  // liq_system_accept: '强平平仓盈亏',
  // Main2Fun: '钱包转永续',
  // Fun2Main: '永续转钱包',
  virtual_deposit: LANG('资金存入'),
  activity_deposit: LANG('活动存入'),
  compensate_deposit: LANG('补偿存入'),
  abnormal_funds: LANG('异常资金'),
  experience_add: LANG('增加体验金'),
  experience_sub: LANG('减少体验金'),
  experience_recovery: LANG('回收体验金'),
  deductible_add: LANG('增加抵扣金'),
  deductible_sub: LANG('减少抵扣金'),
  deductible_recovery: LANG('回收抵扣金'),
  transfer_refund: LANG('划转回退'),
  experience_tf_recovery: LANG('划转回收体验金'),
  transferPerpetualIn: LANG('永续转永续'),
  transferPerpetualOut: LANG('永续转永续'),
  risk_close: LANG('风险保障金注入'),
});
export const SWAP_FUNDS_RECORD_FUNDS_TYPE = () => ({
  0: LANG('现金'),
  1: LANG('体验金'),
  2: LANG('抵扣金'),
});

export const SWAP_ORDER_DIRECTIONS: { [key: string]: string } = {
  1: LANG('买入'),
  2: LANG('卖出'),
};

export const SWAP_POSITION_MANAGE: { [key: string]: { [key: string]: string } } = {
  1: {},//单向仓位
  2: {
    1: LANG('开仓'),
    2: LANG('开仓'),
    3: LANG('平仓'),
    4: LANG('平仓'),
    5: LANG('平仓')
  }//双向仓位
};
