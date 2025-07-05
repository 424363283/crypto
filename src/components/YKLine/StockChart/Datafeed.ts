import {
  OnReadyCallback,
  ErrorCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  SearchSymbolsCallback,
  Timezone,
  Bar,
  HistoryMetadata
} from '../../../../public/tradingView/charting_library/charting_library';

import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import axios, { Canceler } from 'axios';
import { SUBSCRIBE_TYPES, useWs, WS, wsType } from '@/core/network';
import { isLite, getUrlQueryParams } from '@/core/utils';

import { ALL_RESOLUTION_INFO, SUPPORT_RESOLUTIONS } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

interface DatafeedOptions {
  priceType: number;
  volumeUnit: number;
  getTimezone: () => string;
  brokenNotify: () => void;
  onDataLoading?: () => void;
  onDataLoadEnd?: () => void;
}

export type DatafeedSymbolInfo = LibrarySymbolInfo & { volume_multiplier: number; price_precision: number };

export type DatafeedBar = Bar & { timestamp: number };

export type DatafeedOnResolveSymbolCallback = (symbolInfo: DatafeedSymbolInfo) => void;

export type DatafeedGetBarsOnResultCallBack = (dataList: DatafeedBar[], meta?: HistoryMetadata) => void;

export type DatafeedSubscribeOnTickCallback = (bar: DatafeedBar) => void;

function getReqIntervalFromResolution(resolution: string) {
  const resolutionInfo = ALL_RESOLUTION_INFO.find(item => item.resolution === resolution);
  if (resolutionInfo) {
    return resolutionInfo.tvRes;
  }
  return '15m';
}

export default class Datafeed implements IDatafeedChartApi {
  private _options: DatafeedOptions;
  private _requestCancels: Canceler[] = [];
  private _lastData: Bar | null = null;
  private _updatedData: any;

  constructor(options: DatafeedOptions) {
    this._options = options;
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  onReady(callback: OnReadyCallback) {
    setTimeout(() =>
      callback({
        exchanges: [],
        symbols_types: [],
        supports_time: true,
        supported_resolutions: SUPPORT_RESOLUTIONS as ResolutionString[],
        supports_marks: false,
        supports_timescale_marks: false
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchSymbols(_userInput: string, _exchange: string, _symbolType: string, _onResult: SearchSymbolsCallback): void { }

  resolveSymbol(symbolName: string, onResolve: DatafeedOnResolveSymbolCallback): void {
    const result = symbolName.split('@');
    const ticker = result[0];
    const name = result[1];
    const pricePrecision = +result[2];
    const volumePrecision = +result[3];
    const volumeMultiplier = +result[4];
    const symbol: DatafeedSymbolInfo = {
      ticker,
      name,
      full_name: ticker,
      description: '', // 描述可以为空
      type: 'stock',
      session: '24x7',
      pricescale: Math.pow(10, pricePrecision), // 价格精度
      price_precision: pricePrecision,
      volume_precision: volumePrecision, // 成交量小数位
      volume_multiplier: volumeMultiplier,
      has_intraday: true, // 分钟数据
      visible_plots_set: 'ohlcv',
      has_weekly_and_monthly: true, // 月，周数据
      supported_resolutions: SUPPORT_RESOLUTIONS as ResolutionString[],
      timezone: this._options.getTimezone() as Timezone,
      data_status: 'streaming',
      minmov: 1, // 新版api 无
      has_daily: true, // 新版api 无 日k线诗句
      exchange: '',
      listed_exchange: '',
      format: 'price'
    };
    onResolve(symbol);
  }
  // 处理可见性变化
  // private handleVisibilityChange() {
  //   if (document.visibilityState === 'visible') {
  //     console.log("页面从其他标签切换到当前标签");
  //     // 重新请求K线的历史数据
  //     // const symbol = (window.location.pathname.split('/').pop() || "btc-usdt").toUpperCase();
  //     // const resolution = '15'; // 根据需要设置分辨率
  //     // const periodParams = { from: Date.now() / 1000 - 3600, to: Date.now() / 1000, firstDataRequest: true }; // 过去一小时的数据
  //     // this.getBars(this?._lastData, resolution, periodParams, (bars, meta) => {
  //     //   // 处理获取到的K线数据
  //     //   console.log(bars, meta);
  //     // }, (error) => {
  //     //   console.error("获取K线数据失败", error);
  //     // });
  //   } else {
  //     console.log("当前标签页不再可见");
  //   }
  // }


  // 处理可见性变化
  private async handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      console.log("页面从其他标签切换到当前标签");
      this.cancel()
      
      // 获取当前的symbol和时间参数
      let symbol = (window.location.pathname.split('/').pop() || "btc-usdt").toUpperCase();
      const time_from = Math.floor(Date.now() / 1000) - 86400;// 过去24小时
      const time_to = Math.floor(Date.now() / 1000); // 当前时间
      const periodParams = { from: time_from, to: time_to, firstDataRequest: true };
      // const periodParams = { from: '1735077891', to: '1735977891', firstDataRequest: false };

      // 请求历史数据
      // await this.getBars(
      //   { ticker: symbol, name: '', full_name: symbol, description: '', type: 'stock', session: '24x7', pricescale: 1, price_precision: 2, volume_precision: 2, volume_multiplier: 1, has_intraday: true, visible_plots_set: 'ohlcv', has_weekly_and_monthly: true, supported_resolutions: SUPPORT_RESOLUTIONS as ResolutionString[], timezone: this._options.getTimezone() as Timezone, data_status: 'streaming', minmov: 1, has_daily: true, exchange: '', listed_exchange: '', format: 'price' } as DatafeedSymbolInfo,
      //   '1', // 你可以根据需要调整分辨率
      //   periodParams,
      //   (bars, meta) => {
      //     // 处理返回的数据
      //     // console.log("获取到的历史数据:", bars, meta);
      //     if (this._onTickCallback) {
      //       this._onTickCallback(bars);
      //     }

      //   },
      //   (error) => {
      //     console.error("获取数据错误:", error);
      //   }
      // );
    } else {
      console.log("当前标签页不再可见");
    }
  }

  async getBars(
    symbolInfo: DatafeedSymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: DatafeedGetBarsOnResultCallBack,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: ErrorCallback
  ) {
    const { from, to, firstDataRequest } = periodParams;
    const start = from * 1000;
    const end = to * 1000;

    const isKLine = this._options.priceType === 0;

    let time_from = start / 1000;
    let time_to = end / 1000;
    let symbol = (window.location.pathname.split('/').pop() || "btc-usdt").toUpperCase();
    // let symbol = (symbolInfo.ticker || "btc-usdt").toUpperCase();
    // let symbol = "BTCUSDT1808";
    const contract = getUrlQueryParams('contract');

    const isLiteId = isLite(symbol);
    if (isLiteId) {
      symbol = `${symbol.toUpperCase()}1808`;
    }

    try {
      const bars: DatafeedBar[] = [];
      const TV_LINK = `/api/tv/tradingView/history?symbol=${symbol}&from=${time_from}&to=${time_to}&resolution=${resolution}`;
      const response = await fetch(TV_LINK);
      const res3 = await response.json();

      const barsData: { t: number; c: number; o: number; h: number; l: number; v: number }[] = [];

      (res3.t || []).forEach((t, i) => {
        if (t >= time_from && t <= time_to) {
          barsData.push({
            t: t * 1000,
            c: +res3.c[i],
            o: +res3.o[i],
            h: +res3.h[i],
            l: +res3.l[i],
            v: +res3.v[i]
          });
        }
      });

      for (let i = 0; i < barsData.length; i++) {
        const d = barsData[i];
        const time = d.t;
        if (time <= end && time >= start) {
          const open = Number(d.o);
          const close = Number(d.c);
          bars.push({
            time,
            timestamp: time,
            open,
            high: Number(d.h),
            low: Number(d.l),
            close,
            volume: d.v,
          });
        }
      }

      console.log("🔥",firstDataRequest )
      if (firstDataRequest) {
        this._lastData = bars[bars.length - 1] ?? null;
      }

      onResult(bars, { noData: bars.length === 0 });
    } catch (e) {
      onResult([], { noData: true });
    }
    this._options.onDataLoadEnd?.();
  }

  private async fetchHistoricalData(symbol: string, time_from: number, time_to: number, resolution: ResolutionString, onResult: DatafeedGetBarsOnResultCallBack) {
    const TV_LINK = `/api/tv/tradingView/history?symbol=${symbol}&from=${time_from}&to=${time_to}&resolution=${resolution}`;
    const res3 = await fetch(TV_LINK).then(response => response.json());

    const barsData: { t: number; c: number; o: number; h: number; l: number; v: number }[] = [];

    (res3.t || []).forEach((t, i) => {
      if (t >= time_from && t <= time_to) {
        barsData.push({
          t: t * 1000,
          c: +res3.c[i],
          o: +res3.o[i],
          h: +res3.h[i],
          l: +res3.l[i],
          v: +res3.v[i]
        });
      }
    });

    if (this._options.onDataLoading) {
      this._options.onDataLoading();
    }

    try {
      const bars: DatafeedBar[] = [];
      const data = barsData ?? [];
      const volumeUnit = this._options.volumeUnit;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const time = d.t;
        if (time <= time_to && time >= time_from) {
          const open = Number(d.o);
          const close = Number(d.c);
          bars.push({
            time,
            timestamp: time,
            open,
            high: Number(d.h),
            low: Number(d.l),
            close,
            volume: d.v,
          });
        }
      }
      onResult(bars, { noData: bars.length === 0 });
    } catch (e) {
      onResult([], { noData: true });
    }
    this._options.onDataLoadEnd?.();
  }

  private _onTickCallback: DatafeedSubscribeOnTickCallback | null = null;

  subscribeBars(
    symbolInfo: DatafeedSymbolInfo,
    resolution: ResolutionString,
    onTick: DatafeedSubscribeOnTickCallback,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _listenerGuid: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onResetCacheNeededCallback: () => void
  ): void {
    const isIndexPrice = this._options.priceType === 1;
    this._onTickCallback = onTick;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsubscribeBars(_listenerGuid: string): void { }

  setPriceType(priceType: number): boolean {
    if (this._options.priceType !== priceType) {
      this._options.priceType = priceType;
      return true;
    }
    return false;
  }

  setVolumeUnit(unit: number) {
    if (this._options.volumeUnit !== unit) {
      this._options.volumeUnit = unit;
      return true;
    }
    return false;
  }

  // 实时更新数据
  updateData(data) {
    this._updatedData = data;
    if (this._onTickCallback) {
      const bar: DatafeedBar = {
        time: data.t * 1000,
        timestamp: data.t * 1000,
        open: +data.o,
        high: +data.h,
        low: +data.l,
        close: +data.c,
        volume: +data.v,
      };
      this._onTickCallback(bar);
    }
  }

  cancel() {
    this._requestCancels.forEach(cancel => {
      try {
        cancel('');
      } catch { }
    });
    this._requestCancels = [];
  }
}