import { getCommonUserInfoApi, getKycStatusApi } from '@/core/api';
import { R } from '@/core/network';
import { asyncFactory } from '@/core/utils/src/async-instance';
import { KycStatus } from './types';

class UserInfo {
  private static instance: UserInfo;
  private static cacheHttp: Promise<R<object>>;
  private readonly interval: number = 5000;

  public uid: string = ''; // 用户id
  public username: string = ''; // 用户名
  public avatar: string = ''; // 头像
  public phone: string = ''; // 手机
  public email: string = ''; // 邮箱
  public ru: string = ''; // 邀请码
  public bindEmail: boolean = false; // 是否绑定邮箱
  public bindGoogle: boolean = false; // 是否绑定谷歌
  public bindPassword: boolean = false; // 是否绑定密码
  public bindPhone: boolean = false; // 是否绑定手机
  public pw_l: number = 1; // 密码强度
  public pw_w: number = 0; // 密码强度
  public identityPhotoValid: boolean = false; //是否证件认证通过
  public identityNumberValid: boolean = false; // 是否实名认证
  public antiPhishing: boolean = false; // 是否开启防钓鱼
  public type = 0; // 用户类型; 1-没开启; 2-普通用户; 3-明显
  public traderActive: boolean = false; // 是否是跟单交易员
  public localCurrency: string = ''; // 本地货币
  public withdrawTime: any = '0'; // 禁止提币时间
  public withdrawWhite: boolean = false; // 是否在白名单
  public withdrawFast: boolean = false; // 是否开启快速提币
  public level: number = 0; // vip等级
  public verifiedDeveloped: boolean = false; // 是否完成KYC且T1国家
  public verified: boolean = false; // 是否已认证

  constructor(data: any) {
    this.setUserInfo(data);
  }

  private setUserInfo(data: any): void {
    if (!data) return;
    this.avatar = data.avatar;
    this.uid = data.userId;
    this.username = data.username;
    this.phone = data.phone;
    this.email = data.email;
    this.ru = data.refer;
    this.bindEmail = data.bindEmail;
    this.bindGoogle = data.bindGoogle;
    this.bindPassword = data.bindPassword;
    this.bindPhone = data.bindPhone;
    this.pw_l = data.pw_l;
    this.pw_w = data.pw_w;
    this.identityPhotoValid = data.identityPhotoValid;
    this.antiPhishing = data.antiPhishing;
    this.type = data.type;
    this.traderActive = data.traderActive;
    this.localCurrency = data.localCurrency;
    this.withdrawTime = data.withdrawTime;
    this.withdrawWhite = data.withdrawWhite;
    this.withdrawFast = data.withdrawFast;
    this.identityNumberValid = data.identityNumberValid;
    this.level = data.level;
    this.verifiedDeveloped = data.verifiedDeveloped;
    this.verified = data.kyc == 2;  
  }

  static async getInstance(): Promise<UserInfo> {
    return await asyncFactory.getInstance<UserInfo>(async (): Promise<UserInfo> => {
      const { data } = await getCommonUserInfoApi();
      UserInfo.instance = new UserInfo(data);
      return UserInfo.instance;
    }, UserInfo);
  }
  static async getUserKycInfo(): Promise<KycStatus> {
    return await asyncFactory.getInstance<KycStatus>(async (): Promise<KycStatus> => {
      const { data } = await getKycStatusApi();
      return data;
    }, 'KYC_STATUS');
  }

  static async refresh(): Promise<UserInfo> {
    const { data } = await getCommonUserInfoApi();
    if (!UserInfo.instance) {
      UserInfo.instance = new UserInfo(data);
      return UserInfo.instance;
    }
    UserInfo.instance.setUserInfo(data);
    return UserInfo.instance;
  }
}

export { UserInfo };
