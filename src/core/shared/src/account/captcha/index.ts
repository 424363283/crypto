/**
 * @fileoverview Captcha - 人机验证模块
 */

import { Loading } from '@/components/loading';
import { getCommonGt4StatusApi, postCommonGt4ValidateApi } from '@/core/api';
import { getUUID } from '@/core/utils';
import { gt4 } from './gt4';
import { ImgCode } from './img-code';

export interface CaptchaResponse {
  code: 200 | 500;
  message: any;
  data?: {
    token: string;
    vHash: string;
    geetest?: boolean; // gt4
    imgCode?: string; // 图形验证码
  };
}

class Captcha {
  private static _geetestLang = { zh: 'zho-tw', en: 'eng', vi: 'eng', ru: 'rus', ko: 'kor', id: 'ind', ja: 'jpn', pt: 'pon', tr: 'tr', es: 'es', fr: 'fra', th: 'eng', tl: 'tl' };

  // 开始验证方法
  public static async verification(): Promise<CaptchaResponse> {
    Loading.start();
    const { data } = await getCommonGt4StatusApi();
    if (data?.active) {
      const result = await new Promise<CaptchaResponse>((resolve) => {
        let key: string = 'en';
        try {
          const list = location.pathname.match(/^\/[a-z]{0,10}\//);
          key = list ? list[0].replace(/\//g, '') : 'en';
        } catch (e) {
          console.log(e);
        }
        Captcha.Geetest4(data.captchaId, Captcha._geetestLang[key as keyof typeof Captcha._geetestLang], resolve);
      });
      return result;
    } else {
      const result = await new Promise<CaptchaResponse>((resolve) => {
        Captcha.verifyImgCode(resolve);
      });
      return result;
    }
  }

  private static Geetest4(captchaId: string, lang: string, resolve: (res: CaptchaResponse) => void) {
    const Geetest = gt4();
    try {
      Geetest(
        {
          captchaId,
          nextWidth: '300px',
          product: 'bind',
          language: lang || 'en',
          protocol: 'https://',
          onError: (e: any) => {
            Loading.end();
            resolve({ code: 500, message: e });
          },
        },
        (o: any) => {
          o.onReady(() => {
            o.showCaptcha();
            Loading.end();
          });
          o.onNextReady(() => console.log('onNextReady'));
          o.onSuccess(async () => {
            Loading.start();
            const result = o.getValidate();
            const { data } = await postCommonGt4ValidateApi(result);
            Loading.end();
            resolve({
              code: 200,
              message: 'success',
              data: {
                token: data.token,
                vHash: getUUID(32),
                geetest: true,
              },
            });
          });
          o.onError((e: any) => {
            resolve({ code: 500, message: e });
            Loading.end();
          });
          o.onClose(Loading.end);
        }
      );
    } catch (e: any) {
      resolve({ code: 500, message: e });
      Loading.end();
    }
  }

  // 获取图形验证码
  private static async verifyImgCode(resolve: (res: CaptchaResponse) => void): Promise<any> {
    Loading.end();
    ImgCode.start(resolve);
  }
}

export { Captcha };
