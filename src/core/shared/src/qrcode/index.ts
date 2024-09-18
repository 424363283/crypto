import { getCommonLoginQrCodeApi, postCommonCheckLoginQrCodeApi } from '@/core/api';
import { getUUID } from '@/core/utils';

interface QrCodeData {
  data: string;
}

interface CheckResult {
  status: number;
  data?: any;
  message: string;
}

class QrCodeLogin {
  private static _keepAlive: NodeJS.Timeout | null = null;
  private static _mounted = false;
  private static _random = '';
  public static qrcode = '';

  // 获取二维码标识，参数：random, 随机32位字符串
  public static getQrcode(opts: any): Promise<QrCodeData> {
    QrCodeLogin._random = getUUID(32);
    return new Promise(async (resolve, reject) => {
      try {
        const data = await getCommonLoginQrCodeApi(`${this._random}`, opts);
        if (!data.data) {
          reject({ message: 'no qrcode' });
        } else {
          QrCodeLogin.qrcode = data.data;
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // 验证，轮询，1s一次
  public static keepAliveVerifyQrcode({ time = 1000 } = {}): Promise<CheckResult> {
    if (this._keepAlive) {
      clearTimeout(this._keepAlive);
    }
    if (!QrCodeLogin.qrcode) {
      return Promise.reject('请先调用： getQrcode 方法获取二维码');
    }
    this._mounted = true;
    return new Promise((resolve, reject) => QrCodeLogin._keepAliveTimer({ resolve, reject, time }));
  }

  // 轮训验证
  private static async _keepAliveTimer({ resolve, reject, time }: any) {
    if (!QrCodeLogin._mounted) {
      return;
    }
    try {
      const { data, message } = await postCommonCheckLoginQrCodeApi({
        random: QrCodeLogin._random,
        qrcode: QrCodeLogin.qrcode,
      });
      if (data) {
        // 验证状态：-1:二维码过期 0:未验证 1:成功
        if (+data.status === 0) {
          QrCodeLogin._keepAlive = setTimeout(this._keepAliveTimer.bind(this, { resolve, reject, time }), time);
        } else {
          // 停止
          QrCodeLogin.killKeepAliveTimer();
          resolve({ data, message });
        }
      } else {
        reject({ message });
      }
    } catch (error) {
      reject(error);
    }
  }

  // 强制停止轮训
  public static killKeepAliveTimer() {
    if (this._keepAlive) {
      clearTimeout(this._keepAlive);
      this._keepAlive = null;
      this._mounted = false;
    }
  }
}

export { QrCodeLogin };
