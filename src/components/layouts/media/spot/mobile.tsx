import KlineViewRight from './kline-view-right';

export const SpotMobileLayout = ({
  QuoteInfo,
  KlineView,
  OrderBook,
  RecentTrades,
  OrderList,
  TradeView,
  HeaderAnnouncement
}: {
  QuoteInfo: React.ReactNode;
  KlineView: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
  OrderList: React.ReactNode;
  TradeView: React.ReactNode;
  HeaderAnnouncement: React.ReactNode;
}) => {
  return (
    <>
      <div id="spot-layout">
        <div className="announcement">{HeaderAnnouncement}</div>
        <div className="spot-header bg">{QuoteInfo}</div>
        <div className="spot-body">
          <KlineViewRight Chart={KlineView} OrderBook={OrderBook} RecentTrades={RecentTrades} />
        </div>
        <div className="spot-footer bg">{OrderList}</div>
        <div className="spot-trade-view">{TradeView}</div>
      </div>
      <style jsx>{`
        #spot-layout {
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          // padding: var(--theme-trade-layout-gap);
          padding-bottom: 0;
          display: flex;
          flex-direction: column;
          .spot-header,
          .spot-body,
          .spot-footer {
            overflow: hidden;
            width: 100%;
            margin-bottom: var(--theme-trade-layout-gap);
          }
          .spot-body {
            :global(.mobile-header) {
              overflow-x: auto;
            }
          }
          .bg {
            background-color: var(--fill_bg_1);
            overflow: hidden;
          }
          .spot-footer {
            flex: 1;
            margin-bottom: 0;
          }
          .spot-trade-view {
            position: fixed;
            z-index: 3;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            padding: 8px 0;
            background: var(--fill_1);
            box-shadow: 0px -4px 8px 0px var(--fill_1);
          }
        }
      `}</style>
    </>
  );
};
