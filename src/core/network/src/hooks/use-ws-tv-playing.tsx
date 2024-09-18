import { useEffect } from 'react';
import { TvSocketWs } from '../websocket/tv';
import { TV_SUBSCRIBE_TYPES } from '../websocket/tv/socket';
type fun = (data: any) => void;

const tv_socket = {
  listeners: new Set<fun>(),
  playing(callback: fun, data?: any, deps?: any[]) {
    useEffect(() => {
      tv_socket.listeners.add(callback);
      if (data) {
        TvSocketWs.subscribePlaying(data);
      }
      window.addEventListener(TV_SUBSCRIBE_TYPES.ws_subscribe_playing, (e: any) => callback(e.detail));
      return () => {
        tv_socket.listeners.delete(callback);
        window.removeEventListener(TV_SUBSCRIBE_TYPES.ws_subscribe_playing, callback);
        if (!tv_socket.listeners.size) {
          TvSocketWs.unsubscribePlaying(data);
        }
      };
    }, deps || []);
  },
};

export const usePlaying = tv_socket.playing;
