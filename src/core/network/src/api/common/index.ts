/**
 * 公共接口合集，非其余几个目录的接口均可放在这里
 */

import { http } from '../../http/request';
import { paths } from '../paths';
import { NetworksChain } from './types';

import { serializeObject } from '@/core/utils';

function _(data?: any){
  return serializeObject(data);
}

/** 获取新手奖励任务列表 */
export function getCommonTaskListApi() {
  return http.get<object>(paths['activity_missions']);
}

/** 获取分组索引接口 */
export async function getCommonSymbolsApi(url?: string) {
  const res = await http.get<{
    spot_symbols: [];
    spot_units: [];
    spot_zones: [];
    favors: [];
  }>((url || '') + paths['get_symbols']);
  if (res.code === 200) {
    const data: any = res.data;
    [data.copy_symbols, data.lite_symbols, data.spot_symbols, data.swap_symbols, data.swap_testnet_symbols].forEach((list: any) => {
      list?.forEach((e: any) => {
        // 移除字段：digit （priceScale，volumeScale代替）
        e.digit = e.priceScale;
      });
    });
  }
  return res;
}

/** 获取轮播列表接口 */
export function getCommonBannersApi() {
  return http.get<object>(paths['banners']);
}

/** 当前空投任务 */
export function getCommonCurrentAirdropApi() {
  return http.get<{
    banner: string;
    currency: string;
    status: number;
    amount: number;
    number: number;
  }>(paths['current_airdrop']);
}

/** 获取公告列表接口 */
export function getCommonNoticesApi(type?: string) {
  return http.get<object[]>(paths['notices'], { params: { type } });
}

/** 获取可交易货币列表接||汇率接口 */
export function getCommonCurrencyListApi(type?: 0 | 1) {
  return http.get(paths['currency_list'], { params: { type } });
}
/** 获取基本信息接口 */
export async function getCommonBaseInfoApi() {
  const res = await http.get<{ liteLuckyRate: number; swapLuckyRate: number }>(paths['setting_info']);
  if (res.code === 200) {
    const data: any = res.data;
    data.quoteDomain = data.spotQuoteDomain;
    data.ppQuoteDomain = data.swapQuoteDomain;
  }
  return res;
}

/** 抽奖盲盒活动 */
export function getCommonVarietyLotteryApi() {
  return http.get<{ lottery: number; id: number }[]>(paths['lottery_blind']);
}

/** 获取汇率接口 */
export function getCommonExchangeRateListApi(target: string, real?: boolean, type?: 1 | 2) {
  return http.get<object[]>(paths['exchange_rate_list'], {
    params: { target, real, type },
  });
}

/** 获取登录自选列表 */
export function getCommonFavoritesListApi() {
  return http.get<{ type: any; list: string[] }[]>(paths['get_favorites_list']);
}

/** 添加自选 */
export function addCommonFavoritesApi(symbols: string[], type: any) {
  // 注意这里的 FAVORITE_TYPE 已更改为 any，请根据实际情况调整类型
  return http.post<object>(paths['add_favorites'], { symbols, type });
}

/** 删除自选 */
export function postCommonRemoveFavoritesApi(symbols: string[], type: any) {
  // 注意这里的 FAVORITE_TYPE 已更改为 any，请根据实际情况调整类型
  return http.post<object>(paths['remove_favorites_list'], { symbols, type });
}

/** 获取国家列表 */
export function getCommonCountryListApi() {
  return http.get<{ list: []; countryCode: number }>(paths['home_country_list']);
}

/** 获取是否极验验证 */
export function getCommonGt4StatusApi() {
  return http.get<{ active: boolean; captchaId: string }>(paths['get_behavior_state']);
}

/** 极验验证 */
export function postCommonGt4ValidateApi(data: any) {
  return http.post<{ token: string; valid: boolean }>(paths['gt4_validate'], _(data));
}

/** 用户信息 */
export async function getCommonUserInfoApi() {
  const res = await http.get<object>(paths['user_detail']);
  if (res.code === 200) {
    // const _data: any = res.data;
    // const data: any = _data.user;
    // data.bindPassword = data.hasPin;
    // data.realname = data.fullname;
    // data.withdrawTime = data.withdrawDisableTime;
    // data.withdrawCreateDisableTime = data.withdrawLimitTime;
  }
  return res;
}

/** 全球合伙人合作伙伴表单 */
export function postCommonApplyAffiliateAgentApi(data: object) {
  return http.post<object>(paths['apply_affiliate_agent'], _(data));
}

/** 登陆二维码 */
export function getCommonLoginQrCodeApi(random: string, opts: any) {
  return http.get(paths['login_qrcode'] + random, opts);
}

/** check login Qrcode */
export function postCommonCheckLoginQrCodeApi(data: { random: string; qrcode: string }) {
  return http.post<{ status: number }>(paths['check_login_qrcode'], _(data));
}

/** 任务列表 */
export function getCommonMissionsApi(module: string) {
  return http.get<object[]>(paths['variety_mission_missions'], {
    params: { module },
  });
}

/** 任务进度 */
export function getCommonMissionProgressApi(module: string) {
  return http.get<object[]>(paths['variety_mission_progress'], {
    params: { module },
  });
}

/** 加入社区 */
export function postCommonVarietyActivitySubscribeSocialApi(type: string) {
  return http.post(`${paths['variety_activity_subsricbe_social']}/${type}`);
}
/** 领取奖品 */
export function onVarietyActivityCollectApi(id: string) {
  return http.post(`${paths['variety_activity_collect']}/${id}`);
}

/** 抽奖 open_lottery */
export function postCommonVarietyActivityOpenLotteryApi<T>(data: { blind: boolean; lotteryId: string }) {
  return http.post(`${paths['open_lottery']}`, _(data));
}

/** 发送手机验证码 */
export function sendSmsCodeApi<T>(data: { sence: string; countryCode: number | string; phone: string | number; token?: string }) {
  return http.post<T>(paths['system_send_sms'], _(data));
}

/** 发送邮箱验证码 */
export function postCommonSendEmailCodeApi<T>(data: { sence: string; email: string; token?: string; params?: any }) {
  return http.post<T>(paths['system_send_email'], _(data));
}



/** 发送手机验证码 V2*/
export function sendSmsCodeApi_V2<T>(data: { sence: string; countryCode: number | string; phone: string | number; token?: string }) {
  return http.post<T>(paths['system_v2_send_sms'], _(data));
}


/** 发送邮箱验证码 V2 */
export function postSendEmailCodeApi_V2<T>(data: { sence: string; email: string; token?: string; params?: any }) {
  return http.post<T>(paths['system_v2_send_email'], _(data));
}


/** 注册接口 */
export function postCommonRegisterApi(data: { password: string; countryCode?: string; countryId?: string; sign: string; email?: string; phone?: string }) {
  return http.post<object>(paths['register_submit'], _(data));
}

/** 图片验证码 */
export function validateImgCodeApi(data: { vHash: string; code: string }) {
  return http.post<{ valid: boolean; token: string }>(paths['kaptcha_validate'], data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

/** 校验邮箱验证码 */
export function postCommonValidateEmailCodeApi<T>(data: { account: string; type: string; code: string }) {
  return http.post<T>(paths['system_check_email'], _(data));
}

/** 校验手机验证码 */
export function validateSmsCodeApi<T>(data: { account: string; type: string; code: string }) {
  return http.post<T>(paths['system_check_sms'], _(data));
}


/** 校验邮箱验证码V2 */
export function postCommonValidateEmailCodeApi_V2<T>(data: { account: string; type: string; code: string }) {
  return http.post<T>(paths['system_v2_check_email'], _(data));
}

/** 校验手机验证码V2 */
export function validateSmsCodeApi_V2<T>(data: { account: string; type: string; code: string }) {
  return http.post<T>(paths['system_v2_check_sms'], _(data));
}


/** 登陆接口 */
export function loginApi(data: any) {
  return http.post<{ next: boolean; phone: string; uid: string }>(paths['login'], _(data));
}

/** 退出登录 */
export function logoutApi() {
  return http.post<object>(paths['logout']);
}

/** 官方验证 */
export function officialVerifyApi(data: { content: string }) {
  return http.post<{ official: boolean }>(paths['official_validate'], _(data));
}

/** 安全验证 */
export function securityVerifyApi(data: { account: string; email_code?: string; phone_code?: string; ga_code?: string }) {
  return http.post<{ token: string }>(paths['forgot_v2_securify_verify'], _(data));
}

/** 重置密码 */
export function resetPasswordApi(data: { account: string; password: string; token: string }) {
  return http.post<object>(paths['forgot_v2_reset_password'], _(data));
}

/** 获取安全认证项 */
export function getSecurityOptionsApi(data: object) {
  return http.get<any[]>(paths['security_options'], { params: data });
}

/** 奖励累积 */
export function getReferralRewardTotalApi() {
  return http.get<object[]>(paths['private_referral_reward_total']);
}

/** 推荐总览 */
export function getReferralSummaryApi() {
  return http.get<object[]>(paths['private_referral_summary']);
}

/** 获取记录 */
export function getReferralRewardRecordsApi(data: any) {
  return http.get<object[]>(paths['private_referral_reward_records'], {
    params: data,
  });
}

/** 重发邮件 */
export function referralResendEmailApi(data: any) {
  return http.post<object>(paths['private_referral_resend_email'], _(data));
}

/** 发送邮件 */
export function referralSendEmailApi(data: any) {
  return http.post<object>(paths['private_referral_send_email'], _(data));
}

/** 获取KYC状态 */
export async function getKycStatusApi() {
  const res = await http.get(paths['profile_last_kyc2']);
  if (res.code === 200) {
    const data: any = res.data;
    data.identityName = [data.firstname, data.lastname].filter((v) => !!v).join('');
  }
  return res;
}

/** 获取转账链 */
export function getTransferChainsApi(currency: string) {
  return http.get(paths['transfer_chains'], {
    params: { currency },
  });
}

/** 获取网络链 */
export function getNetworksChainsApi(currency: string) {
  return http.get<NetworksChain[]>(paths['networks_chains'] + `/${currency}`);
}

/** 法币交易列表 */
export function getPaymentsApi(params: object) {
  return http.get(paths['supports_payments'], { params });
}

/** 法币配置 */
export function getSupportsApi(type?: number) {
  return http.get(paths['supports'], { params: { type } });
}

/** 法币交易 */
export function renderPaymentApi(data: any) {
  return http.post(paths['rechargeXXPay'], _(data));
}

/** 获取转账货币 */
export function getTransferCurrencyApi() {
  return http.get<string[]>(paths['transfer_currency']);
}

/** 国家验证 */
export function countryVerifyApi(data: { device: string; countryId: string }) {
  return http.post(paths['initiate_creation'], _(data));
}

/** KYC上传 */
export function kycUploadApi(data: FormData) {
  return http.post(paths['profile_submit_kyc2'], data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 获取货币规则详情列表 */
export function getCurrencyRuleDetailsApi() {
  return http.get<{ code: string }>(paths['currency_intro']);
}

/** 商品介绍 */
export function getCommonCommodityInfoApi(id: string) {
  return http.get<object>(paths['currency_info'].replace('{id}', id));
}

/** 获取ETF商品 */
export function getCommonEtfCommodityApi(id: string) {
  return http.get<{ currency: string; managerRate: number }>(paths['etf_commodity'].replace('{id}', id));
}
/** 维护配置信息 */
export function getCommonSettingGlobalApi() {
  return http.get<object>(paths['setting_global']);
}

/** 获取邀请码信息 */
export function getCommonInviteCodeInfoApi(ru: string) {
  return http.get<object>(paths['common_refer'].replace('{ru}', ru));
}

/** 三方账号登录 */
export function postCommonOauthLoginApi(data: { type: string; idToken: string; scene: string }) {
  return http.post(`${paths['oauth_login']}/${data.type}`, {
    idToken: data.idToken,
    scene: data.scene,
  });
}

/** 三方账号注册 */
export function postCommonOauthRegisterApi(data: { token: string; scene: string; trace: string; ru?: string; f?: string }) {
  return http.post(paths['oauth_register'], {
    token: data.token,
    scene: data.scene,
    trace: data.trace,
    ru: data.ru,
    f: data.f,
  });
}

/** vip申请 */
export function postCommonVipApplyApi(data: { account: string; contact: string; content: string; images: any }) {
  return http.post(paths['vip_apply'], data, {
    headers: {
      'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime(),
    },
  });
}

/** vip等级相关数据 */
export function getCommonVipDataApi() {
  return http.get(paths['vip_level_data']);
}

/** VIP等级设置 */
export function getCommonVipLevelsApi() {
  return http.get(paths['vip_setting_levels']);
}

/** 活动列表获取 */
export function getCommonActivityListApi() {
  return http.get(paths['admin_activity_list']);
}
export function getCommonVarietyActivityListApi() {
  return http.get(paths['admin_variety_activity_list']);
}
/** 意见反馈 */
export function submitCommonFeedbackApi(data: { type: number; problem: string; images: any }) {
  return http.post(paths['feedback_submit'], data, {
    headers: {
      'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime(),
    },
  });
}

/** 意见反馈记录 */
export function getCommonFeedbackRecordsApi() {
  return http.get(paths['feedback_records']);
}

/** 获取用户网络的当前定位 */
export function getCommonLocationApi() {
  return http.get(paths['get_location']);
}
/** 4周年活动（充值+抵扣金） */
export function getCommon4YearActivityDepositLucksApi(data: { dateGe: number; dateLe: number }) {
  return http.get<{ deposit: number; lucky: number }>(paths['deposit_lucks'], { params: data });
}

/** 4周年活动 （永续交易量排名） */
export function getCommonSwapRankApi(data: { dateGe: number; dateLe: number }) {
  return http.get<{ rank: number; amount: number }>(paths['swap_rank'], { params: data });
}

/** 获取文章列表 */
export function getCommonArticleListApi(type: string) {
  return http.get(`${paths['grid_article_list']}?type=${type}`);
}
