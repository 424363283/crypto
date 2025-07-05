import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { LiteMobileLayout } from '@/components/layouts/media/lite/mobile';
import TradeCountDown from '@/components/trade-count-down';
// import { HotQuote } from '@/components/trade-ui/hot-quote';
import { Header } from '@/components/trade-ui/mobile/header';
import { QuoteInfo } from '@/components/trade-ui/mobile/header/quote-info';
// import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
// import { RecentTrades } from '@/components/trade-ui/recent-trades';
import dynamic from 'next/dynamic';
// const OrderList = dynamic(() => import('@/components/trade-ui/mobile/spot/order-list'));
const TradeView = dynamic(() => import('@/components/trade-ui/trade-view/lite'));
const OrderList = dynamic(() => import('@/components/order-list/lite'));
// const Asset = dynamic(() => import('@/components/trade-ui/trade-view/lite/components/asset'));
import { HeaderAnnouncement } from '@/components/trade-ui/header-announcement';
import { OrderActions } from '@/components/trade-ui/order-actions';

function MobileSSR() {
  return (
    <LiteMobileLayout
      HeaderAnnouncement={<HeaderAnnouncement.Lite />}
      // HotQuote={<HotQuote />}
      QuoteHeader={<Header isLite />}
      QuoteInfo={<QuoteInfo isLite />}
      KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.LITE} />} />}
      // OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SPOT} />}
      // RecentTrades={<RecentTrades />}
      OrderList={<OrderList />}
      // TradeView={<TradeView />}
      OrderActions={<OrderActions.Lite />}
      // Asset={<Asset />}
    />
  );
}

export default MobileSSR;
