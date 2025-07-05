export const LiteMobileLayout = ({
  QuoteHeader,
  QuoteInfo,
  KlineView,
  // OrderBook,
  // RecentTrades,
  OrderList,
  // TradeView,
  // HotQuote,
  // Asset,
  OrderActions,
  HeaderAnnouncement
}: {
  QuoteHeader: React.ReactNode;
  QuoteInfo: React.ReactNode;
  KlineView: React.ReactNode;
  // OrderBook: React.ReactNode;
  // RecentTrades: React.ReactNode;
  OrderList: React.ReactNode;
  // TradeView: React.ReactNode;
  // HotQuote: React.ReactNode;
  // Asset: React.ReactNode;
  OrderActions: React.ReactNode;
  HeaderAnnouncement: React.ReactNode;
}) => {
  return (
    <>
      <div id="lite-layout">
        <div className="announcement">{HeaderAnnouncement}</div>
        {/* <div className='hot-quote bg'>{HotQuote}</div> */}
        <div className='lite-header bg'>{QuoteHeader}</div>
        <div className='lite-info bg'>{QuoteInfo}</div>
        <div className="lite-body">{KlineView}</div>
        <div className="lite-footer">{OrderList}</div>
        <div className="lite-trade-view">{OrderActions}</div>
      </div>
      <style jsx>{`
        #lite-layout {
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
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
            position: sticky;
            top: 2.75rem;
            z-index: 100;
          }
          .lite-info {
            width: 100%;
            margin-bottom: 0;
          }
          .lite-body {
            background: var(--fill_bg_1);
            margin-bottom: var(--theme-trade-layout-gap);
          }
          .bg {
            background-color: var(--fill_bg_1);
            overflow: hidden;
          }
          .lite-footer {
            overflow: auto;
            background: var(--fill_bg_1);
          }
          .lite-trade-view {
            position: fixed;
            z-index: 3;
            left: 0;
            right: 0;
            bottom: 0;
            // height: 70px;
            width: auto;
            padding: 8px 1rem;
            background: var(--fill_bg_1);
            box-shadow: 0px -4px 8px 0px var(--fill_1);
          }
        }
      `}</style>
    </>
  );
};
