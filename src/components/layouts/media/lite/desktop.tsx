import { useResponsive } from '@/core/hooks';
import { useWindowWidthByValue } from '@/core/hooks/src/use-responsive';
import { MediaInfo } from '@/core/utils';

export const LiteDesktopLayout = ({
  KlineHeader,
  KlineView,
  TradeView,
  // OrderBook,
  // RecentTrades,
  OrderList,
  NetworkInfo,
  HotQuote,
  Asset,
}: {
  KlineHeader: React.ReactNode;
  KlineView: React.ReactNode;
  TradeView: React.ReactNode;
  // OrderBook: React.ReactNode;
  // RecentTrades: React.ReactNode;
  OrderList: React.ReactNode;
  NetworkInfo: React.ReactNode;
  HotQuote: React.ReactNode;
  Asset: React.ReactNode;
}) => {
  const { isSmallDesktop } = useResponsive(false);
  const { isMatch: isLargeDesktop } = useWindowWidthByValue({ width: 1440 });

  return (
    <>
      <div id='lite-layout'>
        <div className='lite-layout-left'>
          <div className='lite-layout-top'>
            <div className='hot-quote bg'>{HotQuote}</div>
            <div className='kline-header bg'>{KlineHeader}</div>
            <div className={`${isSmallDesktop ? 'small-layout' : ''} container-wrapper`}>
              <div className={`container ${isSmallDesktop ? 'flex-column' : ''}`}>
                <div className='lite-layout-top-left'>
                  <div className='kline-view bg'>{KlineView}</div>
                </div>
                {/* <div className='lite-layout-top-right'>
                  <div className='order-book bg'>{OrderBook}</div>
                  <div className='recent-trades bg'>{RecentTrades}</div> 
                </div> */}
              </div>
              {isSmallDesktop && <div className='lite-layout-right'>{TradeView}</div>}
            </div>
          </div>
          <div className='order-list bg'>{OrderList}</div>
        </div>
        <div className={`lite-layout-right ${isSmallDesktop ? 'hide' : ''}`}>
          {TradeView}
          {Asset}
        </div>
        <div className='spot-network-info'>{NetworkInfo}</div>
      </div>
      <style jsx>{`
        #lite-layout {
          overflow: auto;
          flex: 1;
          background-color: var(--fill_3);
          padding-top: var(--theme-trade-layout-gap);
          padding-left: var(--theme-trade-layout-spacing);
          display: flex;
          flex-direction: row;

          .lite-layout-left {
            width: calc(100vw - 355px);
            display: flex;
            flex-direction: column;
            margin-right: var(--theme-trade-layout-spacing);
            @media ${MediaInfo.smallDesktop} {
              width: 100vw;
            }
            .lite-layout-top {
              min-height: 760px;
              display: flex;
              flex-direction: column;
              .hot-quote {
                height: 48px;
                display: flex;
                flex-shrink: 1;
                border-radius: 0;
              }
              .kline-header {
                height: 58px;
                display: flex;
                flex-shrink: 1;
                border-radius: 0;
                margin-top: var(--theme-trade-layout-gap);
              }
              .container-wrapper {
                display: flex;
                width: 100%;
              }
              .container {
                width: 100%;
                display: flex;
                &.flex-column {
                  flex-direction: column;
                  .lite-layout-top-left {
                    margin-right: 0;
                    .kline-view {
                      height: 567px;
                    }
                  }
                  .lite-layout-top-left {
                    width: 100%;
                  }
                  .lite-layout-top-right {
                    display: flex;
                    width: 100%;
                    .order-book,
                    .recent-trades {
                      flex: 1;
                      border-radius: 0;
                      height: 403px;
                    }
                    .order-book {
                      margin-right: var(--theme-trade-layout-gap);
                    }
                  }
                }
                .lite-layout-top-left {
                  flex: ${!isSmallDesktop ? 'var(--theme-trade-tv-view-flex)' : '1'};
                  overflow: hidden;
                  .kline-view {
                    height: 697px;
                    display: flex;
                    margin-top: var(--theme-trade-layout-gap);
                    border-radius: 0;
                  }
                } 
                .lite-layout-top-right {
                  ${isLargeDesktop ? ' max-width: var(--theme-trade-depth-view-max-width);' : ''}
                  ${isLargeDesktop ? 'min-width: var(--theme-trade-depth-view-width);' : 'width: 246px;'}
                  flex: ${isLargeDesktop ? ' var(--theme-trade-depth-view-flex)' : 'none'};
                  margin-top: var(--theme-trade-layout-gap);
                  .order-book {
                    padding-top: 10px;
                    height: 500px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    border-bottom: 1px solid var(--theme-background-color-3);
                  }
                  .recent-trades {
                    display: flex;
                    flex-direction: column;
                    height: 197px;
                    overflow: hidden;
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                  }
                }
              }
              .small-layout {
                display: flex;
                .container {
                  flex: 1;
                }
                .lite-layout-right {
                  padding-right: 0;
                  margin-top: var(--theme-trade-layout-gap);
                  margin-left: var(--theme-trade-layout-gap);
                  margin-right: 0;
                }
              }
            }
          }
          .lite-layout-right {
            display: flex;
            flex-direction: column;
            max-width: var(--theme-trade-trade-view-max-width);
            flex: ${isLargeDesktop ? ' var(--theme-trade-trade-view-flex)' : 'none'};
            min-width: 340px;
            margin-right: var(--theme-trade-layout-spacing);
          }

          .order-list {
            min-height: 620px;
            margin-top: var(--theme-trade-layout-gap);
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            padding-bottom: 20px;
          }
          .bg {
            background-color: var(--fill_bg_1);
            overflow: hidden;
          }
        }
        .hide {
          display: none !important;
        }
        .spot-network-info {
          position: fixed;
          bottom: 0;
          left: 0;
          height: 22px;
          width: 100%;
          z-index: 10;
        }
      `}</style>
    </>
  );
};
