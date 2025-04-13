import { KChart, TRADINGVIEW_SYMBOL_TYPE } from '@/components/chart/k-chart';
import { KlineGroupLayout } from '@/components/layouts/kline-group';
import { SwapDesktopLayout } from '@/components/layouts/media/swap';
import { OrderList } from '@/components/order-list';
import TradeCountDown from '@/components/trade-count-down';
import { HeaderAnnouncement } from '@/components/trade-ui/header-announcement';
import { HeaderFavorite } from '@/components/trade-ui/header-favorite';
import { KlineHeader } from '@/components/trade-ui/kline-header';
import { ORDER_BOOK_TYPES, OrderBook } from '@/components/trade-ui/order-book/swapIndex';
import { RecentTrades } from '@/components/trade-ui/recent-trades';
import { TradeGuide } from '@/components/trade-ui/trade-guide';
import { TradeGuideBar } from '@/components/trade-ui/trade-guide-bar';
import { TradeView } from '@/components/trade-ui/trade-view';
import { kChartEmitter } from '@/core/events';
import { useResponsive } from '@/core/hooks';
import { getUrlQueryParams } from '@/core/utils';
import KlineViewRight from './kline-view-right';
import dynamic from 'next/dynamic';
import { useLayoutEffect } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import GridLayout from 'react-grid-layout';
import usePageSize from '@/hooks/pageResize';
import { useDragX } from '@/hooks/dragX';
import {
  colCount,
  getOrderModuleSide,
  marginWidth,
  minWindowWidth,
  modulePadding,
  rowHeight,
  useLayoutControl,
} from '@/hooks/spotLayoutControl';
import css from 'styled-jsx/css';
// import './index.module.scss'
const GridLayout = dynamic(() => import('react-grid-layout'), { ssr: false });
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';



const HeaderSwapDemoGuide = dynamic(() => import('@/components/header/components/header-swap-demo-guide'), {
  ssr: false,
  loading: () => <div />,
});
const MarginRatio = dynamic(() => import('../../components/margin-ratio'), { ssr: false, loading: () => <div /> });
const Assets = dynamic(() => import('../../components/assets'), { ssr: false, loading: () => <div /> });
const ContractDetails = dynamic(() => import('../../components/contract-details'), {
  ssr: false,
  loading: () => <div />,
});
const NetworkInfo = dynamic(() => import('@/components/trade-ui/network-info'), { ssr: false, loading: () => <div /> });

export const DesktopNoSSR = () => {
  const isKlineGroup = getUrlQueryParams('type') == 'kline';
  if (isKlineGroup) return <KlineGroupLayout />;


  const [orderModuleSide, setOrderModuleSide] = useState(() => getOrderModuleSide()); // 下单模块位置 'right' | 'left'


  // grid布局宽度
  const { windowWidth, windowHeight, rightModuleWidth } = usePageSize();
  const layoutWidth = useMemo(() => {
    const rightModuleWidthPlus = rightModuleWidth + marginWidth;
    return windowWidth < minWindowWidth ? minWindowWidth - rightModuleWidthPlus : windowWidth - rightModuleWidthPlus;
  }, [windowWidth, rightModuleWidth]);




  // 下单区拖拽左右定位逻辑
  const { dragMoveX, dragStatus, handleMouseDown, handleMouseMove, handleDragOver, setDragStatus } = useDragX({
    side: `to-${orderModuleSide === 'right' ? 'left' : 'right'}`,
    maxX: 100,
  });

  const { layoutConfig, layoutH, historyLayoutH, layoutDone, handleLayoutChange, handleDropLayout, handleResetLayout } =
    useLayoutControl({
      windowHeight,
      orderModuleDragStatus: dragStatus,
      setOrderModuleDragStatus: setDragStatus,
      orderModuleSide,
      setOrderModuleSide,
    });
  // 下单区动态样式
  const orderModuleStyle = useMemo(() => {
    const style: { [key: string]: any } = {};
    if (orderModuleSide === 'right') {
      style.right = `${dragStatus === 'init' ?'2px' : -dragMoveX}px`;
      style.width =340;

    } else {
      style.left = `${dragStatus === 'init' ? modulePadding : dragMoveX}px`;
    }
    return style;
  }, [orderModuleSide, dragMoveX, dragStatus]);

  // 拖拽grid区动态样式
  const gridLayoutStyle = useMemo(() => {
    const style: { [key: string]: any } = {};
    if (layoutH) {
      style.height = layoutH + 'px';
    }
    if (orderModuleSide === 'right') {
      style.left = `${dragStatus === 'init' ? 0 : -dragMoveX}px`;
    } else {
      style.marginLeft = `${rightModuleWidth + marginWidth}px`;
      style.right = `${dragStatus === 'init' ? 0 : dragMoveX}px`;
    }
    return style;
  }, [orderModuleSide, dragMoveX, dragStatus, rightModuleWidth, layoutH]);
  const rightModuleRef = useRef(null);

  const chartIdx = 1



  const MyTradeCountDown = () => {
    const { isSmallDesktop } = useResponsive(false);
    useLayoutEffect(() => {
      setTimeout(() => {
        kChartEmitter.emit(kChartEmitter.K_CHART_FULL_SCREEN);
      }, 1000);
    }, [isSmallDesktop]);
    return <TradeCountDown KChart={<KChart symbolType={TRADINGVIEW_SYMBOL_TYPE.SWAP} />} />;
  };



  return (
    <>

       <div className="spot_page_trade">
        <div className="view-main">
          <GridLayout
            className={`view-main-left${layoutDone ? ' layout-done' : ''}`}
            draggableHandle=".draggable-module"
            layout={layoutConfig}
            onLayoutChange={handleLayoutChange}
            onResizeStop={handleDropLayout}
            onDragStop={handleDropLayout}
            cols={colCount}
            rowHeight={rowHeight}
            width={layoutWidth}
            margin={[marginWidth, marginWidth]}
            style={gridLayoutStyle}
          >


            <div key="chart">
              <div className="draggable-module-ctr">
                <div className="draggable-module" />
              </div>
              <div className="view-port-chart">
                <div
                  className={`nav-detail-ctr detail-tv spot_klineContent  nav-detail-ctr-left${chartIdx === 1 ? '' : '-hide'}`}

                >
                  <KlineHeader.Swap />
                  <MyTradeCountDown />
                </div>
              </div>
            </div>

            <div key="history">
              <div className="view-port-history">
                <div className="draggable-module-ctr">
                  <div className="draggable-module" />
                </div>
       
                <KlineViewRight className='kline-view-right' OrderBook={ <OrderBook type={ORDER_BOOK_TYPES.SWAP}  layoutH={historyLayoutH}  />} RecentTrades={<RecentTrades />} />
              </div>
            </div>

            <div key="form">
              <div className="view-positions" id="formCtr">
                <div className="draggable-module-ctr">
                  <div className="draggable-module" />
                </div>
                <div className={`positions-ctr com-scroll-bar scroll-ctr`}>
                <OrderList.SwapDesktop />
                </div>
              </div>
            </div>

          </GridLayout>
          <div
            ref={rightModuleRef}
            className={`view-main-right com-scroll-bar${' com-loading-with-animation'
              }`}
            style={orderModuleStyle}
          >
            <HeaderSwapDemoGuide>
              <TradeView.Swap />
            </HeaderSwapDemoGuide>
            <MarginRatio />
            <Assets />
            <ContractDetails />
            <div
              className="main-right-drag"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragOver}
              onMouseLeave={handleDragOver}
            />

          </div>

        </div>
        <div className='swap-network-info'>
        <NetworkInfo />

        </div>

      </div> 
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`

.kline-header-content {
              height: 58px;
              display: flex;
}

$moduleMargin: 14px;

@mixin comBtn($active: null) {
  cursor: pointer;
  user-select: none;

  @if ($active != null) {
    &:active {
      opacity: 0.8;
    }
  }
}

.layout-done {
  .react-grid-item {
    transition: all 200ms linear;
  }
}

.view-main {
  .react-grid-item {
    .draggable-module {
      cursor: grab;
    }

    &.react-draggable-dragging {
      z-index: 1;
      transition-duration: 0ms;
      .draggable-module {
        cursor: grabbing;
      }
    }

    &.react-grid-placeholder {
      background: rgba(255, 0, 0, 0.2);
      transition-duration: 60ms;
      user-select: none;
      cursor: grabbing;
    }

    .react-resizable-handle {
      cursor: se-resize;
      display: inline-block;
    }
    .react-resizable-handle-se{
      cursor: se-resize;
      display: inline-block;
    }
    &:hover .react-resizable-handle-se{
      &::after{
        content: '';
      }
    }
    .react-resizable-handle-se{
      &::after{
        position: absolute;
      right: 0;
      bottom: 0;
      width: 4px;
      height: 4px;
      border-right: 2px solid red;
      border-bottom: 2px solid red;
      }
    }


    &:hover .react-resizable-handle::after {
      content: '';
    }

    .react-resizable-handle::after {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 4px;
      height: 4px;
      border-right: 2px solid red;
      border-bottom: 2px solid red;
    }
  }
}

// 布局
.spot_page_trade {
  padding-right: 4px;
  color: #ffffff;

  .x-nav-bar {
    height: 36px;
  }

  .view-main {
    display: flex;
    position: relative;
  }

  .view-main-left {
    position: relative;
    flex: 1;
    transition: all 100ms linear;
  }


  @media (min-width: 1921px) {
    .view-main-right {
      /* width: 482px; */
    }
  }

  @media (max-width: 1920px) {
    .view-main-right {
      /* width: 340px; */
    }
  }
  .view-main-right {
    position: absolute;
    top: 4px;
    bottom: 4px;
    height: auto !important;
    overflow-y: scroll;
    user-select: none;

    .main-right-drag {
      position: absolute;
      height: 16px;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
  }

  .view-port {
    display: flex;
  }

  .view-port-chart {
    flex-grow: 1;
    height: 100%;
  }

  .view-port-history {
    height: 100%;
  }

  .view-positions {
    height: 100%;
    position: relative;
  }

  .view-header,
  .view-port-chart,
  .view-port-history,
  .view-main-right,
  .view-positions {
    border-radius: 0px;
    background-color: var(--bg-1);
  }

  .draggable-module-ctr {
    position: relative;
  }

  .draggable-module {
    position: absolute;
    top: 0;
    z-index: 1;
    right: 0;
    left: 0;
    height: 10px;
  }

  .flex-line {
    display: flex;
    align-items: center;

    &.align-center {
      justify-content: center;
    }

    &.align-between {
      justify-content: space-between;
    }
  }

  .flex-line-loves {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .x-order-label,
  .x-checkbox-label {
    color: #ffffff;
  }
}

//头部样式
.view-header {
  position: relative;
  display: flex;
  margin-left: 8px;
  height: 56px;
  padding: 0 16px;
  align-items: center;

  .currency-pair {
    position: relative;
    z-index: 2;
    display: flex;
    min-width: 130px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
    align-items: center;
    cursor: pointer;
    user-select: none;

    .pair-txt {
      margin: 0 10px 0 8px;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 18px;
    }

    .pair-txt-gap {
      position: relative;
      top: -1px;
      margin: 0 4px;
    }

    .coin-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;

      &:nth-of-type(2) {
        margin-left: -4px;
      }
    }

    .symbol-list-drop {
      margin-left: auto;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      fill: #ffffff;
    }
  }

  .current-value {
    min-width: 110px;
    flex-shrink: 0;
    flex-grow: 0;
    margin-left: 10px;
    padding: 0 8px;
    text-align: center;
    font-weight: 500;
    font-size: 18px;
    border-left: 1px solid #333439;
    border-right: 1px solid #333439;
  }

  .detail-ctr {
    position: relative;
    flex-shrink: 0;
    min-width: 78px;
    padding: 0 10px;
    font-size: 12px;

    &.daily-up {
      .detail-value {
        color: #0f984f;
      }
    }

    &.daily-down {
      .detail-value {
        color: #df4040;
      }
    }

    .detail-title {
      color: #aeaeb0;
    }

    .detail-value {
      margin-top: 4px;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 1px;
      height: 24px;
      background-color: #333439;
    }

    &.last-detail-ctr::after {
      opacity: 0;
    }
  }

  .view-header-right {
    position: absolute;
    right: 16px;
    top: 0;
    bottom: 0;
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .header-icon-ctr {
    width: 32px;
    height: 32px;
    margin-left: 8px;
    display: flex;
    background: #333439;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;

    &:hover {
      .icon-edit-indicator {
        fill: #fed702;
      }
    }
  }

  .setting-guidance {
    position: absolute;
    right: 48px;
    height: 40px;
    display: flex;
    align-items: center;

    padding: 0 2px;
    border-radius: 8px;
    background: #fed702;
    white-space: nowrap;
    color: #121212;

    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      right: -5px;
      transform: rotate(45deg);
      background: #fed702;
    }
  }

  .close-setting-guidance {
    width: 20px;
    height: 20px;
    margin: 0 4px;
    fill: #121212;
    opacity: 0.8;
    cursor: pointer;

    &.star {
      width: 28px;
      height: 28px;
    }

    &:hover {
      opacity: 1;
    }
  }

  .icon-edit-indicator {
    width: 22px;
    height: 22px;
    fill: #aeaeb0;
    transition: all 100ms linear;
  }
}

// 导航内容区样式
 .nav-detail-ctr {
  position: absolute;
  top: 0px;
  bottom: 0;
  width: 100%;

  &.with-animation {
    transition: all 240ms linear;
  }

  &.nav-detail-ctr-left-hide {
    transform: translate3d(-100%, 0, 0);
  }

  &.nav-detail-ctr-right-hide {
    transform: translate3d(100%, 0, 0);
  }
}

//图表区样式
.view-port-chart {
  position: relative;
  overflow: hidden;
  height: 100%;

  .chart-area {
    height: 100%;
    width: 100%;
  }

  .funding-ctr {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .loading-ctr {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .x-loading {
      width: 50px;
    }
  }

  .funding-rate-operate {
    position: absolute;
    z-index: 3;
    top: 0;
    right: 0;
    display: flex;
  }

  .funding-rate-btn {
    margin: 0 8px;
    color: #aeaeb0;
    cursor: pointer;
    user-select: none;

    &:hover,
    &.current-rate {
      color: #ffffff;
    }
  }

  .chart-funding {
    padding: 16px 20px 16px 16px;
  }
}

//历史记录
.view-port-history {
  position: relative;
  overflow: hidden;

  //最近成交
  .nav-detail-ctr {
    display: flex;
    flex-direction: column;

    .trade-line-ctr {
      display: flex;
      padding: 12px 16px;
      font-size: 12px;
      color: #aeaeb0;

      &.enable-click {
        cursor: pointer;

        &:hover {
          background: #2a2a30;
        }

        &:active {
          opacity: 0.8;
        }
      }
    }

    .trade-item-ctr {
      height: 24px;
      padding: 0 16px;
      align-items: center;
    }

    .trade-detail-area {
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .trade-item {
      width: 33.33%;
      text-align: right;

      &:nth-of-type(1) {
        text-align: left;
      }
    }

    .trade-item-total {
      margin-left: 10px;
      position: relative;
      overflow: hidden;
      height: 22px;
      line-height: 22px;
    }

    .trade-item-total-cursor {
      position: absolute;
      top: 0;
      right: 100%;
      width: 100%;
      height: 100%;
      transition: all 120ms ease-in-out;
      transform: translateX(0);

      &.item-sell {
        background: rgba(15, 152, 79, 0.1);
      }

      &.item-buy {
        background: rgba(223, 64, 64, 0.1);
      }
    }
  }
}

//OrderBook 样式

.view-order-book {
  display: flex;
  height: 100%;
  flex-direction: column;
  font-size: 12px;

  .order-book-type-ctr {
    display: flex;
    padding: 8px 16px 4px;
    align-items: center;
  }

  .order-book-type-btn {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    cursor: pointer;
    user-select: none;

    &.current {
      background: #333439;
      border-radius: 4px;
    }

    &:not(.current):hover {
      background: #333439;
      border-radius: 4px;
    }

    &.type-btn-buy {
      fill: #0f984f;
    }

    &.type-btn-sell {
      fill: #df4040;
    }
  }

  .order-book-deep {
    margin-left: auto;
    border-radius: 8px;
    background: #2a2a30;
    font-size: 12px;

    .x-dropdown-show-line {
      padding: 4px 8px 4px 10px;
    }

    .current-txt {
      margin-left: auto;
    }
  }

  .order-book-data-ctr {
    position: relative;
    flex: 1;

    .long-data-ctr,
    .short-data-ctr {
      overflow: hidden;
    }
  }

  .order-book-data-ctr-ani {
    .short-data-ctr,
    .long-data-ctr {
      transition: all 120ms linear;
    }
  }

  .order-book-title-ctr {
    display: flex;
    height: 24px;
    padding: 0 16px;
    align-items: center;
    color: #aeaeb0;
  }

  .order-book-item {
    width: 33.33%;
    text-align: right;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:nth-of-type(1) {
      text-align: left;
    }
  }

  .current-price-ctr {
    display: flex;
    height: 34px;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    background: #121212;
    font-weight: 600;
    font-size: 16px;
  }

  .last-price {
    display: flex;
    align-items: center;

    .last-price-icon {
      width: 22px;
      height: 22px;
    }

    &.is-up {
      color: #0f984f;

      .last-price-icon {
        fill: #0f984f;
      }
    }

    &.is-down {
      color: #df4040;

      .last-price-icon {
        fill: #df4040;
        transform: rotate(180deg);
      }
    }
  }

  .reference-price {
    display: flex;
    align-items: center;
    color: #fed702;

    .oracle-price-icon {
      width: 22px;
      height: 22px;
      fill: #fed702;
    }
  }

  .order-book-item-ctr {
    display: flex;
    height: 24px;
    align-items: center;
    padding: 0 16px;
    font-size: 12px;
    color: #aeaeb0;

    &.item-buy-ctr {
      animation: showBuyOrder 300ms linear;
    }

    &.item-sell-ctr {
      animation: showSellOrder 300ms linear;
    }

    &.enable-click {
      cursor: pointer;

      &:hover {
        background: #2a2a30;
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  .has-sell-order-icon,
  .has-buy-order-icon {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 10px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
    }
  }

  .has-buy-order-icon::before {
    background: #0f984f;
  }

  .has-sell-order-icon::before {
    background: #df4040;
  }
}

.trade-order-copy {
  .copy-icon {
    display: inline-block;
    margin-left: 2px;
    cursor: pointer;

    &:hover {
      > svg {
        fill: #ffffff;
      }
    }
    > svg {
      fill: #aeaeb0;
    }
  }
}

//仓位区
.view-positions {
  display: flex;
  flex-direction: column;

  .positions-nav {
    flex-shrink: 0;

    .x-nav-item {
      line-height: 36px;
    }
  }

  .positions-operate-ctr {
    top: 0;
    right: 0;
    height: 36px;
    position: absolute;
    display: flex;
    align-items: center;
    padding-right: 16px;
  }

  .jump-token-ceil {
    margin-left: 8px;
    display: flex;
    align-items: center;
    padding-left: 8px;
    border-left: 1px solid #333439;
    cursor: pointer;
  }

  .token-img {
    width: 16px;
    height: 16px;
  }

  .token-ceil-line {
    margin-left: 4px;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;

    &.token-USDC {
      &:hover {
        color: #2775ca;

        .to-token-icon {
          fill: #2775ca;
        }
      }
    }

    &.token-USDT {
      &:hover {
        color: #53ae94;

        .to-token-icon {
          fill: #53ae94;
        }
      }
    }
  }

  .to-token-icon {
    width: 16px;
    height: 16px;
    fill: #ffffff;
    position: relative;
    top: 1px;
  }

  .positions-ctr {
    position: relative;
    flex-grow: 1;
    width: 100%;
    overflow-x: scroll;
    height: 100%;
  }

  .action-btn {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    border-radius: 4px;

    background: #2a2a30;

    &.action-btn-add {
      min-width: 54px;
    }

    &.action-btn-add-sm {
      margin-top: 4px;
      margin-right: 0;
    }

    &:nth-of-type(2) {
      margin-left: 8px;
    }

    .x-button-txt {
      font-size: 12px;
    }
  }

  .table-padding-bottom {
    height: 16px;
  }

  .positions-table {
    position: absolute;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    .x-table-tr {
      // border-bottom: 4px solid transparent;
    }

    .symbol-td {
      position: relative;
      cursor: pointer;

      &::before {
        content: '';
        margin-right: 6px;
        height: 40px;
        width: 2px;
        border-radius: 8px 0 0 8px;
      }

      &.symbol-td-long {
        background: linear-gradient(90deg, var(--trade-color-long-stop-start) 0%, #121212 100%) 18px;
        &::before {
          border-left: 2px solid #0f984f;
        }
      }

      &.symbol-td-short {
        background: linear-gradient(90deg, var(--trade-color-short-stop-start) 0%, #121212 100%) 18px;
        &::before {
          border-left: 2px solid #df4040;
        }
      }

      &.symbol-td-neutral {
        background: linear-gradient(90deg, #3f3f3f 0%, #121212 100%) 18px;
        &::before {
          border-left: 2px solid #ffffff;
        }
      }
    }

    .base-coin {
      margin-right: 4px;
      width: 18px;
      height: 18px;
    }

    .other-coin {
      position: relative;
      right: 6px;
      top: 8px;
      width: 12px;
      height: 12px;
    }

    .item-contract {
      display: inline-flex;
      align-items: center;
      padding-bottom: 2px;
    }

    //追踪出场、止盈止损编辑样式
    .edit-ceil {
      display: flex;
      height: 50px;
      justify-content: center;
      align-items: center;
      font-size: 10px;

      .edit-ceil-icon {
        width: 16px;
        height: 16px;
        fill: #ffffff;
        cursor: pointer;

        &:hover {
          fill: #fed702;
        }

        &:active {
          opacity: 0.9;
        }
      }
    }

    .adl-ceil {
      margin-left: 4px;
      cursor: help;
    }

    .adl-item {
      display: inline-block;
      width: 2px;
      height: 8px;
      background: #3b3b3b;
      margin: 0 1px;

      &.adl-in {
        background: #36f092;

        &:nth-of-type(2) {
          background: #e4ff3d;
        }

        &:nth-of-type(3) {
          background: #ffdf34;
        }
        &:nth-of-type(4) {
          background: #ffae35;
        }
        &:nth-of-type(5) {
          background: #ff6635;
        }
      }
    }

    td:first-of-type,
    th:first-of-type {
      position: sticky;
      left: 0;
      z-index: 1;
      background: #121212;
    }

    &.has-action-table {
      td:last-of-type,
      th:last-of-type {
        background: #121212;
        position: sticky;
        right: 0;
      }

      &.can-scroll-row {
        th:last-of-type,
        td:last-of-type {
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 1px;
            height: 100%;
            box-shadow: -2px 0 2px var(--trade-body-bg);
          }
        }
      }
    }
  }

  .exit-price-tips {
    top: 3px;
    .x-popover-content {
      padding: 16px 10px;
      font-size: 14px;
    }
  }
}

//下单区样式
.view-create-order {
  font-size: 14px;

  .create-order-top {
    background: var(--module-title-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-type-nav {
    padding: 0 0 0 10px;
    border-bottom: none;
    border-radius: 0;
  }

  .create-order-top-right {
    display: flex;
    flex: 1;
    padding-right: 12px;
    justify-content: space-between;
    align-items: center;
  }

  .condition-type-selector {
    margin-left: -12px;

    .x-dropdown-list-ctr {
      top: 6px;
      right: -12px;
      padding-top: 18px;
    }

    .x-dropdown-item {
      height: 40px;
      line-height: 40px;
      padding: 0 12px;
    }

    .current-txt {
      display: none;
    }
  }

  .cross-btn {
    display: flex;
    height: 30px;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    background: var(--trade-body-bg);
    cursor: pointer;

    font-weight: 600;
    color: #fed702;
  }

  .create-order-area {
    padding: 12px 12px 0;
    font-size: 12px;
  }

  #createOrderPanel {
    padding-bottom: 2px;
  }

  .order-input-qty {
    margin-bottom: 8px;
  }

  .order-qty-ratio {
    margin-bottom: 24px;
  }

  .ratio-qty-line {
    height: 40px;
    padding: 0 12px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--trade-body-bg);
    border: 1px solid transparent;
    border-radius: 6px;
    font-size: 14px;
  }

  .ratio-qty-ceil {
    width: 240px;
    cursor: pointer;
  }

  .ratio-to-qty {
    margin-left: 4px;
    font-size: 12px;
    color: #aeaeb0;
  }

  .qty-label-ctr {
    display: flex;
  }

  .qty-label-coin {
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
  }

  .label-switch-icon {
    margin-left: 2px;
    width: 16px;
    height: 16px;
    fill: #aeaeb0;
    cursor: pointer;

    &:hover {
      color: #ffffff;
    }
  }

  .order-input-value {
    width: 68px;
    transition: all 120ms linear;

    &:hover {
      color: #ffffff;
    }

    .x-order-input {
      transition: all 120ms linear;
      width: 0;
      padding-right: 0;
      opacity: 0;
    }
  }

  .order-input-trigger {
    flex: 1;
    max-width: 240px;
  }

  .order-input {
    margin-bottom: 8px;
  }

  .condition-price-line {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 8px;
    border-radius: 6px;
    background: var(--trade-body-bg);
  }

  .condition-type-btn {
    width: 150px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    background: #2a2a30;
    text-align: center;
    cursor: pointer;
    user-select: none;

    &.current {
      color: #fed702;
    }

    &:not(.current):hover {
      color: #ffffff;
    }

    &:not(.current):active {
      color: #aeaeb0;
    }
  }

  .tpOsl-ctr {
    display: none;
    color: #aeaeb0;

    &.tpOsl-ctr-show {
      display: block;
      animation: showTpOSlCtr 100ms linear forwards;
    }

    .flex-line-loves {
      padding: 16px 0;
    }
  }

  .create-order-btn {
    flex: 1;
    flex-direction: column;
    height: 52px;
    padding-top: 2px;
    border-radius: 12px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    opacity: 0.9;
    box-shadow: inset -1px -4px 0 rgba(0, 0, 0, 0.32);
    color: #121212;

    &.coming-soon-btn {
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0px -5px 0px 0px rgba(0, 0, 0, 0.32) inset;
      color: #ffffff;
    }

    &:nth-of-type(2) {
      margin-left: 12px;
    }

    .order-btn-txt {
      font-weight: 700;
    }

    .order-btn-value {
      padding-top: 1px;
      font-size: 12px;

      &.has-value {
        opacity: 0.9;
      }
    }

    .x-button-loading {
      width: 20px;
      height: 20px;
    }
  }

  .create-order-btn-line {
    margin: 24px 0 8px;
  }

  .create-order-line {
    margin: 12px 0;
  }

  .max-qty-label-line {
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #aeaeb0;
  }

  .max-qty-ceil {
    width: 168px;
    display: flex;
    justify-content: space-between;
  }

  .liq-price-line {
    margin-top: 6px;
  }

  .max-qty-value-data {
    color: #ffffff;

    &.liq-data {
      color: #fed702;
    }
  }
}

//资产
.property-ctr {
  font-size: 12px;
  color: #aeaeb0;

  #assetCtr {
    padding: 12px 12px 2px;
  }

  .symbol-infos {
    padding: 0 12px 20px;
  }

  .property-title {
    display: flex;
    align-items: center;
    font-weight: 700;
    color: #ffffff;

    .eye-icon {
      margin-left: 4px;
      width: 16px;
      height: 16px;
      fill: #ffffff;
      cursor: pointer;
    }
  }

  .transfer-btn {
    height: 28px;
    min-width: 80px;
    padding: 0 8px;
    border-radius: 8px;
  }

  .flex-line-loves {
    margin-bottom: 12px;

    &.no-margin {
      margin: 0;
    }

    &.total-line {
      margin: 12px 0;
    }
  }

  .property-btn-deposit,
  .property-btn-withdraw {
    min-width: 80px;
    padding: 0 8px;
    border-radius: 8px;
  }

  .property-btn-deposit {
    height: 30px;
  }

  .property-btn-withdraw {
    height: 32px;
    margin-left: 8px;
    background: var(--trade-color-operate-opacity);
    color: #fed702;
  }

  .property-item-value {
    &.has-value {
      color: #ffffff;
    }
  }

  .detail-info {
    padding-top: 16px;
    justify-content: initial;
    font-weight: 700;
    color: #ffffff;

    .property-item-value {
      margin-left: 4px;
    }
  }
}

.login-ctr {
  height: 100%;
  display: flex;
  padding-top: 224px;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  .login-logo {
    width: 98px;
  }

  .logo-tips {
    margin-top: 10px;
    line-height: 1.8;
    padding: 0 40px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
  }

  .login-btn {
    margin-top: 20px;
    width: 160px;
    line-height: 32px;
    border-radius: 32px;
    font-weight: 500;
    font-size: 14px;
  }
}

.risk-rate-table {
  &.x-table-com {
    thead {
      background: #2a2a30;
    }

    .x-table-tr {
      &:hover {
        td {
          background: #121212 !important;
          &.in-level {
            background: rgba(254, 215, 2, 0.2) !important;
          }
        }
      }
    }
  }

  .in-level {
    background: rgba(254, 215, 2, 0.2);
    color: #fed702;

    &:nth-of-type(1) {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 16px;
        border: 4px solid transparent;
        border-left-color: #fed702;
      }
    }
  }

  .risk-value-ceil {
    display: flex;
    align-items: center;
  }

  .risk-value-item,
  .risk-value-item-second {
    width: 110px;

    &.text-align-center {
      text-align: center;
    }
  }

  .risk-value-gap {
    margin: 0 4px;
  }

  .risk-value-item-second {
    text-align: right;
  }
}

@keyframes showTpOSlCtr {
  from {
    height: 0;
  }
  90% {
    height: 88px;
  }
  to {
    height: auto;
  }
}

@keyframes inputShow {
  from {
    height: 0;
  }
  to {
    height: 42px;
  }
}

@keyframes showBuyOrder {
  from,
  to {
    background: transparent;
  }
  50% {
    background: rgba(15, 152, 79, 0.1);
  }
}

@keyframes showSellOrder {
  from,
  to {
    background: transparent;
  }
  50% {
    background: rgba(223, 64, 64, 0.1);
  }
}

.tooltip-icon-ctr {
  &.fill-tips-icon {
    position: relative;
    top: -1px;
  }
}

.with-help {
  cursor: help;
}

.tooltip-icon {
  margin-left: 2px;
  height: 16px;
  width: 16px;
  fill: #aeaeb0;
  cursor: help;
  &:hover {
    fill: #ffffff;
  }
}

.tpOsl-price {
  color: #ffffff;
}

.tpOsl-ratio-tp {
  color: #0f984f;
}

.tpOsl-ratio-sl {
  color: #df4040;
}

.tpOsl-ratio-reverse {
  .tpOsl-ratio-tp {
    color: #df4040;
  }

  .tpOsl-ratio-sl {
    color: #0f984f;
  }
}

.tips-full-icon-ctr {
  line-height: 7px;

  .tips-full-icon {
    width: 14px;
    height: 14px;
    fill: #aeaeb0;
  }
}

//header指数价格提示
.index-price-tips {
  min-width: 344px;

  .index-price-tips-area {
    padding: 6px;
    font-size: 14px;
    color: #ffffff;
  }

  .index-price-tips-title {
    font-weight: 700;
  }

  .index-price-tips-detail-ctr {
    margin-top: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-top: none;
    border-radius: 8px;
  }

  .tips-detail-tr {
    display: flex;
    height: 32px;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .detail-tr-header {
    border-radius: 8px 8px 0 0;
    background: rgba(255, 255, 255, 0.08);
  }

  .tips-detail-item {
    flex: 1;
    text-align: center;
  }
}

.trade-tooltip {
  font-size: 14px;
  color: #ffffff;
}

.cross-bottom-tooltip {
  right: 16px;
}

.item-tips-line {
  white-space: nowrap;
  font-size: 14px;
}

.item-tips-icon {
  width: 16px;
  height: 16px;
  fill: #aeaeb0;
  cursor: help;
}
.spot_KlineContent {
  margin-top: 28px;
}


`;

export default DesktopNoSSR;
