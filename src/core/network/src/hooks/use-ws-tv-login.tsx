import { DependencyList, useEffect } from 'react';
import { TvSocketWs } from '../websocket/tv';
import { TV_SUBSCRIBE_TYPES } from '../websocket/tv/socket';

type fun = (data: any) => void;

const tv_socket = {
  listeners: new Set<fun>(),
  login(callback: fun, deps?: DependencyList, { open }: { open: boolean } = { open: true }) {
    useEffect(() => {
      tv_socket.listeners.add(callback);
      const listenerCallback = (e: any) => callback(e.detail);
      window.addEventListener(TV_SUBSCRIBE_TYPES.ws_method_login, listenerCallback);

      open && TvSocketWs.login();
      return () => {
        tv_socket.listeners.delete(callback);
        window.removeEventListener(TV_SUBSCRIBE_TYPES.ws_method_login, listenerCallback);
        if (!tv_socket.listeners.size) {
          // TvSocketWs.unsubscribe1060();
        }
      };
    }, [...(deps ?? []), open]);
  },
};

export const useLogin = tv_socket.login;
// export const useLoginPosition = (callback: fun, deps?: DependencyList, { open }: { open: boolean } = { open: true }) => {
//   useLogin(
//     (data) => { 
//       if (data?.params.channel === TV_SUBSCRIBE_TYPES.ws_method_login) {
//         return callback(data);
//       }
//     },
//     deps,
//     { open }
//   );
// };
