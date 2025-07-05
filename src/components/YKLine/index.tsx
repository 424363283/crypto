'use client';

import { useState, useMemo, useRef } from 'react';

import Header from './Header';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import TradingView from './StockChart/Tradingview';
import OriginalKLine from './StockChart/OriginalKLine';
// import DepthChart from './DepthChart';
import { getKineState } from '@/store/kline';
import { SUPPORT_RESOLUTIONS } from './types';
import { DeepChart } from '@/src/components/chart/k-chart/lib/deep-chart/index';

// import { CandleType } from 'klinecharts';
import { CandleType } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

import {
  ChartType,
  STORAGE_ORIGINAL_KLINE_STYLE,
  STORAGE_CHART_TYPE_KEY, STORAGE_K_LINE_RESOLUTION_KEY,
  STORAGE_SHOW_POSITION_LINE_KEY, STORAGE_SHOW_HISTORY_MARK_KEY,
  STORAGE_KLINE_PRICE_TYPE_KEY,
  STORAGE_SHOW_LIQUIDATION_LINE_KEY,
  STORAGE_SHOW_POSIITION_TPSL_LINE_KEY,
  STORAGE_SHOW_CURRENT_ENTRUST_LINE_KEY,
  STORAGE_SHOW_COUNT_DOWN,
  KLinePriceType
} from './types';

import { ExchangeChartContextProvider } from './context';
import { ChartRef } from './StockChart/types';

import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import styles from './index.module.scss';


export default function ExchangeChart({ originalKLineChartContainerId,pricePrecision }:any) {
  const chartRef = useRef<ChartRef>(null);
  const router = useRouter();
  let { id, locale } = router.query;
  const [chartType, setChartType] = useState<ChartType>(() => {
    const type = +(localStorage.getItem(STORAGE_CHART_TYPE_KEY) ?? '0');
    if (type === ChartType.TradingView || type === ChartType.Original) {
      return type;
    }
    return ChartType.Original;
  });

  const [originalKLineStyle, setOriginalKLineStyle] = useState<CandleType>(() => {
    const style = (localStorage.getItem(STORAGE_ORIGINAL_KLINE_STYLE) ?? CandleType.CandleSolid);
    if (
      style === CandleType.CandleSolid ||
      style === CandleType.CandleStroke ||
      style === CandleType.CandleUpStroke ||
      style === CandleType.CandleDownStroke ||
      style === CandleType.Area
    ) {
      return style;
    }
    return CandleType.CandleSolid;
  });

  const [kLineResolution, setKLineResolution] = useState(() => {
    const resolution = localStorage.getItem(STORAGE_K_LINE_RESOLUTION_KEY) ?? '15';
    if (SUPPORT_RESOLUTIONS.includes(resolution)) {
      return resolution;
    }
    return '15';
  });

  const [showPositionLine, setShowPositionLine] = useState(() => {
    const show = +(localStorage.getItem(STORAGE_SHOW_POSITION_LINE_KEY) ?? '1');
    return !!show;
  });

  const [showHistoryOrderMark, setShowHistoryOrderMark] = useState(() => {
    const show = +(localStorage.getItem(STORAGE_SHOW_HISTORY_MARK_KEY) ?? '1');
    return !!show;
  });



  const [showLiquidationLine, setShowLiquidationLine] = useState(() => {
    const show = +(localStorage.getItem(STORAGE_SHOW_LIQUIDATION_LINE_KEY) ?? '1');
    return !!show;
  });

  const [showPositionTPSLLine, setShowPositionTPSLLine] = useState(() => {
    const show = +(localStorage.getItem(STORAGE_SHOW_POSIITION_TPSL_LINE_KEY) ?? '1');
    return !!show;
  });

  const [showCurrentEntrustLine, setShowCurrentEntrustLine] = useState(() => {
    const show = +(localStorage.getItem(STORAGE_SHOW_CURRENT_ENTRUST_LINE_KEY) ?? '1');
    return !!show;
  });

  const [showCountdown, setShowCountdown] = useState(() => {
    const show = +(localStorage.getItem(STORAGE_SHOW_COUNT_DOWN) ?? '1');
    return !!show;
  });


  const [kLinePriceType, setKLinePriceType] = useState(() => {
    const type = +(localStorage.getItem(STORAGE_KLINE_PRICE_TYPE_KEY) ?? '0');
    if (type === KLinePriceType.Last || type === KLinePriceType.Index) {
      return type;
    }
    return KLinePriceType.Last;
  });

  const { disableKlinePointEvent } = getKineState();

  const contextValue = useMemo(() => {
    return {
      chartType,
      originalKLineStyle,
      kLinePriceType,
      kLineResolution,
      showPositionLine,
      showHistoryOrderMark,
      showLiquidationLine,
      showPositionTPSLLine,
      showCurrentEntrustLine,
      showCountdown,
      setChartType: (type: ChartType) => {
        if (type === ChartType.Original || type === ChartType.TradingView) {
          localStorage.setItem(STORAGE_CHART_TYPE_KEY, `${type}`);
        }
        setChartType(type);
      },
      setOriginalKLineStyle: (style: CandleType) => {
        localStorage.setItem(STORAGE_ORIGINAL_KLINE_STYLE, `${style}`);
        setOriginalKLineStyle(style);
      },
      setKLinePriceType: (type: KLinePriceType) => {
        localStorage.setItem(STORAGE_KLINE_PRICE_TYPE_KEY, `${type}`);
        setKLinePriceType(type);
      },
      setKLineResolution: (resolution: string) => {
        localStorage.setItem(STORAGE_K_LINE_RESOLUTION_KEY, `${resolution}`);
        setKLineResolution(resolution);
      },
      setShowPositionLine: (show: boolean) => {
        localStorage.setItem(STORAGE_SHOW_POSITION_LINE_KEY, show ? '1' : '0');
        setShowPositionLine(show);
      },
      setShowHistoryOrderMark: (show: boolean) => {
        localStorage.setItem(STORAGE_SHOW_HISTORY_MARK_KEY, show ? '1' : '0');
        setShowHistoryOrderMark(show);
      },
      setShowLiquidationLine: (show: boolean) => {
        localStorage.setItem(STORAGE_SHOW_LIQUIDATION_LINE_KEY, show ? '1' : '0');
        setShowLiquidationLine(show);
      },
      setShowPositionTPSLLine: (show: boolean) => {
        localStorage.setItem(STORAGE_SHOW_LIQUIDATION_LINE_KEY, show ? '1' : '0');
        setShowPositionTPSLLine(show);
      },
      setShowCurrentEntrustLine: (show: boolean) => {
        localStorage.setItem(STORAGE_SHOW_CURRENT_ENTRUST_LINE_KEY, show ? '1' : '0');
        setShowCurrentEntrustLine(show);
      },
      setShowCountdown: (show: boolean) => {
        localStorage.setItem(STORAGE_SHOW_COUNT_DOWN, show ? '1' : '0');
        setShowCountdown(show);
      }
    };
  }, [chartType, originalKLineStyle, kLinePriceType, kLineResolution, showPositionLine, showHistoryOrderMark, showLiquidationLine, showPositionTPSLLine, showCurrentEntrustLine, showCountdown]);








  const renderChart = () => {
    // return <OriginalKLine key="OriginalKLine" ref={chartRef} containerId={originalKLineChartContainerId}/>
    switch (chartType) {
      case ChartType.Original: {
        return <OriginalKLine key="OriginalKLine" coinPricePrecision={pricePrecision}   ref={chartRef} containerId={originalKLineChartContainerId} />;
      }
      case ChartType.TradingView: {
        return (
          <TradingView key="TradingView" coinPricePrecision={pricePrecision}   ref={chartRef} />
        );
      }
      case ChartType.Depth: {
        return  '';
      }
    }
  };

  return (
    <ExchangeChartContextProvider
      value={contextValue}>
      <div className={styles.klineContainer}>
        <Header
          onIndicatorClick={() => {
            if (chartRef.current) {
              chartRef.current.openIndicatorModal();
            }
          }}
          onSettingClick={() => {
            if (chartRef.current) {
              chartRef.current.openSettingModal();
            }
          }} />
        <div
          className={styles.klineContainer}
          style={{ pointerEvents: disableKlinePointEvent ? 'none' : 'initial' }}>
          {renderChart()}
        </div>
      </div>
    </ExchangeChartContextProvider>
  );
}
