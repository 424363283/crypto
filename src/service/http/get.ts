import { http } from './base';

export function get(url: string, timeout?: number, options?: any) {
  const controller = new AbortController();

  return {
    start: () => http({ url, method: 'get', timeout, options }).catch(error => error.toJSON()),
    /** 不进行异常捕获 */
    start2: () => http({ url, method: 'get', timeout, options }),
    abort: controller.abort,
    signal: controller.signal
  };
}
