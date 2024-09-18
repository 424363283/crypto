/**
 * 与交易有关的接口合集，无特定指明现货或永续的接口
 */

import { http } from '../../http/request';
import { paths } from '../paths';

/** 网格策略——获取支持币对 */
export function getTradeGridSymbolsApi() {
  return http.get(paths['grid_symbols']);
}

/** 网格策略——获取策略列表 */
export function getTradeGridSquareListApi(params: { symbol: string; sort: string; roiMin: number; roiMax?: number; runningTimeMin: number; runningTimeMax?: number; page: number; rows: number }) {
  return http.get(paths['grid_square_list'], { params });
}

/** 网格策略——获取网格策略最新列表 */
export function getTradeGridRollListApi() {
  return http.get(paths['grid_roll_list']);
}

/** 网格策略——获取文章列表 */
export function getTradeGridArticleListApi(type: string) {
  return http.get(`${paths['grid_article_list']}?type=${type}`);
}
/** 网格策略——获取网格策略最新列表 */
export function getTradeGridAiListApi(symbol: string) {
  return http.get(`${paths['grid_ai_list']}/${symbol}`);
}

/** 网格策略——创建网格策略 */
export function postTradeCreateGridStrategyApi(data: object) {
  return http.post(paths['grid_create_strategy'], data);
}

/** 网格策略——获取我的网格列表 */
export function getTradeMyGridListApi() {
  return http.get(paths['spot_grid_position_list']);
}

/** 网格策略——停止网格 */
export function stopTradeGridByIdApi(data: object) {
  return http.post(paths['grid_stop_by_id'], data);
}

/** 网格策略——获取网格策略详情 */
export function getTradeGridDetailApi(id: string) {
  return http.get(`${paths['grid_get_detail']}/${id}`);
}

/** 网格策略——获取支持币对 */
export function getGridStrategyPriceListApi(strategyId: string) {
  return http.get(`${paths['grid_get_strategy_price_list']}?strategyId=${strategyId}`);
}

/** 网格策略——获取成交记录 */
export function getGridStrategyDealListApi(strategyId: string) {
  return http.get(`${paths['grid_get_strategy_deal_list']}?strategyId=${strategyId}`);
}

/** 网格策略——修改网格 */
export function updateTradeGridApi(data: object) {
  return http.post(paths['grid_update_grid'], data);
}

/** 网格策略——获取网格最大年化收益 */
export function getTradeGridMaxApyApi() {
  return http.get(paths['grid_max_apy']);
}

/** 定投策略——获取定投最大年化收益 */
export function getTradeInvestMaxApyApi() {
  return http.get(paths['invest_max_apy']);
}

/** 定投策略——创建网格策略 */
export function postTradeCreateInvestStrategyApi(data: object) {
  return http.post(paths['invest_create_strategy'], data);
}

/** 定投策略——修改网格策略 */
export function postTradeUpdateInvestStrategyApi(data: object) {
  return http.post(paths['invest_update_strategy'], data);
}

/** 定投策略——获取支持币对 */
export function getTradeInvestSymbolsApi() {
  return http.get(paths['invest_symbols'], { params: { brand: 'BYD' } });
}

/** 定投策略——获取策略列表 */
export function getTradeInvestSquareListApi(params: { symbol: string; sort: string; roiMin: number; roiMax?: number; runningTimeMin: number; runningTimeMax?: number; page: number; rows: number }) {
  return http.get(paths['invest_square_list'], { params });
}

/** 定投策略——获取定投订单列表 */
export function getInvestOrderListApi(id: string) {
  return http.get(`${paths['invest_get_order_list']}?planId=${id}`);
}

/** 定投策略——获取定投策略详情 */
export function getTradeInvestDetailApi(id: string) {
  return http.get(`${paths['invest_get_detail']}/${id}`);
}

/** 定投策略——停止定投 */
export function stopTradeInvestByIdApi(data: object) {
  return http.post(paths['invest_stop_by_id'], data);
}

/** 获取闪兑汇率 */
export function getTradeConvertRateApi(currency: string) {
  return http.get<object[]>(paths['exchange_rate'], { params: { currency } });
}

/** 闪兑币种 */
export function getTradeExchangeCurrencyApi() {
  return http.get(paths['exchange_currency']);
}

/** 兑换 */
export function postTradeExchangeApplyApi(data: { sourceAmount: string; sourceCurrency: string; targetCurrency: string }) {
  return http.post(paths['exchangeApply'], data);
}
/** 获取闪兑币种 */
export function getTradeConvertCurrencyApi() {
  return http.get<string[]>(paths['exchange_currency']);
}
/** 获取历史行情接口 */
export function getTradeHistoryKlineApi(symbols: string, from: number, to: number, resolution: number | string) {
  return http.get<object[]>(paths['miniChart'], {
    params: { symbols, from, to, resolution },
  });
}
/** 获取跟单失败记录 */
export function getFailedFollowLogApi(data: { page: number; rows: number; tagCodeExcludes?: string }) {
  return http.get<{
    list: [];
    page: number;
    count: number;
    size: number;
    total: number;
    totalPage: number;
  }>(paths['follow_follower_log'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 8 },
  });
}

/** 获取交易员详情 */
export function getFollowTraderDetailApi(data: { traderId: string; currency?: string }) {
  return http.get<{
    uid: number;
    type: string;
    avatar: string;
    username: string;
  }>(paths['follow_detail'], {
    params: { ...data, currency: data.currency || 'USDT' },
  });
}
/** 获取跟单列表 */
export function getFollowListApi(data: any) {
  return http.get<{ list: []; count: number; page: number; size: number }>(paths['copy_trade_list'], { params: data });
}

/** 获取交易员筛选参数预设值 */
export function getFilterDefaultValuesApi() {
  return http.get(paths['copy_trade_list_preset']);
}

/** 关注交易员 */
export function followTraderByIdApi(uid: string) {
  return http.post(`${paths['add_follow']}/${uid}`);
}

/** 取消关注交易员 */
export function unfollowTraderByIdApi(uid: string) {
  return http.post(`${paths['cancel_follow']}/${uid}`);
}

/** 获取用户跟单详情 */
export function getFollowDetailByIdApi(data: { traderId: string; currency?: string }) {
  return http.get<{}>(paths['follow_follower_detail'], {
    params: { ...data, currency: 'USDT' },
  });
}

/** 获取跟单预设值 */
export function getFollowDefaultValuesApi(data: { currency?: string }) {
  return http.get<{}>(paths['follow_preset_follow_apply'], {
    params: { ...data, currency: 'USDT' },
  });
}

/** 取消跟随 */
export function cancelFollowApi(id: string) {
  return http.post(`${paths['follow_follower_cancel']}/${id}`);
}

/** 是否跟随某带单人 */
export function setFollowerActiveApi(id: string, active: boolean) {
  return http.post(paths['follow_follower_active'], { id, active });
}
/** 带单员当前持仓 */
export function getTradePositionApi(data: { traderId: string; page: number; rows: number }) {
  return http.get<{ count: number; size: number; page: number; list: [] }>(paths['follow_trader_positions'], { params: data });
}
/** 跟单者进程 */
export function getFollowTraderProcessApi() {
  return http.get<{
    email: string;
    telegram: string;
    content: string;
    state: number;
    remark: string;
  }>(paths['follow_trader_process']);
}

/** 申请跟单 */
export function applyFollowTraderApi(data: { email: string; telegram: string; content: string }) {
  return http.post<object>(paths['follow_trader_apply'], data);
}

/** 获取正在跟随数据 */
export function getApplyTraderInfoApi() {
  return http.get<{ teamMax: number; ratioMin: number; ratioMax: number }>(paths['follow_preset_trader_apply']);
}

/** 更新收益明细 */
export function updateFollowIncomeApi(data: { currency?: string; rows: number; page: number }) {
  return http.get<{
    list: [];
    count: number;
    totalPage: number;
    page: number;
    size: number;
  }>(paths['follow_trader_income_list'], {
    params: { ...data, currency: data.currency || 'USDT' },
  });
}
/** 跟单信息修改 */
export function updateFollowApplyApi(data: any) {
  return http.post(paths['follow_follower_apply'], data);
}

/** 货币汇率详情 */
export function getCurrencyRateListApi(type?: 1 | 0) {
  return http.get<object[]>(paths['currency_list'], { params: { type } });
}

/** 交易员合约商品统计(图表) */
export function getFollowTraderStateApi(traderId: string, days: number) {
  return http.get<object[]>(paths['follow_trader_income_state'], {
    params: { traderId, days },
  });
}

/** 交易统计 */
export function getTraderCommodityStateApi(traderId: string, days: number) {
  return http.get<object[]>(paths['follow_stat'], {
    params: { traderId, days },
  });
}

/** 带单员持仓历史 */
export function getCommonTradeHistoryApi(data: { traderId: string; page: number; rows: number }) {
  return http.get<{ count: number; size: number; page: number; list: [] }>(paths['follow_trader_history'], { params: data });
}
