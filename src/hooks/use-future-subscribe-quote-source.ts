import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useWebSocket } from './use-websocket';
import { ConfigContext } from '@/context';
import { EXCHANGE_ID } from '@/constants';
import { api, http, operator } from '@/service';
import { isServerSideRender } from '@/utils';
import { useParams } from 'next/navigation';

/** 更新币种最新行情 */
export function useFutureSubscribeQuoteSource() {
  const { appConfig } = useContext(ConfigContext);

  const { slug } = useParams();
  const symbolId = useMemo(() => slug?.length ? slug[slug.length - 1].replace(/USDT/, '-SWAP-$&') : '', [slug]);

  const wsDataFormat = useCallback(({ current, previous }: { current: any; previous: any }) => {
    return current.data.map((itemParent: any) => ({
      ...itemParent,
      previousC: previous[itemParent.s]?.c
    }));
  }, []);
  const wsFilter = useCallback(
    ({ source }: { source: any }) => {
      const symbols: string[] = [symbolId];
      const targets = source.data.map((item: any) => item.s);
      return targets.some((symbol: string) => symbols.includes(symbol));
    },
    [symbolId]
  );

  const httpAction = async () => {
    const futuresTokens = new Set();
    appConfig?.futuresSymbol?.forEach(({ baseTokenId }: any) => futuresTokens.add(baseTokenId));
    const tokenList = Array.from(futuresTokens);
    const symbolIds = tokenList.map(item => `${EXCHANGE_ID}.${item}`);

    try {
      const res = await http({
        url: api.token_ticker,
        method: 'get',
        options: {
          body: {
            symbol: symbolIds.join(','),
            realtimeInterval: '24h'
          }
        }
      });
      if (res?.status === 200 && res?.data?.data) {
        res.data.data.forEach((item: any) => {
          operator.setData('symbol_quote_source', [{ ...item, previousC: item.c }]);
        });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useWebSocket({
    name: 'symbol_quote_source',
    path: api.qws,
    status: 'loading',
    format: wsDataFormat,
    filter: wsFilter,
    httpAction,
    subscription: {
      id: 'broker',
      topic: 'broker',
      event: 'sub',
      params: {
        org: '9001',
        realtimeInterval: '24h',
        binary: isServerSideRender() ? false : !Boolean(window?.localStorage?.ws_binary)
      }
    }
  });

  useEffect(() => {
    httpAction();
  }, []);
}
