// 安全验证2FA
import { countryVerifyApi, getBindOptionsApi, getSecurityOptionsApi, postAccountVerifyApi, referralVerifyCodeApi, securityVerifyApi } from '@/core/api';
import { SENCE } from '@/core/shared';
import { message } from '@/core/utils';
import { Captcha } from '../captcha';
class SecurityVerify extends Captcha {
  public static run() {}

  // 账号验证
  public static accountVerify = async (account: string) => {
    try {
      const { data } = await this.verification();
      if (data?.token) {
        return postAccountVerifyApi({ account, token: data.token });
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };
  //安全验证
  public static verify(data: { account: string; sence: SENCE; email_code?: string; phone_code?: string; ga_code?: string }) {
    return securityVerifyApi(data);
  }

  //获取安全认证项security_options
  public static getSecurityOptions(data: { vHash: string; sence: SENCE; account?: string }) {
    return getSecurityOptionsApi(data);
  }
  // 验证验证码
  public static referralVerifyCode(data: { vHash: string; account?: string; email_code?: string; ga_code?: string; phone_code?: string; password?: string; sence: SENCE }) {
    return referralVerifyCodeApi(data);
  }
  //bind options
  public static getBindOptions() {
    return getBindOptionsApi();
  }

  // country verify
  public static countryVerify(data: { device: string; countryId: string }) {
    return countryVerifyApi(data);
  }
}

export { SecurityVerify };
