import { UserContext } from '@/context';
import { api, http } from '@/service';
import { useTradesStore } from '@/store';
import { isServerSideRender } from '@/utils';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useWebSocket } from './use-websocket';
import { useCopyTradingUserInfo } from './use-copytrading-user-info';

/**
 * 获取用户 带单/跟单数据 & 交易原帐号信息
 */
export function useCopyTradingInfo() {
  const { isLogin } = useContext(UserContext);
  const { setTradeList, setTraderUser, setTraderPairs } = useTradesStore();

  const { ctUser, fetchUserInfo } = useCopyTradingUserInfo(20000);
  useEffect(() => {
    setTraderUser(ctUser);

    if (ctUser?.userId) {
      fetchTradeList();
      if (ctUser?.trader) fetchTraderPairs();
    } else {
      setTraderUser(null);
      setTradeList([]);
    }
  }, [ctUser]);

  /*********** 获取交易员带单币对 START ***********/
  const fetchTraderPairs = () => {
    http({
      url: api.traderSettings,
      timeout: 0,
      method: 'GET'
    }).then(({ data }) => {
      let paris = {};
      const traderSymbolVOList = data?.data?.traderSymbolVOList;
      if (traderSymbolVOList?.length) {
        paris = traderSymbolVOList.reduce((supportPairs: any, pair: any) => {
          if (pair?.checked) supportPairs[pair.symbolId] = true;
          return supportPairs;
        }, {});
      }
      setTraderPairs(paris);
    });
  };
  /*********** 获取交易员带单币对 END ***********/

  /************ 带单/跟单(列表) START ************/
  const fetchTradeList = () => {
    if (!ctUser?.userId) return;

    http({
      url: ctUser?.trader ? api.orderLsit : api.getCurrentOrderList,
      timeout: 0,
      method: 'GET'
    }).then(({ data }: any) => {
      if (data?.data) setTradeList(data.data);
    });
  };

  const wsDataFormat = useCallback(({ current }: any) => {
    return current?.data;
  }, []);
  const wsFilter = useCallback(({ source }: any) => {
    if (source?.data) setTradeList(source.data);
    return source?.data;
  }, []);

  const subscription = useMemo(
    () => ({
      id: 'copytrading_position',
      topic: 'copytrading_position',
      event: 'sub',
      params: {
        org: '9001',
        binary: isServerSideRender() ? false : !Boolean(window.localStorage.ws_binary)
      }
    }),
    []
  );
  useWebSocket({
    name: 'copytrading_position_source',
    path: isLogin ? api.ws : '',
    status: 'loading',
    format: wsDataFormat,
    filter: wsFilter,
    httpAction: fetchTradeList,
    subscription
  });
  /************ 带单/跟单(列表) END ************/


  return {
    ctUser,
    fetchUserInfo
  };
}
