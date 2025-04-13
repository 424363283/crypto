import KlineViewRight from './kline-view-right';

export const SwapMobileLayout = ({
  QuoteInfo,
  KlineView,
  OrderList,
  OrderBook,
  RecentTrades,
  OrderActions,
  HeaderAnnouncement
}: {
  // QuoteList: React.ReactNode;
  QuoteInfo: React.ReactNode;
  KlineView: React.ReactNode;
  OrderList: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
  OrderActions: React.ReactNode;
  HeaderAnnouncement: React.ReactNode;
}) => {
  return (
    <>
      <div id="swap-layout-mobile">
        <div className="announcement">{HeaderAnnouncement}</div>
        <div className="swap-layout-top bg">{QuoteInfo}</div>
        <div className="swap-layout-middle bg">
          <KlineViewRight
            className="kline-view-right bg"
            Chart={KlineView}
            OrderBook={OrderBook}
            RecentTrades={RecentTrades}
          />
        </div>
        <div className="swap-layout-bottom bg">{OrderList}</div>
        <div className="swap-layout-actions">{OrderActions}</div>
      </div>
      <style jsx>{`
        #swap-layout-mobile {
          width: 100%;
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          /* padding: var(--theme-trade-layout-gap); */
          padding-bottom: 0;
          display: flex;
          flex-direction: column;
          padding-bottom: 0;
          .swap-layout-middle {
            height: auto;
          }
          .swap-layout-top,
          .swap-layout-middle,
          .swap-layout-bottom {
            overflow: hidden;
            width: 100%;
            margin-bottom: var(--theme-trade-layout-gap);
          }
          .swap-layout-bottom {
            flex: 1;
          }
          .swap-layout-actions {
            position: fixed;
            z-index: 3;
            left: 0;
            right: 0;
            bottom: 0;
            // height: 70px;
            width: auto;
            padding: 8px 1rem;
            background: var(--fill-1);
            box-shadow: 0px -4px 8px 0px var(--fill-1, #fff);
          }
        }

        .bg {
          background-color: var(--bg-1);
        }
        .order-bg {
          background-color: var(--theme-trade-bg-color-3);
          overflow: hidden;
        }
        .card-radius {
          border-radius: var(--theme-trade-layout-radius);
          &.bottom {
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
          }
        }
        :global(.kline-view-right) {
          height: 100%;
        }
        :global(.mobile-header) {
          overflow-x: auto;
         
        }
      `}</style>
    </>
  );
};
