import { getCookie } from '@/core/utils';
import { SWAP_SUBSCRIBE_TYPES, WS } from './messager';

export class SwapMessagerWs {
  private static _instance: WS;

  public static getInstance(): WS {
    if (!this._instance) this._instance = new WS();
    return this._instance;
  }

  private static _symbols1050: string;

  // 1050订阅
  public static subscribeFlagPrice(symbols: string): void {
    // if (this._symbols1050 == symbols) {
    //   return;
    // } else {
    //   this.unsubscribe1050();
    //   this._symbols1050 = symbols;
    // }
     
    this.getInstance().send({
        method: SWAP_SUBSCRIBE_TYPES.ws_method_subscribe,
        params: [{
          channel:"flagprice_list",
        }]
      });
  }

  // 1050取消订阅
  public static unsubscribeFlagPrice(): void {
    // if (!this._symbols1050) return;
    this.getInstance().send({
      method: SWAP_SUBSCRIBE_TYPES.ws_method_unsubscribe,
      params: [{
        channel: SWAP_SUBSCRIBE_TYPES.ws_subscribe_flagprice_list,
      }]
    });
    this._symbols1050 = '';
  }

  // 1060订阅
  public static subscribe1060(): void {
     
    this.getInstance().send({
      method: SWAP_SUBSCRIBE_TYPES.ws_method_login,
      params: [{
        token:getCookie('TOKEN'),
        timestamp:new Date().getTime()
      }]
    }); 
  }

  // 1060取消订阅
  public static unsubscribe1060(): void {
    // this.getInstance().send({
    //   client: 'web',
    //   cancel: true,
    //   cmid: SWAP_SUBSCRIBE_TYPES.ws1061,
    //   event: 'PP_POSITION',
    // });
  }
}
