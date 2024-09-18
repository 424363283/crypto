import dynamic from 'next/dynamic';
import { Lite } from './components/lite';
import { Spot } from './components/spot';

export const KlineHeader = {
  Lite: Lite,
  Spot: Spot,
  Swap: dynamic(() => import('./components/swap'), { ssr: false, loading: () => <div /> }),
};
