import axios from 'axios';
import { getOptions } from './options';

export function http({
  timeout = 60 * 1000,
  method,
  url,
  data,
  options
}: {
  data?: any;
  timeout?: number;
  options?: any;
  method: string;
  url: string;
}) {
  const { url: schema, options: opts } = getOptions(url, { ...options, data, method });
  axios.defaults.withCredentials = true;
  // 初始化axios 实例
  const instance = axios.create();

  /*************** 响应拦截 -开始***************/
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error?.response?.status === 400 && error?.response?.data?.hasOwnProperty('msg')) {
        // status === 400 && 有响应对象, 格式化响应内容
        const resData = {
          message: error?.response?.data.msg,
          ...error?.response?.data
        };
        error = {
          ...resData,
          toJSON: () => resData
        };
      }
      return Promise.reject(error);
    }
  );
  /*************** 响应拦截 - 结束***************/

  return instance({
    ...opts,
    data,
    method,
    url: schema,
    timeout,
    headers: {
      ...opts.headers
    }
  });
}
