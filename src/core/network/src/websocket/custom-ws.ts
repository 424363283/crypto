import { Markets, MarkteDetail, OrderBook, RecentTrade } from '@/core/shared';
import { NetWorkInfo } from '@/core/utils/src/network-info';
import { WorkerStore } from '@/core/workers';
import { SUBSCRIBE_TYPES } from '../hooks/use-ws';

export enum wsType {
  'SPOT_LITE' = 'SPOT&LITE',
  'SWAP' = 'SWAP',
  'SWAP_SL' = 'SWAP_SL',
}

class CustomWebSocket {
  private ws?: WebSocket;
  private type: wsType;
  private urls: Array<string> = [];
  private index: number = 0;
  private debug: boolean = true;
  private messages: Array<any> = []; // 消息队列，用于重连时发送消息
  private forceClose: boolean = false; // 是否强制关闭ws
  private isOpen: boolean = false; // ws是否连接成功
  private currentUrl: string = ''; // 当前连接的url
  private isHeartbeatClose: boolean = false; // 是否检测触发重连

  constructor(urls: Array<string>, type: wsType) {
    this.type = type;
    this.urls = urls;
    this.connect();
  }

  public setMessageHandler(handler: (response: any) => void): void {
    this.onmessage = handler;
}
  private connect(): void {
    if (this.ws) return;

    this.ws = new WebSocket(this.getWsUrl());
    this.ws.onclose = this.onclose.bind(this);
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onopen = this.onopen.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
  }

  private onmessage(event: MessageEvent): void {


    WorkerStore.wsWorker.parse(event.data).then((data: any) => {
      if (data.cmid === SUBSCRIBE_TYPES.ws3001) {
        Markets.onMessage(data, this.type);
      }
      if (data.cmid === SUBSCRIBE_TYPES.ws4001) {
        WorkerStore.wsWorker.parse(data.data).then((_data: any) => {
          // _data.symbol = _data.symbol.replace(/^[im]/, '');
          data.data = _data;
          MarkteDetail.onMessage(data);
        });
      }
      if (data.cmid === SUBSCRIBE_TYPES.ws6001) {
        RecentTrade.onMessage(data);
      }
      if (data.cmid === SUBSCRIBE_TYPES.ws7001) {
        OrderBook.onMessage(data);
      }
      if (data.cmid === SUBSCRIBE_TYPES.ws3000) {
        this.heartbeat();
      }
    });
  }

  private onopen(event: Event): void {
    if ([wsType.SWAP, wsType.SWAP_SL].includes(this.type)) {
      NetWorkInfo.getInstance().setWsSwapOnLine(true);
    }
    if (this.type === wsType.SPOT_LITE) {
      NetWorkInfo.getInstance().setWsSpotOnLine(true);
    }
    this.log('ws open', event);
    this.isOpen = true;
    this.heartbeat();
    this.messages.forEach((data) => this.sendMessage(data));
  }

  private onclose(event: CloseEvent): void {
    if ([wsType.SWAP, wsType.SWAP_SL].includes(this.type)) {
      NetWorkInfo.getInstance().setWsSwapOnLine(false);
    }
    if (this.type === wsType.SPOT_LITE) {
      NetWorkInfo.getInstance().setWsSpotOnLine(false);
    }
    this.log('ws close', event);
    this.ws = undefined;
    this.isOpen = false;
    if (!this.forceClose) {
      this.isHeartbeatClose = false;
      this.index++;
      setTimeout(() => {
        this.connect();
      }, 1000 * this.index);
    }
  }

  private onerror(event: Event): void {
    this.log('ws error', event);
    // this.ws = undefined;
    // this.isOpen = false;
    // if (!this.forceClose) {
    //   this.index++;
    //   setTimeout(() => {
    //     this.connect();
    //   }, 1000 * this.index);
    // }
  }

  private sendMessage(data: any): void {
    if (!this.ws) return;
    if (this.ws.readyState !== 1) return;
    try {
      if (data.cmid === SUBSCRIBE_TYPES.ws3001 && [wsType.SPOT_LITE, wsType.SWAP].includes(this.type)) {
        const hour = data.data;
        fetch(`${this.wsTohttps(this.currentUrl)}/market?preHour=${hour}`)
          .then((res) => res.json())
          .then(({ data }) => {
            Markets.onMessage({ cmid: SUBSCRIBE_TYPES.ws3001, data: data }, this.type);
          });
      }
    } catch (e) {
      console.log(e);
    }

    if (data.cmid === SUBSCRIBE_TYPES.ws4001) {
      this.ws?.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            cmid: SUBSCRIBE_TYPES.ws6001,
            type: 'init',
            data: { id: data.symbols, url: this.wsTohttps(this.currentUrl) },
          }),
        })
      );
      this.ws?.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            cmid: SUBSCRIBE_TYPES.ws7001,
            type: 'init',
            data: { id: data.symbols, url: this.wsTohttps(this.currentUrl) },
          }),
        })
      );
    }
    this.ws?.send(JSON.stringify(data));
  }

  private getWsUrl(): string {
    this.currentUrl = this.urls[this.index % this.urls.length];
    return `${this.currentUrl}/wsquote`;
  }

  private wsTohttps(url: string): string {
    return url.replace('wss://', 'https://').replace('ws://', 'http://');
  }

  private log(str: string, ...args: any[]): void {
    this.debug && console.log(`%c${this.type}`, 'color: red', str, ...args);
  }

  private timer: any = null;
  private heartbeat(): void {
    if (!this.isOpen) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.ws?.close();
    }, 15 * 1000);
    this.sendMessage({ cmid: SUBSCRIBE_TYPES.ws3000 });
  }

  public send(data: { cmid: SUBSCRIBE_TYPES; [key: string]: any }): void {
    if (!data) return;
    this.isOpen && this.sendMessage(data);

    // 接收到消息后，将消息放入消息队列,等待连接成功后发送，如果是取消订阅消息，则将对应的订阅消息从消息队列中删除
    if (String(data.cmid).substr(-1) === '2') {
      const index = this.messages.findIndex(({ cmid }) => +cmid === +data.cmid - 1);
      if (index !== -1) this.messages.splice(index, 1);
      return;
    }
    const index = this.messages.findIndex(({ cmid }) => cmid === data.cmid);
    if (index === -1) {
      this.messages.push(data);
    } else {
      this.messages.splice(index, 1);
      this.messages.push(data);
    }
  }

  public close(): void {
    this.forceClose = true;
    this.ws?.close();
  }
}

export { CustomWebSocket };
