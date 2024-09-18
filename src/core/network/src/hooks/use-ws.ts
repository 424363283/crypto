// import { DetailMap, MarketsMap, OrderBookMap, RecentTradeList } from '@/core/shared';
import { frameRun } from '@/core/utils/src/frame-run';
import { useEffect } from 'react';

export enum SUBSCRIBE_TYPES {
  'ws1000' = '1000', // 永续心跳
  'ws3000' = '3000', // 现货心跳
  'ws3001' = '3001', // 行情市场列表
  'ws3002' = '3002', // 行情市场列表退订
  'ws4001' = '4001', // 行情详情
  'ws4002' = '4002', // 行情详情退订
  'ws6001' = '6001', // 最新成交
  'ws7001' = '7001', // 深度
}

interface EventDetail {
  [SUBSCRIBE_TYPES.ws3001]: any;
  [SUBSCRIBE_TYPES.ws4001]: any;
  [SUBSCRIBE_TYPES.ws6001]: any;
  [SUBSCRIBE_TYPES.ws7001]: any;
}

export const useWs = <E extends EventDetail, K extends keyof E>(cmid: K, callback: (data: E[K]) => void, deps: any[] = [], isbgrun: boolean = false) => {
  useEffect(() => {
    const _callback: any = (e: CustomEvent<E[K]>) => {
      if (isbgrun) {
        callback(e.detail);
      } else {
        if (document.visibilityState === 'hidden') return;
        frameRun(() => callback(e.detail));
      }
    };
    window.addEventListener(cmid as string, _callback);
    return () => window.removeEventListener(cmid as string, _callback);
  }, deps);
};
