import { useEffect, useRef, useState } from 'react';
import isBoolean from 'lodash/isBoolean';
import identity from 'lodash/identity';
import noop from 'lodash/noop';
import { WSService, operator } from '@/service';
import type { Subscription } from '@/service';

/**
 * @param {string} name: 需要订阅的 websocket 地址，等价于之前的 WSDATA.getData(name);
 * @param {string} path: api 地址
 * @param {Subscription} subscription：订阅信息，等价于之前的 ws 的订阅信息
 * @param {any} data 初始化数据内容
 * @param {string} status ws 的状态 loading | success | failed
 * @param {boolean} force 是否要强制更新 ws，即触发重新订阅
 * @param {function} httpAction ws 降级，https请求
 * @param {function} format 对 ws 数据格式化方法
 * @param {function} extends setData 第三个扩展参数
 * @param {function} FourExtends setData 第四个扩展参数默认是1
 * @param {function} wsCallback ws 链接成功回调
 * @param {function} filter 过滤逻辑，因为 ws 中会下发所有的 symbol 标的，建议只关注当前页面中需要的标的，避免全量更新而引发性能问题
 */
export function useWebSocket(init: {
  name?: string;
  path: string;
  subscription: Subscription;
  data?: any;
  status?: string;
  force?: boolean;
  httpAction: (data: any) => any;
  format?: (data: any) => any;
  extends?: (data: any) => any;
  FourExtends?: (data: any) => any;
  wsCallback?: (data: any) => any;
  filter?: (data: any) => any;
}) {
  const {
    data: initData = [],
    path,
    subscription,
    name,
    status: initStatus = 'loading',
    force,
    httpAction,
    format = identity,
    extends: extendsFunc,
    FourExtends,
    wsCallback,
    filter = () => true
  } = init;
  const [content, setContent] = useState({ data: initData, status: initStatus });
  const cancelRef = useRef(noop);
  const wsRef = useRef<any>(null);
  if (!wsRef.current) {
    wsRef.current = path ? WSService(path) : undefined;
  }
  const ws = wsRef.current;
  // const ws = path ? WSService(path) : undefined;

  useEffect(() => {
    if (!ws) return;
    const cancel = ws.subscribe(
      subscription,
      httpAction || noop,
      (data: any) => {
        const previous = name ? operator?.getData(name) : {};
        const arr = format({ previous, current: data });
        const extendsId = extendsFunc ? extendsFunc(data) : null;
        const FourExtendsId = FourExtends ? FourExtends(data) : null;

        // ws返回的数据不一定都是数组
        if (subscription?.id && name) {
          operator.setData(name, arr, extendsId, FourExtendsId);
        }

        const d = name ? operator?.getData(name) : data;
        const needUpdate = filter({ source: data, current: d });

        if (needUpdate) {
          if (content.status !== 'complete') {
            setContent(state => ({ ...state, data: d, status: 'complete' }));
          } else if (content.data?.length !== d.length) {
            setContent(state => ({ ...state, data: d }));
          }
        }
      },
      (res: any) => {
        if (wsCallback) {
          wsCallback(res);
        }
      },
      isBoolean(force) ? force : !!operator?.getData?.(name || '')?.length
    );

    cancelRef.current = cancel;

    return () => {
      cancelRef.current = noop;
      cancel();
    };
  }, [force, name, subscription]);

  if (!path) {
    return { ws, data: initData, error: 'invalid path', status: 'error', cancel: cancelRef.current };
  }

  return { ...content, ws, cancel: cancelRef.current };
}
