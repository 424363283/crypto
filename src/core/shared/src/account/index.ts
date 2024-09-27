import { getCommonCountryListApi, kycUploadApi, loginApi, postAccountUploadAvatarApi, postCommonRegisterApi, resetPasswordApi, settingFundPasswordApi, updateLoginPasswordApi, updateUsernameApi } from '@/core/api';
import { appContextSetState , localStorageApi , LOCAL_KEY} from '@/core/store';
import { getCookie, mergeMultiFileFields, removeCookie, serializeObject } from '@/core/utils';
import { Assets } from './assets';
import { Convert } from './convert';
import { FiatCrypto } from './fiat-crypto';
import { Follow } from './follow';
import { GoogleSecret } from './google-secret';
import { SecurityVerify } from './security-verify';
import { UserInfo } from './user-info';
import { KycStatus } from './user-info/types';
import { VerifyCode } from './verify-code';
import { SENCE } from './verify-code/types';
import { Vip } from './vip';
interface LoginParam {
  username: string;
  password: string;
  vHash: string;
  terminal: string;
  trust?: boolean;
  version?: string;
  cToken?: string;
  vToken?: string;
  countryCode?: number;
}
class Account {
  public static countryCode: number = 852;

  // 获取验证码
  public static verifyCode = VerifyCode;

  // 安全验证
  public static securityVerify = SecurityVerify;

  // google secret
  public static googleSecret = GoogleSecret;
  // 跟单相关
  public static follow = Follow;

  // 快捷买币
  public static fiatCrypto = FiatCrypto;

  // 闪兑
  public static convert = Convert;

  // vip
  public static vip = Vip;

  // assets
  public static assets = Assets;

  // 是否登录
  static get isLogin(): boolean {
    return !!getCookie('TOKEN');
  }

  // 获取token
  static get token(): string {
    return getCookie('TOKEN') || '';
  }

  // 设置登录状态,刷新全局Context登录状态
  static setLoginStatus(status: boolean): void {
    appContextSetState({ isLogin: status });
  }

  // 获取国家列表
  static async getCountryList() {
    const list = localStorageApi.getItem(LOCAL_KEY.COUNTRY_CODE);
    if (list) return list as [];
    const { data } = await getCommonCountryListApi();
    localStorageApi.setItem(LOCAL_KEY.COUNTRY_CODE, data.list);

    return data.list;
  }

  // 获取用户信息
  static async getUserInfo(): Promise<UserInfo | null> {
    if (Account.isLogin) {
      return await UserInfo.getInstance();
    } else {
      return null;
    }
  }
  // 立即刷新用户信息
  static async refreshUserInfo(): Promise<UserInfo | null> {
    if (Account.isLogin) {
      return await UserInfo.refresh();
    } else {
      // console.log('refreshUserInfo 未登录');
      return null;
    }
  }

  static async registerUser(data: { password: string; countryCode?: string; countryId?: string; sign: string; email?: string; phone?: string; ru?: string; terminal?: string; code?: string }) {
    return await postCommonRegisterApi(data);
  }
  static async login(data: LoginParam): Promise<{ code: number; message: string; data: any }> {
    const res = await loginApi(data);
    if (res.code === 200 && !res.data.next) {
      Account.setLoginStatus(true);
    }
    return res;
  }
  // logout
  static async logout(): Promise<void> {
    removeCookie('TOKEN');
    document.documentElement.setAttribute('token', '');
    return Account.setLoginStatus(false);
  }
  // reset pwd
  static async resetPassword(data: { password: string; token: string; account: string }): Promise<{ code: number; message: string }> {
    return await resetPasswordApi(data);
  }

  // 上传头像
  static async uploadAvatar(data: { image: File }): Promise<{ code: number; message: string; data: { avatar: string } }> {
    return await postAccountUploadAvatarApi(data);
  }
  // updateUsername
  static async updateUsername(data: { username: string }): Promise<{ code: number; message: string }> {
    return await updateUsernameApi(data);
  }
  // 获取kyc状态
  static async getKycStatus(): Promise<KycStatus> {
    return await UserInfo.getUserKycInfo();
  }
  // 资金密码
  static settingFundPassword(data: { password: string; withdrawPw: string }): Promise<{ code: number; message: string }> {
    return settingFundPasswordApi(data);
  }
  //kycUpload
  static kycUpload(data: { images: any; countryId: string; identityName: string; identityType: number; identityNumber: string }): Promise<{ code: number; message: string }> {
    const formData = mergeMultiFileFields({ ...data, front: true }) as any;
    return kycUploadApi(formData);
  }
  //updateLoginPassword
  static updateLoginPassword(data: { oldPassword: string; newPassword: string; token: string }): Promise<{ code: number; message: string }> {
    return updateLoginPasswordApi(data);
  }
}

export { Account, SENCE, UserInfo,VerifyCode };
