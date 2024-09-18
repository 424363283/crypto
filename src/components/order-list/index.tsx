import dynamic from 'next/dynamic';
import { Index as LiteComponent, Index as SpotComponent } from './lite';

export const OrderList = {
  Lite: dynamic(() => import('./lite'), { loading: () => <LiteComponent />, ssr: false }),
  Spot: SpotComponent,
  SwapDesktop: dynamic(() => import('./swap/media/desktop'), { ssr: false, loading: () => <div /> }),
  SwapTablet: dynamic(() => import('./swap/media/tablet'), { ssr: false, loading: () => <div /> }),
};
