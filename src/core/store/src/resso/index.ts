import { useEffect } from 'react';
import { Data, myresso, Options, Store } from './resso';
export { authKeyIsMatch, getTokenKeyString } from './resso';
export type { Store } from './resso';

export interface MyData extends Data {
  initCache: Function;
  clearCache: Function;
}

export const resso = <T extends Data>(data: T, options: Options = {}): Store<T & MyData> => {
  return myresso<T>(data, options);
};

export const useResso = <T>(store: T & MyData) => {
  useEffect(() => {
    store.initCache();
  }, []);
  return store;
};
