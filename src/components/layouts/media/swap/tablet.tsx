import { useAppContext } from '@/core/store';
import KlineViewRight from './kline-view-right';

export const SwapTabletLayout = ({
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
  TradeGuideBar: React.ReactNode;
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
}) => {
  const { isLogin } = useAppContext();
  return (
    <>
      <div id='swap-layout-tablet'>
        <div className='announcement'>{HeaderAnnouncement}</div>
        {isLogin && TradeGuideBar}
        <div className='kline-header bg card-radius'>
          {isLogin && HeaderFavorite && <div className='favorite'>{HeaderFavorite}</div>}
          <div className='kline-header-content'>{KlineHeader}</div>
        </div>
        <div className='swap-layout-content'>
          <div className='swap-layout-left'>
            <KlineViewRight
              className='kline-view-right'
              Chart={<div className='kline-view'>{KlineView}</div>}
              OrderBook={OrderBook}
              RecentTrades={RecentTrades}
            />
            <div className='trade-view order-bg card-radius'>{TradeView}</div>
          </div>
          <div className='swap-layout-right'>
            <div className='order-list bg card-radius bottom'>{OrderList}</div>
            <div className='margin-ratio bg card-radius bottom'>
              {MarginRatio}
              {Assets}
              {ContractDetails}
            </div>
            {/* <div className='assets bg card-radius'>{Assets}</div>
          <div className='contract-details bg card-radius'>{ContractDetails}</div> */}
          </div>
        </div>
        <div className='swap-network-info'>{NetworkInfo}</div>
      </div>
      <style jsx>{`
        #swap-layout-tablet {
          width: 100%;
          overflow: auto;
          flex: 1;
          background-color: var(--theme-trade-bg-color-1);
          padding: var(--theme-trade-layout-gap);

          display: flex;
          flex-direction: column;
          .swap-layout-content {
            flex: 1;
            width: 100%;
            margin-top: var(--theme-trade-layout-gap);
            display: flex;
            padding-bottom: 22px;
            flex-direction: column;
          }
          .kline-header {
            .favorite {
              height: 42px;
              border-bottom: 1px solid rgba(var(--theme-trade-border-color-1-rgb), 0.5);
            }
            .kline-header-content {
              height: 58px;
              display: flex;
            }
          }
          .kline-view {
            display: flex;
            flex-direction: column;
            height: 480px;
          }
          .swap-layout-left {
            display: flex;
            flex-direction: row;
            .trade-view {
              margin-left: var(--theme-trade-layout-gap);
              flex: none;
              width: 255px;
              min-height: 450px;
              display: flex;
              flex-direction: column;
            }
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
                    height: 697px;
                    flex: 1;
                    display: flex;
                  }
                }
              }
            }
          }
          .swap-layout-right {
            flex: 1;
            display: flex;
            flex-direction: row;

            .margin-ratio {
              flex: none;
              width: 255px;
              min-height: 687px;
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
            margin-right: var(--theme-trade-layout-gap);
          }
          .bg {
            background-color: var(--bg-1);
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
          :global(.kline-view-right) {
            flex: 1;
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
