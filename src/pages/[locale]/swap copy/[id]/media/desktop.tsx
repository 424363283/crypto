import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { KlineGroupLayout } from '@/components/layouts/kline-group';
import { SwapDesktopLayout } from '@/components/layouts/media/swap';
import { OrderList } from '@/components/order-list';
import TradeCountDown from '@/components/trade-count-down';
import { HeaderAnnouncement } from '@/components/trade-ui/header-announcement';
import { HeaderFavorite } from '@/components/trade-ui/header-favorite';
import { KlineHeader } from '@/components/trade-ui/kline-header';
import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
import { RecentTrades } from '@/components/trade-ui/recent-trades';
import { TradeGuide } from '@/components/trade-ui/trade-guide';
import { TradeGuideBar } from '@/components/trade-ui/trade-guide-bar';
import { TradeView } from '@/components/trade-ui/trade-view';
import { kChartEmitter } from '@/core/events';
import { useResponsive } from '@/core/hooks';
import { getUrlQueryParams } from '@/core/utils';
import dynamic from 'next/dynamic';
import { useLayoutEffect } from 'react';

const HeaderSwapDemoGuide = dynamic(() => import('@/components/header/components/header-swap-demo-guide'), {
  ssr: false,
  loading: () => <div />,
});
const MarginRatio = dynamic(() => import('../../components/margin-ratio'), { ssr: false, loading: () => <div /> });
const Assets = dynamic(() => import('../../components/assets'), { ssr: false, loading: () => <div /> });
const ContractDetails = dynamic(() => import('../../components/contract-details'), {
  ssr: false,
  loading: () => <div />,
});
const NetworkInfo = dynamic(() => import('@/components/trade-ui/network-info'), { ssr: false, loading: () => <div /> });

export const DesktopNoSSR = () => {
  const isKlineGroup = getUrlQueryParams('type') == 'kline';
  if (isKlineGroup) return <KlineGroupLayout />;

  return (
    <TradeGuide.Swap>
      <SwapDesktopLayout
        TradeGuideBar={<TradeGuideBar.Swap />}
        HeaderAnnouncement={<HeaderAnnouncement.Swap />}
        KlineHeader={<KlineHeader.Swap />}
        HeaderFavorite={<HeaderFavorite.Swap />}
        KlineView={<MyTradeCountDown />}
        TradeView={
          <HeaderSwapDemoGuide>
            <TradeView.Swap />
           </HeaderSwapDemoGuide>
        }
        OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SWAP} />}
        RecentTrades={<RecentTrades />}
        OrderList={<OrderList.SwapDesktop />}
        MarginRatio={<MarginRatio />}
        Assets={<Assets />}
        ContractDetails={<ContractDetails />}
        NetworkInfo={<NetworkInfo />}
      />
    </TradeGuide.Swap>
  );
};
const MyTradeCountDown = () => {
  const { isSmallDesktop } = useResponsive(false);
  useLayoutEffect(() => {
    setTimeout(() => {
      kChartEmitter.emit(kChartEmitter.K_CHART_FULL_SCREEN);
    }, 1000);
  }, [isSmallDesktop]);
  return <TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SWAP} />} />;
};

export default DesktopNoSSR;
