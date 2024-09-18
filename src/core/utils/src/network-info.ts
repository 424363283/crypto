import { useEffect, useState } from 'react';

interface NWInfo {
  onLine: boolean;
  wsSwapMessagerOnLine: boolean;
  wsSwapOnLine: boolean;
  wsSpotOnLine: boolean;
}

export class NetWorkInfo {
  private static _instance: NetWorkInfo;

  private _onLine: boolean = false;
  private _wsSwapOnLine: boolean = false;
  private _wsSpotOnLine: boolean = false;
  private _wsSwapMessagerOnLine: boolean = false;

  private _infocallbacks: { [key: number]: (info: NWInfo) => void } = {};
  private _infocallbacksId = 0;

  private constructor() {
    this.setOnLine(navigator.onLine);
    window.addEventListener('online', () => this.setOnLine(navigator.onLine));
    window.addEventListener('offline', () => this.setOnLine(navigator.onLine));
  }

  public static getInstance(): NetWorkInfo {
    if (!this._instance) {
      this._instance = new NetWorkInfo();
    }
    return this._instance;
  }

  private _emit() {
    const info: NWInfo = {
      onLine: this._onLine,
      wsSwapOnLine: this._wsSwapOnLine,
      wsSpotOnLine: this._wsSpotOnLine,
      wsSwapMessagerOnLine: this._wsSwapMessagerOnLine,
    };
    
    for (let key in this._infocallbacks) {
      this._infocallbacks[key](info);
    }
  }

  private setOnLine(onLine: boolean) {
    this._onLine = onLine;
    this._emit();
  }

  public setWsSwapOnLine(onLine: boolean) {
    this._wsSwapOnLine = onLine;
    this._emit();
  }

  public setWsSpotOnLine(onLine: boolean) {
    this._wsSpotOnLine = onLine;
    this._emit();
  }

  public setWsSwapMessagerOnLine(onLine: boolean) {
    this._wsSwapMessagerOnLine = onLine;
    this._emit();
  }

  // 监听所有
  public on(func: (info: NWInfo) => void): number {
    let id = this._infocallbacksId++;
    this._infocallbacks[id] = func;
    this._emit();
    return id;
  }

  // 取消监听
  public off(id: number) {
    delete this._infocallbacks[id];
  }
}

export const useNetWorkInfo = () => {
  const [info, setInfo] = useState<NWInfo>();
  useEffect(() => {
    const netWorkInfo = NetWorkInfo.getInstance();
    const id = netWorkInfo.on((info: NWInfo) => {
      setInfo(info);
    });

    return () => {
      netWorkInfo.off(id);
    };
  }, []);

  return info;
};
