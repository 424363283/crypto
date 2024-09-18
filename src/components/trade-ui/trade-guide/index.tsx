import dynamic from 'next/dynamic';
export const TradeGuide = {
  Swap: dynamic(() => import('./swap'), { ssr: false, loading: () => <div /> }),
};
