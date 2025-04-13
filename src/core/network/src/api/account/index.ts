/**
 * 与账户有关的接口合集
 */

import { SpotItem } from '@/core/shared';
import { http } from '../../http/request';
import { paths } from '../paths';
import { PerpetualCoinAssetProps, PerpetualUAssetProps } from './types';
import { serializeObject } from '@/core/utils';


function _(data?: any){
  return serializeObject(data);
}

/** 登录验证 */
export function getloginValidate(data: { username: string,vHash:any,terminal:any,af_id:number,app_id:number}) {
  return http.post<string[]>(paths['loginValidate'],data);
}

/** 国家列表 */
export function getCountryList() {
  return http.get<string[]>(paths['countryList']);
}
/** 登录验证State */
export function getBehaviorStatetApi() {
  return http.get<string[]>(paths['get_behavior_state'],{});
}

/** 获取可充值币种列表接口 */
export function getAccountRechargeListApi() {
  return http.get<string[]>(paths['recharge_currency']);
}
/* 获取可提取币种列表接口 */
export function getAccountWithdrawListApi() {
  return http.get<string[]>(paths['withdraw_currency']);
}
/** 账户盈亏 */
export function getAccountProfitApi(data: { type: number }) {
  return http.get<{ dateType: number; balance: number; netIncome: number }[]>(paths['account_profit'], { params: data });
}

/** 账户盈亏率 */
export function getAccountProfitRateApi(data: { type: number; startTime: number; endTime: number }) {
  return http.get<{ date: number; rate: number; btcRate: number }[]>(paths['account_profit_rate'], { params: data });
}

/** 账户盈亏历史 */
export function getAccountProfitHistoryApi(data: { type: number; startTime: number; endTime: number }) {
  return http.get<{ date: string; balance: string }[]>(paths['account_profit_history'], { params: data });
}

/** 账户盈亏日历 */
export function getAccountProfitCalendarApi(data: { type: number; startTime: number; endTime?: number }) {
  return http.get<{ date: number; rate: number; profit: number }[]>(paths['account_day_profit'], { params: data });
}
/** 绑定手机 */
export function postAccountBindPhoneApi(data: { phone: string; code: string; reset: boolean; countryId: string; token: string }) {
  return http.post(paths['user_v2_bind_phone'], data);
}

/** 绑定邮箱 */
export function postAccountBindEmailApi(data: { email: string; code: string; reset: boolean; token: string }) {
  return http.post(paths['user_v2_bind_email'], data);
}

/** 解绑手机 */
export function postAccountUnbindPhoneApi(data: { token: string }) {
  return http.post(paths['user_v2_unbind_phone'], data);
}

/** 验证验证码 */
export function referralVerifyCodeApi(data: { sence: any; vHash: string; account?: string; email_code?: string; ga_code?: string; phone_code?: string; password?: string }) {
  return http.post<{
    token: string;
    verify_email?: boolean;
    verify_phone?: boolean;
    verify_ga?: boolean;
  }>(paths['security_verify'], data);
}

/** 上传头像 */
export function postAccountUploadAvatarApi(data: any) {
  return http.post(paths['upload_avatar'], data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 更新用户名 */
export function updateUsernameApi(data: { username: string }) {
  return http.post(paths['update_username'], data);
}

/** 获取谷歌秘钥 */
export function getGoogleSecretApi() {
  return http.get(paths['user_v2_google_secret']);
}

/** 设置防钓鱼码 */
export function setAntiPhishingCodeApi(data: { antiPhishing: string; token: string }) {
  return http.post(paths['user_v2_set_anti_phishing'], data);
}

/** 设置资金密码 */
export function settingFundPasswordApi(data: { password: string; withdrawPw: string }) {
  return http.post(paths['user_init_withdrawPw'], data);
}

/** 修改资金密码 */
export function updateFundPasswordApi(data: { oldPassword: string; newPassword: string; token: string }) {
  return http.post(paths['user_update_withdrawPw'], data);
}

/** 重置资金密码 */
export function resetFundPasswordApi(data: { password: string; token: string }) {
  return http.post(paths['user_v2_reset_withdrawPw'], data);
}
/** 解绑资金密码 */
export function unbindFundPasswordApi(data: { token: string }) {
  return http.post(paths['user_v2_unbind_withdrawPw'], data);
}

/** 获取资产列表 */
export function getAssetsListApi() {
  return http.get(paths['withdraw_address']);
}

/** 删除地址 */
export function deleteAddressApi(addressId: number) {
  return http.post(`${paths['delete_address']}/${addressId}`);
}
/** 获取今日提币限额 */
export function getWithdrawAvailableApi() {
  return http.get<{ amount: number; currency: string; total: number }>(paths['transfer_avaiable']);
}

/* 获取kyc配置 */
export function getKycConfigApi() {
  return http.get(paths['kyc_config']);
}

/** 提币申请 */
export function transferWithdrawApi(data: { currency: string; amount: number; chain: string; address: string; addressTag?: string; vToken?: string; version: string; token?: string }) {
  return http.post(paths['transfer_withdraw'], data);
}
/** 获取充币地址信息 */
export function getRechargeAddressInfoApi(currency: string, chain: string) {
  return http.get<{ address: string; remark: string; chain: string }>(paths['recharge_getAddress'], { params: { currency, chain } });
}
/** 添加地址 */
export function addAddressApi(data: { currency: string; address: string; remark?: string; chain: string; addressTag?: string }) {
  return http.post(paths['add_address'], data);
}

/** 编辑提币地址 */
export function editAddressApi(data: { currency: string; address: string; remark?: string; chain: string; addressTag?: string; id: number; common?: boolean; white?: boolean }) {
  return http.post(paths['edit_address'], data);
}

/** 获取绑定选项 */
export function getBindOptionsApi() {
  return http.get<any[]>(paths['user_v2_bind_options']);
}
/** 绑定谷歌秘钥 */
export function bindGoogleSecretApi(data: { code: string; token: string; secret: string; reset: boolean }) {
  return http.post(paths['user_v2_bind_google'], data);
}

/** 解绑谷歌秘钥 */
export function unbindGoogleSecretApi(data: { token: string }) {
  return http.post(paths['user_v2_unbind_google'], data);
}

/** 更新登录密码 */
export function updateLoginPasswordApi(data: { token: string; oldPassword: string; newPassword: string }) {
  return http.post(paths['user_v2_update_password'], data);
}
/** 获取登录历史 */
export function getLoginHistoryApi(data: { page: number; rows: number }) {
  return http.get<{
    list: [];
    count: number;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['private_login_history'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 10 },
  });
}

/** 现货资产 */
export function getSpotAssetApi() {
  return http.get<SpotItem[]>(paths['spot_asset']);
}
/** 永续U本位资产 */
export function getPerpetualUAssetApi() {
  return http.get<PerpetualUAssetProps>(paths['swap_future_account_sumFound']);
}

/** 永续币本位合约资产 */
export function getPerpetualCoinAssetApi() {
  return http.get<PerpetualCoinAssetProps>(paths['swap_delivery_account_sumFound']);
}

/** 转账记录 */
export function getTransferRecordApi(data: { page?: number; size?: number; source: string; target: string }) {
  return http.get<{
    count: number;
    list: [];
    page: number;
    size: number;
    totalPage: number;
    createTimeGe?: string;
    createTimeLe?: string;
  }>(paths['transfer_record'], {
    params: { ...data, page: data.page || 1, size: data.size || 10 },
  });
}

/** 设置本地货币 */
export function setLocalCurrencyApi(data: { currency: string }) {
  return http.post<{}>(paths['set_local_currency'], data);
}
/** 钱包划转 */
export function walletTransferApi(data: { source: string; amount: string; target: string; currency: string; version: string }) {
  return http.post<{}>(paths['wallet_transfer'], _(data));
}

/** 法币记录 */
export function getDepositRecordsApi(data: { page?: number; rows?: number; createTimeGe: string; createTimeLe: string; currency?: string; coin: boolean }) {
  return http.get<{
    list: [];
    count: string;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['deposit_records'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 13 },
  });
}

/** 提币记录 */
export function getWithdrawRecordsApi(data: { page?: number; rows?: number; createTimeGe: string; createTimeLe: string; currency?: string; coin?: boolean; transfer?: boolean }) {
  return http.get<{
    list: [];
    count: string;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['deposit_withdraw'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 13 },
  });
}
/** 转账记录接口 */
export function getPaymentsRecordsApi(data: { page?: number; rows?: number; startTime: number; endTime: number; source?: string; target?: string; fund?: string }) {
  return http.get<{
    list: [];
    count: string;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['payments_records'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 13 },
  });
}
/** 闪兑记录 */
export function getExchangeRecordsApi(data: { page?: number; rows?: number; createTimeGe: string; createTimeLe: string; sourceCurrency?: string; targetCurrency: string }) {
  return http.get<{
    list: [];
    count: string;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['exchangeHistory'], {
    params: { ...data, page: data.page || 1, rows: data.rows || 13 },
  });
}

export function getDepositExportApi(data: { createTimeGe: string; createTimeLe: string; coin?: boolean }) {
  return http.get(paths['deposit_export'], {
    params: data,
    responseType: 'blob',
  });
}

/** 报税单下载记录 */
export function getAccountTaxDownloadRecordApi() {
  return http.get<{ code: number; list: [] }>(paths['tax_download_record']);
}

/** 报税单下载申请 */
export function getAccountTaxDownloadApplyApi(data: { from: string; to: string }) {
  return http.post(paths['tax_download_apply'], data);
}
/** 报税记录下载 */
export function getTaxDownloadRemainCountApi() {
  return http.get<{ code: number; data: number; remain: number }>(paths['tax_download_last_record']);
}
/** 提币记录导出 */
export function geAccountWithdrawExportApi(data: { createTimeGe: string; createTimeLe: string }) {
  return http.get<object>(paths['spot_withdraw_export'], {
    params: data,
    responseType: 'blob',
  });
}
 

/** 提币免验证 */
export function toggleAccountWithdrawFastApi(data: { enable: boolean; token?: string }) {
  return http.post(paths['toggle_withdraw_fast'], data);
}
/** 打开/关闭 仅地址簿提币 */
export function toggleAccountWithdrawWhiteApi(data: { enable: boolean; token?: string }) {
  return http.post(paths['toggle_withdraw_white'], data);
}

/** 验证密码 */
export function postAccountVerifyPasswordApi(data: { password: string }) {
  return http.post<{ macth: boolean; error: string; token: string }>(paths['verify_password'], data);
}
/** 获取充值地址列表 */
export function getAccountDepositAddressListApi(data: { currency: string; network: string }) {
  return http.get(paths['deposit_address_list'], { params: data });
}

/** 充值到目标钱包 */
export function postDepositTargetWalletApi(data: { currency: string; wallet: string }) {
  return http.post(paths['deposit_target_wallet'], data);
}

/** 创建充币地址 */
export function depositAddressCreateApi(data: { currency: string; network: string }) {
  return http.post(paths['deposit_address_create'], data);
}

/** 修改充币地址 */
export function depositAddressUpdateApi(data: { id: string; selected?: boolean; alias?: string }) {
  return http.post(paths['deposit_address_update'], data);
}
/** 获取余币兑换算力列表 */
export function getAccountConvertPointAssetsListApi() {
  return http.get(paths['convert_point_assets_list']);
}

/** 余币兑换算力--兑换 */
export function applyConvertCoinApi(data: { currencies: string[] }) {
  return http.post(paths['convert_point_apply'], data);
}

/** 获取余币兑换记录 */
export function getAccountConvertHistoryApi(data: { page: number; rows: number }) {
  return http.get(paths['convert_history'], { params: data });
}
/** 内部转账 */
export function postAccountInnerTransferApi(data: { currency: string; address: string; amount: number; note?: string }) {
  return http.post(paths['payment_send'], {
    fund: 'ASSET',
    source: 'SPOT',
    target: 'SPOT',
    ...data,
  });
}

/** KYC支持的国家 */
export function getKycSupportCountryApi(countryId: string) {
  return http.get<{ type: string }>(`${paths['get_kyc_support_country']}/${countryId}`);
}

/** Onfido请求 */
export function postAccountOnfidoCreationApi(data: { countryId: string; device: string; firstName: string; lastName: string }) {
  return http.post<{ sdk_token: string; workflow_id: string; id: string }>(paths['onfido_initiate_creation'], data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
}

/** Onfido请求回执 */
export function postAccountOnfidoCreationReceiptApi(runId: string) {
  return http.post<'WAIT' | 'PASS' | 'REJECT'>(`${paths['onfido_check']}/${runId}`);
}
/** 账号验证 */
export function postAccountVerifyApi(data: { account: string; token?: string }) {
  return http.post<{
    account: string;
    verify_ga: boolean;
    verify_email: boolean;
    verify_phone: boolean;
  }>(paths['forgot_v2_account_verify'], data);
}
/** 韩国kyc验证 */
export function getAccountKoreaKycStatus() {
  return http.get(`${paths['account_suspect']}`);
}
