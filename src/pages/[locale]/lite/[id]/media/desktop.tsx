import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { KlineGroupLayout } from '@/components/layouts/kline-group';
import { LiteDesktopLayout } from '@/components/layouts/media/lite/desktop';
import TradeCountDown from '@/components/trade-count-down';
import { HotQuote } from '@/components/trade-ui/hot-quote';
import { KlineHeader } from '@/components/trade-ui/kline-header';
import { NetworkInfo } from '@/components/trade-ui/network-info';
import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book';
import { RecentTrades } from '@/components/trade-ui/recent-trades';
import TradeViewLite from '@/components/trade-ui/trade-view/lite';
import { getUrlQueryParams } from '@/core/utils';
import dynamic from 'next/dynamic';

function DesktopSSR() {
  const isKlineGroup = getUrlQueryParams('type') == 'kline';
  if (isKlineGroup) return <KlineGroupLayout />;

  const OrderList = dynamic(() => import('@/components/order-list/lite'));
  const Asset = dynamic(() => import('@/components/trade-ui/trade-view/lite/components/asset'));

  return (
    <>
      <LiteDesktopLayout
        HotQuote={<HotQuote />}
        KlineHeader={<KlineHeader.Lite />}
        KlineView={<TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.LITE} />} />}
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

export default DesktopSSR;
