import { useMemo, useCallback } from 'react';

import { EXCHANGE_ID } from '@/constants';
import { api, http, operator } from '@/service';
import { isServerSideRender } from '@/utils';
import { useWebSocket } from '../../../hooks/use-websocket';
import { ALL_RESOLUTION_INFO, KLinePriceType } from '@/components/KLine/types';

interface UseKLineSourceProps {
  symbolSwapId: string;
  indexToken: string
  kLineResolution: string;
  kLinePriceType: KLinePriceType;
}

export function useKLineSource(props: UseKLineSourceProps) {

  const { symbolSwapId, kLineResolution, kLinePriceType, indexToken } = props;

  const interval = useMemo(() => {
    const resolutionInfo = ALL_RESOLUTION_INFO.find(item => item.resolution === kLineResolution);
    return resolutionInfo!.tvRes;
  }, [props.kLineResolution]);

  const wsDataFormat = ({ current }: { current: any }) => current.data;
  const wsExtends = (data: any) => data.id;

  const id = useMemo(() => {
    return kLinePriceType === KLinePriceType.Last ? `kline_${EXCHANGE_ID}${symbolSwapId}_${interval}` : `indexKline_${symbolSwapId}_${interval}`;
  }, [
    interval,
    symbolSwapId,
    indexToken,
    kLinePriceType
  ]);

  const subscription = useMemo(() => {
    if (kLinePriceType === KLinePriceType.Last) {
      return {
        id,
        topic: `kline_${interval}`,
        event: 'sub',
        symbol: EXCHANGE_ID + '.' + symbolSwapId,
        params: {
          binary: isServerSideRender() ? false : !Boolean(window?.localStorage?.ws_binary),
          klineType: interval,
          limit: 1500
        }
      };
    }
    return {
      id,
      topic: `indexKline_${interval}`,
      event: 'sub',
      symbol: indexToken,
      params: {
        binary: isServerSideRender() ? false : !Boolean(window?.localStorage?.ws_binary),
        limit: 1500
      }
    };
  }, [
    id,
    interval,
    symbolSwapId,
    indexToken,
    kLinePriceType
  ]);

  const httpAction = useCallback(async () => {
    const isLast = kLinePriceType === KLinePriceType.Last;
    let url;
    let body;
    if (isLast) {
      url = api.kline_history;
      body = {
        symbol: EXCHANGE_ID + '.' + symbolSwapId.toUpperCase(),
        interval,
        id: EXCHANGE_ID + symbolSwapId,
        from: '',
        to: '',
        limit: 1 // 默认写的固定值
      };
    } else {
      url = api.index_kline;
      body = {
        symbol: indexToken,
        interval,
        from: '',
        to: '',
        limit: 1 // 默认写的固定值
      };
    }
    try {
      const response = await http({ url, method: 'get', options: { body }});
      if (response?.data?.code == 200) {
        operator.setData(isLast ? 'kline_source' : 'indexKline_source', response?.data.data, id);
      }
    } catch {
    }
  }, [id, interval, symbolSwapId, indexToken, kLinePriceType]);

  const { cancel } = useWebSocket({
    name: kLinePriceType === KLinePriceType.Last ? 'kline_source' : 'indexKline_source',
    path: api.qws,
    status: 'loading',
    format: wsDataFormat,
    extends: wsExtends,
    wsCallback: () => { },
    httpAction,
    FourExtends: data => {
      return data.f;
    },
    subscription
  });
  return cancel;
}
