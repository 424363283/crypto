/**
 * 与代理中心有关的接口合集
 */

import { AffiliateBalanceItem, BarGraphType, InviteLinkListItem, TradeListItem, TradeTab, UserListItem } from '@/core/shared';
import { http } from '../../http/request';
import { paths } from '../paths';

/** 代理中心——提现 */
export function postAffiliateWithdrawApi(currency: string, amount: number) {
  return http.post(paths['affiliate_withdraw'], { amount, currency });
}

/** 代理中心——获取用户列表 */
export function getAffiliateWithdrawListApi(page?: number) {
  return http.get<{
    count: number;
    list: [];
  }>(paths['affiliate_withdraw_history_list'], { params: { page, rows: 10 } });
}

/** 代理中心——获取团队管理列表 */
export function getAffiliateTeamsListApi(type: number, currency: string, dateGe: string, dateLe: string, orderBy: number | string, order: string, uid?: string, username?: string, page?: number, ratio?: number | string, pid?: string) {
  return http.get<{
    count: number;
    list: [];
  }>(paths['affiliate_teams_list'], {
    params: {
      type,
      currency,
      dateGe,
      dateLe,
      orderBy,
      order,
      uid,
      username,
      page,
      rows: 10,
      ratio,
      pid,
    },
  });
}

/** 代理中心——获取返佣列表 */
export function getAffiliateStepsListApi() {
  return http.get<{
    spot_steps: { disabled: boolean; value: number }[];
    swap_steps: { disabled: boolean; value: number }[];
  }>(paths['affiliate_steps_list']);
}
/** 代理中心——用户现货升点 */
export function upgradeSpotRateApi(descendant: string, rate: number) {
  return http.post(paths['affiliate_spot_upgrade'], {
    descendant,
    rate,
    type: 1,
  });
}

/** 代理中心——用户永续升点 */
export function upgradeSwapRateApi(descendant: string, rate: number) {
  return http.post(paths['affiliate_swap_upgrade'], {
    descendant,
    rate,
    type: 3,
  });
}

/** 代理中心——获取返佣记录列表 */
export function getRecordListApi(params: { dateGe: string; dateLe: string; uid?: string; sname?: string; type?: number; page?: number; rows?: number }) {
  return http.get(paths['affiliate_record_list'], { params });
}

/** 代理中心——获取总览信息 */
export function getAffiliateSummaryApi() {
  return http.get<{
    tcommission: number;
    ycommission: number;
    hcommission: number;
    invites: number;
  }>(paths['affiliate_summary']);
}

/** 代理中心——获取收入信息 */
export function getAffiliateSummaryCommissionApi() {
  return http.get<{
    commissions: { currency: string; hcommissionValue: number }[];
  }>(paths['affiliate_summary_commission']);
}

/** 代理中心——获取用户信息 */
export function getAffiliateUserinfoApi() {
  return http.get<{
    username: string;
    uid: string;
    refer: string;
    avatar: string;
    swapRatio: number;
    spotRatio: number;
  }>(paths['affiliate_userinfo']);
}
/** 代理中心——获取用户的钱包余额 */
export function getAffiliateBalanceApi() {
  return http.get<AffiliateBalanceItem[]>(paths['affiliate_balance']);
}

/** 代理中心——获取直属数据/团队数据 */
export function getAffiliateBarGraphDataApi(type: BarGraphType, currency: string, dateGe: string, dateLe: string) {
  return http.get<{
    data1: { date: string; value: number }[];
    data2: { date: string; value: number }[];
    sum1: number;
    sum2: number;
  }>(paths['affiliate_bar_graph'], {
    params: { type, currency, dateGe, dateLe },
  });
}

/** 代理中心——获取交易直属数据/团队数据 */
export function getAffiliateTradeDataApi(type: TradeTab, currency: string, dateGe: string, dateLe: string, uid?: string) {
  return http.get<{
    data1: TradeListItem[];
    data2: TradeListItem[];
  }>(paths['affiliate_trading_data'], {
    params: { type, currency, dateGe, dateLe, uid },
  });
}

/** 代理中心——获取邀请链接列表 */
export function getInviteLinkListApi() {
  return http.get<InviteLinkListItem[]>(paths['affiliate_invite_link_list']);
}

/** 代理中心——获取邀请链接列表 */
export function getAffiliateInviteDomainsApi() {
  return http.get<string[]>(paths['affiliate_share_domains']);
}

/** 代理中心——新增邀请链接 */
export function addAffiliateInviteLinkApi(source: string, link: string) {
  return http.post(paths['affiliate_add_invite_link'], { source, link });
}

/** 代理中心——按 id 删除邀请链接 */
export function deleteInviteLinkByIdApi(id: string) {
  return http.post(`${paths['affiliate_delete_invite_link']}/${id}`);
}

/** 代理中心——获取用户列表 */
export function getAffiliateUserListApi(source: string, currency: string, dateGe: string, dateLe: string, uid?: string, username?: string, page?: number) {
  return http.get<{
    count: number;
    list: UserListItem[];
  }>(paths['affiliate_user_list'], {
    params: { source, currency, dateGe, dateLe, uid, username, page, rows: 10 },
  });
}
