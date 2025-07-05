import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { SwapMobileLayout } from '@/components/layouts/media/swap';
import { OrderList } from '@/components/order-list';
import TradeCountDown from '@/components/trade-count-down';
import { HeaderAnnouncement } from '@/components/trade-ui/header-announcement';
import { Header } from '@/components/trade-ui/mobile/header';
import { QuoteInfo } from '@/components/trade-ui/mobile/header/quote-info';
import { OrderActions } from '@/components/trade-ui/order-actions';
import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
import { RecentTrades } from '@/components/trade-ui/recent-trades';
// MobileModal
export const MobileNoSSR = () => {
  return (
    <SwapMobileLayout
      HeaderAnnouncement={<HeaderAnnouncement.Swap />}
      QuoteHeader={<Header />}
      QuoteInfo={<QuoteInfo />}
      KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SWAP} />} />}
      OrderBook={<OrderBook type={ORDER_BOOK_TYPES.SWAP} />}
      RecentTrades={<RecentTrades />}
      OrderList={<OrderList.SwapTablet />}
      OrderActions={<OrderActions.Swap />}
    />
  );
};

export default MobileNoSSR;
