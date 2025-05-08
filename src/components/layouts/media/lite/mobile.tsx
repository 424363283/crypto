
export const LiteMobileLayout = ({
  QuoteInfo,
  KlineView,
  // OrderBook,
  // RecentTrades,
  OrderList,
  TradeView,
  HotQuote,
  Asset,
}: {
  QuoteInfo: React.ReactNode;
  KlineView: React.ReactNode;
  // OrderBook: React.ReactNode;
  // RecentTrades: React.ReactNode;
  OrderList: React.ReactNode;
  TradeView: React.ReactNode;
  HotQuote: React.ReactNode;
  Asset: React.ReactNode;
}) => {
  return (
    <>
      <div id='lite-layout'>
        <div className='hot-quote bg'>{HotQuote}</div>
        <div className='lite-header bg'>{QuoteInfo}</div>
        <div className='lite-body'>
          {/* <KlineViewRight Chart={KlineView} OrderBook={OrderBook} RecentTrades={RecentTrades} /> */}
        </div>
        <div className='lite-footer'>{OrderList}</div>
        <div className='lite-trade-view'>{TradeView}</div>
        <div className='lite-trade-asset'>{Asset}</div>
      </div>
      <style jsx>{`
        #lite-layout {
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
          .lite-header {
            min-height: 110px;
            border-radius: var(--theme-trade-layout-radius);
            padding: 15px;
            margin-top: var(--theme-trade-layout-gap);
          }
          .lite-body {
            height: 415px;
            border-radius: var(--theme-trade-layout-radius);
            background: var(--fill_bg_1);
            margin-top: var(--theme-trade-layout-gap);
          }
          .bg {
            background-color: var(--fill_bg_1);
            overflow: hidden;
          }
          .lite-footer {
            min-height: 375px;
            overflow: auto;
            border-radius: var(--theme-trade-layout-radius);
            background: var(--fill_bg_1);
            margin-top: var(--theme-trade-layout-gap);
            padding-bottom: 70px;
          }
          .lite-trade-view {
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
