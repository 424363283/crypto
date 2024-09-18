/**
 * 永续合约交易相关的接口合集
 */

import { http } from '../../http/request';
import { paths } from '../paths';
import { SwapAssetsTransactionProps, SwapHistoryDealProps, SwapHistoryOrderProps } from './types';

/** 永续资金流水订单 */
export function getSwapAssetsTransactionApi(
  data: {
    subWallet: string;
    endTime: number;
    startTime: number;
    type?: string;
    currency?: string;
    page?: number;
    size?: number;
  },
  isSwapU?: boolean
) {
  return http.get<SwapAssetsTransactionProps>(paths[isSwapU ? 'swap_future_account_ledger_transaction' : 'swap_delivery_account_ledger_transaction'], { params: { ...data, page: data.page || 1, size: data.size || 13 } });
}

/** 永续历史成交订单 */
export function getSwapHistoryDealApi(
  data: {
    subWallet: string;
    endDate: number;
    beginDate: number;
    type?: string;
    symbol?: string;
    page?: number;
    size?: number;
  },
  usdt?: boolean
) {
  return http.get<SwapHistoryDealProps>(paths[usdt ? 'swap_future_order_trade' : 'swap_delivery_order_trade'], {
    params: { ...data, page: data.page || 1, size: data.size || 13 },
  });
}
/** 永续历史委托订单 */
export function getSwapHistoryOrderApi(
  data: {
    subWallet: string;
    endDate: number;
    beginDate: number;
    type?: string;
    symbol?: string;
    page?: number;
    size?: number;
  },
  isSwapU: boolean
) {
  return http.get<SwapHistoryOrderProps>(paths[isSwapU ? 'swap_future_history_order' : 'swap_delivery_history_order'], { params: { ...data, page: data.page || 1, size: data.size || 10 } });
}
/** 获取永续合约交易商品详情列表 */
export function getSwapTradeListApi() {
  return http.get(paths['swap_trade_list']);
}
/** U本位盈亏报表 */
export function getSwapUProfitsReportsApi(data: { beginDate: number; endDate: number; userId?: string }) {
  return http.get(`${paths['swap_feature_profits_reports']}`, {
    params: data,
  });
}
/** 币本位盈亏报表 */
export function getSwapProfitsReportsApi(data: { beginDate: number; endDate: number; userId?: string }) {
  return http.get(`${paths['swap_delivery_profits_reports']}`, {
    params: data,
  });
}
/** U本位合约盈亏汇总 */
export function getSwapUTotalProfitsApi(data?: { userId?: string }) {
  return http.get(`${paths['swap_feature_total_profits']}`, {
    params: data,
  });
}

/** 币本位合约盈亏汇总 */
export function getSwapTotalProfitsApi(data?: { userId?: string }) {
  return http.get(`${paths['swap_delivery_total_profits']}`, {
    params: data,
  });
}
/** 下单单位 和 持仓方向 */
export function swapGetPositionTypeApi(usdt: boolean) {
  return http.get(paths[usdt ? 'swap_future_leverage_userSetting_getPositionType' : 'swap_delivery_leverage_userSetting_getPositionType'], { params: { contractType: usdt ? 2 : 1 } });
}

/** 更新持仓方向 */
export function swapUpdatePositionTypeApi(usdt: boolean, twoWayMode: boolean) {
  return http.post(paths[usdt ? 'swap_future_leverage_userSetting_updatePositionType' : 'swap_delivery_leverage_userSetting_updatePositionType'], {}, { params: { type: !twoWayMode ? 1 : 2 } });
}
/** 更新单位模式 */
export function postSwapUpdateUnitApi(usdt: boolean, value: number) {
  return http.post(paths[usdt ? 'swap_future_leverage_userSetting_updateUnit' : 'swap_delivery_leverage_userSetting_updateUnit'], {}, { params: { unitModel: value } });
}
/** 永续资金费率 */
export function getSwapContractDetailApi(id: string) {
  return http.get(paths['swap_contract_contractDetail'].replace('{id}', id));
}
/** 永续 仓位历史 */
export function getSwapPositionHistoryApi(data: any, usdt: boolean) {
  return http.get(`${paths[usdt ? 'swap_private_future_trade_positionHistory' : 'swap_private_delivery_trade_positionHistory']}`, { params: data });
}

/** 永续 创建子钱包 */
export function postSwapCreateWalletApi(data: any) {
  return http.post(`${paths['swap_public_wallet_create_wallet']}`, data);
}

/** 永续 更新子钱包 */
export function updateSwapWalletApi(data: any) {
  return http.post(`${paths['swap_public_wallet_update_wallet']}`, data);
}

/** 永续 模拟盘加币 */
export function addSwapTestnetCoinApi(data: any) {
  return http.post(`${paths['testnet_private_testnet_addCoin']}`, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
/** 永续 设置通知设置 */
export function swapSetNotificationSettingApi(data: any) {
  return http.post(`${paths['swap_set_notification_setting']}`, data);
}

/** 永续 获取通知设置 */
export function getSwapNotificationSettingApi() {
  return http.get(`${paths['swap_get_otification_setting']}`);
}

/** 永续 设置预警通知设置 */
export function getSwapSetUserWarnOpenApi(data: any) {
  return http.post(`${paths['swap_private_userWarn_open']}`, data);
}

/** 永续 设置保证金通知设置 */
export function postSwapSetUserWarnAddMarginNotifyApi(data: any) {
  return http.post(`${paths['swap_private_userWarn_addMarginNotify']}/${data.type}`);
}

/** 永续 设置保证金通知设置 */
export function postSwapSetUserWarnAddLpNotifyApi(data: any) {
  return http.post(`${paths['swap_private_userWarn_addLpNotify']}/${data.type}`);
}
/** 永续 持仓止盈止损 */
export function postSwapSetSpslApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_condition_createBatch' : 'swap_delivery_condition_createBatch']}`, data);
}

/** 永续 编辑持仓止盈止损 */
export function postSwapEditSpslApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_edit_plan_order' : 'swap_delivery_edit_plan_order']}`, data);
}

/** 永续 反向开仓 */
export function postSwapReverseOpenPositionApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_private_future_reccerse_position' : 'swap_private_delivery_reccerse_position']}`, data);
}
/** 永续 价差保护 */
export function postSwapPriceProtectApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_userSetting_priceProtection' : 'swap_delivery_userSetting_priceProtection']}`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
}
/** 更新币对杠杆 */
export function postSwapUpdateLeverApi(usdt: boolean, data: { symbol: string; userLeverage: number; subWallet?: string }) {
  return http.post(`${paths[usdt ? 'swap_future_leverage_update' : 'swap_delivery_leverage_update']}/${data.symbol}`, {}, { params: data });
}

/** 获取持仓 */
export function getSwapPositionApi(usdt: boolean) {
  return http.get(paths[usdt ? 'swap_future_position' : 'swap_delivery_position']);
}

/** 获取委托 */
export function getSwapGetPendingApi(usdt: boolean, data: any) {
  return http.get(paths[usdt ? 'swap_future_order_list' : 'swap_delivery_order_list'], { params: data });
}
/** 同意协议 */
export function getSwapAgreementApi() {
  return http.get<object>(paths['swap_agreement_agreement']);
}

/** 协议状态 */
export function getSwapGetAgreementApi() {
  return http.get(paths['swap_agreement_getAgreement']);
}

/** 下单 */
export function postSwapAddOtocoApi(usdt: boolean, data: any) {
  return http.post(paths[usdt ? 'swap_future_addOtoco' : 'swap_delivery_addOtoco'], data);
}

/** 撤单 */
export function delSwapOrderCancelApi(data: any, usdt: boolean) {
  return http.del(`${paths[usdt ? 'swap_future_order_delete' : 'swap_delivery_order_delete']}`, data);
}

/** 全部撤单 */
export function delSwapOrderCancelAllApi(data: any, usdt: boolean) {
  return http.del(`${paths[usdt ? 'swap_future_order_delete_all' : 'swap_delivery_order_delete_all']}`, data);
}

/** 全部平仓 */
export function postSwapPositionCloseAllApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_position_close_all' : 'swap_delivery_position_close_all']}`, data);
}

/** 持仓平仓 */
export function postSwapPositionCloseApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_close_position' : 'swap_delivery_close_position']}`, data);
}

/** 永续计算强平 */
export function getSwapCalculateLpApi(data: any, usdt: boolean) {
  return http.get(paths[usdt ? 'swap_future_calculateLp' : 'swap_delivery_calculateLp'], { params: data });
}

/** 永续 修改持仓保证金 */
export function swapAdjustPositionMarginApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_leverage_userSetting_adjustPositionMargin' : 'swap_delivery_leverage_userSetting_adjustPositionMargin']}`, {}, { params: data });
}

/** 永续 自动追加保证金 */
export function postSwapAutoPositionMarginApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_userSetting_autoPositionMargin' : 'swap_delivery_userSetting_autoPositionMargin']}`, {}, { params: data });
}

/** 追踪委托下单 */
export function postSwapOrderTraceOrderApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_future_order_trace_order' : 'swap_delivery_order_trace_order']}`, data);
}

/** 获取汇率 */
export function getSwapsFundingRateApi(usdt: boolean) {
  return http.get(`${paths[usdt ? 'swap_public_future_fundingRate_real' : 'swap_public_delivery_fundingRate_real']}`);
}

/** 获取汇率历史 */
export function getSwapsFundingRateHistoryApi(data: any, usdt: boolean) {
  return http.get(`${paths[usdt ? 'swap_public_future_fundingRate_days' : 'swap_public_delivery_fundingRate_days']}`, { params: data });
}

/** 获取风险保障基金 */
export function getSwapPublicRiskDaysApi(data: any, usdt: boolean) {
  return http.get(`${paths[usdt ? 'swap_public_future_risk_days' : 'swap_public_delivery_risk_days']}`, { params: data });
}
/** 币对风险信息 */
export function getSwapGetRiskDetailApi(id: string, leverage: string) {
  return http.get(`${paths['swap_contract_contract_risk_detail']}/${id}`, {
    params: { leverage },
  });
}

/** 币对杠杆信息 */
export function getSwapGetLeverageFindApi(usdt: boolean, data: { code: string }) {
  return http.get(`${paths[usdt ? 'swap_future_leverage_find' : 'swap_delivery_leverage_find']}/${data.code}`, { params: data });
}

/** 更新保证金模式 */
export function swapUpdateMarginTypeApi(usdt: boolean, data: { id: string; type: number }) {
  return http.post(paths[usdt ? 'swap_future_leverage_userSetting_updateMarginType' : 'swap_delivery_leverage_userSetting_updateMarginType'], {}, { params: { symbol: data.id.toLowerCase(), type: data.type } });
}

/** 币对风险列表 */
export function swapGetContractRiskListApi(code: string) {
  return http.get(`${paths['swap_contract_contract_risk_list']}/${code}`);
}
/** 永续 更新子钱包 */
export function postSwapEditOrderApi(data: any, usdt: boolean) {
  return http.post(`${paths[usdt ? 'swap_private_future_order_edit_order' : 'swap_private_delivery_order_edit_order']}`, data);
}
