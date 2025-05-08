import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { SpotMobileLayout } from '@/components/layouts/media/spot/mobile';
import TradeCountDown from '@/components/trade-count-down';
import { HotQuote } from '@/components/trade-ui/hot-quote';
import { Header } from '@/components/trade-ui/mobile/header';
import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
import { RecentTrades } from '@/components/trade-ui/recent-trades';
import { HeaderAnnouncement } from '@/components/trade-ui/header-announcement';
import dynamic from 'next/dynamic';
const TradeView = dynamic(() => import('@/components/trade-ui/mobile/spot/trade-view'));
const OrderList = dynamic(() => import('@/components/trade-ui/mobile/spot/order-list'));

function MobileSSR() {
  return (
    <SpotMobileLayout
      HeaderAnnouncement={<HeaderAnnouncement.Swap />}
      QuoteInfo={<Header isSpot />}
      KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SPOT} />} />}
      OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SPOT} />}
      RecentTrades={<RecentTrades />}
      OrderList={<OrderList />}
      TradeView={<TradeView />}
    />
  );
}

export default MobileSSR;
