import { LiteListItem, TPlanCommission } from '@/core/shared';
import { http } from '../../http/request';
import { paths } from '../paths';
import { infoInstance as Info } from '@/core/shared/src/lite/info';

/** 简单合约资产 */
export function getLiteAssetApi() {
  return http.get<{
    currency: string;
    discount: string;
    game: number;
    lucky: number;
    money: number;
    uid: string;
    frozen: number;
    position: number;
    plan: number;
  }>(paths['lite_asset']);
}

/** 简单合约历史成交量 */
export function getLiteHistoryVolumeApi() {
  return http.get<{ amountToday: number; amountTotal: number }>(paths['lite_history_amount'], {
    params: { standard: true }
  });
}

/** 简单合约历史 */
export function getLiteHistoryApi(params = {} as { page?: number; size?: number; timeGe?: string; timeLe?: string }) {
  return http.get<LiteListItem[]>(paths['lite_history'], {
    params: { ...params }
  });
}

/** 简单合约历史分页数据 */
export function getLiteHistoryTransactionApi(params = {} as { page?: number; size?: number; timeGe?: string; timeLe?: string }) {
  return http.get<LiteListItem[]>(paths['lite_history_transaction'], {
    params: { ...params }
  });
}

/** 简单合约资金流水 */
export function getLiteHistoryFundsApi(
  params = {} as { size?: number; standard?: boolean; commodityZone?: string; commodity?: string }
) {
  return http.get<LiteListItem[]>(paths['lite_history_funds'], {
    params: { _: new Date().getTime(), standard: true, ...params }
  });
}

/** 简单合约资金流水v2 */
export function getLiteHistoryFundsV2Api(
  params = {} as { size?: number; standard?: boolean; commodityZone?: string; commodity?: string }
) {
  return http.post<LiteListItem[]>(paths['lite_history_funds_v2'], params);
}

/** 简单合约计划委托撤单 */
export function cancelLitePlanOrderApi(id: string | string[]) {
  return http.post<{ successNum: number; failureNum: number }>(
    `${paths['lite_revoke']}`,
    Array.isArray(id) ? { ids: id } : { id }
  );
}
/** 简单合约计划委托 */
export function getLitePlanOrdersApi(data?: any) {
  return http.get<TPlanCommission[]>(paths['lite_plan_orders'], { params: data });
}
/** 简单合约资金费率 */
export function getLiteFundingRateApi(id: string) {
  return http.get<any>(paths['lite_funding_rate'].replace('{id}', id));
}

/** 卖币 */
export function withdrawSellApi(data: any) {
  return http.post<any>(paths['withdraw_sell'], data);
}

/** 获取简单合约基本配置 */
export function getLiteConfigInfoApi<T>() {
  return {code: 200, data: Info.getTradePreference()};
  return http.get<{ tp: number; sl: number; confirmPlace: boolean; confirmClose: boolean; overnight: boolean, deferPref: boolean }>(
    paths['get_lite_setting']
  );
}

/** 设置简单合约基本配置 */
export function setLiteConfigInfoApi(data: any) {
  Info.setTradePreference(data);
  return {code: 200};
  return http.post(paths['get_lite_set_info'], data);
}

/** 获取简单合约手续费 */
export function getLiteFeeApi() {
  return http.get(paths['lite_fee']);
}

/** 简单合约市价下单 */
export function liteMarketOrderApi(data: any) {
  return http.post(paths['lite_open'], data);
}

/** 简单合约限价下单（计划委托） */
export function liteLimitOrderApi(data: any) {
  return http.post(paths['lite_place'], data);
}

/** 简单合约平仓 */
export function closeLiteOrderApi(data: { id?: string; ids?: string[] }) {
  return http.post<{ successNum: number; failureNum: number }>(paths['lite_close'], data);
}

/** 简单合约按订单号修改止盈止损比例 */
export function liteUpdateTPSLApi(data: { id: string; takeProfit: number; stopLoss: number }) {
  return http.post(paths['lite_tpsl'], data);
}

/** 简单合约按订单号增加保证金 */
export function liteAddMarginApi(data: { id: string; margin: number }) {
  return http.post(paths['lite_add_margin'], data);
}

/** 简单合约模拟账户充币 */
export function liteAddScoreApi() {
  return http.post(paths['lite_add_score']);
}
/** 简单合约反向开仓 */
export function liteReverseOpenOrderApi(data: { positionId: string; platform: string }) {
  return http.post(paths['lite_reverse_open_order'], data);
}
/** 简单自动追加保证金 */
export function liteAutoAddMarginApi(data: { id: string; auto: boolean }) {
  return http.post(paths['lite_auto_add_margin'], data);
}

/** 简单设置移动止损 */
export function liteShiftStopLossApi(data: { id: string; price: number; offset: number }) {
  return http.post(paths['lite_shift_stop_loss'], data);
}
/** 获取简单合约交易商品详情列表 */
export function getLiteTradeListApi() {
  return http.get(paths['lite_trade_list']);
}
/** 账户跟单数据 */
export function getAccountFollowDataApi() {
  return http.get<{ sumIncome: number; incomeToday: number; incomeDailys: [] }>(paths['lite_follow_follower_stat']);
}

/** 获取正在跟单 */
export function getAccountFollowListApi(data: {
  page: number;
  rows: number;
  sumIncomeGe: number;
  sumIncomeLt: number;
}) {
  return http.get<{ count: number; size: number; page: number; list: [] }>(paths['lite_follow_follower_traders'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 10 }
  });
}

/** 获取跟单交易详情 */
export function getAccountFollowDetailApi(data: { page: number; rows: number }) {
  return http.get<{ list: []; totalPage: number; page: number; size: number }>(paths['lite_follow_follower_orders'], {
    params: { ...data, page: data.page || 1, size: data.rows || 10 }
  });
}
/** 交易员修改跟随人数 */
export function saveFollowMaxApi(data: { followTeamMax: number; followOpenMax: number }) {
  return http.post<object>(paths['lite_follow_trader_save_follow_max'], data);
}

/** 删除跟随者 */
export function removeFollowTraderApi(id: string) {
  return http.post<object>(`${paths['api_lite_follow_trader_remove']}/${id}`);
}
/** 设置跟单比例 */
export function setFollowTraderRatioApi(ratio: number) {
  return http.post<object>(paths['lite_follow_trader_set_ratio'], { ratio });
}

/** 跟单交易收益概览 */
export function getFollowTraderIncomeViewApi(data: { currency?: string }) {
  return http.get<{
    incomeWeek: number;
    incomeDay: number;
    incomeAll: number;
    ratio: number;
  }>(paths['lite_follow_trader_income_view'], {
    params: { ...data, currency: data.currency || 'USDT' }
  });
}

/** 获取跟单交易员的跟随者 */
export function getFollowTraderFollowersApi(data: {
  currency?: string;
  rows: number;
  page: number;
  traderId: number;
  relation?: boolean;
}) {
  return http.get<{
    list: [{ uid: number; username: string }];
    count: number;
    totalPage: number;
    page: number;
    size: number;
  }>(paths['lite_follow_trader_followers'], {
    params: { ...data, currency: data.currency || 'USDT' }
  });
}

/** 设置交易员状态 */
export function setFollowTraderActiveApi(data: { active: boolean }) {
  return http.post(paths['lite_follow_trader_active'], data);
}
/** 添加风格 */
export function addFollowTraderStyleApi(code: string) {
  return http.post(paths['lite_follow_trader_addTags'], { code, type: 2 });
}
/** 获取所有系统理念 */
export function getFollowTraderIdeaApi() {
  return http.get<{ id: string; type: number; code: string; name: string; content: string }[]>(
    `${paths['lite_follow_trader_sysTags']}/1`
  );
}
/** 获取我的理念 */
export function getFollowTraderMyIdeaApi() {
  return http.get<
    {
      code: string;
      content: string;
      id: number;
      language: string;
      name: string;
      type: number;
    }[]
  >(`${paths['lite_follow_trader_myTags']}/1`);
}

/** 获取所有系统风格 */
export function getAllSystemStyleApi() {
  return http.get<
    {
      code: string;
      content: string;
      id: string;
      language: string;
      name: string;
      type: number;
    }[]
  >(`${paths['lite_follow_trader_sysTags']}/2`);
}
/** 获取我的风格 */
export function getMyStyleApi() {
  return http.get<
    {
      code: string;
      content: string;
      id: string;
      language: string;
      name: string;
      type: number;
    }[]
  >(`${paths['lite_follow_trader_myTags']}/2`);
}

/** 差价合约持仓 */
export function getLitePositionApi(
  params = {} as {
    standard?: boolean;
  }
) {
  return http.get<LiteListItem[]>(paths['lite_position'], {
    params: { ...params }
  });
}
/** 获取体验金账户 */
export function getLiteRewardsAccountApi() {
  return http.get<{
    lite: {
      amount: number;
      createTime: number;
      currency: string;
      expireTime: number;
      id: string;
      label: string;
      lever: number;
      state: number;
      symbols: null;
      type: number;
      uid: string;
      usedAmount: number;
    }[];
    swap: [];
  }>(paths['lite_rewards']);
}
