// import { init, Chart, Nullable, dispose, CandleType, registerOverlay, KLineData, Point } from 'klinecharts';

import {
  init,
  Chart,
  Nullable,
  dispose,
  CandleType,
  registerOverlay,
  KLineData,
  OverlayMode,
  ActionType,
  registerFigure,
  Point
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

import { ResolutionString } from '../../../../../public/tradingView/charting_library/charting_library';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import positionLine, { PositionLineFigureKey } from './extension/positionLine';

import positionTPTLLine, { PositionTPSLLineFigureKey } from './extension/positionTPTLLine';

import currentEntrustLine, { PositionEntrustineFigureKey } from './extension/positionEntrustLine';

// import positionTPTLLine from './extension/positionTPTLLine'
import historyOrderMark, { HistoryOrderMarkArrowDirection } from './extension/historyOrderMark';

import liquidationLine from './extension/liquidationLine';

//增加的k线下单及其持仓线

import positionOverlay from './extension/overlays/positionOverlay';
import takeProfitOverlay from './extension/overlays/takeProfitOverlay';
import stopLossOverlay from './extension/overlays/stopLossOverlay';
import addOverlay from './extension/overlays/addOverlay';

import { DatafeedSymbolInfo } from '../Datafeed';

import { getTheme } from './overrides';

import { WidgetOptions } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);


export interface PositionOverlayCallbacks {
  onPositionClick?: (data: any) => void;
  onChangeClick?: (data: any) => void;
  onCloseClick?: (data: any) => void;
  onTakeProfitClick?: (data: any) => void;
  onAddTakeProfitClick?: (data: any) => void;
  onStopLossClick?: (data: any) => void;
  onAddStopLossClick?: (data: any) => void;
  onAddPositionClick?: (data: any) => void;
}

export const STORAGE_ORIGINAL_INDICATOR_KEY = 'bv_original_indicator';

export enum IndicatorType {
  Main = 'main',
  Sub = 'sub'
}

const positionOverlayConfig = {
  chart: null,
  // 仓位覆盖物
  //位按钮+ ↑↓ 按钮 + 平仓按钮 + 持仓价线
  positionOverlay: {
    id: null,
    // 仓位数据，仓位的坐标用于所有覆盖物做参照点，这样在每个覆盖物中计算值的时候就不会乱
    // 貌似坐标转换的时候是用的dataIndex转换的,dataFeed新增bar时要记得,更新dataIndex, 覆盖物重绘制的时候会自动更新位置
    positionData: { dataIndex: 0, timestamp: 0, price: 0, direction: 'long' },
    // 仓位按钮
    positionBtnFigure: {
      show: true,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // 添加事件回调callback
      // onClick: (e) =>{ console.log('positionOverlay positionBtnFigure click')}
    },
    // 切换按钮
    changeBtnFigure: {
      show: true,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // 添加事件回调callback
      // onClick: (e) =>{ console.log('positionOverlay changeBtnFigure click')}
    },
    // 平仓按钮
    closePositionBtnFigure: {
      show: true,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // 添加事件回调callback
      // onClick: (e) =>{ console.log('positionOverlay closePositionBtnFigure click')}
    },
    positionLineFigure: {
      show: true,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
    }
  },

  // 止盈覆盖物
  takeProfitOverlay: {
    id: null,
    // 止盈线
    takeProfitLineFigure: {
      show: false,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
    },
    // 止盈按钮
    takeProfitBtnFigure: {
      show: false,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // onClick: (e) =>{ console.log('takeProfitOverlay takeProfitBtnFigure click')}
    },
    // 新增按钮
    addBtnFigure: {
      show: false,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // onClick: (e) =>{ console.log('takeProfitOverlay addBtnFigure click')}
    }
  },

  // 止损覆盖物
  stopLossOverlay: {
    id: null,
    // 止损线
    stopLossLineFigure: {
      show: false,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
    },
    // 止损按钮
    stopLossBtnFigure: {
      show: false,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // onClick: (e) =>{ console.log('stopLossOverlay stopLossBtnFigure click')}
    },
    // 新增按钮
    addBtnFigure: {
      show: false,
      option: null,
      styles: {
        width: 0,
        height: 0,
        marginLeft: 0
      }
      // onClick: (e) =>{ console.log('stopLossOverlay addBtnFigure click')}
    }
  }
};

interface IndicatorInfo {
  name: string;
  type: IndicatorType;
}

export interface PositionLineOptions {
  id?: string;
  direction: string;
  directionColor: string;
  profitLoss: string;
  profitLossColor: string;
  backgroundColor: string;
  price: number;
  volume: string;
  closeTooltip?: string;
  reverseTooltip?: string;
  tooltipColor?: string;
  positionId?: string;
  onReverseClick?: () => void;
  onCloseClick?: () => void;
  onOrderdrag?: (e) => void;
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
  private _currentEntrustLineCountMap: Record<string, number> = {};

  private _historyMarkCountMap: Record<string, number> = {};

  private _paneIds: Record<string, string> = {};

  constructor(options: WidgetOptions) {
    registerOverlay(positionLine);
    registerOverlay(positionTPTLLine);
    registerOverlay(currentEntrustLine);

    registerOverlay(historyOrderMark);
    registerOverlay(liquidationLine);

    // k线注册

    registerOverlay(positionOverlay);
    registerOverlay(addOverlay);
    registerOverlay(takeProfitOverlay);
    registerOverlay(stopLossOverlay);

    this._options = options;
    const containerId = options.container ?? 'bv_kline_chart';
    this._chart = init(containerId, {
      locale: options.locale,
      styles: getTheme(options.theme),
      decimalFoldThreshold: 100
    });
    this._createWatermark();
    // 加载更多
    // this._chart?.setLoadMoreDataCallback(params => {
    this._chart?.applyMoreData(params => {
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

  private _createWatermark() {
    if (this._chart) {
      const container = this._chart.getDom();
      if (container) {
        const waterMarkId = 'yemx_klinecharts_watermark';

        const background1 = `url("/imgs/${this._options.theme}Logo.svg")`;
        let watermark = container.querySelector('#' + waterMarkId);
        if (!watermark) {
          watermark = document.createElement('div');
          watermark.id = waterMarkId;
          container.appendChild(watermark);
        }
        // @ts-ignore
        watermark.style = `
        position: absolute;
        bottom: 25%;
        left: 10px;
        z-index: 0;
        width: 201px;
        height: 38px;
        background: ${background1} no-repeat center;
        background-size: contain;
      `;
      }
    }
  }

  getCacheIndicators() {
    let indicators: Record<string, IndicatorInfo[]> = {};
    try {
      indicators = window.JSON.parse(localStorage.getItem(STORAGE_ORIGINAL_INDICATOR_KEY) || '{}');
    } catch {}
    return typeof indicators === 'object' && !Array.isArray(indicators) ? indicators : {};
  }

  private _getTimeRange(to: number, resolution: string, num?: number) {
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
        from = toDate.subtract(count, 'minute').valueOf();
        break;
      }
    }
    return { from: Math.floor(from / 1000), to: Math.floor(to / 1000), countBack: count };
  }

  // 是否显示当前k线倒计时
  setShowCountdown(show: boolean) {
    this._chart?.setStyles({
      candle: {
        priceMark: {
          last: {
            countdown: {
              show: show
            }
          }
        }
      }
    });
  }
  // 是否显示当前k线倒计时
  setShowKlineScale(show: boolean) {
    this._chart?.setStyles({
      candle: {
        priceMark: {
          last: {
            countdown: {
              show: show
            }
          }
        }
      }
    });
  }

  // CrosshairHorizontalLabelView

  chart() {
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

  removeIndicator(indicator: IndicatorInfo) {
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

  removeAllIndicator() {
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

  changeTheme(theme: string) {
    this._options.theme = theme;
    this._createWatermark();
    this._chart?.setStyles(getTheme(theme));
  }

  setSymbol(symbol: string, resolution: string) {
    this._options.datafeed.resolveSymbol(symbol, (symbolInfo: DatafeedSymbolInfo) => {
      if (symbolInfo.ticker !== this._symbolInfo?.ticker || resolution !== this._options.interval) {
        const prevSymbol = this._symbolInfo?.ticker;
        if (prevSymbol) {
          this._options.datafeed.unsubscribeBars(`${prevSymbol}_#_${this._options.interval}`);
        }
        this._chart?.setPriceVolumePrecision(symbolInfo.price_precision, symbolInfo.volume_precision ?? 2);
        // this._chart?.setPrecision(symbolInfo.price_precision, symbolInfo.volume_precision ?? 2);

        this._symbolInfo = symbolInfo;
        this._options.interval = resolution;
        this._getBars();
      }
    });
  }

  symbolInterval() {
    return {
      symbol: this._symbolInfo?.ticker,
      interval: this._options.interval
    };
  }

  private _getBars() {
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
            data => {
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

  setChartType(type: CandleType) {
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

  resetData() {
    this._getBars();
  }
  // 设置k线颜色
  setColor(upColor: string, downColor: string) {
    let upColorRgb = `rgb(${upColor})`;
    let downColorRgb = `rgb(${downColor})`;
    let theme = 'dark';
    const textColor = theme == 'light' ? '#131722' : '#d1d4dc';
    const alphaRed = upColorRgb;
    const alphaGreen = downColorRgb;
    this._chart?.setStyles({
      candle: {
        bar: {
          upColor: upColorRgb,
          upBorderColor: upColorRgb,
          upWickColor: upColorRgb,
          downColor: downColorRgb,
          downBorderColor: downColorRgb,
          downWickColor: downColorRgb
        },
        area: {
          smooth: true
        },
        priceMark: {
          high: {
            color: textColor,
            textOffset: 4,
            textSize: 12
          },
          low: {
            color: textColor,
            textOffset: 4,
            textSize: 12
          },
          last: {
            upColor: upColorRgb,
            downColor: downColorRgb
          }
        },
        tooltip: {
          custom: (data: any) => {
            const { current, prev } = data;
            const prevClose = prev?.close ?? current.close;

            const color = current.close - prevClose < 0 ? downColorRgb : upColorRgb;
            const amplitude = `${(((current.high - current.low) / prevClose) * 100).toFixed(2)}%`;
            return [
              { title: { text: 'time', color: textColor }, value: { text: '{time}', color } },
              { title: { text: 'open', color: textColor }, value: { text: '{open}', color } },
              { title: { text: 'high', color: textColor }, value: { text: '{high}', color } },
              { title: { text: 'low', color: textColor }, value: { text: '{low}', color } },
              { title: { text: 'close', color: textColor }, value: { text: '{close}', color } },
              { title: { text: 'volume', color: textColor }, value: { text: '{volume}', color } },
              { title: { text: 'change', color: textColor }, value: { text: '{change}', color } },
              { title: { text: 'amplitude', color: textColor }, value: { text: amplitude, color } }
            ];
          }
        }
      },
      indicator: {
        ohlc: {
          upColor: alphaGreen,
          downColor: alphaRed
        },
        bars: [
          {
            style: 'fill',
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: alphaGreen,
            downColor: alphaRed,
            noChangeColor: '#888888'
          }
        ],
        circles: [
          {
            style: 'fill',
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: alphaGreen,
            downColor: alphaRed,
            noChangeColor: '#888888'
          }
        ]
      }
    });

    //  registerStyles(getTheme(theme));

    // @ts-ignore
    // this._chart?.setStyles(options(this.koptions, k_config(RootColor.getColorRGB)).styles);
  }

  // 创建新版持仓线
  // createPositionLine

  // 在Widget类中添加以下方法
  createPositionLine2(
    positionData: {
      dataIndex: number;
      timestamp: number;
      price: number;
      direction: 'long' | 'short';
    },
    callbacks?: PositionOverlayCallbacks
  ) {
    if (!this._chart) return null;

    // 深拷贝配置模板
    const overlayConfig = JSON.parse(JSON.stringify(positionOverlayConfig));
    overlayConfig.chart = this._chart;

    // 设置仓位基础数据
    overlayConfig.positionOverlay.positionData = {
      dataIndex: positionData.dataIndex,
      timestamp: positionData.timestamp,
      price: positionData.price,
      direction: positionData.direction
    };

    // 注册事件回调
    if (callbacks) {
      overlayConfig.positionOverlay.positionBtnFigure.onClick = callbacks.onPositionClick;
      overlayConfig.positionOverlay.changeBtnFigure.onClick = callbacks.onChangeClick;
      overlayConfig.positionOverlay.closePositionBtnFigure.onClick = callbacks.onCloseClick;
      overlayConfig.takeProfitOverlay.takeProfitBtnFigure.onClick = callbacks.onTakeProfitClick;
      overlayConfig.takeProfitOverlay.addBtnFigure.onClick = callbacks.onAddTakeProfitClick;
      overlayConfig.stopLossOverlay.stopLossBtnFigure.onClick = callbacks.onStopLossClick;
      overlayConfig.stopLossOverlay.addBtnFigure.onClick = callbacks.onAddStopLossClick;
    }

    // 创建主仓位覆盖物
    const positionOverlayId = this._chart.createOverlay({
      name: 'positionOverlay',
      paneId: 'candle_pane',
      visible: true,
      lock: true,
      mode: OverlayMode.Normal,
      points: [{
        dataIndex: positionData.dataIndex,
        timestamp: positionData.timestamp,
        value: positionData.price
      }],
      extendData: overlayConfig
    });

    // 创建加号按钮覆盖物（跟随十字光标）
    let addOverlayId: string | null = null;
    const addOverlayConfig = {
      point: { x: 0, y: 0 },
      onClick: callbacks?.onAddPositionClick
    };

    // 订阅十字光标移动事件
    const crosshairHandler = (data: any) => {
      addOverlayConfig.point = { x: data.x, y: data.y };
      if (!addOverlayId) {
        addOverlayId = this._chart?.createOverlay({
          name: 'addOverlay',
          paneId: 'candle_pane',
          visible: true,
          lock: true,
          mode: OverlayMode.Normal,
          points: [{ x: data.x, y: data.y }],
          extendData: addOverlayConfig
        }) ?? null;
      } else {
        this._chart?.overrideOverlay({
          id: addOverlayId,
          points: [{ x: data.x, y: data.y }]
        });
      }
    };
    this._chart.subscribeAction(ActionType.OnCrosshairChange, crosshairHandler);

    // 返回操作方法
    return {
      remove: () => {
        if (positionOverlayId) this._chart?.removeOverlay(positionOverlayId);
        if (addOverlayId) this._chart?.removeOverlay(addOverlayId);
        this._chart?.unsubscribeAction(ActionType.OnCrosshairChange, crosshairHandler);
      },
      updatePosition: (newData: typeof positionData) => {
        this._chart?.overrideOverlay({
          id: positionOverlayId,
          points: [{
            dataIndex: newData.dataIndex,
            timestamp: newData.timestamp,
            value: newData.price
          }],
          extendData: {
            ...overlayConfig,
            positionOverlay: {
              ...overlayConfig.positionOverlay,
              positionData: newData
            }
          }
        });
      }
    };
  }



  //创建持仓线
  createPositionLine(position: PositionLineOptions) {
    const key = `${position.price}`;
    const count = this._positionLineCountMap[key] ?? 0;

    // console.log("position=======",position)

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
        openDirectionBg: position.openDirectionBg,
        offsetLeft: 2 + count * 40
      },
      onClick: event => {
        switch (event.figure.key) {
          case PositionLineFigureKey.Close: {
            position?.onCloseClick();
            break;
          }
          case PositionLineFigureKey.Reverse: {
            position?.onReverseClick();
            break;
          }
        }
        return true;
      }
      // onMouseEnter: event => {
      //   console.log('hover进来了', event);
      //   switch (event.figure.key) {
      //     case PositionLineFigureKey.Close: {
      //       this._chart?.overrideOverlay({
      //         id: event.overlay.id,
      //         extendData: {
      //           ...position,
      //           reverseTooltip: ''
      //         }
      //       });
      //       break;
      //     }
      //     case PositionLineFigureKey.Reverse: {
      //       this._chart?.overrideOverlay({
      //         id: event.overlay.id,
      //         extendData: {
      //           ...position,
      //           closeTooltip: ''
      //         }
      //       });
      //       break;
      //     }
      //   }
      //   return true;
      // },
      // onMouseLeave: event => {
      //   console.log('hover走了', event);
      //   this._chart?.overrideOverlay({
      //     id: event.overlay.id,
      //     extendData: {
      //       ...position,
      //       reverseTooltip: '',
      //       closeTooltip: ''
      //     }
      //   });
      //   return true;
      // }
    });
    this._positionLineCountMap[key] = (this._positionLineCountMap[key] ?? 0) + 1;
  }
  //移除持仓线
  removeAllPositionLine() {
    this._positionLineCountMap = {};
    this._chart?.removeOverlay({ name: 'positionLine' });
  }
  //创建历史成交标记
  createHistoryOrderMark(orderMark: HistoryOrderMarkOptions) {
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
        points: [
          {
            timestamp: candleData.timestamp,
            value: orderMark.direction === HistoryOrderMarkArrowDirection.Up ? candleData.low : candleData.high
          }
        ],
        styles: {
          color: orderMark.color,
          tooltipColor: orderMark.tooltipColor
        },
        onMouseEnter: event => {
          this._chart?.overrideOverlay({
            id: event.overlay.id,
            extendData: {
              ...orderMark,
              offset: event.overlay.extendData.offset
            }
          });
          return true;
        },
        onMouseLeave: event => {
          this._chart?.overrideOverlay({
            id: event.overlay.id,
            extendData: {
              ...orderMark,
              offset: event.overlay.extendData.offset,
              tooltip: ''
            }
          });
          return true;
        }
      });
      this._historyMarkCountMap[key] = (this._historyMarkCountMap[key] ?? 0) + 1;
    }
  }
  //移除历史成交标记
  removeAllHistoryOrderMark() {
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
        openDirectionColor: position.openDirectionColor,
        openDirectionBg: position.openDirectionBg,
        closeBg: position.closeBg,
        closeColor: position.closeColor,
        directionColor: position.directionColor,
        profitLossColor: position.profitLossColor,
        tooltipColor: position.tooltipColor,
        backgroundColor: position.backgroundColor,
        offsetLeft: 2 + count * 40
      },
      onClick: event => {
        switch (event.figure.key) {
          case PositionTPSLLineFigureKey.Close: {
            position?.onCloseClick();
            break;
          }
          case PositionTPSLLineFigureKey.Reverse: {
            position?.onReverseClick();
            break;
          }
        }
        return true;
      },
      onMouseEnter: event => {
        switch (event.figure.key) {
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
      onMouseLeave: event => {
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
      onPressedMoveStart: event => {
        // console.log("按住拖动开始回调事件", event)
        position.onOrderdrag?.(event);
        // return true;
      },
      onPressedMoving: event => {
        // console.log("按住拖动回调事件", event)
        position.onOrderdrag?.(event);
        // return true;
      },
      onPressedMoveEnd: event => {
        // console.log("按住拖动结束回调事件", event)
        position.onOrderdragEnd?.(event);
        // return true;
      }
    });
    this._positionLineCountMap[key] = (this._positionLineCountMap[key] ?? 0) + 1;
  }
  //移除止盈止损线
  removeAllPositionTPSLLine() {
    this._positionLineCountMap = {};
    this._chart?.removeOverlay({ name: 'positionTPTLLine' });
  }

  /* 强平线 */
  createLiquidationLine(position: PositionLineOptions) {
    const key = `${position.price}`;
    const count = this._positionLineCountMap[key] ?? 0;
    this._chart?.createOverlay({
      name: 'liquidationLine',
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
      }
    });
    this._positionLineCountMap[key] = (this._positionLineCountMap[key] ?? 0) + 1;
  }
  /* 移除强平线 */
  removeAllLiquidationLine() {
    this._positionLineCountMap = {};
    this._chart?.removeOverlay({ name: 'liquidationLine' });
  }

  //创建当前委托持仓线
  createCurrentEntrustLine(position: any) {
    const key = `${position.price}`;
    const count = this._currentEntrustLineCountMap[key] ?? 0;
    this._chart?.createOverlay({
      name: 'currentEntrustLine',
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
      onClick: event => {
        switch (event.figure.key) {
          case PositionEntrustineFigureKey.Close: {
            position?.onCloseClick();
            break;
          }
          case PositionEntrustineFigureKey.Reverse: {
            position?.onReverseClick();
            break;
          }
        }
        return true;
      },
      onMouseEnter: event => {
        switch (event.figure.key) {
          case PositionEntrustineFigureKey.Close: {
            this._chart?.overrideOverlay({
              id: event.overlay.id,
              extendData: {
                ...position,
                reverseTooltip: ''
              }
            });
            break;
          }
          case PositionEntrustineFigureKey.Reverse: {
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
      onMouseLeave: event => {
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
      onPressedMoveStart: event => {
        console.log('按住拖动开始回调事件', event);
        position.onOrderdrag(event);
        return true;
      },
      onPressedMoving: event => {
        console.log('按住拖动回调事件', event);
        position.onOrderdrag(event);
        return true;
      },
      onPressedMoveEnd: event => {
        console.log('按住拖动结束回调事件', event);
        position.onOrderdrag(event);
        return true;
      }
    });
    this._currentEntrustLineCountMap[key] = (this._currentEntrustLineCountMap[key] ?? 0) + 1;
  }
  //移除当前委托线
  removeCurrentEntrusLine() {
    this._currentEntrustLineCountMap = {};
    this._chart?.removeOverlay({ name: 'currentEntrustLine' });
  }

  remove() {
    dispose('bv_kline_chart');
  }
}
