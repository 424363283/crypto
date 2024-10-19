import { useContext, useEffect, useRef } from 'react';
import axios from 'axios';

import { EXCHANGE_ID } from '@/constants';
import { ConfigContext, UserContext } from '@/context';
import { api, http } from '@/service';
import { useOrderSettingStore } from '@/store';
import isEqual from 'lodash/isEqual';
import { getRatesState } from '@/store/rates';
import { useCustomSetting } from './use-custom-settings';

import { delay } from '@/utils';


export function useRates() {
  const { appConfig } = useContext(ConfigContext);
  const { setOrderSettings } = useOrderSettingStore();
  const { isLogin } = useContext(UserContext);
  const { getCustomSetting } = useCustomSetting();

  const rateRequestCancel = useRef<any>();
  const orderSettingRequestCancel = useRef<any>();

  useEffect(() => {
    const request = async () => {
      const tokens = new Set(['BTC', 'USDT']);
      const legalCoins = new Set(['BTC', 'USDT', 'USD']);
      const futuresTokens = new Set();

      appConfig?.token?.forEach(({ tokenId }: any) => tokens.add(tokenId));

      appConfig?.futuresSymbol?.forEach(({ baseTokenId }: any) => futuresTokens.add(baseTokenId));

      appConfig?.supportLanguages?.forEach(({ lang, suffix }: any) => {
        if (lang == window.localStorage.unit) legalCoins.add(suffix);
      });
      
      try {
        const rateRes = await http({
          url: api.rate2,
          method: 'get',
          options: {
            body: {
              tokens: Array.from(tokens).join(',').toUpperCase(),
              legalCoins: Array.from(legalCoins).join(',').toUpperCase()
            },
            cancelToken: new axios.CancelToken(cancel => { rateRequestCancel.current = cancel; })
          }
        });
        const data = rateRes.data;
        if (data?.code == 200 && data?.data?.length) {
          const newRats = data.data.reduce((result: any, item: any) => {
            result[item.token] = { ...item.rates };
            return result;
          }, {});

          const { rates, setRates } = getRatesState();
          if (!isEqual(rates, newRats)) {
            setRates(newRats);
          }
        }
      } catch {}

      if (isLogin) {
        try {
          const orderSettingRes = await http({
            url: api.get_order_setting,
            method: 'post',
            data: {
              symbol_ids: Array.from(futuresTokens).join(',').toUpperCase(),
              exchange_id: EXCHANGE_ID
            },
            options: {
              cancelToken: new axios.CancelToken(cancel => { orderSettingRequestCancel.current = cancel; })
            }
          });
          if (orderSettingRes?.data) {
            setOrderSettings(
              orderSettingRes.data.reduce((result: any, item: any) => {
                result[item.symbolId] = item;
                  return result;
                }, {}
              )
            );
          }
        } catch {}
      }
      getCustomSetting();
      await delay(10000);
      request();
    };
    request();
    return () => {
      try {
        rateRequestCancel.current?.('');
        rateRequestCancel.current = undefined;
        orderSettingRequestCancel.current?.('');
        orderSettingRequestCancel.current = undefined;
      } catch {
      }
    };
  }, [isLogin, appConfig]);
}
