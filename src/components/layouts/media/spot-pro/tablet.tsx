import KlineViewRight from '../spot/kline-view-right';

export const SpotProTabletLayout = ({
  KlineHeader,
  KlineView,
  TradeView,
  OrderBook,
  RecentTrades,
  OrderList,
  NetworkInfo,
  HotQuote,
}: {
  KlineHeader: React.ReactNode;
  KlineView: React.ReactNode;
  TradeView: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
  OrderList: React.ReactNode;
  NetworkInfo: React.ReactNode;
  HotQuote: React.ReactNode;
}) => {
  return (
    <>
      <div id='spot-layout'>
        <div className='spot-layout-left'>
          <div className='spot-layout-top'>
            <div className='hot-quote bg'>{HotQuote}</div>
            <div className='kline-header bg'>{KlineHeader}</div>
            <div className='container'>
              <div className='spot-layout-top-left'>
                <KlineViewRight Chart={KlineView} OrderBook={OrderBook} RecentTrades={RecentTrades} />
                <div className='spot-layout-right'>
                  <div>{TradeView}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='order-list bg'>{OrderList}</div> <div className='spot-network-info'>{NetworkInfo}</div>
      </div>
      <style jsx>{`
        #spot-layout {
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          padding-top: var(--theme-trade-layout-gap);
          display: flex;
          flex-direction: column;

          .spot-layout-left {
            display: flex;
            .spot-layout-top {
              height: 596px;
              display: flex;
              flex-direction: column;
              flex: 1;
              width: 100vw;
              .hot-quote {
                height: 48px;
                display: flex;
                border-radius: var(--theme-trade-layout-radius);
                margin: 0 var(--theme-trade-layout-gap);
              }
              .kline-header {
                height: 58px;
                display: flex;
                border-radius: var(--theme-trade-layout-radius);
                margin: 0 var(--theme-trade-layout-gap);
                margin-top: var(--theme-trade-layout-gap);
              }
              .container {
                display: flex;
                .spot-layout-top-left {
                  margin-left: var(--theme-trade-layout-gap);
                  overflow: hidden;
                  display: flex;
                  width: calc(100vw - var(--theme-trade-layout-gap));
                  .spot-layout-right {
                    width: 255px;
                    height: 500px;
                    margin: 0 var(--theme-trade-layout-gap);
                    margin-top: var(--theme-trade-layout-gap);
                    border-radius: var(--theme-trade-layout-radius);
                    overflow: auto;
                    > div {
                      height: 100%;
                    }
                  }
                }
              }
            }
          }
          .bg {
            background-color: var(--theme-background-color-1);
            overflow: hidden;
          }
          .order-list {
            flex: 1;
            min-height: 500px;
            margin: 0 var(--theme-trade-layout-gap);
            border-radius: var(--theme-trade-layout-radius);
          }
          :global(.kline-view-right) {
            flex: 1;
            margin: var(--theme-trade-layout-gap) 0;
            height: 500px;
          }
          .spot-network-info {
            position: fixed;
            bottom: 0;
            left: 0;
            height: 22px;
            width: 100%;
            z-index: 1;
          }
        }
      `}</style>
    </>
  );
};
