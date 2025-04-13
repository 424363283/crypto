import { Lang } from '@/core/i18n/src';
import { DeviceInfo, toEAST8Time } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import axios from 'axios';
import { TO_GMT8_API } from './constants';

/**
 * 配置-AXIOS
 * @param {number} retry - 重连次数
 * @param {number} retryDelay - 重连时间间隔
 * @param {number} axiosConfig - axios配置
 */
const $Axios = ({ retry = Infinity, retryDelay = 1000, ...axiosConfig }) => {
  const _axios = axios.create(axiosConfig);
  // @ts-ignore
  _axios.defaults.retry = retry;
  // @ts-ignore
  _axios.defaults.retryDelay = retryDelay;
  _axios.interceptors.request.use(async (request: any) => {
    if (TO_GMT8_API.indexOf(request.url) > -1 && request?.params) {
      if (request.params?.createTimeGe) {
        request.params = {
          ...request.params,
          createTimeGe: toEAST8Time(request.params.createTimeGe)
        };
      }
      if (request.params?.createTimeLe) {
        request.params = {
          ...request.params,
          createTimeLe: toEAST8Time(request.params.createTimeLe)
        };
      }
    }

    if (isSwapDemo() && request.url.indexOf('/swap/') > -1) {
      console.log(request);
      request.url = request.url.replaceAll('/swap/', '/testnet/');
    }

    const lang = document.documentElement.lang;
    // 语言参数
    request.headers['Accept-Language'] = Lang.getAcceptLanguage(lang);
    // 设备信息
    request.headers['Device-Info'] = await DeviceInfo.getbase64();

    return request;
  });

  _axios.interceptors.response.use(
    response => {
      if (+response.data?.code === 401) {
        // Account.logout();
        return;
      }
      if (response.data instanceof Blob) {
        return new Promise((resolve: any, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader?.result === 'string') {
              try {
                const data = JSON.parse(reader?.result);
                resolve({ ...response, data, code: 500 });
              } catch {
                resolve({ ...response, data: response.data, code: 200 });
              }
            } else {
              resolve({ ...response, data: response.data, code: 200 });
            }
          };
          reader.readAsText(response.data);
        });
      }
      const { code = 500, message = 'http response error', data } = response.data || {};
      return {
        code,
        message,
        data,
        headers: response.headers
      } as any;
    },
    err => {
      const httpstatus = [404]; // 无需重联的状态码
      if (httpstatus.includes(err?.response?.status) || !err.response) return Promise.reject(err);
      const config = err.config;
      if (!config || !config.retry) return Promise.reject(err);
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= config.retry) return Promise.reject(err);
      config.__retryCount += 1;
      var backoff = new Promise<void>(resolve => {
        setTimeout(() => {
          config.retryDelay += 1000;
          resolve();
        }, config.retryDelay);
      });
      return backoff.then(() => _axios(config));
    }
  );
  return _axios;
};

const $axios = $Axios({});
export { $axios };
