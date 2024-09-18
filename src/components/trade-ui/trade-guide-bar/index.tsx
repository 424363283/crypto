import dynamic from 'next/dynamic';
export const TradeGuideBar = {
  Swap: dynamic(() => import('./swap'), { ssr: false, loading: () => <div /> }),
};
