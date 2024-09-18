// 谷歌密钥
import { bindGoogleSecretApi, getGoogleSecretApi, unbindGoogleSecretApi } from '@/core/api';

class GoogleSecret {
  public static run() {}

  //获取谷歌秘钥
  public static getGoogleSecret() {
    return getGoogleSecretApi();
  }
  // 绑定谷歌secret
  public static bindGoogleSecret(data: { code: string; token: string; secret: string; reset: boolean }) {
    return bindGoogleSecretApi(data);
  }
  // 解绑谷歌secret
  public static unbindGoogleSecret(data: { token: string }) {
    return unbindGoogleSecretApi(data);
  }
}

export { GoogleSecret };
