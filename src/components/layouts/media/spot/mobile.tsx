import KlineViewRight from './kline-view-right';

export const SpotMobileLayout = ({
  QuoteInfo,
  KlineView,
  OrderBook,
  RecentTrades,
  OrderList,
  TradeView,
  HotQuote,
}: {
  QuoteInfo: React.ReactNode;
  KlineView: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
  OrderList: React.ReactNode;
  TradeView: React.ReactNode;
  HotQuote: React.ReactNode;
}) => {
  return (
    <>
      <div id='spot-layout'>
        <div className='hot-quote bg'>{HotQuote}</div>
        <div className='spot-header bg'>{QuoteInfo}</div>
        <div className='spot-body'>
          <KlineViewRight Chart={KlineView} OrderBook={OrderBook} RecentTrades={RecentTrades} />
        </div>
        <div className='spot-footer'>{OrderList}</div>
        <div className='spot-trade-view'>{TradeView}</div>
      </div>
      <style jsx>{`
        #spot-layout {
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          padding: var(--theme-trade-layout-gap);
          padding-bottom: 0;
          display: flex;
          flex-direction: column;
          .hot-quote {
            height: 48px;
            border-radius: var(--theme-trade-layout-radius);
            display: flex;
            align-items: center;
          }
          .spot-header {
            min-height: 110px;
            border-radius: var(--theme-trade-layout-radius);
            padding: 15px;
            margin-top: var(--theme-trade-layout-gap);
          }
          .spot-body {
            height: 415px;
            border-radius: var(--theme-trade-layout-radius);
            background: var(--theme-trade-bg-color-2);
            margin-top: var(--theme-trade-layout-gap);
          }
          .bg {
            background-color: var(--theme-trade-bg-color-2);
            overflow: hidden;
          }
          .spot-footer {
            min-height: 375px;
            overflow: auto;
            border-radius: var(--theme-trade-layout-radius);
            background: var(--theme-trade-bg-color-2);
            margin-top: var(--theme-trade-layout-gap);
            padding-bottom: 70px;
          }
          .spot-trade-view {
            position: fixed;
            z-index: 3;
            left: 0;
            bottom: 0;
            height: 70px;
            width: 100%;
            background-color: var(--theme-trade-bg-color-6);
          }
        }
      `}</style>
    </>
  );
};
