import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
import { $axios } from './conf';

export interface R<T> {
  code: number;
  data: T;
  message: string;
  headers?: AxiosResponseHeaders;
}

async function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<R<T>> {
  const response = await $axios.get<any, R<T>>(url, config);
  return response;
}

async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R<T>> {
  const response = await $axios.post<any, R<T>>(url, data, config);
  return response;
}
/** delete 是保留关键词 */
async function del<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const deleteConfig = config || {};
  if (data) {
    deleteConfig.data = data;
  }
  const response = await $axios.delete<any, T>(url, deleteConfig);
  return response;
}

export const http = {
  get,
  post,
  del,
};
