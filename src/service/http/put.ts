import { http } from './base';

export function put(url: string, data?: any, timeout?: number, options?: any) {
  const controller = new AbortController();

  return {
    start: () => http({ url, method: 'put', data, timeout, options }).catch(error => error.toJSON()),
    abort: controller.abort,
    signal: controller.signal
  };
}
