import React from 'react';

//  枚举原生方法
export enum NativeAppMethod {
  // 原生页面回退
  BACK = 'back',
  // 指定页面跳转
  ROUTE_CHANGE = 'route_change',
}

// 枚举原生页面
export enum NativeAppRoute {
  // 登录页面
  LOGIN = '/login',
  // 现货交易页面
  SPOTTRADE = '/tradeEntrance/spot',
  // 充值页面
  DEPOSIT = '/fiatPurchase',
  // 快捷卖币
  FIATPURCHASE = '/fiatPurchase',
  // 合约交易
  SWAPTRADE = '/tradeEntrance/PerpetualUOrder',
  // 奖励中心
  NOVICETASK = '/novice-task',
}

interface NativeAppParams {
  // token
  token: string | null;
  // 平台
  platform: 'app' | null;
  // 主题
  theme: 'dark' | 'light' | null;
  // 皮肤
  skin: 'primary' | 'blue' | null;
  // 是否是原生APP
  isNativeAPP: boolean;
}

// 定义对应的枚举方法 对应原生APP数据
interface NativeAppData {
  [NativeAppMethod.BACK]: null;
  [NativeAppMethod.ROUTE_CHANGE]: {
    pathname: NativeAppRoute;
    // app内置传递的参数 暂时不用
    state?: any;
  };
}

/// 定义调用原生方法的方法
type callNativeMethod = <T extends NativeAppMethod>(method: NativeAppMethod, data: NativeAppData[T], cb?: Function) => void;

export const useNativeAPP = (): NativeAppParams & { callNativeMethod: callNativeMethod } => {
  const [params, setParams] = React.useState<NativeAppParams>({
    isNativeAPP: false,
    token: null,
    platform: null,
    theme: null,
    skin: null,
  });

  if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect;
  }

  React.useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') as NativeAppParams['token'];
    const platform = params.get('platform') as NativeAppParams['platform'];
    const theme = params.get('theme') as NativeAppParams['theme'];
    const skin = params.get('skin') as NativeAppParams['skin'];
    setParams({
      isNativeAPP: platform === 'app',
      token,
      platform,
      theme,
      skin,
    } as NativeAppParams);
  }, []);

  const _callNativeMethod: callNativeMethod = React.useCallback(
    (method, data, cb) => {
      try {
        if (!params.isNativeAPP) {
          cb?.();
        } else {
          window.flutterApp.postMessage(JSON.stringify({ method, data }));
        }
      } catch (e) {
        console.error('callNativeMethod error', e);
      }
    },
    [params.isNativeAPP]
  );

  return {
    ...params,
    callNativeMethod: _callNativeMethod,
  };
};
