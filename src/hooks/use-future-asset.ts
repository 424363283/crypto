import { ConfigContext, UserContext } from '@/context';
import { useSlugSymbol, useWebSocket } from '@/hooks';
import { api, get, post } from '@/service';
import { useFutureStore } from '@/store';
import { useFutureOrderStore } from '@/store/future-order';
import { isServerSideRender } from '@/utils';
import { useCallback, useContext, useEffect } from 'react';
import { MSGDATATYPE } from '@/constants';
import { getFutureStore } from '@/store/future';
import { throttle } from 'lodash';
function useFutureAsset() {
  const { appConfig } = useContext(ConfigContext);
  const { isLogin } = useContext(UserContext);
  const { updateFutureBalances, updateFutureTradeable } = useFutureStore();
  const { futureTradeable } = getFutureStore();
  const { symbolSwapId } = useSlugSymbol();

  const fetchUserBalance = useCallback(async () => {
    if (isLogin) {
      try {
        const { status, data } = await get(api.get_futures_asset).start();
        if (status == 200 && data?.length) {
          updateFutureBalances(data);
        }
      } catch (err) {}
    } else updateFutureBalances([]);
  }, []);

  useWebSocket({
    httpAction: fetchUserBalance,
    format: ({ current }: { previous: any; current: any }) => current.data,
    filter: ({ source }: { source: any; current: unknown }) => {
      if (source?.data?.length) updateFutureBalances(source?.data);
      return true;
    },
    name: '',
    path: isLogin ? api.ws : '',
    status: 'loading',
    subscription: {
      id: 'futures_balance',
      topic: 'futures_balance',
      event: 'sub',
      params: {
        org: appConfig.orgId,
        binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
      }
    }
  });

  // 可开张数
  const setUserTradeable = (tradeables: FutureTradeableItem[]) => {
    if (tradeables && tradeables.length) {
      updateFutureTradeable(
        tradeables.reduce((results: FutureTradeable, item: FutureTradeableItem) => {
          results[item.tokenId] = item;
          return results;
        }, {})
      );
    }
  };

  const fetchUserTradeable = useCallback(async () => {
    if (isLogin) {
      try {
        const { status, data } = await post(
          api.get_future_tradeable,
          { token_ids: symbolSwapId, exchange_id: '' },
          0
        ).start();
        if (status == 200 && data?.length) setUserTradeable(data);
      } catch (err) {}
    }
  }, [isLogin, symbolSwapId, setUserTradeable]);
  useWebSocket({
    httpAction: fetchUserTradeable,
    format: ({ current }: { previous: any; current: any }) => current.data,
    filter: throttle(({ source }: { source: any; current: unknown }) => {
      if (source?.data && source?.msgDataType == MSGDATATYPE.ALL) {
        setUserTradeable(source?.data);
      } else {
        if (source?.data && futureTradeable[source?.data[0]?.tokenId]) {
          futureTradeable[source.data[0].tokenId] = source?.data[0];
          setUserTradeable(Object.values(futureTradeable));
        } else {
          const TradeableList = { ...futureTradeable };
          if (source?.data) {
            const list = [...source?.data, TradeableList];
            setUserTradeable(list);
          }
        }
      }
      return true;
    }, 1000), // 节流1秒
    name: '',
    path: isLogin ? api.ws : '',
    status: 'loading',
    subscription: {
      id: 'futures_tradeable',
      topic: 'futures_tradeable',
      event: 'sub',
      params: {
        org: appConfig.orgId,
        binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
      }
    }
  });
  // useWebSocket({
  //   httpAction: fetchUserTradeable,
  //   format: ({ current }: { previous: any; current: any }) => current.data,
  //   filter: throttle(({ source }: { source: any; current: unknown }) => {
  //     if (source?.data && source?.msgDataType == MSGDATATYPE.ALL) {
  //       setUserTradeable(source?.data);
  //     } else {
  //       if (source?.data && futureTradeable[source?.data[0]?.tokenId]) {
  //         futureTradeable[source.data[0].tokenId] = source?.data[0];
  //         setUserTradeable(Object.values(futureTradeable));
  //       } else {
  //         const TradeableList = { ...futureTradeable };
  //         if (source?.data) {
  //           const list = [TradeableList, source?.data[0]];
  //           setUserTradeable(list);
  //         }
  //       }
  //     }
  //     return true;
  //   }, 1000), // 节流1秒
  //   name: '',
  //   path: isLogin ? api.ws : '',
  //   status: 'loading',
  //   subscription: {
  //     id: 'futures_tradeable',
  //     topic: 'futures_tradeable',
  //     event: 'sub',
  //     params: {
  //       org: appConfig.orgId,
  //       binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
  //     }
  //   }
  // });

  // useWebSocket({
  //   httpAction: fetchUserTradeable,
  //   format: ({ current }: { previous: any; current: any }) => current.data,
  //   filter: ({ source }: { source: any; current: unknown }) => {
  //     if (source?.data && source?.msgDataType == MSGDATATYPE.ALL) {
  //       setUserTradeable(source?.data);
  //     } else {
  //       if (futureTradeable[source?.data[0]?.tokenId]) {
  //         futureTradeable[source.data[0].tokenId] = source?.data[0];
  //         setUserTradeable(Object.values(futureTradeable));
  //       } else {
  //         const TradeableList = { ...futureTradeable };
  //         const list = [TradeableList, source?.data[0]];
  //         setUserTradeable(list);
  //       }
  //     }
  //     return true;
  //   },
  //   name: '',
  //   path: isLogin ? api.ws : '',
  //   status: 'loading',
  //   subscription: {
  //     id: 'futures_tradeable',
  //     topic: 'futures_tradeable',
  //     event: 'sub',
  //     params: {
  //       org: appConfig.orgId,
  //       binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
  //     }
  //   }
  // });

  const { updateFutureOrderStore } = useFutureOrderStore();
  useWebSocket({
    httpAction: () => {},
    format: ({ current }: { previous: any; current: any }) => current.data,
    filter: ({ source }: { source: any; current: unknown }) => {
      const curLeverageInfo = source?.data?.filter?.((item: any) => item.symbolId == symbolSwapId)[0];
      if (curLeverageInfo) updateFutureOrderStore(curLeverageInfo);
      return true;
    },
    name: '',
    path: isLogin ? api.ws : '',
    status: 'loading',
    subscription: {
      id: 'account_config_update',
      topic: 'account_config_update',
      event: 'sub',
      params: {
        org: appConfig.orgId,
        binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
      }
    }
  });

  useEffect(() => {
    if (isLogin) {
      fetchUserBalance();
      fetchUserTradeable();
    }
  }, [isLogin, symbolSwapId]);
}

export default useFutureAsset;
