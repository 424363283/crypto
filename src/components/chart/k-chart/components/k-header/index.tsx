import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { Svg } from '@/components/svg';
import { kChartEmitter } from '@/core/events';
import { isSwap } from '@/core/utils';
import { useEffect } from 'react';
import { ChartType } from './chart-type';
import { Resolution } from './resolution/resolution';
import { Right } from './right';
import { KlineHeaderActionSetting } from './setting';
import { KTYPE, kHeaderStore } from './store';

export const KHeader = ({ id, qty }: { id: string; qty: number }) => {
  const store = kHeaderStore(qty);
  const { kType, resolution } = store;
  useEffect(() => {
    return () => {
      kChartEmitter.removeAllListeners();
    };
  }, []);

  return (
    <>
      <div className='box'>
        <ScrollXWrap wrapClassName='k-h' left='0' right='0'>
          <div className='l'>
            <div style={{ display: kType == KTYPE.DEEP_CHART ? 'none' : 'block' }}>
              <Resolution qty={qty} />
            </div>
            {[KTYPE.TRADING_VIEW].includes(kType) && (
              <div
                className='action'
                onClick={() => {
                  if (kType == KTYPE.K_LINE_CHART) {
                    kChartEmitter.emit(kChartEmitter.K_CHART_INDICATOR_KLINE + qty);
                  } else {
                    kChartEmitter.emit(kChartEmitter.K_CHART_INDICATOR_TRADINGVIEW + qty);
                  }
                }}
              >
                <Svg
                  src='/static/images/trade/kline/indicator.svg'
                  width={26}
                  height={26}
                  currentColor={'var(--theme-kline-header-color)'}
                />
              </div>
            )}
            {[KTYPE.TRADING_VIEW].includes(kType) && resolution.key != 'Line' && <ChartType qty={qty} />}
            {/* {[KTYPE.K_LINE_CHART].includes(kType) && <KlineHeaderActionOrders store={store} />} */}
            {[KTYPE.K_LINE_CHART].includes(kType) && <KlineHeaderActionSetting store={store} isSwap={isSwap(id)} />}
            {[KTYPE.TRADING_VIEW, KTYPE.K_LINE_CHART].includes(kType) && (
              <div
                className='action'
                onClick={() => {
                  if (kType == KTYPE.K_LINE_CHART) {
                    kChartEmitter.emit(kChartEmitter.K_CHART_SCREENSHOT + qty);
                  } else {
                    kChartEmitter.emit(kChartEmitter.K_CHART_SCREENSHOT_TRADINGVIEW + qty);
                  }
                }}
              >
                <Svg
                  src='/static/images/trade/kline/screen-shot.svg'
                  width={26}
                  height={26}
                  currentColor={'var(--theme-kline-header-color)'}
                />
              </div>
            )}
            {[KTYPE.TRADING_VIEW].includes(kType) && (
              <div
                className='action'
                onClick={() => {
                  if (kType == KTYPE.K_LINE_CHART) {
                    kChartEmitter.emit(kChartEmitter.K_CHART_SEARCH_SYMBOL_TRADINGVIEW + qty);
                  } else {
                    kChartEmitter.emit(kChartEmitter.K_CHART_SEARCH_SYMBOL_TRADINGVIEW + qty);
                  }
                }}
              >
                <Svg
                  src='/static/images/trade/kline/add.svg'
                  width={26}
                  height={26}
                  currentColor={'var(--theme-kline-header-color)'}
                />
              </div>
            )}
          </div>
          <Right id={id} qty={qty} />
        </ScrollXWrap>
      </div>
      <style jsx>
        {`
          :global(.k-full-screen) {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
          }
          .box {
            width: 100%;
            overflow: hidden;
            font-weight: 500;
            :global(.k-h) {
              width: 100%;
              height: 38px;
              flex-shrink: 0;
              border-bottom: 1px solid var(--theme-trade-bg-color-1);
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 15px;
              white-space: nowrap;
              overflow: hidden;
              .l {
                flex: 1;
                display: flex;
                align-items: center;
                .action {
                  margin-left: 10px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        `}
      </style>
    </>
  );
};
