import { kChartEmitter } from '@/core/events';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarkteDetail } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { useEffect, useRef } from 'react';
import { ResolutionType } from '../../components/k-header/resolution/config.js';
import { TRADINGVIEW_SYMBOL_TYPE } from '../../view.jsx';
import { Chart } from './library/index.js';

interface Options {
  id?: string;
  language?: string;
  interval?: number;
  containerId?: string;
  theme?: string;
  indicators?: string[];
  resolution: ResolutionType;
  symbolType: TRADINGVIEW_SYMBOL_TYPE;
  qty: number;
}

const TradingView = ({
  containerId = 'trading-view',
  language = 'en',
  interval = 1,
  id = 'BTC_USDT',
  theme = 'dark',
  indicators = ['MA', 'VOL'],
  resolution,
  symbolType,
  qty = 0,
}: Options) => {
  const ref = useRef<Chart | null>(null);
  useEffect(() => {
    MarkteDetail.getGroupList().then((tradeList) => {
      const config = {
        id: containerId + qty,
        language,
        symbol: id,
        indicators,
        theme: localStorageApi.getItem(LOCAL_KEY.THEME) || theme,
        skin: localStorageApi.getItem(LOCAL_KEY.DATA_SKIN) || 'primary',
        tradeList,
        resolution,
        symbolType,
        qty,
      };
      ref.current = new Chart(config);

      kChartEmitter.on(kChartEmitter.K_CHART_INDICATOR_TRADINGVIEW + qty, () => {
        ref.current?.openIndicators?.();
      });
      kChartEmitter.on(kChartEmitter.K_CHART_SCREENSHOT_TRADINGVIEW + qty, () => {
        ref.current?.screenshot?.();
      });
      kChartEmitter.on(kChartEmitter.K_CHART_SEARCH_SYMBOL_TRADINGVIEW + qty, () => {
        ref.current?.openSearchSymbol?.();
      });
      kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_CHART_TYPE + qty, (val) => {
        ref.current?.switchChartType?.(val);
      });
    });
  }, []);

  useEffect(() => {
    ref.current?.setTheme?.(localStorageApi.getItem(LOCAL_KEY.THEME) || theme);
  }, [theme]);

  useEffect(() => {
    ref.current?.switchCommodity?.(id);
  }, [id]);

  useEffect(() => {
    ref.current?.switchResolution?.(resolution);
  }, [resolution]);

  useWs(SUBSCRIBE_TYPES.ws4001, (data) => ref.current?.updateData?.(data));

  return (
    <>
      <div id={containerId + qty} style={{ flex: 1 }}></div>
    </>
  );
};

export default TradingView;
