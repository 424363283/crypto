import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { LiteMobileLayout } from '@/components/layouts/media/lite/mobile';
import TradeCountDown from '@/components/trade-count-down';
import { HotQuote } from '@/components/trade-ui/hot-quote';
import { Header } from '@/components/trade-ui/mobile/header';
// import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
// import { RecentTrades } from '@/components/trade-ui/recent-trades';
import dynamic from 'next/dynamic';
// const TradeView = dynamic(() => import('@/components/trade-ui/mobile/spot/trade-view'));
// const OrderList = dynamic(() => import('@/components/trade-ui/mobile/spot/order-list'));
const TradeView = dynamic(() => import('@/components/trade-ui/trade-view/lite'));
const OrderList = dynamic(() => import('@/components/order-list/lite'));
const Asset = dynamic(() => import('@/components/trade-ui/trade-view/lite/components/asset'));

function MobileSSR() {
  return (
    <LiteMobileLayout
      HotQuote={<HotQuote />}
      QuoteInfo={<Header isSpot />}
      KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SPOT} />} />}
      // OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SPOT} />}
      // RecentTrades={<RecentTrades />}
      OrderList={<OrderList />}
      TradeView={<TradeView />}
      Asset={<Asset />}
    />
  );
}

export default MobileSSR;
