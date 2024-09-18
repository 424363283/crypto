import { AppContextState, useAppContext } from '@/core/store';
import { DependencyList, useEffect } from 'react';

type Callback = (appContext: AppContextState) => Promise<void | (() => void)>;

export function useLoginEffect(callback: Callback, dep: DependencyList = []) {
  const appContext = useAppContext();
  useEffect(() => {
    let unmount = () => {};

    if (appContext.isLogin) {
      (async () => {
        const func = await callback(appContext);
        if (typeof func === 'function') unmount = func;
      })();
    }

    return unmount;
  }, [appContext.isLogin, ...dep]);
}
