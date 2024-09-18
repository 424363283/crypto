import dynamic from 'next/dynamic';

export const TradingView: any = dynamic(() => import('./trading-view'), { ssr: false });
