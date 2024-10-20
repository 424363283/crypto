
import { init, Chart, Nullable, dispose, CandleType, registerOverlay, KLineData, Point } from 'klinecharts';

import { ResolutionString } from '../../../../../public/tradingView/charting_library/charting_library';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


import positionLine, { PositionLineFigureKey } from './extension/positionLine';

import positionTPTLLine, { PositionTPSLLineFigureKey } from './extension/positionTPTLLine';
// import positionTPTLLine from './extension/positionTPTLLine'
import historyOrderMark, { HistoryOrderMarkArrowDirection } from './extension/historyOrderMark';

import { DatafeedSymbolInfo } from '../Datafeed';

import { getTheme } from './overrides';

import { WidgetOptions } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

export const STORAGE_ORIGINAL_INDICATOR_KEY = 'bv_original_indicator';

export enum IndicatorType {
  Main = 'main',
  Sub = 'sub'
}

interface IndicatorInfo {
  name: string;
  type: IndicatorType;
}

export interface PositionLineOptions {
  direction: string;
  directionColor: string;
  profitLoss: string;
  profitLossColor: string;
  backgroundColor: string;
  price: number;
  volume: string;
  closeTooltip: string;
  reverseTooltip: string;
  tooltipColor: string;
  onReverseClick: () => void;
  onCloseClick: () => void,
  onOrderdrag: (e) => void;
}

export interface HistoryOrderMarkOptions {
  point: Pick<Point, 'timestamp'>;
  direction: HistoryOrderMarkArrowDirection;
  color: string;
  tooltip: string;
  tooltipColor: string;
}

export default class Widget {

  private _chart: Nullable<Chart>;
  private _options: WidgetOptions;
  private _symbolInfo: Nullable<DatafeedSymbolInfo> = null;

  private _positionLineCountMap: Record<string, number> = {};
  private _historyMarkCountMap: Record<string, number> = {};

  private _paneIds: Record<string, string> = {};

  constructor (options: WidgetOptions) {
    registerOverlay(positionLine);
    registerOverlay(positionTPTLLine);
    registerOverlay(historyOrderMark);
    this._options = options;
    const containerId = options.container ?? 'bv_kline_chart';
    this._chart = init(containerId, {
      locale: options.locale,
      styles: getTheme(options.theme),
      decimalFoldThreshold: 100
    });
    this._createWatermark();
    // 加载更多
    this._chart?.setLoadDataCallback((params) => {
      if (params.type === 'backward') {
        params.callback([], false);
      } else {

        let from = params.data?.timestamp;
        if (from) {
          from = this._getTimeRange(from, this._options.interval, 1).from * 1000;
        } else {
          from = new Date().getTime();
        }
        const range = this._getTimeRange(from, this._options.interval);
        this._options.datafeed.getBars(
          this._symbolInfo!,
          this._options.interval as ResolutionString,
          { ...range, firstDataRequest: false },
          (dataList, meta) => {
            params.callback(dataList, !(meta?.noData ?? true));
          },
          () => {}
        );
      }
    });
    this.setSymbol(options.symbol, options.interval);
  }

  private _createWatermark () {
    if (this._chart) {
      const container = this._chart.getDom();
      if (container) {
        const waterMarkId = 'bv_klinecharts_watermark';
        const background = `url("/images/KlineChart/klinechart_${this._options.theme}.svg")`;
        let watermark = container.querySelector('#' + waterMarkId);
        if (!watermark) {
          watermark = document.createElement('div');
          watermark.id = waterMarkId;
          container.appendChild(watermark);
        }
        // @ts-ignore
        watermark.style = `position:absolute;top:0;z-index:0;width: 100%;height:100%;background:${background} repeat;background-position: center center`;
      }
    }
  }

  getCacheIndicators () {
    let indicators: Record<string, IndicatorInfo[]> = {};
    try {
      indicators = window.JSON.parse(localStorage.getItem(STORAGE_ORIGINAL_INDICATOR_KEY) || '{}');
    } catch {}
    return typeof indicators === 'object' && !Array.isArray(indicators) ? indicators : {};
  }

  private _getTimeRange (to: number, resolution: string, num?: number) {
    const count = (num ?? 1000) * parseInt(resolution);
    const toDate = dayjs(to);
    let from = 0;
    const unit = resolution.replace(/\d+/g, '');  
    switch (unit) {
      case 'D': {
        from = toDate.subtract(count, 'day').valueOf();
        break;
      }
      case 'W': {
        from = toDate.subtract(count, 'week').valueOf();
        break;
      }
      case 'M': {
        from = toDate.subtract(count, 'month').valueOf();
        break;
      }
      default: {
        from =toDate.subtract(count, 'minute').valueOf();
        break;
      }
    }
    return { from: Math.floor(from / 1000), to: Math.floor(to / 1000), countBack: count };
  }

  chart () {
    return this._chart;
  }

  createIndicator(indicator: IndicatorInfo) {
    // 副图指标最多选择3个
    // 主图指标最多4个，可选的也就4个，不用判断
    if (indicator.type === IndicatorType.Sub) {
      if (Object.keys(this._paneIds).length > 2) {
        this._options.onIndicatorCountLimit?.();
        return;
      }
    }
    const symbol = this._symbolInfo?.ticker;
    if (symbol) {
      if (indicator.type === IndicatorType.Main) {
        this._chart?.createIndicator(indicator, true, { id: 'candle_pane' });
      } else {
        let paneId: Nullable<string> = null;
        if (indicator.name === 'VOL') {
          paneId = this._chart?.createIndicator(indicator, false, { gap: { bottom: 2 } }) ?? null;
        } else {
          paneId = this._chart?.createIndicator(indicator) ?? null;
        }
        if (paneId) {
          this._paneIds[indicator.name] = paneId;
        }
      }
      const cacheIndicators = this.getCacheIndicators();
      if (!cacheIndicators[symbol]) {
        cacheIndicators[symbol] = [];
      }
      cacheIndicators[symbol].push(indicator);
      window.localStorage.setItem(STORAGE_ORIGINAL_INDICATOR_KEY, window.JSON.stringify(cacheIndicators));
    }
  }

  removeIndicator (indicator: IndicatorInfo) {
    const symbol = this._symbolInfo?.ticker;
    if (symbol) {
      if (indicator.type === IndicatorType.Main) {
        this._chart?.removeIndicator('candle_pane', indicator.name);
      } else {
        const paneId = this._paneIds[indicator.name];
        this._chart?.removeIndicator(paneId);
        delete this._paneIds[indicator.name];
      }
      
      const cacheIndicators = this.getCacheIndicators();
      const indicators = cacheIndicators[symbol];
      if (indicators) {
        const index = indicators.findIndex(item => item.type === indicator.type && item.name === indicator.name);
        indicators.splice(index, 1);
        window.localStorage.setItem(STORAGE_ORIGINAL_INDICATOR_KEY, window.JSON.stringify(cacheIndicators));
      }
    }
  }

  removeAllIndicator () {
    const symbol = this._symbolInfo?.ticker;
    if (symbol) {
      this._chart?.removeIndicator('candle_pane');
      Object.keys(this._paneIds).forEach(name => {
        const paneId = this._paneIds[name];
        this._chart?.removeIndicator(paneId);
      });
      this._paneIds = {};
      const cacheIndicators = this.getCacheIndicators();
      cacheIndicators[symbol] = [];
      window.localStorage.setItem(STORAGE_ORIGINAL_INDICATOR_KEY, window.JSON.stringify(cacheIndicators));
    }
  }

  changeTheme (theme: string) {
    this._options.theme = theme;
    this._createWatermark();
    this._chart?.setStyles(getTheme(theme));
  }

  setSymbol (symbol: string, resolution: string) {
    this._options.datafeed.resolveSymbol(symbol, (symbolInfo: DatafeedSymbolInfo) => {
      if (symbolInfo.ticker !== this._symbolInfo?.ticker || resolution !== this._options.interval) {
        const prevSymbol = this._symbolInfo?.ticker;
        if (prevSymbol) {
          this._options.datafeed.unsubscribeBars(`${prevSymbol}_#_${this._options.interval}`);
        }
        this._chart?.setPriceVolumePrecision(symbolInfo.price_precision, symbolInfo.volume_precision ?? 2);
        this._symbolInfo = symbolInfo;
        this._options.interval = resolution;
        this._getBars();
      }
    });
  }

  symbolInterval () {
    return {
      symbol: this._symbolInfo?.ticker,
      interval: this._options.interval
    };
  }

  private _getBars () {
    const symbolInfo = this._symbolInfo;
    if (symbolInfo) {
      const resolution = this._options.interval as ResolutionString;
      const range = this._getTimeRange(new Date().getTime(), this._options.interval);
      this._options.datafeed.getBars(
        symbolInfo,
        resolution,
        { ...range, firstDataRequest: true },
        (dataList, mate) => {
          this._chart?.applyNewData(dataList, !(mate?.noData ?? false));
          this._options.datafeed.subscribeBars(
            symbolInfo,
            resolution,
            (data) => {
              this._chart?.updateData(data);
            },
            `${symbolInfo.ticker}_#_${this._options.interval}`,
            () => {}
          );
        },
        () => {}
      );
    }
  }

  setChartType (type: CandleType) {
    if (this._chart) {
      if (type !== this._chart.getStyles().candle.type) {
        this._chart?.setStyles({
          candle: {
            type
          }
        });
      }
    }
  }

  resetData () {
    this._getBars();
  }
//创建持仓线
  createPositionLine(position: PositionLineOptions) {
    const key = `${position.price}`;
    const count = this._positionLineCountMap[key] ?? 0;
    this._chart?.createOverlay({
      name: 'positionLine',
      points: [{ value: position.price }],
      extendData: {
        ...position,
        closeTooltip: '',
        reverseTooltip: ''
      },
      styles: {
        directionColor: position.directionColor,
        profitLossColor: position.profitLossColor,
        tooltipColor: position.tooltipColor,
        backgroundColor: position.backgroundColor,
        offsetLeft: 2 + count * 40
      },
      onClick: (event) => {
        switch (event.figureKey) {
          case PositionLineFigureKey.Close: {
            position.onCloseClick();
            break;
          }
          case PositionLineFigureKey.Reverse: {
            position.onReverseClick();
            break;
          }
        }
        return true;
      },
      onMouseEnter: (event) => {
        switch (event.figureKey) {
          case PositionLineFigureKey.Close: {
            this._chart?.overrideOverlay({
              id: event.overlay.id,
              extendData: {
                ...position,
                reverseTooltip: ''
              }
            });
            break;
          }
          case PositionLineFigureKey.Reverse: {
            this._chart?.overrideOverlay({
              id: event.overlay.id,
              extendData: {
                ...position,
                closeTooltip: ''
              }
            });
            break;
          }
        }
        return true;
      },
      onMouseLeave: (event) => {
        this._chart?.overrideOverlay({
          id: event.overlay.id,
          extendData: {
            ...position,
            reverseTooltip: '',
            closeTooltip: ''
          }
        });
        return true;
      },
    });
    this._positionLineCountMap[key] = (this._positionLineCountMap[key] ?? 0) + 1;
  }
//移除持仓线
  removeAllPositionLine () {
    this._positionLineCountMap = {};
    this._chart?.removeOverlay({ name: 'positionLine' });
  }
//创建历史成交标记
  createHistoryOrderMark (orderMark: HistoryOrderMarkOptions) {
    const dataList = this._chart?.getDataList() ?? [];
    let candleData: Nullable<KLineData> = null;
    const size = dataList.length;
    if (dataList && size > 0) {
      for (let i = size - 1; i > -1; i--) {
        const currentData = dataList[i];
        const prevData = dataList[i - 1];
        if (i === size - 1 && orderMark.point.timestamp >= currentData.timestamp) {
          candleData = currentData;
          break;
        }
        if (orderMark.point.timestamp === currentData.timestamp) {
          candleData = currentData;
          break;
        }
        if (
          prevData &&
          orderMark.point.timestamp > prevData.timestamp &&
          orderMark.point.timestamp < currentData.timestamp
        ) {
          candleData = prevData;
          break;
        }
      }
    }
    if (candleData) {
      const key = `${candleData.timestamp}_${orderMark.direction}`;
      const count = this._historyMarkCountMap[key] ?? 0;
      this._chart?.createOverlay({
        name: 'historyOrderMark',
        extendData: {
          ...orderMark,
          offset: 6 + count * 16,
          tooltip: ''
        },
        points: [{
          timestamp: candleData.timestamp,
          value: orderMark.direction === HistoryOrderMarkArrowDirection.Up ? candleData.low : candleData.high 
        }],
        styles: {
          color: orderMark.color,
          tooltipColor: orderMark.tooltipColor
        },
        onMouseEnter: (event) => {
          this._chart?.overrideOverlay({
            id: event.overlay.id,
            extendData: {
              ...orderMark,
              offset: event.overlay.extendData.offset,
            }
          });
          return true;
        },
        onMouseLeave: (event) => {
          this._chart?.overrideOverlay({
            id: event.overlay.id,
            extendData: {
              ...orderMark,
              offset: event.overlay.extendData.offset,
              tooltip: '',
            }
          });
          return true;
        }
      });
      this._historyMarkCountMap[key] = (this._historyMarkCountMap[key] ?? 0) + 1;
    }
  }
//移除历史成交标记
  removeAllHistoryOrderMark () {
    this._historyMarkCountMap = {};
    this._chart?.removeOverlay({ name: 'historyOrderMark' });
  }
  //创建止盈止损持仓线
  createPositionTPSLLine(position: any) {
    const key = `${position.price}`;
    const count = this._positionLineCountMap[key] ?? 0;
    this._chart?.createOverlay({
      name: 'positionTPTLLine',
      points: [{ value: position.price }],
      extendData: {
        ...position,
        closeTooltip: '',
        reverseTooltip: ''
      },
      styles: {
        cursor: 'grab',
        directionColor: position.directionColor,
        profitLossColor: position.profitLossColor,
        tooltipColor: position.tooltipColor,
        backgroundColor: position.backgroundColor,
        offsetLeft: 2 + count * 40
      },
      onClick: (event) => {
        switch (event.figureKey) {
          case PositionTPSLLineFigureKey.Close: {
            position.onCloseClick();
            break;
          }
          case PositionTPSLLineFigureKey.Reverse: {
            position.onReverseClick();
            break;
          }
        }
        return true;
      },
      onPressedMoving:(event)=>{
        console.log("拖动",event)
        position.onOrderdrag(event);
        return true; 
      },
      onPressedMoveEnd: (event) => {
        position.onOrderdrag(event);
        return true; 
      },
      onMouseEnter: (event) => {
        switch (event.figureKey) {
          case PositionTPSLLineFigureKey.Close: {
            this._chart?.overrideOverlay({
              id: event.overlay.id,
              extendData: {
                ...position,
                reverseTooltip: ''
              }
            });
            break;
          }
          case PositionTPSLLineFigureKey.Reverse: {
            this._chart?.overrideOverlay({
              id: event.overlay.id,
              extendData: {
                ...position,
                closeTooltip: ''
              }
            });
            break;
          }
        }
        return true;
      },
      onMouseLeave: (event) => {
        this._chart?.overrideOverlay({
          id: event.overlay.id,
          extendData: {
            ...position,
            reverseTooltip: '',
            closeTooltip: ''
          }
        });
        return true;
      },
   
    });
    this._positionLineCountMap[key] = (this._positionLineCountMap[key] ?? 0) + 1;
  }
//移除持仓线
  removeAllPositionTPSLLine () {
    this._positionLineCountMap = {};
    this._chart?.removeOverlay({ name: 'positionTPTLLine' });
  }

  remove () {
    dispose('bv_kline_chart');
  }
}