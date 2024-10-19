import { useContext, useEffect, useMemo, useState, useRef } from 'react';
import dayjs from 'dayjs';
import isArray from 'lodash/isArray';
import axios, { Canceler } from 'axios';

import { UserContext } from '@/context';
import { useSlugSymbol } from '@/hooks';
// import { api, http } from '@/service';


/** 历史委托和强平记录数据 */
export function useKLineHistoryOrder() {
  const historyOrderRequestCancel = useRef<Canceler>();
  const liquidateOrderRequestCancel = useRef<Canceler>();

  const requestTimeout = useRef<ReturnType<typeof setTimeout>>();

  const { symbolSwapId, contractMultiplier } = useSlugSymbol();
  const { isLogin } = useContext(UserContext);

  const [historyEntrust, setHistoryEntrust] = useState<any>([]);
  const [historyLiquidate, setHistoryLiquidate] = useState<any>([]);

  useEffect(() => {
    if (!isLogin) {
      setHistoryEntrust([]);
      setHistoryLiquidate([]);
      return;
    }

    // const request = async () => {
    //   // 历史委托
    //   try {
    //     const response = await http({
    //       url: api.futures_history_entrust,
    //       method: 'get',
    //       options: {
    //         body: {
    //           checked: 'true',
    //           from_order_id: '',
    //           type: 'LIMIT',
    //           order_type: 'LIMIT',
    //           limit: '100',
    //           end_time: dayjs()?.valueOf(),
    //           start_time: dayjs()?.subtract(6, 'days')?.valueOf(),
    //           firstReq: true
    //         },
    //         cancelToken: new axios.CancelToken(cancel => { historyOrderRequestCancel.current = cancel; })
    //       }
    //     });
    //     const data = response?.data;
    //     if (isArray(data)) {
    //       setHistoryEntrust(
    //         data.map(item => {
    //           item.total = item.origQty;
    //           return item;
    //         })
    //       );
    //     }
    //   } catch {
    //   }

    //   try {
    //     const response = await http({
    //       url: api.history_liquidate,
    //       method: 'get',
    //       options: {
    //         body: {
    //           order_type: 'FLAT_RECORD',
    //           checked: true,
    //           firstReq: true,
    //           type: 'FLAT_RECORD',
    //           limit: 30,
    //           fromId: ''
    //         },
    //         cancelToken: new axios.CancelToken(cancel => { liquidateOrderRequestCancel.current = cancel; })
    //       }
    //     });
    //     const data = response?.data;
    //     if (isArray(data)) {
    //       setHistoryLiquidate(
    //         data.map(item => {
    //           item.total = item.quantity;
    //           item.updateTime = item.time;
    //           return item;
    //         })
    //       );
    //     }
    //   } catch {
    //   }
    //   requestTimeout.current = setTimeout(() => {
    //     request();
    //   }, 5000);
    // };
    // request();
    return () => {
      try {
        clearTimeout(requestTimeout.current);
        historyOrderRequestCancel.current?.();
        liquidateOrderRequestCancel.current?.();
      } catch {}
    };
  }, [isLogin, symbolSwapId]);

  return useMemo(() => []
    .concat(historyEntrust, historyLiquidate)
    .filter((item: any) => item.symbolId === symbolSwapId)
    .map((item: any) => {
      item.contractMultiplier = contractMultiplier;
      return item;
    }), [historyEntrust, historyLiquidate, symbolSwapId]);
}
