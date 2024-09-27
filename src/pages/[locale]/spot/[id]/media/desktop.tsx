import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { KlineGroupLayout } from '@/components/layouts/kline-group';
import { SpotProDesktopLayout } from '@/components/layouts/media/spot-pro/desktop';
import TradeCountDown from '@/components/trade-count-down';
import { HotQuote } from '@/components/trade-ui/hot-quote';
import { KlineHeader } from '@/components/trade-ui/kline-header';
import { NetworkInfo } from '@/components/trade-ui/network-info';
import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
import { RecentTrades } from '@/components/trade-ui/recent-trades';
import TradeViewSpotPro from '@/components/trade-ui/trade-view/spot-pro';
import { getUrlQueryParams } from '@/core/utils';
import dynamic from 'next/dynamic';

function DesktopSSR() {
  const isKlineGroup = getUrlQueryParams('type') == 'kline';
  if (isKlineGroup) return <KlineGroupLayout />;

  const OrderList = dynamic(() => import('@/components/order-list/spot'));

  return (
    <>
      <SpotProDesktopLayout
        HotQuote={<HotQuote />}
        KlineHeader={<KlineHeader.Spot />}
        KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SPOT} />} />}
        TradeView={<TradeViewSpotPro />}
        OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SPOT} />}
        RecentTrades={<RecentTrades />}
        OrderList={<OrderList />}
        NetworkInfo={<NetworkInfo />}
      />
    </>
  );
}

export default DesktopSSR;
