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
  registerFigure,
  ActionType,
  Point
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

// import { ActionType, init, OverlayMode, registerFigure, registerOverlay } from 'klinecharts';

import {
  getKineState,
  setDragOverlayDataFun,
  setPositionLineTpSl,
  setPositionTpSLInfoFun,
  setPositionTpSlFun,
  setIsH5CreateAnOrderFun
} from '@/store/kline';
import { ResolutionString } from '../../../../../public/tradingView/charting_library/charting_library';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import positionLine, { PositionLineFigureKey } from './extension/positionLine';

import positionTPTLLine, { PositionTPSLLineFigureKey } from './extension/positionTPTLLine';

import currentEntrustLine, { PositionEntrustineFigureKey } from './extension/positionEntrustLine';

// import positionTPTLLine from './extension/positionTPTLLine'
import historyOrderMark, { HistoryOrderMarkArrowDirection } from './extension/historyOrderMark';

//新版持仓线

import positionOverlay, { cacheTPSLineFigureKey } from './extension/overlays/positionOverlay';
import takeProfitOverlay from './extension/overlays/takeProfitOverlay';
import stopLossOverlay from './extension/overlays/stopLossOverlay';
import addOverlay from './extension/overlays/addOverlay';
import popTextFigure from './extension/figures/popText'

import liquidationLine from './extension/liquidationLine';

import { DatafeedSymbolInfo } from '../Datafeed';

import { getTheme } from './overrides';

import { WidgetOptions } from '../types';
import { useModalProps, usePositionActions } from '@/components/order-list/swap/stores/position-list';
import { darkTheme } from './extension/overlayTheme';

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
  id?: string;
  direction: string;
  profitLoss: string;
  price: number;
  volume: string;
  closeTooltip?: string;
  reverseTooltip?: string;
  positionId?: string;
  styles: any;
  onReverseClick?: () => void;
  onCloseClick?: () => void;
  onOrderdrag?: (e: any) => void;
  positionOverlayConfig?: any;
  orginalItem?: any;
  positionIds?: any[];
}

export interface HistoryOrderMarkOptions {
  point: Pick<Point, 'timestamp'>;
  direction: HistoryOrderMarkArrowDirection;
  color: string;
  tooltip: string;
  tooltipColor: string;
}

const cachePositionLineData: any = {};
const prevPositionIds: number[] = [];
// 全局覆盖物使用的移动跟踪坐标，不允许直接替换对象，只能替换值
const crosshairPoint:any = {x: 0, y: 0}

// 修改新版本k线
const drawOverlay = (index: number, positoinData: any, chart: any, positionOverlayConfig: any, styles: any, allPositionIds: any[] = []) => {
  /** 
   你可以在交互组件中把回调函数传到positionView中,
   然后在overlay里面触发事件的时候进行调用
   positionOverlayView.positionOverlay.positionBtnFigure.onClick= (data:any) => { 
    console.log('点击了仓位按钮', data); 
   }
  */
  //  const { onReverse } = usePositionActions(); // 反向开仓
  // const {
  //   onVisibleLiquidationModal,
  //   liquidationModalProps,
  //   onCloseLiquidationModal,
  //   onVisibleReverseModal,
  //   reverseModalProps,
  //   onCloseReverseModal,
  //   onVisiblesSpslModal,
  //   spslModalProps,
  //   onCloseSpslModal
  // } = useModalProps();
  const overlayViewConfig = JSON.parse(JSON.stringify(positionOverlayConfig));
  overlayViewConfig.crosshairPoint = crosshairPoint

  let stopProfit = '';
  let stopLoss = '';
  const marginType =  positoinData.orginalItem?.marginType;
  positoinData.orginalItem.orders.forEach((o: any) => {
    if (o.strategyType === '1' && o.ctime) stopProfit = Number(o.triggerPrice);
    if (o.strategyType === '2' && o.ctime) stopLoss = Number(o.triggerPrice);
  });

  const positionData: any = {
    timestamp: positoinData.timestamp,
    value: positoinData.price,
    direction: positoinData.direction,
    positionId: positoinData?.orginalItem?.positionId,
    stopProfit,
    stopLoss,
    dialogVisible: positoinData.dialogVisible,
    marginType
  };
  // console.log('仓位数据', positionData);
  overlayViewConfig.positionOverlay.positionData = positionData;

  overlayViewConfig.chart = chart;

  // 注册事件
  overlayViewConfig.positionOverlay.positionBtnFigure.onClick = (data: any) => {
    console.log('点击了仓位按钮', data);
  };
  overlayViewConfig.positionOverlay.changeBtnFigure.onClick = (data: any) => {
    positoinData?.onReverseClick?.();
    // console.log('点击反手开仓');
  };
  overlayViewConfig.positionOverlay.closePositionBtnFigure.onClick = (data: any) => {
    console.log('点击了平仓按钮', data);
    positoinData?.onCloseClick?.();
  };
  overlayViewConfig.takeProfitOverlay.takeProfitBtnFigure.onClick = (data: any) => {
    console.log('点击了止盈按钮', data);
  };
  overlayViewConfig.takeProfitOverlay.addBtnFigure.onClick = (data: any) => {
    console.log('点击了新增止盈按钮', data);
  };
  overlayViewConfig.takeProfitOverlay.takeProfitBtnFigure.onPressedMoveEnd = (data: any) => {
    console.log('2222-----拖动完成了新增止盈按钮', data);

    const tpslTypeId = 1; //当前选择的类型
    // //1是止盈。2是止损
    setPositionTpSLInfoFun({
      id: tpslTypeId,
      price: data.overlay.points[0].value,
      positionId: data.overlay?.extendData?.extendsConfig?.positionId
    });
  };
  overlayViewConfig.stopLossOverlay.stopLossBtnFigure.onClick = (data: any) => {
    console.log('点击了止损按钮', data);
  };
  overlayViewConfig.stopLossOverlay.addBtnFigure.onClick = (data: any) => {
    console.log('点击了新增止损按钮', data);
  };
  overlayViewConfig.stopLossOverlay.stopLossBtnFigure.onPressedMoveEnd = (data: any) => {
    console.log('1111-----拖动完成了新增止损按钮', data);

    const tpslTypeId = 2; //当前选择的类型
    // //1是止盈。2是止损
    setPositionTpSLInfoFun({
      id: tpslTypeId,
      price: data.overlay.points[0].value,
      positionId: data.overlay?.extendData?.extendsConfig?.positionId
    });
  };

  // 已有的止盈止损 需要清除TP/SL
  const positionId = positoinData?.orginalItem?.positionId;
  const tpslLine = positionId ? cacheTPSLineFigureKey[positionId] : null;
  window.removeOverlayIfExists = (overlayId) => {
    if (overlayId) {
      chart?.removeOverlay({ id: overlayId });
      // 移除现有的overlay
      ['takeProfitOverlayId', 'stopLossOverlayId'].forEach(key => {
        if (tpslLine && tpslLine[key]) {
          chart?.removeOverlay({ id: tpslLine[key] });
        }
      });

      Object.assign(cacheTPSLineFigureKey, {
        takeProfitOverlayId: null,
        stopLossOverlayId: null,
        id: null,
        [positionId]: null
      });
    }
  };

  (stopLoss || positionData.dialogVisible) && removeOverlayIfExists(tpslLine?.stopLossOverlayId);
  (stopProfit || positionData.dialogVisible) && removeOverlayIfExists(tpslLine?.takeProfitOverlayId);
  tpslLine?.stopLossOverlayId &&
    chart &&
    chart?.updateOverlay &&
    chart?.updateOverlay({
      name: 'stopLossOverlay',
      id: tpslLine?.stopLossOverlayId,
      styles,
      points: [
        {
          value: positionData.value // 只更新value值
        }
      ]
    });

  tpslLine?.takeProfitOverlayId &&
    chart &&
    chart?.updateOverlay &&
    chart?.overrideOverlay({
      name: 'takeProfitOverlay',
      id: tpslLine?.takeProfitOverlayId,
      extendData: overlayViewConfig,
      styles,
      points: [
        {
          value: positionData.value // 只更新value值
        }
      ]
    });

  // 缓存持仓线 避免重复创建
  // if (!cachePositionLineData[positoinData.orginalItem?.positionId]) {
    const positionOverlayId = chart?.createOverlay({
      name: 'positionOverlay',
      paneId: 'candle_pane',
      visible: true,
      lock: true,
      mode: OverlayMode.Normal,
      points: [{ timestamp: positionData.timestamp, value: positionData.value }],
      extendData: overlayViewConfig,
      styles,
      onclick: (data: any) => {}
    });
    // console.log('createOverlay', positionOverlayId, { positionData, overlayViewConfig, styles });
  //   overlayViewConfig.positionOverlay.id = positionOverlayId;
  //   cachePositionLineData[positoinData.orginalItem?.positionId] = positionOverlayId;
  // } else {
  //   // 更新已存在的overlay数据
  //   chart?.overrideOverlay({
  //     name: 'positionOverlay',
  //     id: cachePositionLineData[positoinData.orginalItem?.positionId],
  //     styles,
  //     extendData: overlayViewConfig
  //   });
  // }

  // 清理不存在的持仓线
  Object.keys(cachePositionLineData).forEach(cachedId => {
    if (!allPositionIds.includes(Number(cachedId))) {
      chart?.removeOverlay({ id: cachePositionLineData[cachedId] });
      delete cachePositionLineData[cachedId];
    }
  });
};

// todo
const addBtnOverlayConfig = {
  id: null,
  point: { x: 0, y: 0 },
  ticker: '',
  addBtnFigure: {
    show: false,
    option: null,
    styles: {
      width: 0,
      height: 0,
      marginLeft: 0
    }
                  // onClick: (e) =>{ console.log('stopLossOverlay addBtnFigure click')}
  },
  onClick: null
};

export default class Widget {
  private _chart: Nullable<Chart>;
  private _options: WidgetOptions;
  private _symbolInfo: Nullable<DatafeedSymbolInfo> = null;

  private _positionLineCountMap: Record<string, number> = {};
  private _currentEntrustLineCountMap: Record<string, number> = {};

  private _historyMarkCountMap: Record<string, number> = {};

  private _paneIds: Record<string, string> = {};
  private _tpslOverlayCache: Record<string, any> = {};
  constructor(options: WidgetOptions) {
    // 新版本持仓线

    registerOverlay(addOverlay);
    registerOverlay(takeProfitOverlay);
    registerOverlay(stopLossOverlay);
    registerOverlay(positionOverlay);
    registerFigure(popTextFigure)

    //

    registerOverlay(positionLine);
    registerOverlay(positionTPTLLine);
    registerOverlay(currentEntrustLine);

    registerOverlay(historyOrderMark);
    registerOverlay(liquidationLine);
    this._options = options;
    const containerId = options.container ?? 'bv_kline_chart';
    this._chart = init(containerId, {
      locale: options.locale,
      styles: getTheme(options.theme),
      decimalFoldThreshold: 100
    });
    this._createWatermark();
    this._createAddOverlay();
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
          this._symbolInfo,
          this._options.interval as ResolutionString,
          { ...range, firstDataRequest: false },
          (dataList, meta) => {
            params.callback(dataList, !(meta?.noData ?? true));
          },
          () => {}
        );
      }
    });

    // todo    
    // 创建加号覆盖物
    // this._chart.subscribeAction(ActionType.OnCrosshairChange, (data: any) => {
    //   addBtnOverlayConfig.point = { x: data.x, y: data.y };
    //   crosshairPoint.x = data.x
    //   crosshairPoint.y = data.y
    // });
    this.setSymbol(options.symbol, options.interval);
  }

  private _createAddOverlay() {
    addBtnOverlayConfig.onClick = (data: any) => {
      // console.log(this._symbolInfo)
      const symbol = this._symbolInfo.ticker
      // const symbol = 'BTC'
      const tradeType = 'Limit'
      const price = data.overlay._prevPressedPoint.value.toFixed(this._symbolInfo.price_precision)
      const val = {
        tag: `${symbol}@${price}`,
        tradeType: tradeType,
        x: 60,
        y: data.overlay.extendData.point.y,
        price: price,
        volume: data.overlay._prevPressedPoint.value
      }
      setDragOverlayDataFun(val);
      console.log('点击了加号按钮2', data);
      setIsH5CreateAnOrderFun(true)
    }
    if (this._chart) {
      console.log('执行成功');
      this._chart?.createOverlay({
        name: 'addOverlay',
        paneId: 'candle_pane',
        visible: true,
        lock: true,
        mode: OverlayMode.Normal,
        // points: [{dataIndex: positionData.index, timestamp: positionData.timestamp, value: positionData.value}],
        points: [{ dataIndex: 0, timestamp: 0, value: 100 }],

        extendData: addBtnOverlayConfig
      });
    }
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
    const upColorRgb = `rgb(${upColor})`;
    const downColorRgb = `rgb(${downColor})`;
    const theme = 'dark';
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
  //创建持仓线
  createPositionLine(position: PositionLineOptions) {
    const key = `${position.price}`;
    const count = this._positionLineCountMap[key] ?? 0;

    // console.log("position=======",position)
    // this._chart?.removeOverlay({
    //   name: 'positionOverlay'
    // });
    drawOverlay(position.timestamp, position, this._chart, position.positionOverlayConfig, position.styles, position.positionIds ?? []);

    // const positionOverlayId = this._chart?.createOverlay({
    //   name: 'positionOverlay',
    //   paneId: 'candle_pane',
    //   visible: true,
    //   lock: true,
    //   mode: OverlayMode.Normal,
    //   points: [{timestamp: positionData.timestamp, value: positionData.value}],
    //   extendData: overlayViewConfig
    // })

    return;

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
        // switch (event.figure.key) {
        //   case PositionLineFigureKey.Close: {
        //     position?.onCloseClick();
        //     break;
        //   }
        //   case PositionLineFigureKey.Reverse: {
        //     position?.onReverseClick();
        //     break;
        //   }
        // }
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
  removeNewPositionLine() {
    this._chart?.removeOverlay({
      name: 'positionOverlay'
    });
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
    // 获取theme,根据全局获取选择对应的主题
    const theme = darkTheme
    this._chart?.createOverlay({
      name: 'positionTPTLLine',
      points: [{ value: position.price }],
      extendData: {
        ...position,
        onCloseClick: position.onCloseClick,
        closeTooltip: '平仓',
        reverseTooltip: '',
        crosshairPoint: crosshairPoint,
        profitLoss:  position.marginTypeTxt + ' ' +  position.profitLoss,
      },
      styles: position.styles,
      zLevel: 200,
      onClick: event => {
        const key = typeof event.figureKey === 'string'
          ? event.figureKey
          : event.figureKey?.key;
        if (key === PositionTPSLLineFigureKey.Close) {
          if (typeof event.overlay.extendData.onCloseClick === 'function') {
            event.overlay.extendData.onCloseClick(event);
          } else {
            console.warn('onCloseClick is not a function or not defined');
          }
          return true;
        }
        // 其它按钮逻辑...
        return true;
      },
      onPressedMoveStart: event => {
        position.onOrderdrag?.(event);
      },
      onPressedMoving: event => {
        position.onOrderdrag?.(event);
      },
      onPressedMoveEnd: event => {
        const key = typeof event.figureKey === 'string'
          ? event.figureKey
          : event.figureKey?.key;
        if (key === PositionTPSLLineFigureKey.Close) {
          // X 按钮不弹窗
          return;
        }
        position.onOrderdragEnd?.(event);
        // if (typeof onVisiblesSpslModal === 'function') {
        //   onVisiblesSpslModal({
        //     ...event.overlay?.extendData?.extendsConfig,
        //     price: event.overlay.points[0].value
        //   }, event.overlay?.extendData?.profitLoss === '止盈' ? 0 : 1);
        // }
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
    const side = position.side
    const theme = darkTheme
    this._chart?.createOverlay({
      name: 'currentEntrustLine',
      points: [{ value: position.price }],
      extendData: {
        ...position,
        closeTooltip: '',
        reverseTooltip: '',
        entrustOverlay: {
          directionFigure: {
            option: null,
            styles: {}
          },
          closeBtnFigure: {
            option: null,
            styles: {}
          },
          entrustPriceFigure: {
            option: null,
            styles: {}
          },
          entrustVolumeFigure: {
            option: null,
            styles: {}
          },
          lineFigure: {
            option: null,
            styles: {}
          },
        }
      },
      styles: {
        cursor: 'grab',
        // directionColor: position.directionColor,
        // profitLossColor: position.profitLossColor,
        // tooltipColor: position.tooltipColor,
        // backgroundColor: position.backgroundColor,
        directionColor: theme['entrustLineOverlay.directionColor'],
        directionBackgroundColor: side === '1' ? theme['entrustLineOverlay.directionLongBackgroundColor'] : theme['entrustLineOverlay.directionShortBackgroundColor'],
        priceColor: side === '1' ? theme['entrustLineOverlay.priceLongColor'] : theme['entrustLineOverlay.priceShortColor'],
        priceBackgroundColor: side === '1' ? theme['entrustLineOverlay.priceLongBackgroundColor'] : theme['entrustLineOverlay.priceShortBackgroundColor'],
        volumeColor: theme['entrustLineOverlay.volumeColor'],
        volumeBackgroundColor: theme['entrustLineOverlay.volumeBackgroundColor'],
        tipColor: theme['global.tipColor'],
        tipBackgroundColor: theme['global.tipBackgroundColor'],
        tipBorderColor: theme['global.tipBorderColor'],
        operationColor: theme['global.operationColor'],
        operationBackgroundColor: theme['global.operationBackgroundColor'],
        lineColor: theme['entrustLineOverlay.lineColor'],
        yAxisMarkColor: theme['entrustLineOverlay.yAxisMarkColor'],
        yAxisMarkBorderColor: theme['entrustLineOverlay.yAxisMarkBorderColor'],
        yAxisMarkBackgroundColor: theme['entrustLineOverlay.yAxisMarkBackgroundColor'],
        offsetLeft: 2 + count * 40
      },
      onClick: event => {
        switch (event.figureKey) {
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
