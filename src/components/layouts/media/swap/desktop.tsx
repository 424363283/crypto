import { useResponsive } from '@/core/hooks';
import { useWindowWidthByValue } from '@/core/hooks/src/use-responsive';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils';
import KlineViewRight from './kline-view-right';

export const SwapDesktopLayout = ({
  // QuoteList,
  KlineHeader,
  KlineView,
  TradeView,
  OrderList,
  OrderBook,
  RecentTrades,
  MarginRatio,
  Assets,
  ContractDetails,
  HeaderFavorite,
  NetworkInfo,
  HeaderAnnouncement,
  TradeGuideBar,
}: {
  // QuoteList: React.ReactNode;
  KlineHeader: React.ReactNode;
  KlineView: React.ReactNode;
  TradeView: React.ReactNode;
  OrderList: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
  MarginRatio: React.ReactNode;
  Assets: React.ReactNode;
  ContractDetails: React.ReactNode;
  HeaderFavorite: React.ReactNode;
  NetworkInfo: React.ReactNode;
  HeaderAnnouncement: React.ReactNode;
  TradeGuideBar: React.ReactNode;
}) => {
  const { isLogin } = useAppContext();
  const { isSmallDesktop } = useResponsive(false);
  const { isMatch: isLargeDesktop } = useWindowWidthByValue({ width: 1440 });
  const klineHeight = !isSmallDesktop ? '590px' : '697px';
  return (
    <>
      <div id='swap-layout-desktop'>
        <div className='announcement'>{HeaderAnnouncement}</div>
        { TradeGuideBar}
        {isSmallDesktop && (
          <>
            <div className='kline-header bg card-radius'>
              {isLogin && HeaderFavorite && <div className='favorite'>{HeaderFavorite}</div>}
              <div className='kline-header-content'>{KlineHeader}</div>
            </div>
          </>
        )}
        <div className='swap-layout-content'>
          <div className='swap-layout-left'>
            <div className='swap-layout-left-top'>
              {/* <div className="swap-layout-left-top-left bg">{QuoteList}</div> */}
              <div className='swap-layout-left-top-center'>
                {!isSmallDesktop && (
                  <>
                    {/* <div className='announcement'>{HeaderAnnouncement}</div> */}
                    <div className='kline-header bg card-radius'>
                      {isLogin && HeaderFavorite && <div className='favorite'>{HeaderFavorite}</div>}
                      <div className='kline-header-content'>{KlineHeader}</div>
                    </div>
                  </>
                )}
                <div className={clsx('kline-view-wrap', isSmallDesktop && 'small')}>
                  <div className='kline-view-left bg card-radius'>{KlineView}</div>
                  {!isSmallDesktop ? (
                    <KlineViewRight className='kline-view-right' OrderBook={OrderBook} RecentTrades={RecentTrades} />
                  ) : (
                      <div className='kline-view-bottom'>
                        <div className='bg card-radius kline-view-bottom-orderbook'>{OrderBook}</div>
                        <div className='bg card-radius'>
                          <div className='recent-trades-title'>{LANG('最近成交')}</div>
                          {RecentTrades}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
            {!isSmallDesktop && <div className='order-list bg card-radius bottom'>{OrderList}</div>}
          </div>
          <div className='swap-layout-right'>
            <div className='trade-view order-bg card-radius'>{TradeView}</div>
            <div className={clsx('margin-ratio bg card-radius', !isSmallDesktop && 'bottom')}>
              {MarginRatio}
              {Assets}
              {ContractDetails}
            </div>
            {/* <div className='assets bg card-radius'>{Assets}</div>
          <div className='contract-details bg card-radius'>{ContractDetails}</div> */}
          </div>
        </div>
        {isSmallDesktop && (
          <div className={clsx('order-list bg card-radius', isSmallDesktop && 'small')}>{OrderList}</div>
        )}
        <div className='swap-network-info'>{NetworkInfo}</div>
      </div>
      <style jsx>{`
        #swap-layout-desktop {
          width: 100%;
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          padding: var(--theme-trade-layout-gap);
          padding-bottom: 22px;
          display: flex;
          flex-direction: column;
          ${!isSmallDesktop ? '' : ''}

          .swap-layout-content {
            flex: 1;
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .kline-header {
            margin-bottom: var(--theme-trade-layout-gap);
            .favorite {
              height: 42px;
              border-bottom: 1px solid rgba(var(--theme-trade-border-color-1-rgb), 0.5);
            }
            .kline-header-content {
              height: 58px;
              display: flex;
            }
          }

          .swap-layout-left {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
            flex: var(--theme-trade-trade-page-left-flex);
            .swap-layout-left-top {
              display: flex;
              .swap-layout-left-top-left {
                height: 880px;
                width: 300px;
              }
              .swap-layout-left-top-center {
                flex: 1;
                margin: 0 var(--theme-trade-layout-gap) 0 0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                .kline-view-wrap {
                  display: flex;
                  .kline-view-left {
                    height: ${klineHeight};
                    flex: ${!isSmallDesktop ? ' var(--theme-trade-tv-view-flex)' : '1'};
                    margin-right: var(--theme-trade-layout-gap);
                    display: flex;
                  }
                  &.small {
                    flex-direction: column;
                    .kline-view-left {
                      margin-right: 0;
                      height: 700px;
                      flex: none;
                    }
                    .kline-view-bottom {
                      margin-top: var(--theme-trade-layout-gap);
                      display: flex;
                      :global(> div) {
                        flex: 1;
                        padding-top: 10px;
                      }
                      .kline-view-bottom-orderbook {
                        padding-top: 18px;
                        margin-right: var(--theme-trade-layout-gap);
                      }
                      .recent-trades-title {
                        padding: 8px 12px 1px;
                        display: flex;
                        font-weight: 500;
                        align-items: center;
                        flex-shrink: 0;
                        color: var(--theme-trade-text-color-1);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      }
                    }
                  }
                }
              }
            }
          }
          :global(.kline-view-right) {
            max-width: var(--theme-trade-depth-view-max-width);
            ${isLargeDesktop ? 'min-width: var(--theme-trade-depth-view-width);' : 'width: 246px;'}
            flex: ${isLargeDesktop ? ' var(--theme-trade-depth-view-flex)' : 'none'};
            height: ${klineHeight};
          }
          .swap-layout-right {
            display: flex;
            flex-direction: column;
            max-width: var(--theme-trade-trade-view-max-width);
            flex: ${isLargeDesktop ? ' var(--theme-trade-trade-view-flex)' : 'none'};
            ${isLargeDesktop ? 'min-width: var(--theme-trade-trade-view-width);' : 'width: 294px;'}

            .trade-view {
              min-height: 450px;
              display: flex;
              flex-direction: column;
            }
            .margin-ratio {
              flex: 1;
              ${!isSmallDesktop ? 'min-height: 687px;' : ''}
              margin-top: var(--theme-trade-layout-gap);
            }
            .assets {
            }
            .contract-details {
              flex: 1;
              margin-top: var(--theme-trade-layout-gap);
            }
          }

          .order-list {
            flex: 1;
            margin-top: var(--theme-trade-layout-gap);
            ${!isSmallDesktop ? 'margin-right: var(--theme-trade-layout-gap);' : ''}
            &.small {
              min-height: 400px;
            }
          }
          .bg {
            background-color: var(--theme-trade-bg-color-2);
            overflow: hidden;
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
          .swap-network-info {
            position: fixed;
            bottom: 0;
            left: 0;
            height: 22px;
            width: 100%;
            z-index: var(--zindex-trade-network-info);
          }
        }
      `}</style>
    </>
  );
};
