import { EXCHANGE_ID } from '@/constants';
import { api, http, operator } from '@/service';
import { getGlobalState } from '@/store/global';
import { isServerSideRender } from '@/utils';
import { useCallback, useEffect, useRef } from 'react';
import { useWebSocket } from './use-websocket';

const LIMIT = 1500;
export function useFutureDepthSources() {
  const { symbolSwapId } = getGlobalState();
  const depthIdRef = useRef(`depth${EXCHANGE_ID}.${symbolSwapId}`);

  const wsDataFormat = useCallback(({ current }: { current: any }) => {
    return current.data;
  }, []);
  const wsExtends = useCallback((data: { id: any }) => {
    return data.id;
  }, []);

  const httpAction = async () => {
    const symbol = EXCHANGE_ID + '.' + symbolSwapId.toUpperCase();
    const params = {
      body: {
        symbol,
        limit: LIMIT
      }
    };
    try {
      const response = await http({
        url: api.depth,
        method: 'get',
        options: params
      });
      if (response?.data?.code == 200) {
        operator.setData('depth_source', response?.data.data, 'depth' + symbol, 1);
      }
    } catch {

    }
  };


  const { cancel: depthWsCancel } = useWebSocket({
    name: 'depth_source',
    path: api.qws,
    status: 'loading',
    format: wsDataFormat,
    extends: wsExtends,
    httpAction,
    FourExtends: data => data,
    subscription: {
      id: depthIdRef.current,
      topic: 'depth',
      event: 'sub',
      symbol: EXCHANGE_ID + '.' + symbolSwapId,
      limit: LIMIT,
      params: {
        binary: isServerSideRender() ? false : !Boolean(window?.localStorage?.ws_binary),
      }
    }
  });


  useEffect(() => {
    depthIdRef.current = `depth${EXCHANGE_ID}.${symbolSwapId}`;
  }, [symbolSwapId]);

  return () => {
    depthWsCancel(depthIdRef.current);
    console.log(
      '---- useFutureDepthSource ws unsubscribe by destory ----',
      depthIdRef.current,
    );
  };
}
