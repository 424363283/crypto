import { http } from './base';

export function post(url: string, data?: any, timeout?: number, options?: any) {
  const controller = new AbortController();

  return {
    start: () => http({ url, method: 'post', data, timeout, options }).catch(error => error.toJSON()),
    /** 不进行异常捕获 */
    start2: () => http({ url, method: 'post', data, timeout, options }),
    abort: controller.abort,
    signal: controller.signal
  };
}
