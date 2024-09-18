import dynamic from 'next/dynamic';

export { TRADINGVIEW_SYMBOL_TYPE } from './view';

export const KChart: any = dynamic(() => import('./view'), { ssr: false });
