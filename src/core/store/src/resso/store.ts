import { LOCAL_KEY, localStorageApi } from '../local-storage';

export const setStore = (nameSpace?: string, data?: any, whileList?: string[]) => {
  if (typeof window === 'undefined') return;
  if (nameSpace) {
    try {
      localStorageApi.setItem(nameSpace as LOCAL_KEY, removeFunction(data, whileList));
    } catch (e) {
      // console.log(e);
    }
  }
};

// 移除函数
export function removeFunction<T extends Record<string, unknown>>(state: T, whileList?: string[]) {
  const _state = {} as T;
  Object.entries(state).forEach(([key, value]) => {
    if (typeof value !== 'function' && (!whileList ? true : whileList.includes(key))) {
      _state[key as keyof T] = value as T[keyof T];
    }
  });
  return _state;
}

export function setDataSupportSubscribe(data: any) {
  var cbs: Function[] = []; // 订阅列表
  /**
   * 订阅函数
   * @param {Function} cb 回掉函数
   */
  data.subscribe = (cb: Function) => {
    cbs.push(cb);
  };
  /**
   * 取消订阅函数
   * @param {Function} cb 回掉函数
   */
  data.unsubscribe = (cb: Function) => {
    const i = cbs.indexOf(cb);
    if (i !== -1) cbs.splice(i, 1);
  };
}
