import { getCookie } from '@/core/utils/src/cookie';
import { getUrlQueryParams } from '@/core/utils/src/get';
import { useSyncExternalStore } from 'react';
import { MyData } from '.';
import { setDataSupportSubscribe, setStore } from './store';

type VoidFn = () => void;
type AnyFn = (...args: unknown[]) => unknown;
type Updater<V> = (val: V) => V;

export type Data = Record<string, unknown>;
type State<T> = {
  [K in keyof T]: {
    subscribe: (listener: VoidFn) => VoidFn;
    unsubscribe: (listener: VoidFn) => void;
    getSnapshot: () => T[K];
    useSnapshot: () => T[K];
    setSnapshot: (val: T[K]) => void;
  };
};
type Methods<T> = Record<keyof T, AnyFn>;
type Setter<T> = <K extends keyof T>(key: K, updater: Updater<T[K]>) => void;
export type Store<T> = T & Setter<T> & { getSnapshot: Function; subscribe: Function };

const __DEV__ = process.env.NODE_ENV !== 'production';
const __DEV_ERR__ = (msg: string) => {
  if (__DEV__) {
    throw new Error(msg);
  }
};

let isInMethod = false;
let run = (fn: VoidFn) => {
  fn();
};

const AUTH_KEY = '____auth____';
export const CACHED_KEY = '_initCached';
export const authKeyIsMatch = (data: any) => data?.[AUTH_KEY] === getTokenKeyString();
export const getTokenKeyString = () => (getUrlQueryParams('token') || getCookie('TOKEN') || '').substring(0, 7);
export type Options = { nameSpace?: string; nossr?: boolean; auth?: boolean; whileList?: string[] };
const myresso = <T extends Data>(data: T, options: Options = {}): Store<T & MyData> => {
  let { nameSpace, whileList } = options;
  if (whileList) {
    whileList = [...whileList, AUTH_KEY];
  }

  if (__DEV__ && Object.prototype.toString.call(data) !== '[object Object]') {
    throw new Error('object required');
  }

  let state: State<T> = {} as State<T>;
  const methods: Methods<T> = {} as Methods<T>;

  /**
   * nameSpace
   * 缓存覆盖
   */
  if (options.nossr) {
    try {
      const cacheData = localStorage.getItem(nameSpace as string) || '{}';
      if (cacheData) {
        const parseData = JSON.parse(cacheData) || {};
        Object.keys(parseData).forEach((key) => {
          if (whileList && !whileList.includes(key)) {
            delete data[key];
          }
        });
        data = {
          ...data,
          ...parseData,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  setDataSupportSubscribe(data);

  Object.keys(data).forEach((key: keyof T) => {
    const initVal = data[key];

    if (initVal instanceof Function) {
      methods[key] = (...args: unknown[]) => {
        isInMethod = true;
        const res = initVal(...args);
        isInMethod = false;
        return res;
      };
      return;
    }

    const listeners = new Set<VoidFn>();

    state[key] = {
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      unsubscribe(listener) {
        listeners.delete(listener);
      },
      getSnapshot: () => data[key],
      setSnapshot: (val) => {
        if (val !== data[key]) {
          data[key] = val;
          const next = { ...data };
          if (options.auth) {
            (next as any)[AUTH_KEY] = getTokenKeyString();
          }
          setStore(nameSpace, next, whileList);
          run(() => listeners.forEach((listener) => listener()));
        }
      },
      useSnapshot: () => {
        return useSyncExternalStore(state[key].subscribe, state[key].getSnapshot, state[key].getSnapshot);
      },
    };
  });

  const setState = (key: keyof T, val: T[keyof T] | Updater<T[keyof T]>) => {
    if (key in data) {
      if (key in state) {
        const newVal = val instanceof Function ? val(data[key]) : val;
        state[key].setSnapshot(newVal);
      } else {
        __DEV_ERR__(`\`${key as string}\` is a method, can not update`);
      }
    } else {
      __DEV_ERR__(`\`${key as string}\` is not initialized in store`);
    }
  };

  let _initCached = false;

  return new Proxy(
    (() => undefined) as unknown as Store<T & MyData>,
    {
      get: (_, key: keyof T) => {
        if (key == 'initCache') {
          return () => {
            if (typeof window !== 'undefined' && !_initCached) {
              _initCached = true;
              if (nameSpace && localStorage[nameSpace]) {
                try {
                  const cacheData = JSON.parse(localStorage[nameSpace]);
                  // auth start token不同不读缓存
                  if (options.auth) {
                    if (cacheData[AUTH_KEY] !== getTokenKeyString()) {
                      return;
                    }
                  }
                  if (cacheData[AUTH_KEY] !== undefined) {
                    delete cacheData[AUTH_KEY];
                  }
                  if (typeof cacheData === 'object' && cacheData !== null) {
                    Object.keys(cacheData).forEach((key: keyof T) => setState(key, cacheData[key]));
                  }
                } catch (e) {
                  console.error(e);
                }
              }
            }
            (state as any)[CACHED_KEY] = true;
          };
        }
        if (key == 'clearCache') {
          return (key?: keyof T) => {
            if (key) {
              if (nameSpace && localStorage[nameSpace]) {
                const cacheData = JSON.parse(localStorage[nameSpace]);
                delete cacheData[key];
                localStorage[nameSpace] = JSON.stringify(cacheData);
                // setState(key, data[key]);
              }
            } else {
              if (nameSpace && localStorage[nameSpace]) {
                localStorage.removeItem(nameSpace);
                // Object.keys(data).forEach((key: keyof T) => setState(key, data[key]));
              }
            }
          };
        }

        if (key == 'subscribe') {
          return (key: keyof T, listener: VoidFn) => {
            state[key].subscribe(listener);
            return () => state[key].unsubscribe(listener);
          };
        }

        if (key == 'getSnapshot') {
          return (key: string) => data[key];
        }

        if (key == 'log') {
          return data;
        }

        if (key === CACHED_KEY) {
          return state[CACHED_KEY];
        }

        if (key in methods) {
          return methods[key];
        }

        if (isInMethod) {
          return data[key];
        }

        try {
          return state[key].useSnapshot();
        } catch (err) {
          return data[key];
        }
      },
      set: (_, key: keyof T, val: T[keyof T]) => {
        setState(key, val);

        return true;
      },
      apply: (_, __, [key, updater]: [keyof T, Updater<T[keyof T]>]) => {
        if (typeof updater === 'function') {
          setState(key, updater);
        } else {
          __DEV_ERR__(`updater for \`${key as string}\` should be a function`);
        }
      },
    } as ProxyHandler<Store<T & MyData>>
  );
};

myresso.config = ({ batch }: { batch: typeof run }) => {
  run = batch;
};

export { myresso };
