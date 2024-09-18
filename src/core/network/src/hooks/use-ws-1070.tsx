import { useEffect } from 'react';
import { SWAP_SUBSCRIBE_TYPES } from '../websocket/swap/messager';
type fun = (data: any) => void;

const swapws1070 = {
  listeners: new Set<fun>(),
  ws1070(callback: fun) {
    useEffect(() => {
      swapws1070.listeners.add(callback);
      window.addEventListener(SWAP_SUBSCRIBE_TYPES.ws1070, (e: any) => callback(JSON.parse(e.detail)));
      return () => {
        swapws1070.listeners.delete(callback);
        window.removeEventListener(SWAP_SUBSCRIBE_TYPES.ws1070, callback);
      };
    }, []);
  },
};

export const useWs1070 = swapws1070.ws1070;
