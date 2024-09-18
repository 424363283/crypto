import KlineViewRight from './kline-view-right';

export const SwapMobileLayout = ({
  QuoteInfo,
  KlineView,
  OrderList,
  OrderBook,
  RecentTrades,
  OrderActions,
  HeaderAnnouncement,
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
      <div id='swap-layout-mobile'>
        <div className='announcement'>{HeaderAnnouncement}</div>
        <div className='swap-layout-top card-radius bg'>{QuoteInfo}</div>
        <div className='swap-layout-middle card-radius bg'>
          <KlineViewRight
            className='kline-view-right card-radius bg'
            Chart={KlineView}
            OrderBook={OrderBook}
            RecentTrades={RecentTrades}
          />
        </div>
        <div className='swap-layout-bottom card-radius bg'>{OrderList}</div>
        <div className='swap-layout-actions'>{OrderActions}</div>
      </div>
      <style jsx>{`
        #swap-layout-mobile {
          width: 100%;
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          padding: var(--theme-trade-layout-gap);
          padding-bottom: 0;
          display: flex;
          flex-direction: column;
          padding-bottom: 70px;
          .swap-layout-top {
            height: 116px;
            padding: 15px;
          }
          .swap-layout-middle {
            height: 400px;
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
            bottom: 0;
            height: 70px;
            width: 100%;
            background-color: var(--theme-trade-bg-color-6);
          }
        }

        .bg {
          background-color: var(--theme-trade-bg-color-2);
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
      `}</style>
    </>
  );
};
