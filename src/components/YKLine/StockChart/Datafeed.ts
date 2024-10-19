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
import { SUBSCRIBE_TYPES, useWs,WS,wsType } from '@/core/network';


import { volumeConversion } from './types';

import { ALL_RESOLUTION_INFO, SUPPORT_RESOLUTIONS } from '../types';

// import { operator } from '@/service';

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
  searchSymbols(_userInput: string, _exchange: string, _symbolType: string, _onResult: SearchSymbolsCallback): void {}

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
      // minmov2: 0, // 新版api 无
      // has_empty_bars: false,
      has_daily: true, // // 新版api 无 日k线诗句
      exchange: '',
      listed_exchange: '',
      format: 'price'
    };
    onResolve(symbol);
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
    // const url = isKLine ? api.kline_history : api.index_kline;

    let time_from = start / 1000;
    let time_to = end / 1000;
    let symbol = 'BTC-USDT';
    const TV_LINK = `https://dev-swap.83uvgv.com/api/tv/tradingView/history?symbol=${symbol}&from=${time_from}&to=${time_to}&resolution=${resolution}`;

    const res3 = await fetch(TV_LINK).then(response => response.json());

    const barsData: { t: number; c: number; o: number; h: number; l: number; v: number }[] = [];

    (res3.t || []).forEach((t, i) => {
      if (t >= from && t <= to) {
        barsData.push({
          // t: t * 1000,
          t: t * 1000,
          c: +res3.c[i],
          o: +res3.o[i],
          h: +res3.h[i],
          l: +res3.l[i],
          v: +res3.v[i]
        });
      }
    });

    if (firstDataRequest) {
      this._options.onDataLoading?.();
    }
    try {
      // const response = await http({
      //   url,
      //   method: 'get',
      //   options: {
      //     body: {
      //       symbol: isKLine ? EXCHANGE_ID + '.' + symbolInfo.name.toUpperCase() : symbolInfo.ticker,
      //       interval: getReqIntervalFromResolution(resolution),
      //       from: start,
      //       to: end
      //       // limit // 默认写的固定值需要调整
      //     },
      //     cancelToken: new axios.CancelToken(cancel => {
      //       this._requestCancels.push(cancel);
      //     })
      //   }
      // });
      // const content = response.data ?? {};
      const bars: DatafeedBar[] = [];
      // if (content.code === 200) {
      const data = barsData ?? [];
      const volumeUnit = this._options.volumeUnit;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const time = d.t;
        if (time <= end && time >= start) {
          const open = Number(d.o);
          const close = Number(d.c);
          bars.push({
            time,
            // 时间戳字段适配基础版k线数据
            timestamp: time,
            open,
            high: Number(d.h),
            low: Number(d.l),
            close,
            volume: d.v,
            // volume: +volumeConversion(
            //   volumeUnit,
            //   symbolInfo.volume_multiplier,
            //   +d.v,
            //   (open + close) / 2,
            //   symbolInfo.volume_precision!
            // )
          });
        }
      }
      // }
      if (firstDataRequest) {
        this._lastData = bars[bars.length - 1] ?? null;
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

    const interval = getReqIntervalFromResolution(resolution);

    const key = isIndexPrice ? 'indexKline_source' : 'kline_source';
    this._onTickCallback = onTick;
    // console.log("Accessing updated data in subscribeBars:", this._updatedData);
    // const callback = (response: any) => {
    //   console.log('订阅响应:', response);
    // };

    const ids = ['BTC-USDT'];

    // 调用 subscribe4001 方法进行订阅
    WS.subscribe4001(ids, 1, (response) => {
      console.log('订阅响应:', response);
    });

    // 使用 getDataAfterSubscription 方法来处理推送的数据
    
//     const ids = ['BTC-USDT'];

// // 可选的 r 参数
// const r = 1;
//     // 调用 subscribe4001 方法
//     WS.subscribe4001(ids, r, callback);
    
    // useWs(SUBSCRIBE_TYPES.ws4001, (data) =>{

    //   console.log("data===========",data)

    // });


    // operator.unsubscribe(key);
    // operator.subscribe(key, (data) => {
    //   const result = data[isIndexPrice ? `indexKline_${symbolInfo.name}_${interval}` : `kline_${EXCHANGE_ID}${symbolInfo.name}_${interval}`];
    //   if (!result) {
    //     return;
    //   }
    //   const volumeUnit = this._options.volumeUnit;
    //   const open = Number(result.o);
    //   const close = Number(result.c);
    //   const bar: DatafeedBar = {
    //     time: result.t,
    //     timestamp: result.t,
    //     open,
    //     high: Number(result.h),
    //     low: Number(result.l),
    //     close,
    //     volume: +(volumeConversion(
    //       volumeUnit,
    //       symbolInfo.volume_multiplier,
    //       +result.v,
    //       (open + close) / 2,
    //       symbolInfo.volume_precision!
    //     ))
    //   };
    //   let isBroken = false;
    //   if (this._lastData) {
    //     if (bar.time === this._lastData.time) {
    //       this._lastData = { ...bar };
    //     } else {
    //       if (bar.time > this._lastData.time) {
    //         const period = interval.replace(/\d+/g, '');
    //         const diff = parseInt(resolution);
    //         // const diff * 60 * 1000
    //         switch (period) {
    //           case 'm': {
    //             if (bar.time - this._lastData.time > diff * 60 * 1000) {
    //               isBroken = true;
    //             }
    //             break;
    //           }
    //           case 'h': {
    //             if (bar.time - this._lastData.time > diff * 60 * 60 * 1000) {
    //               isBroken = true;
    //             }
    //             break;
    //           }
    //           case 'd': {
    //             if (bar.time - this._lastData.time > diff * 24 * 60 * 60 * 1000) {
    //               isBroken = true;
    //             }
    //             break;
    //           }
    //           case 'w': {
    //             const lastDate = dayjs(this._lastData.time).tz('Asia/Shanghai');
    //             const barDate = dayjs(bar.time).tz('Asia/Shanghai');
    //             if (barDate.day() !== 1 || (lastDate.diff(barDate, 'week', true) > diff)) {
    //               isBroken = true;
    //             }
    //             break;
    //           }
    //           case 'M': {
    //             const lastDate = dayjs(this._lastData.time).tz('Asia/Shanghai');
    //             const barDate = dayjs(bar.time).tz('Asia/Shanghai');
    //             if (barDate.date() !== 1 || (lastDate.diff(barDate, 'month', true) > diff)) {
    //               isBroken = true;
    //             }
    //             break;
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if (isBroken) {
    //     operator.unsubscribe(key);
    //     this._options.brokenNotify();
    //   } else {
    //      this._lastData = { ...bar };
    //      onTick(bar);
    //   }
    // });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsubscribeBars(_listenerGuid: string): void {}

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
      // console.log("实时更新数据data",data)
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
      } catch {}
    });
    this._requestCancels = [];
  }
}
