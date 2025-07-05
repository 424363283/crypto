import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { LiteTabletLayout } from '@/components/layouts/media/lite/tablet';
import TradeCountDown from '@/components/trade-count-down';
import { HotQuote } from '@/components/trade-ui/hot-quote';
import { KlineHeader } from '@/components/trade-ui/kline-header';
import { NetworkInfo } from '@/components/trade-ui/network-info';
// import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
// import { RecentTrades } from '@/components/trade-ui/recent-trades';
import dynamic from 'next/dynamic';

function TabletSSR() {
  const TradeViewLite = dynamic(() => import('@/components/trade-ui/trade-view/lite'));
  const OrderList = dynamic(() => import('@/components/order-list/lite'));
  const Asset = dynamic(() => import('@/components/trade-ui/trade-view/lite/components/asset'));

  return (
    <>
      <LiteTabletLayout
        HotQuote={<HotQuote />}
        KlineHeader={<KlineHeader.Spot />}
        KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SPOT} />} />}
        TradeView={<TradeViewLite />}
        // OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SPOT} />}
        // RecentTrades={<RecentTrades />}
        OrderList={<OrderList />}
        NetworkInfo={<NetworkInfo />}
        Asset={<Asset />}
      />
    </>
  );
}

export default TabletSSR;
