import dynamic from 'next/dynamic';
import Lite from './lite';
import Spot from './spot';
import SpotPro from './spot-pro';

export const TradeView = {
  Lite,
  // Spot,
  Swap: dynamic(() => import('./swap'), { ssr: false, loading: () => <div /> }),
  // SpotPro,
};
