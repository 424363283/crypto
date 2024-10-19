import { Group } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { isLite, isSpot, isSwap, isSwapSL } from '@/core/utils';
import { SUBSCRIBE_TYPES } from '../hooks/use-ws';
import { CustomWebSocket, wsType } from './custom-ws';

class WS {
  public static WsSpotLite?: CustomWebSocket;
  public static WsSwap?: CustomWebSocket;
  public static WsSwapSL?: CustomWebSocket;

  private static cmd3001: {
    [key: string]: string | string[];
  } = {};

  public static get timeOffset(): string {
    return localStorageApi.getItem(LOCAL_KEY.TIME_OFFSET_KEY) || '24';
  }

  private static id?: string; // 4001 id

  public static async subscribe3001(ids: string[], type: wsType): Promise<void> {
    const { spotQuoteDomains, swapQuoteDomains, swapSLQuoteDomains } = await Group.getInstance();
    const idsStr = ids.join(',');
    if (!idsStr) return;
    this.cmd3001[type] = ids;
    const data = { cmid: SUBSCRIBE_TYPES.ws3001, symbols: idsStr, data: WS.timeOffset } as any;
    if (type === wsType.SPOT_LITE) {
      // 现货不在需要币对订阅
      delete data.symbols;
      const ws = this.WsSpotLite || new CustomWebSocket(spotQuoteDomains, wsType.SPOT_LITE);
      ws?.send(data);
      this.WsSpotLite = ws;
    }
    if (type === wsType.SWAP) {
      // 永续不在需要币对订阅
      delete data.symbols;
      const ws = this.WsSwap || new CustomWebSocket(swapQuoteDomains, wsType.SWAP);
      ws?.send(data);
      this.WsSwap = ws;
    }
    if (type === wsType.SWAP_SL) {
      const ws = this.WsSwapSL || new CustomWebSocket(swapSLQuoteDomains, wsType.SWAP_SL);
      ws?.send(data);
      this.WsSwapSL = ws;
    }
  }

  public static async unsubscribe3001(ids: string[], type: wsType): Promise<void> {
    const idsStr = ids.join(',');
    if (!idsStr) return;
    const data = { cmid: SUBSCRIBE_TYPES.ws3002, symbols: idsStr, data: WS.timeOffset };
    if (type === wsType.SPOT_LITE) {
      this.WsSpotLite?.send(data);
      return;
    }
    if (type === wsType.SWAP) {
      this.WsSwap?.send(data);
      return;
    }
    if (type === wsType.SWAP_SL) {
      this.WsSwapSL?.send(data);
      return;
    }
  }

  public static async subscribe4001(ids: string[], r?: number, callback?: (response: any) => void): Promise<void> {
  // public static async subscribe4001(ids: string[], r?: number): Promise<void> {
    const id = ids.join(',');
    // if (WS.id === id) return console.log('4001-请勿重复订阅...', id);
    if (WS.id) await this.unsubscribe4001(WS.id);
    WS.id = id;
    const data = { cmid: SUBSCRIBE_TYPES.ws4001, symbols: id, r: r || 1, data: WS.timeOffset };

    if (isSwapSL(id)) {
      const { swapSLQuoteDomains } = await Group.getInstance();
     
      this.WsSwapSL = this.WsSwapSL || new CustomWebSocket(swapSLQuoteDomains, wsType.SWAP_SL);
      console.log("订阅数据1",this.WsSwapSL ,data)
      this.WsSwapSL?.send(data);
      return;
    }

    if (isSwap(id)) {
      const { swapQuoteDomains } = await Group.getInstance();
      this.WsSwap = this.WsSwap || new CustomWebSocket(swapQuoteDomains, wsType.SWAP);
      console.log("订阅数据2",this.WsSwap ,data)
      this.WsSwap?.send(data);
      return;
    }

    if (isSpot(id) || isLite(id)) {
      const { spotQuoteDomains } = await Group.getInstance();
      this.WsSpotLite = this.WsSpotLite || new CustomWebSocket(spotQuoteDomains, wsType.SPOT_LITE);
      console.log("订阅数据3",this.WsSpotLite ,data)
      this.WsSpotLite?.send(data);
      return;
    }
  }

  public static async unsubscribe4001(id?: string): Promise<void> {
    if (!WS.id) return;
    const data = { cmid: SUBSCRIBE_TYPES.ws4002, symbols: id || WS.id, data: WS.timeOffset };

    if (isSwap(data.symbols)) {
      this.WsSwap?.send(data);
    }

    if (isSpot(data.symbols) || isLite(data.symbols)) {
      this.WsSpotLite?.send(data);
    }

    if (isSwapSL(data.symbols)) {
      this.WsSwapSL?.send(data);
    }

    WS.id = undefined;
  }

  public static closeAll(): void {
    this.WsSpotLite?.close();
    this.WsSwap?.close();
    this.WsSwapSL?.close();
    WS.id = undefined;
  }

  public static async setTimeOffset(timeOffset: string): Promise<void> {
    localStorageApi.setItem(LOCAL_KEY.TIME_OFFSET_KEY, timeOffset);
    if (this.cmd3001) {
      Object.keys(this.cmd3001).forEach((key) => {
        const ids = this.cmd3001[key];
        if (Array.isArray(ids)) {
          this.subscribe3001(ids, key as wsType);
        }
      });
    }
    if (this.id) {
      this.subscribe4001(this.id.split(','));
    }
  }
}

export { WS, wsType };
