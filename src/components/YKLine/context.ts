import { createContext } from 'react';
import { ChartType, KLinePriceType } from './types';
// import { CandleType } from 'klinecharts';
import { CandleType } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

interface ExchangeChartContextValue {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  originalKLineStyle: CandleType,
  setOriginalKLineStyle: (style: CandleType) => void;
  kLinePriceType: KLinePriceType;
  setKLinePriceType: (type: KLinePriceType) => void;
  kLineResolution: string;
  setKLineResolution: (resolution: string) => void;
  showPositionLine: boolean;
  setShowPositionLine: (show: boolean) => void;
  showPositionTPSLLine: boolean;
  setShowPositionTPSLLine: (show: boolean) => void;
  showHistoryOrderMark: boolean;
  setShowHistoryOrderMark: (show: boolean) => void;
  // 强平线
  showLiquidationLine: boolean;
  setShowLiquidationLine: (show: boolean) => void;

};

const ExchangeChartContext = createContext<ExchangeChartContextValue>(
  {
    chartType: ChartType.TradingView,
    setChartType: () => {},
    originalKLineStyle: CandleType.CandleSolid,
    setOriginalKLineStyle: () => {},
    kLinePriceType: KLinePriceType.Last,
    setKLinePriceType: () => {},
    kLineResolution: '15',
    setKLineResolution: () => {},
    showPositionLine: false,
    setShowPositionLine: () => {},
    showPositionTPSLLine: false,
    setShowPositionTPSLLine: () => {},
    showHistoryOrderMark: false,
    setShowHistoryOrderMark: () => {},
    showLiquidationLine: false,
    setShowLiquidationLine: () => {},
  }
);

export default ExchangeChartContext;

export const ExchangeChartContextProvider = ExchangeChartContext.Provider;