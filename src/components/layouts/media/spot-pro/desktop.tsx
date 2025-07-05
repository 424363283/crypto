import { useState } from 'react'
import { useResponsive } from '@/core/hooks';
import { useWindowWidthByValue } from '@/core/hooks/src/use-responsive';
import { MediaInfo } from '@/core/utils';
import { LANG } from '@/core/i18n';

export const SpotProDesktopLayout = ({
  KlineHeader,
  KlineView,
  TradeView,
  OrderBook,
  RecentTrades,
  OrderList,
  NetworkInfo,
  HotQuote
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
  const { isSmallDesktop } = useResponsive(false);
  const { isMatch: isLargeDesktop } = useWindowWidthByValue({ width: 1440 });
  const [tab, setTab] = useState(1);
  return (
    <>
      <div id="spot-layout">
        <div className="spot-layout-left">
          <div className="spot-layout-top">
            <div className="hot-quote bg">{HotQuote}</div>
            <div className="kline-header bg">{KlineHeader}</div>
            <div className={`${isSmallDesktop ? 'small-layout' : ''} container-wrapper`}>
              <div className={`container ${isSmallDesktop ? 'flex-column' : ''}`}>
                <div className="spot-layout-top-left">
                  <div className="kline-view bg">{KlineView}</div>
                </div>
                <div className="spot-layout-top-right bg">

                  <div className="right-title">
                    <span className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}>
                      {LANG('盘口')}
                    </span>
                    <span className={tab === 2 ? 'active' : ''} onClick={() => setTab(2)}>
                      {LANG('最近成交')}
                    </span>
                  </div>

                  <div className={`right-box order-book bg ${tab === 1 ? 'show' : ''}`}>
                    <>{OrderBook}</>
                  </div>
                  <div className={`right-box recent-trades bg ${tab === 2 ? 'show' : ''}`}>
                    <>{RecentTrades}</>
                  </div>
                </div>
              </div>
              {isSmallDesktop && <div className="spot-layout-right">{TradeView}</div>}
            </div>
          </div>
          <div className="order-list bg">{OrderList}</div>
        </div>
        <div className={`spot-layout-right ${isSmallDesktop ? 'hide' : ''}`}>{TradeView}</div>{' '}
        <div className="spot-network-info">{NetworkInfo}</div>
      </div>
      <style jsx>{`
        #spot-layout {
          overflow: auto;
          flex: 1;
          background-color: var(--fill_3);
          padding-top: var(--theme-trade-layout-gap);
          padding-left: var(--theme-trade-layout-spacing);
          display: flex;
          flex-direction: row;

          .spot-layout-left {
            width: calc(100vw - 346px);
            display: flex;
            flex-direction: column;
            margin-right: var(--theme-trade-layout-spacing);
            @media ${MediaInfo.smallDesktop} {
              width: 100vw;
            }
            .spot-layout-top {
              /* min-height: 504px; */
              display: flex;
              flex-direction: column;
              .hot-quote {
                height: 48px;
                display: flex;
                flex-shrink: 1;
                border-radius:0;
              }
              .kline-header {
                height: 58px;
                display: flex;
                flex-shrink: 1;
                border-radius:0;
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
                  .spot-layout-top-left {
                    margin-right: 0;
                    .kline-view {
                      height: 567px;
                    }
                  }
                  .spot-layout-top-left {
                    width: 100%;
                  }
                  .spot-layout-top-right {
                    display: flex;
                    width: 100%;
                    .order-book,
                    .recent-trades {
                      flex: 1;
                      border-radius: var(--theme-trade-layout-radius);
                      height:600px;
                    }
                    .order-book {
                      margin-right: var(--theme-trade-layout-gap);
                    }
                  }
                }
                .spot-layout-top-left {
                  flex: ${!isSmallDesktop ? 'var(--theme-trade-tv-view-flex)' : '1'};
                  margin-right: var(--theme-trade-layout-gap);
                  overflow: hidden;

                  .kline-view {
                    height: 543px;
                    display: flex;
                    margin-top: var(--theme-trade-layout-gap);
                    border-radius:0;
                  }
                }
                .spot-layout-top-right {
                  ${isLargeDesktop ? ' max-width: var(--theme-trade-depth-view-max-width);' : ''}
                  ${isLargeDesktop ? 'min-width: var(--theme-trade-depth-view-width);' : 'width: 246px;'}
                  flex: ${isLargeDesktop ? ' var(--theme-trade-depth-view-flex)' : 'none'};
                  margin-top: var(--theme-trade-layout-gap);
                  .order-book {
                    padding-top: 10px;
                    height: 504px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border-top-left-radius:0;
                    border-top-right-radius:0;
                    border-bottom: 1px solid var(--theme-background-color-3);
                  }
                  .recent-trades {
                    display: flex;
                    flex-direction: column;
                    height: 504px;
                    overflow: hidden;
                    border-bottom-left-radius:0;
                    border-bottom-right-radius:0;
                  }
                }
              }
              .small-layout {
                display: flex;
                .container {
                  flex: 1;
                }
                .spot-layout-right {
                  padding-right: 0;
                  margin-top: var(--theme-trade-layout-gap);
                  margin-left: var(--theme-trade-layout-gap);
                  margin-right: 0;
                }
              }
            }
          }
          .spot-layout-right {
            display: flex;
            flex-direction: column;
            max-width: var(--theme-trade-trade-view-max-width);
            flex: ${isLargeDesktop ? ' var(--theme-trade-trade-view-flex)' : 'none'};
            max-width: 340px;
            width:340px;
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

          z-index: 1;
        }
        .right-title {
            height: 40px;
            padding: 16px 4px;
            border-bottom: 1px solid var(--fill_line_1);
            color: var(--text_2);
            display:flex;
            align-items:center;
            &.ru,
            &.pt,
            &.es,
            &.fr,
            &.tl {
              font-size: 12px;
            }
            span {
              cursor: pointer;
              padding:0 12px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;

               font-family: "Lexend";;
              font-size: 14px;
              font-weight: 500;

              &.active {
                color: var(--text_brand);
              }
              &:last-child {
                margin-right: 0px;
              }
            }
          }
          .right-box {
            flex: 1;
            display: none !important;
            flex-direction: column;
            overflow: hidden;
            padding:16px 0 0;
            &.show {
              display: flex !important;
            }
          }
      `}</style>
    </>
  );
};
