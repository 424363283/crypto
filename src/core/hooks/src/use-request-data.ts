/**
 * @name useRequestData
 * @description 支持参数不变的情况下，缓存数据到内存中，组件或页面关闭则释放
 * @description 支持接口轮询，refreshInterval设置为大于0，则自动开启轮询
 * @description 支持接口错误提示和错误处理，减少错误处理相关的模板代码
 * @description 支持参数变化时，自动请求接口。参数变化支持深度比较
 */

import { LANG } from '@/core/i18n';
import { R } from '@/core/network';
import { http } from '@/core/network/src/http/request';
import { Account } from '@/core/shared';
import { message, Polling } from '@/core/utils';
import CryptoJS from 'crypto-js';
import { useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';

const RESPONSE_CACHE = new Map();
function generateKey(url: string, params: any) {
  const paramsString = JSON.stringify(params);
  const hashedKey = params ? url + '?' + CryptoJS.SHA256(paramsString).toString() : url;
  return hashedKey;
}
// 是否是get请求
function isApiNameIncludesGet(functionName: string): boolean {
  return functionName.includes('get') && !functionName.includes('post');
}

type UseRequestDataTuple<T, P = any> = [
  responseData: T,
  fetchData: (
    fetchParams?: P,
    cb?: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
    }
  ) => Promise<R<T>>,
  response: R<T>,
  isLoading: boolean
];
type RequestParams<T, P = any> = {
  successCallback?: (data: T) => void;
  errorCallback?: (error: any) => void;
  initData?: any;
  params?: P;
  refreshInterval?: number;
  fetchOnMount?: boolean | null;
  fetchOnMountWhileLogin?: boolean;
  useErrorMsg?: boolean;
  enableIsLoading?: boolean;
  enableCache?: boolean;
  revalidateOnReconnect?: boolean;
  mock?: boolean;
};
/**
 * useRequestData
 * @param requestFunction api function name
 * @param successCallback 成功回调函数，返回response.data
 * @param errorCallback 错误回调函数，返回整个response
 * @param useErrorMsg boolean;是否使用默认的错误toast提示
 * @param params 请求参数，当参数发生变化，会自动重新请求接口
 * @param initData 默认初始化数据，也可以在解构时传递 例如：const [paymentsList = []] = useRequestData(xxxApi)
 * @param fetchOnMount boolean;在组件挂载时是否自动请求接口，get请求自动开启；非get请求时，fetchOnMount 默认关闭
 * @param fetchOnMountWhileLogin boolean; default: false;是否已登录才自动拉取数据, 前提是fetchOnMount 为true.
 * @param refreshInterval number;刷新间隔 毫秒(ms)，default：0，大于0且fetchOnMount为true时，则自动开启接口轮询
 * @param enableIsLoading boolean;是否使用isLoading，default：false
 * @param enableCache boolean;是否开启缓存; 默认关闭
 * @param revalidateOnReconnect 浏览器恢复网络连接时自动重新验证,default: get请求默认开启（api name含有get），其他(post/delete)默认关闭;
 * @param mock?: boolean; 是否开启本地mock，线上环境自动关闭
 * @returns fetchData: (params?: any) => Promise<R<T>> 当在组件挂载时使用fetchData，fetchOnMount需要设置为false
 * @returns [data,fetchData,response,isLoading]
 */
function useRequestData<T, P = any>(requestFunction: (params: P) => Promise<R<T>>, { mock, successCallback, errorCallback, fetchOnMountWhileLogin = false, initData, params, enableCache = false, refreshInterval = 0, fetchOnMount, enableIsLoading = false, useErrorMsg = true, revalidateOnReconnect }: RequestParams<T, P> = {}): UseRequestDataTuple<T, P> {
  const [response, setResponse] = useState<R<T>>({
    message: '',
    code: 0,
    data: initData as T,
    headers: undefined,
  });
  /**
   * effectiveRevalidateOnReconnect: 断网重连时，get请求自动重连，非get 不会自动重连；
   * effectiveFetchOnMount: 组件挂载时，get请求自动请求数据，非get请求默认不会自动请求接口
   */
  const effectiveRevalidateOnReconnect = revalidateOnReconnect !== undefined ? revalidateOnReconnect : isApiNameIncludesGet(requestFunction.name);
  const effectiveFetchOnMount = fetchOnMount !== undefined ? fetchOnMount : isApiNameIncludesGet(requestFunction.name);
  const [isLoading, setIsLoading] = useState<boolean>(enableIsLoading && effectiveFetchOnMount ? true : false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const handleMockResponse = async () => {
    try {
      const mockFileName = `${requestFunction.name}.json`; // Assuming the mock file name correlates with function name
      enableIsLoading && setIsLoading(true);
      const mockResponse = await http.get(`/mock/${mockFileName}`);
      const result = mockResponse.data;
      if (mockResponse.code === 200) {
        if (successCallback) {
          successCallback(result);
        }
        setResponse(mockResponse);
        return mockResponse;
      } else {
        if (useErrorMsg) {
          message.error(result.message || 'Mock data fetch failure');
        }
        if (errorCallback) {
          errorCallback(mockResponse);
        }
      }
      return result;
    } catch (error) {
      console.error('Mock data fetch error', error);
      if (errorCallback) {
        errorCallback(error);
      }
    } finally {
      enableIsLoading && setIsLoading(false);
    }
  };
  const fetchData = useCallback(
    async (
      fetchParams = params,
      {
        onSuccess,
        onError,
      }: {
        onSuccess?: (data: T) => void;
        onError?: (error: any) => void;
      } = {}
    ) => {
      /* mock数据处理 */
      if (mock && isDevelopment) {
        return await handleMockResponse();
      }
      /* get请求缓存数据处理 */
      const cacheKey = generateKey(requestFunction?.name, fetchParams);
      enableIsLoading && setIsLoading(true);
      const shouldUseCache = enableCache && !refreshInterval && RESPONSE_CACHE.has(cacheKey);
      if (shouldUseCache) {
        const cachedResponse = RESPONSE_CACHE.get(cacheKey);
        if (successCallback) {
          successCallback(cachedResponse.data);
        }
        if (onSuccess) {
          onSuccess(cachedResponse.data);
        }
        setResponse(cachedResponse);
        enableIsLoading && setIsLoading(false);
        return cachedResponse;
      }
      try {
        const result = await requestFunction(fetchParams as P);
        if (result?.code === 200) {
          if (successCallback) {
            successCallback(result?.data);
          }
          if (onSuccess) {
            onSuccess(result?.data);
          }
          setResponse(result);
          if (enableCache && !refreshInterval) {
            RESPONSE_CACHE.set(cacheKey, result);
          }
          return result;
        } else {
          if (useErrorMsg) {
            message.error(result.message || LANG('系统繁忙，请稍后再试'));
          }
          if (errorCallback) {
            errorCallback(result);
          }
          if (onError) {
            onError(result);
          }
          return result;
        }
      } catch (e) {
        console.error('use-request-data error', requestFunction.name, e);
        if (errorCallback) {
          errorCallback(e);
        }
        if (onError) {
          onError(e);
        }
      } finally {
        enableIsLoading && setIsLoading(false);
      }
    },
    [requestFunction, params, successCallback, errorCallback, enableCache, refreshInterval, enableIsLoading, useErrorMsg]
  );
  // 断网重连处理
  useDeepCompareEffect(() => {
    const handleOnline = () => {
      if (effectiveRevalidateOnReconnect) {
        RESPONSE_CACHE.clear(); // 断网重连后清空缓存
        fetchData(params);
      }
    };
    if (effectiveRevalidateOnReconnect) {
      window.addEventListener('online', handleOnline);
    }
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [params, effectiveRevalidateOnReconnect, {}]);

  // 轮询和初始化拉取数据
  useDeepCompareEffect(() => {
    if (effectiveFetchOnMount) {
      if (refreshInterval > 0) {
        const polling = new Polling({
          interval: refreshInterval,
          callback: fetchData,
        });
        polling.start();
        return () => {
          polling.stop();
          if (enableCache) {
            RESPONSE_CACHE.clear(); // 清空缓存
          }
        };
      }
      const isLogin = Account.isLogin;
      if (fetchOnMountWhileLogin) {
        if (isLogin) {
          fetchData();
        } else {
          setIsLoading(false);
        }
        return;
      }
      fetchData();

      return () => RESPONSE_CACHE.clear();
    }
  }, [effectiveFetchOnMount, fetchOnMountWhileLogin, refreshInterval, params, {}]);

  return [response?.data, fetchData, response, isLoading];
}

export { useRequestData };
