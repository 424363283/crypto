import dynamic from 'next/dynamic';

export const OrderActions = {
  Swap: dynamic(() => import('./swap'), { ssr: false, loading: () => <div /> }),
};
