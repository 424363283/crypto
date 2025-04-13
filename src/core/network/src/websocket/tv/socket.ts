import { isSwapDemo } from '@/core/utils/src/is';
import { NetWorkInfo } from '@/core/utils/src/network-info';
import { WorkerStore } from '@/core/workers';

export enum TV_SUBSCRIBE_TYPES {
  ws1000 = '1000', // 心跳
  ws_method_heart = 'heart', // 心跳

  ws1050 = '1050', // 订阅交易对(标记价格等)
  ws_method_unsubscribe = 'unsubscribe', 
  ws_method_subscribe = 'subscribe', 
  ws_subscribe_playing = 'playing', 
 
  ws_method_login = 'login', 
  ws_subscribe_position = 'position',  
}

class WS {
  private ws?: WebSocket;
  private debug: boolean = true;
  private messages: Array<any> = []; // 消息队列，用于重连时发送消息
  private forceClose: boolean = false; // 是否强制关闭ws
  private isOpen: boolean = false; // ws是否连接成功
  private index: number = 0;
  private type: string = 'tv-socket';
  private wsFlagPriceMap: { [key: string]: any } = {};

  constructor() {
    this.connect();
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
      if (data.event === TV_SUBSCRIBE_TYPES.ws_method_heart) {
        setTimeout(() => this.heartbeat(), 5000);
      }
      if(data.event == TV_SUBSCRIBE_TYPES.ws_method_subscribe){
        
         return;
      }
      if(data.event == TV_SUBSCRIBE_TYPES.ws_method_unsubscribe){
        
        return;
      }

      if (data.event === TV_SUBSCRIBE_TYPES.ws_method_login) {
        if(Number(data.code) == 0){

          // 发起position订阅 
          // this.send({
          //   method: TV_SUBSCRIBE_TYPES.ws_method_subscribe,
          //   params: [{
          //     channel: TV_SUBSCRIBE_TYPES.ws_subscribe_position,
          //   }]
          // });  
        }else{

        }
        return;
        //  window.dispatchEvent(new CustomEvent(TV_SUBSCRIBE_TYPES.ws_method_login, { detail: data }));
      }

      if(data.params && data.params.channel == TV_SUBSCRIBE_TYPES.ws_subscribe_playing){
          
          let result = [];
          try {
            result =  data.data;
            result.forEach(({ c: currentPrice, p: indexPrice, r: fundRate, s: symbol }: any) => {
              this.wsFlagPriceMap[symbol] = { currentPrice, fundRate, indexPrice };
            });
          } catch (e) {
            
          }
          window.dispatchEvent(new CustomEvent(TV_SUBSCRIBE_TYPES.ws_subscribe_playing, { detail: this.wsFlagPriceMap }));
      }
      
    });
  }

  private onopen(event: Event): void {
    NetWorkInfo.getInstance().setWsSwapMessagerOnLine(true);
    this.log('>>tv socket ws open', event);
    this.isOpen = true;
    this.heartbeat();
    this.messages.forEach((data) => this.sendMessage(data));
  }

  private onclose(event: CloseEvent): void {
    NetWorkInfo.getInstance().setWsSwapMessagerOnLine(false);
    this.log('>>tv socket ws close', event);
    this.ws = undefined;
    this.isOpen = false;
    if (!this.forceClose) {
      this.index++;
      setTimeout(() => {
        this.connect();
      }, 1000 * this.index);
    }
  }

  private onerror(event: Event): void {
    this.log('>>tv socket ws error', event);
    this.ws = undefined;
    this.isOpen = false;
    if (!this.forceClose) {
      this.index++;
      setTimeout(() => {
        this.connect();
      }, 1000 * this.index);
    }
  }

  private sendMessage(data: any): void {
    if (!this.ws) return;
    if (this.ws.readyState !== 1) return;
    this.ws?.send(JSON.stringify(data));
  }

  private getWsUrl(): string {
    const path =  'api/tv/socket';
    if (process.env.NODE_ENV === 'development') {
      return `wss://dev-swap.83uvgv.com/${path}`;
    }
    return `wss://${window.location.host}/${path}`;
  }

  private log(str: string, ...args: any[]): void {
    this.debug && console.log(`%c${this.type}`, 'color: red', str, ...args);
  }

  private heartbeat(): void {
    if (!this.isOpen) return;
    this.sendMessage({ 'method': TV_SUBSCRIBE_TYPES.ws_method_heart });
  }

  public send(data: { method: TV_SUBSCRIBE_TYPES; [key: string]: any }): void {
    if (!data) return;
    this.isOpen && this.sendMessage(data);

    // 接收到消息后，将消息放入消息队列,等待连接成功后发送，如果是取消订阅消息，则将对应的订阅消息从消息队列中删除
    if (String(data.cmid).substr(-1) === '1') {
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

export { WS };
