import TradingView from '../../../../../public/tradingView/charting_library/charting_library';
import { getOverrides, getStudyOverrides } from './overrides';

import { WidgetOptions } from '../types';

const STORAGE_DRAWING_KEY = 'bv_tv_drawing';
const STORAGE_STUDY_KEY = 'bv_tv_index';

interface StudyShapeInfo {
  id: TradingView.EntityId;
  name: string;
  symbol: string;
  forceOverlay?: boolean;
  lock?: boolean;
  inputs?: Record<string, TradingView.StudyInputValue>;
  overrides?: any,
  options?: TradingView.CreateStudyOptions;
  points?: TradingView.PricedPoint[];
}

type EmptyCallback = () => void;

interface PositionLineOptions<T = any> {
  id: string;
  price?: number;
  text?: string;
  textColor?: string;
  lineLength?: number;
  lineStyle?: number;
  lineColor?: string;
  quantityText?: string;
  quantityFont?: string;
  quantityTextColor?: string;
  quantityBackgroundColor?: string;
  quantityBorderColor?: string;
  bodyTextColor?: string;
  bodyFont?: string;
  bodyBorderColor?: string;
  bodyBackgroundColor?: string;
  reverse?: {
    data: T;
    callback: (data: any) => void;
  };
  reverseButtonIconColor?: string;
  reverseButtonBorderColor?: string;
  closeButtonBorderColor?: string;
  closeButtonIconColor?: string;
  closeButtonBackgroundColor?: string;
  reverseButtonBackgroundColor?: string;
  reverseTooltip?: string;
  tooltip?: string;
  protectTooltip?: string;
  closeTooltip?: string;
  extendLeft?: boolean;
  onClose?: EmptyCallback;
  onModify?: EmptyCallback;
}

interface HistoryOrderMarkOptions {
  id: string;
  price: number;
  arrowColor: string;
  tooltip: string;
  direction: TradingView.Direction;
  time: number
}

const STUDY_COUNT_LIMIT = 10;

export interface WidgetApi<T = any> extends TradingView.IChartingLibraryWidget {
  createPositionLine: (options: PositionLineOptions<T>) => void;
  createPositionTPSLLine: (options: PositionLineOptions<T>) => void;
  createLiquidationLine: (options: PositionLineOptions<T>) => void;
  removeAllPositionLine: () => void;
  removeAllPositionTPSLLine: () => void;
  removeAllLiquidationLine: () => void;
  createHistoryOrderMark: (options: HistoryOrderMarkOptions) => void;
  removeAllHistoryOrderMark: () => void;
  setSymbolResolution: (symbol: string, resolution: TradingView.ResolutionString) => void;
}

export default function createWidget(options: WidgetOptions<TradingView.ResolutionString, TradingView.LanguageCode, TradingView.ThemeName>) {
  class Widget extends window.TradingView.widget implements WidgetApi {
    private _saveStudiesShapesTimeout = -1;

    private _options: WidgetOptions<TradingView.ResolutionString, TradingView.LanguageCode, TradingView.ThemeName>;

    private _positionLineMapping: Map<string, TradingView.IPositionLineAdapter> = new Map();//持仓线
    private _positionTPSLLineMapping: Map<string, TradingView.IPositionLineAdapter> = new Map(); //止盈止损

    private _LiquidationLineMapping: Map<string, TradingView.IPositionLineAdapter> = new Map();//爆仓线



    private _historyOrderMarkMapping: Map<string, TradingView.IExecutionLineAdapter> = new Map();

    private _studyEvent = (id: TradingView.EntityId, type: TradingView.StudyEventType) => {
      try {
        if (type === 'price_scale_changed') {
          const chart = this.activeChart();
          const studies = chart.getAllStudies();
          if (studies.length > STUDY_COUNT_LIMIT) {
            this._options.onIndicatorCountLimit?.();
            chart.removeEntity(id);
          }
        }
      } catch (e) {
      }
    };

    constructor(options: WidgetOptions<TradingView.ResolutionString, TradingView.LanguageCode, TradingView.ThemeName>) {
      const overrides = getOverrides(options.theme ?? 'Dark');
      const containerId = options.container ?? 'tv_chart_container';
      const ops: TradingView.ChartingLibraryWidgetOptions = {
        ...options,
        autosize: true,
        symbol_search_request_delay: 1000,
        timezone: 'Asia/Shanghai',
        container: containerId,
        debug: false,
        library_path: '/tradingView/charting_library/',
        custom_css_url: overrides.cssUrl,
        //隐藏模块
        disabled_features: [
          'create_volume_indicator_by_default',
          'volume_force_overlay', //在主数据量列的窗格上放置成交量指标
          'display_market_status', //显示市场状态 （开市休市，加载中等）
          'header_indicators', //指标
          'header_fullscreen_button', //全屏按钮
          'header_widget', //头部工具栏,
          'use_localstorage_for_settings',
          'disable_resolution_rebuild'
        ],
        // study_count_limit: 10,
        enabled_features: ['custom_resolutions'],
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        // backgroundColor: '#121212',
        overrides: overrides.overrides,
        load_last_chart: true,
        loading_screen: {
          backgroundColor: overrides.loadingBackground,
          foregroundColor: '#ff8f34'
        },
        // favorites: {
        //   intervals:
        //     // ['1', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M']
        //     ['1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '1W', '1M']
        // },
        studies_overrides: getStudyOverrides(),
      };
      super(ops);
      this._options = options;
      this.onChartReady(() => {
        this._restoreStudies();
        this._restoreShapes();
        this._saveStudiesShapes();
        this.subscribe('study_event', this._studyEvent);
      });
    }

    private _saveStudiesShapes() {
      const chart = this.activeChart();
      const symbol = chart.symbol();
      const cacheStudies = this._getCacheStudies();
      const studyList = chart.getAllStudies();
      if (cacheStudies[symbol]) {
        cacheStudies[symbol] = [];
      }
      studyList.forEach(item => {
        const study = chart.getStudyById(item.id);
        const inputs: Record<string, TradingView.StudyInputValue> = {};
        study.getInputValues().forEach(item => {
          inputs[item.id] = item.value;
        });
        if (!cacheStudies[symbol]) {
          cacheStudies[symbol] = [];
        }
        cacheStudies[symbol].push({
          id: item.id,
          name: item.name,
          symbol,
          inputs
        });
      });
      localStorage.setItem(STORAGE_STUDY_KEY, JSON.stringify(cacheStudies));

      const cacheShapes = this._getCacheShapes();
      const shapeList = chart.getAllShapes();
      cacheShapes[symbol] = [];
      shapeList.forEach(item => {
        const shape = chart.getShapeById(item.id);
        const properties = shape.getProperties();
        cacheShapes[symbol].push({
          id: item.id,
          name: item.name,
          symbol,
          points: shape.getPoints(),
          lock: properties.frozen,
          overrides: properties
        });
      });
      localStorage.setItem(STORAGE_DRAWING_KEY, JSON.stringify(cacheShapes));

      this._saveStudiesShapesTimeout = window.setTimeout(() => {
        this._saveStudiesShapes();
      }, 1000);
    }

    /**
     * 获取缓存的指标
     * @returns 
     */
    private _getCacheStudies() {
      let studies: Record<string, StudyShapeInfo[]> = {};
      try {
        studies = window.JSON.parse(localStorage.getItem(STORAGE_STUDY_KEY) || '{}');
      } catch { }
      return typeof studies === 'object' && !Array.isArray(studies) ? studies : {};
    }

    /**
     * 获取缓存的图形
     * @returns 
     */
    private _getCacheShapes() {
      let shapes: Record<string, StudyShapeInfo[]> = {};
      try {
        shapes = window.JSON.parse(window.localStorage.getItem(STORAGE_DRAWING_KEY) ?? '{}');
      } catch { }
      return typeof shapes === 'object' && !Array.isArray(shapes) ? shapes : {};
    }

    private _restoreStudies() {
      try {
        const chart = this.activeChart();
        const symbol = chart.symbol();
        const studies = this._getCacheStudies();
        const studyList: StudyShapeInfo[] = studies[symbol];

        if (studyList) {
          chart.removeAllStudies();
        } else {
          chart.createStudy(
            'Volume',
            false,
            false,
            {
              col_prev_close: false,
              length: 20,
              showMA: false,
              smoothingLength: 9,
              smoothingLine: 'SMA'
            }
          );
        }
        studyList.forEach(study => {
          const { name, forceOverlay, lock, inputs, overrides, options } = study;
          if (name === 'Volume') {
            // @ts-expect-error
            delete inputs['symbol'];
          }
          chart.createStudy(name, forceOverlay, lock, inputs, overrides, options);
        });
      } catch {
      }
    }

    /**
     * 按交易对恢复划线和指标
     * @param symbol 
     */
    private _restoreShapes() {
      const chart = this.activeChart();
      const shapes = this._getCacheShapes();
      const symbol = chart.symbol();
      const shapeList = shapes[symbol] ?? [];

      shapeList.forEach(shape => {
        const points = shape.points;
        if (points && points.length > 0) {
          if (points.length === 1) {
            // @ts-ignore
            chart.createShape(points[0], { shape: shape.name, overrides: shape.overrides });
          } else {
            // @ts-ignore
            chart.createMultipointShape(points, { shape: shape.name, overrides: shape.overrides });
          }
        }
      });
    }

    setSymbol(symbol: string, interval: TradingView.ResolutionString, callback: TradingView.EmptyCallback) {
      super.setSymbol(symbol, interval, () => {
        this._restoreStudies();
        this._restoreShapes();
        callback();
      });
    }

    setSymbolResolution(symbol: string, resolution: TradingView.ResolutionString) {
      const chart = this.activeChart();
      const symbolChanged = symbol !== chart.symbol();
      const resolutionChanged = resolution !== chart.resolution();
      if (symbolChanged || resolutionChanged) {
        super.setSymbol(symbol, resolution, () => {
          if (symbolChanged) {
            this._restoreStudies();
            this._restoreShapes();
          }
        });
      }
    }

    async changeTheme(themeName: TradingView.ThemeName, options?: TradingView.ChangeThemeOptions): Promise<void> {
      await super.changeTheme(themeName, options);
      const overrides = getOverrides(themeName);
      this.applyOverrides(overrides.overrides);
      this.addCustomCSSFile(overrides.cssUrl);
    }

    /**
     * 创建持仓线
     */
    createPositionLine<T>(options: PositionLineOptions<T>) {
      let positionLine = this._positionLineMapping.get(options.id);
      if (positionLine) {
        positionLine.remove();
      }
      positionLine = this.activeChart().createPositionLine();
      this._positionLineMapping.set(options.id, positionLine);
      this.overridePositionLine(options);
    }

    overridePositionLine<T>(options: PositionLineOptions<T>) {
      const {
        id, price, text, lineLength, lineStyle, lineColor,
        quantityText, quantityFont, quantityTextColor, quantityBackgroundColor, quantityBorderColor,
        bodyTextColor, bodyFont, bodyBorderColor, bodyBackgroundColor,
        reverse, reverseButtonIconColor, reverseButtonBorderColor, reverseButtonBackgroundColor, reverseTooltip,
        closeButtonBorderColor, closeButtonIconColor, closeButtonBackgroundColor,
        tooltip, protectTooltip, closeTooltip,
        extendLeft, onClose, onModify,
      } = options;
      const positionLine = this._positionLineMapping.get(id);
      if (!positionLine) {
        return;
      }
      if (price || price === 0) {
        positionLine.setPrice(price);
      }
      if (text) {
        positionLine.setText(text);
      }
      if (lineLength) {
        positionLine.setLineLength(lineLength);
      }
      if (lineStyle || lineStyle === 0) {
        positionLine.setLineStyle(lineStyle);
      }
      
      if (lineColor) {
        positionLine.setLineColor(lineColor);
      }
      if (tooltip) {
        positionLine.setTooltip(tooltip);
      }
      if (protectTooltip) {
        positionLine.setProtectTooltip(protectTooltip);
      }
      if (bodyTextColor) {
        positionLine.setBodyTextColor(bodyTextColor);
      }
      if (bodyFont) {
        positionLine.setBodyFont(bodyFont);
      }
      if (quantityText) {
        positionLine.setQuantity(quantityText);
      }
      if (quantityFont) {
        positionLine.setQuantityFont(quantityFont);
      }
      if (quantityTextColor) {
        positionLine.setQuantityTextColor(quantityTextColor);
      }
      if (quantityBackgroundColor) {
        positionLine.setQuantityBackgroundColor(quantityBackgroundColor);
      }
      if (quantityBorderColor) {
        positionLine.setQuantityBorderColor(quantityBorderColor);
      }
      if (bodyBorderColor) {
        positionLine.setBodyBorderColor(bodyBorderColor);
      }
      if (bodyBackgroundColor) {
        positionLine.setBodyBackgroundColor(bodyBackgroundColor);
      }
      if (reverse) {
        positionLine.onReverse(reverse.data, reverse.callback);
      }
      if (reverseTooltip) {
        positionLine.setReverseTooltip(reverseTooltip);
      }
      if (reverseButtonIconColor) {
        positionLine.setReverseButtonIconColor(reverseButtonIconColor);
      }
      if (reverseButtonBorderColor) {
        positionLine.setReverseButtonBorderColor(reverseButtonBorderColor);
      }
      if (closeButtonBorderColor) {
        positionLine.setCloseButtonBorderColor(closeButtonBorderColor);
      }
      if (closeButtonIconColor) {
        positionLine.setCloseButtonIconColor(closeButtonIconColor);
      }
      if (closeButtonBackgroundColor) {
        positionLine.setCloseButtonBackgroundColor(closeButtonBackgroundColor);
      }
      if (reverseButtonBackgroundColor) {
        positionLine.setReverseButtonBackgroundColor(reverseButtonBackgroundColor);
      }
      if (closeTooltip) {
        positionLine.setCloseTooltip(closeTooltip);
      }
      positionLine.setExtendLeft(!!extendLeft);
      if (onModify) {
        positionLine.onModify(onModify);
      }
      if (onClose) {
        positionLine.onClose(onClose);
      }
    }

    removeAllPositionLine() {
      this._positionLineMapping.forEach(positionLine => {
        positionLine.remove();
      });
      this._positionLineMapping.clear();
    }

    /**
     * 创建历史订单标识
     */
    createHistoryOrderMark(options: HistoryOrderMarkOptions) {
      let mark = this._historyOrderMarkMapping.get(options.id);
      if (mark) {
        mark.remove();
      }
      mark = this.activeChart().createExecutionShape();
      this._historyOrderMarkMapping.set(options.id, mark);
      this.overrideHistoryOrderMark(options);
    }

    overrideHistoryOrderMark(options: HistoryOrderMarkOptions) {
      const {
        id, price, arrowColor, tooltip, direction, time,
      } = options;
      const mark = this._historyOrderMarkMapping.get(id);
      if (!mark) {
        return;
      }
      if (price || price === 0) {
        mark.setPrice(price);
      }
      if (tooltip) {
        mark.setTooltip(tooltip);
      }
      if (arrowColor) {
        mark.setArrowColor(arrowColor);
      }
      if (direction) {
        mark.setDirection(direction);
      }
      if (time) {
        mark.setTime(time);
      }
    }

    removeAllHistoryOrderMark() {
      this._historyOrderMarkMapping.forEach(mark => {
        mark.remove();
      });
      this._historyOrderMarkMapping.clear();
    }

    /**
   * 创建止盈止损线
   */

    createPositionTPSLLine<T>(options: PositionLineOptions<T>) {
      let positionTPSLLine = this._positionTPSLLineMapping.get(options.id);
      if (positionTPSLLine) {
        positionTPSLLine.remove();
      }
      positionTPSLLine = this.activeChart().createPositionLine();
      this._positionTPSLLineMapping.set(options.id, positionTPSLLine);
      this.overridePositionTPSLLine(options);
    }

    overridePositionTPSLLine<T>(options: PositionLineOptions<T>) {
      const {
        id, price, text, lineLength, lineStyle, lineColor,
        quantityText, quantityFont, quantityTextColor, quantityBackgroundColor, quantityBorderColor,
        bodyTextColor, bodyFont, bodyBorderColor, bodyBackgroundColor,
        reverse, reverseButtonIconColor, reverseButtonBorderColor, reverseButtonBackgroundColor, reverseTooltip,
        closeButtonBorderColor, closeButtonIconColor, closeButtonBackgroundColor,
        tooltip, protectTooltip, closeTooltip,
        extendLeft, onClose, onModify,
      } = options;
      const positionTPSLLine = this._positionTPSLLineMapping.get(id);
      if (!positionTPSLLine) {
        return;
      }
      if (price || price === 0) {
        positionTPSLLine.setPrice(price);
      }
      if (text) {
        positionTPSLLine.setText(text);
      }
      if (lineLength) {
        positionTPSLLine.setLineLength(lineLength);
      }
      if (lineStyle || lineStyle === 0) {
        positionTPSLLine.setLineStyle(lineStyle);
      }
      if (lineColor) {
        positionTPSLLine.setLineColor(lineColor);
      }
      if (tooltip) {
        positionTPSLLine.setTooltip(tooltip);
      }
      if (protectTooltip) {
        positionTPSLLine.setProtectTooltip(protectTooltip);
      }
      if (bodyTextColor) {
        positionTPSLLine.setBodyTextColor(bodyTextColor);
      }
      if (bodyFont) {
        positionTPSLLine.setBodyFont(bodyFont);
      }
      if (quantityText) {
        positionTPSLLine.setQuantity(quantityText);
      }
      if (quantityFont) {
        positionTPSLLine.setQuantityFont(quantityFont);
      }
      if (quantityTextColor) {
        positionTPSLLine.setQuantityTextColor(quantityTextColor);
      }
      if (quantityBackgroundColor) {
        positionTPSLLine.setQuantityBackgroundColor(quantityBackgroundColor);
      }
      if (quantityBorderColor) {
        positionTPSLLine.setQuantityBorderColor(quantityBorderColor);
      }
      if (bodyBorderColor) {
        positionTPSLLine.setBodyBorderColor(bodyBorderColor);
      }
      if (bodyBackgroundColor) {
        positionTPSLLine.setBodyBackgroundColor(bodyBackgroundColor);
      }
      if (reverse) {
        positionTPSLLine.onReverse(reverse.data, reverse.callback);
      }
      if (reverseTooltip) {
        positionTPSLLine.setReverseTooltip(reverseTooltip);
      }
      if (reverseButtonIconColor) {
        positionTPSLLine.setReverseButtonIconColor(reverseButtonIconColor);
      }
      if (reverseButtonBorderColor) {
        positionTPSLLine.setReverseButtonBorderColor(reverseButtonBorderColor);
      }
      if (closeButtonBorderColor) {
        positionTPSLLine.setCloseButtonBorderColor(closeButtonBorderColor);
      }
      if (closeButtonIconColor) {
        positionTPSLLine.setCloseButtonIconColor(closeButtonIconColor);
      }
      if (closeButtonBackgroundColor) {
        positionTPSLLine.setCloseButtonBackgroundColor(closeButtonBackgroundColor);
      }
      if (reverseButtonBackgroundColor) {
        positionTPSLLine.setReverseButtonBackgroundColor(reverseButtonBackgroundColor);
      }
      if (closeTooltip) {
        positionTPSLLine.setCloseTooltip(closeTooltip);
      }
      positionTPSLLine.setExtendLeft(!!extendLeft);
      if (onModify) {
        positionTPSLLine.onModify(onModify);
      }
      if (onClose) {
        positionTPSLLine.onClose(onClose);
      }
    }

    removeAllPositionTPSLLine() {
      this._positionTPSLLineMapping.forEach(positionTPSLLine => {
        positionTPSLLine.remove();
      });
      this._positionTPSLLineMapping.clear();
    }

   /**
   * 创建爆仓线
   */
    createLiquidationLine<T>(options: PositionLineOptions<T>) {
      let positionLine = this._LiquidationLineMapping.get(options.id);
      if (positionLine) {
        positionLine.remove();
      }
      positionLine = this.activeChart().createPositionLine();
      this._LiquidationLineMapping.set(options.id, positionLine);
      this.overrideLiquidationLine(options);
    }

    overrideLiquidationLine<T>(options: PositionLineOptions<T>) {
      const {
        id, price, text, lineLength, lineStyle, lineColor,
        quantityText, quantityFont, quantityTextColor, quantityBackgroundColor, quantityBorderColor,
        bodyTextColor, bodyFont, bodyBorderColor, bodyBackgroundColor,
        reverse, reverseButtonIconColor, reverseButtonBorderColor, reverseButtonBackgroundColor, reverseTooltip,
        closeButtonBorderColor, closeButtonIconColor, closeButtonBackgroundColor,
        tooltip, protectTooltip, closeTooltip,
        extendLeft, onClose, onModify,
      } = options;
      const positionLine = this._LiquidationLineMapping.get(id);
      if (!positionLine) {
        return;
      }
      if (price || price === 0) {
        positionLine.setPrice(price);
      }
      if (text) {
        positionLine.setText(text);
      }
      if (lineLength) {
        positionLine.setLineLength(lineLength);
      }
      if (lineStyle || lineStyle === 0) {
        positionLine.setLineStyle(lineStyle);
      }
      if (lineColor) {
        positionLine.setLineColor(lineColor);
      }
      if (tooltip) {
        positionLine.setTooltip(tooltip);
      }
      if (protectTooltip) {
        positionLine.setProtectTooltip(protectTooltip);
      }
      if (bodyTextColor) {
        positionLine.setBodyTextColor(bodyTextColor);
      }
      if (bodyFont) {
        positionLine.setBodyFont(bodyFont);
      }
      if (quantityText) {
        positionLine.setQuantity(quantityText);
      }
      if (quantityFont) {
        positionLine.setQuantityFont(quantityFont);
      }
      if (quantityTextColor) {
        positionLine.setQuantityTextColor(quantityTextColor);
      }
      if (quantityBackgroundColor) {
        positionLine.setQuantityBackgroundColor(quantityBackgroundColor);
      }
      if (quantityBorderColor) {
        positionLine.setQuantityBorderColor(quantityBorderColor);
      }
      if (bodyBorderColor) {
        positionLine.setBodyBorderColor(bodyBorderColor);
      }
      if (bodyBackgroundColor) {
        positionLine.setBodyBackgroundColor(bodyBackgroundColor);
      }
      if (reverse) {
        positionLine.onReverse(reverse.data, reverse.callback);
      }
      if (reverseTooltip) {
        positionLine.setReverseTooltip(reverseTooltip);
      }
      if (reverseButtonIconColor) {
        positionLine.setReverseButtonIconColor(reverseButtonIconColor);
      }
      if (reverseButtonBorderColor) {
        positionLine.setReverseButtonBorderColor(reverseButtonBorderColor);
      }
      if (closeButtonBorderColor) {
        positionLine.setCloseButtonBorderColor(closeButtonBorderColor);
      }
      if (closeButtonIconColor) {
        positionLine.setCloseButtonIconColor(closeButtonIconColor);
      }
      if (closeButtonBackgroundColor) {
        positionLine.setCloseButtonBackgroundColor(closeButtonBackgroundColor);
      }
      if (reverseButtonBackgroundColor) {
        positionLine.setReverseButtonBackgroundColor(reverseButtonBackgroundColor);
      }
      if (closeTooltip) {
        positionLine.setCloseTooltip(closeTooltip);
      }
      positionLine.setExtendLeft(!!extendLeft);
      if (onModify) {
        positionLine.onModify(onModify);
      }
      if (onClose) {
        positionLine.onClose(onClose);
      }
    }

    removeAllLiquidationLine() {
      this._LiquidationLineMapping.forEach(positionLine => {
        positionLine.remove();
      });
      this._LiquidationLineMapping.clear();
    }



    remove(): void {
      try {
        clearTimeout(this._saveStudiesShapesTimeout);
        this.unsubscribe('study_event', this._studyEvent);
        super.remove();
      } catch { }
    }
  }

  return new Widget(options);
}

