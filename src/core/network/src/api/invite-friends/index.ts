import { http } from '../../http/request';
import { paths } from '../paths';
import { PaginationParamsType, RendEmailType } from './types';

// 重发邀请邮件
export function postInviteFriendsResendEmailApi(id: string) {
  return http.post(paths['invite_friends_resend_email'], { id });
}

// 发送邀请邮件
export function postInviteFriendsRendEmailApi(params: RendEmailType) {
  return http.post(paths['invite_friends_send_email'], params);
}

// 活动任务列表
export function getInviteFriendsListApi() {
  return http.get<object>(paths['activity_missions'], { params: { type: '9,36', category: 4 } });
}

// 奖励累计
export function getInviteFriendsRewardTotalApi() {
  return http.get(paths['invite_friends_reward_total']);
}

// 推荐总览
export function getInviteFriendsSummaryApi() {
  return http.get(paths['invite_friends_summary']);
}

// 邀请记录
export function getInviteFriendsSendRecordsApi() {
  return http.get(paths['invite_friends_send_records']);
}

// 奖励记录
export function getInviteFriendsRewardRecordsApi() {
  return http.get(paths['invite_friends_reward_records']);
}

// 助力券-邀请记录
export function getInviteAssistApi(data: { startTime: number; endTime: number; page: number; rows: number }) {
  return http.get(paths['assist_invite'], { params: data });
}
// 助力券-奖励记录
export function getInviteAssistProcessApi(data: { startTime: number; endTime: number; page: number; rows: number }) {
  return http.get(paths['assist_process'], { params: data });
}
// 助力券-参加活动
export function postJoinAssistApi() {
  return http.post(paths['join_assist']);
}
// 助力券-提前结束
export function postCancelAssistApi(data: { processId: number }) {
  return http.post(paths['cancel_assist'], data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
// 助力券-领取奖励
export function postCollectAssistApi(data: { rewardId: number }) {
  return http.post(paths['collect_assist'], data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
// 助力券-当前进行中活动详情
export function getAssistDetailApi() {
  return http.get(paths['assist_detail']);
}
// 助力券-待领取活动奖励
export function getAssistRewardsApi(data: { page: number; rows: number }) {
  return http.get(paths['assist_rewards'], { params: data });
}
export function getLuckydrawInvitesApi(data: PaginationParamsType) {
  return http.get(paths['luckydraw_invites'], { params: data });
}
/**
 *
 * @param  未登录：邀新活动-数据统计
 * @returns
 */
export function getPromoOverviewApi(data: PaginationParamsType) {
  return http.get(paths['promo_overview'], { params: data });
}
/**
 * @param  已登录：邀新活动-数据统计
 * @returns
 */
export function getPromoPrivateOverviewApi(data: PaginationParamsType) {
  return http.get(paths['promo_private_overview'], { params: data });
}

export function getLuckydrawRewardsApi(data: PaginationParamsType) {
  return http.get(paths['luckydraw_rewards'], { params: data });
}
/**
 * 幸运轮盘-当前进行中活动详情
 */
export function getLuckydrawDetailApi() {
  return http.get(paths['luckydraw_detail']);
}

export function postjoinLuckydrawApi() {
  return http.post(paths['join_luckydraw']);
}

export function postCancelLuckydrawApi(boody: { processId: number }) {
  return http.post(paths['cancel_luckydraw'], boody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function postLuckydraw(boody: { processId: number }) {
  return http.post(paths['draw'], boody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function postShareLuckydrawApi(boody: { processId: number; shareType: string }) {
  return http.post(paths['share_luckydraw'], boody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function postCollectLuckydrawApi(boody: { rewardId: number }) {
  return http.post(paths['collect_luckydraw'], boody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function getMysteryboxDetailApi() {
  return http.get(paths['mysterybox_detail'], {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function getMysteryboxInvitesApi(data: { startTime: number; endTime: number; page: number; rows: number }) {
  return http.get(paths['mysterybox_invites'], { params: data });
}

export function getMysteryboxRewardsApi(data: { startTime: number; endTime: number; page: number; rows: number }) {
  return http.get(paths['mysterybox_rewards'], { params: data });
}

export function postOpenMysteryboxApi(boody: { assetId: number }) {
  return http.post(paths['open_mysterybox'], boody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export function postCollectMysteryboxApi(boody: { rewardId: number }) {
  return http.post(paths['collect_mysterybox'], boody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
