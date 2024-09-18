import { DependencyList, useEffect } from 'react';
import { SwapMessagerWs } from '../websocket/swap';
import { SWAP_SUBSCRIBE_TYPES } from '../websocket/swap/messager';
type fun = (data: any) => void;

const swapws1060 = {
  listeners: new Set<fun>(),
  ws_subscribe_position(callback: fun, deps?: DependencyList, { open }: { open: boolean } = { open: true }) {
    useEffect(() => {
      swapws1060.listeners.add(callback);
      const listenerCallback = (e: any) => callback(e.detail);
      window.addEventListener(SWAP_SUBSCRIBE_TYPES.ws_subscribe_position, listenerCallback);

      open && SwapMessagerWs.subscribe1060();
      return () => {
        swapws1060.listeners.delete(callback);
        window.removeEventListener(SWAP_SUBSCRIBE_TYPES.ws_subscribe_position, listenerCallback);
        if (!swapws1060.listeners.size) {
          SwapMessagerWs.unsubscribe1060();
        }
      };
    }, [...(deps ?? []), open]);
  },
};

export const useWs1060 = swapws1060.ws_subscribe_position;
export const useWs1060Position = (callback: fun, deps?: DependencyList, { open }: { open: boolean } = { open: true }) => {
  useWs1060(
    (data) => { 
      if (data?.params.channel === SWAP_SUBSCRIBE_TYPES.ws_subscribe_position) {
        return callback(data);
      }
    },
    deps,
    { open }
  );
};
