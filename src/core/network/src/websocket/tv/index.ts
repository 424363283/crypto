import { getCookie } from '@/core/utils';
import { TV_SUBSCRIBE_TYPES, WS } from './socket';

export class TvSocketWs {
  private static _instance: WS;

  public static getInstance(): WS {
    if (!this._instance) this._instance = new WS();
    return this._instance;
  }

  private static _data: string;

  // playing 订阅
  public static subscribePlaying(data: any): void {
    
    this.getInstance().send({
        method: TV_SUBSCRIBE_TYPES.ws_method_subscribe,
        params: [
            {
                "channel": "playing",
                "vid": "991502511808348160",
                "tvType": "1",
                "playName": "正片",
                "playTime": "5629",
                "totalTime": "10000",
                "loadTime": "10"
            }
        ]
      });
  }

  // playing 取消订阅
  public static unsubscribePlaying(data: any): void {
    this.getInstance().send({
      method: TV_SUBSCRIBE_TYPES.ws_method_unsubscribe,
      params: [
          {
              "channel": "playing",
              "vid": "991502511808348160",
              "tvType": "1",
              "playName": "正片",
              "playTime": "5629",
              "totalTime": "10000",
              "loadTime": "10"
          }
      ]
    });
  }

  // login  登录
  public static login(): void {
     
    this.getInstance().send({
      method: TV_SUBSCRIBE_TYPES.ws_method_login,
      params: [{
        token:getCookie('TOKEN'),
        timestamp:new Date().getTime(),
        device:"h5",
        deviceId:new Date().getTime(),
      }]
    }); 
  }
 
}
