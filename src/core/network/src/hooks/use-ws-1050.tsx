import { Group } from '@/core/shared';
import { isSwapDemo } from '@/core/utils/src/is';
import { useEffect } from 'react';
import { SwapMessagerWs } from '../websocket/swap';
import { SWAP_SUBSCRIBE_TYPES } from '../websocket/swap/messager';
type fun = (data: any) => void;

const swapws_flagprice = {
  listeners: new Set<fun>(),
  ws_flagprice(callback: fun, symbols?: string, deps?: any[]) {
    useEffect(() => {
      swapws_flagprice.listeners.add(callback);
      if (symbols) {
        SwapMessagerWs.subscribeFlagPrice(symbols);
      } else {
        Group.getInstance().then((group) => {
          const symbols = !isSwapDemo() ? group.getSwapIds.join(',') : group.getSwapSLIds.join(',');
          SwapMessagerWs.subscribeFlagPrice(symbols);
        });
      }
      window.addEventListener(SWAP_SUBSCRIBE_TYPES.ws_subscribe_flagprice_list, (e: any) => callback(e.detail));
      return () => {
        swapws_flagprice.listeners.delete(callback);
        window.removeEventListener(SWAP_SUBSCRIBE_TYPES.ws_subscribe_flagprice_list, callback);
        if (!swapws_flagprice.listeners.size) {
          SwapMessagerWs.unsubscribeFlagPrice();
        }
      };
    }, deps || []);
  },
};

export const useWs1050 = swapws_flagprice.ws_flagprice;
