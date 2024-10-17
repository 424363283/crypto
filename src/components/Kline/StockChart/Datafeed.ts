import { OnReadyCallback, ErrorCallback, IDatafeedChartApi, LibrarySymbolInfo, PeriodParams, ResolutionString, SearchSymbolsCallback, Timezone, Bar, HistoryMetadata } from '../../../../public/tradingView/charting_library/charting_library';

import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import axios, { Canceler } from 'axios';

import { volumeConversion } from './types';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';

import { ALL_RESOLUTION_INFO, SUPPORT_RESOLUTIONS } from '../types';

// import { WebSocketAPI } from '@/service/spot/spotWs';
// import useSpotMetaData from '@/models/spot';

let birdeyeApiKey='c12a45312db84ec7a7cfe03b8a0f38ce'
const httpApi = 'https://public-api.birdeye.so';

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
  return '15';
}

export default class Datafeed implements IDatafeedChartApi {
  private _options: DatafeedOptions;
  private _requestCancels: Canceler[] = [];
  private _lastData: Bar | null = null;

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
        supports_timescale_marks: false,
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
      format: 'price',
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
    if (firstDataRequest) {
      this._options.onDataLoading?.();
    }
    try {
      const url = new URL(window.location.href);
      const pathname = url.pathname;
      const address = 'So11111111111111111111111111111111111111112'

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-chain':'solana',
          'X-API-KEY': birdeyeApiKey,
        },
      };

      let time_from = start / 1000;
      let time_to = end / 1000;
      let  symbol= 'BTC-USDT'
      const TV_LINK = `/api/tv/tradingView/history?symbol=${symbol}&from=${time_from}&to=${time_to}&resolution=${getReqIntervalFromResolution(resolution)}`;

      const res3 = await fetch(TV_LINK).then(response => response.json());

      // const res3 = await fetch(
      //   `${httpApi}/defi/ohlcv?address=${address}&type=${getReqIntervalFromResolution(
      //     resolution
      //   )}&time_from=${time_from}&time_to=${time_to}`,
      //   options
      // ).then(response => response.json());



const barsData: { t: number; c: number; o: number; h: number; l: number; v: number; }[] = [];

(res3.t || []).forEach((t, i) => {
  if (t >= from && t <= to) {
    barsData.push({
      // t: t * 1000,
      t: t * 1000,
      c: +res3.c[i],
      o: +res3.o[i],
      h: +res3.h[i],
      l: +res3.l[i],
      v: +res3.v[i],
    });
  }
});

console.log("barsData",barsData)


      
      let res3Data = res3?.data?.items?.map(item => ({
        c: item.c,
        h: item.h,
        l: item.l,
        o: item.o,
        // s: 'SOL-SWAP-USDT',
        // sn: 'SOL-SWAP-USDT',
        t: Number(item.unixTime) * 1000,
        v: item.v,
      }));
      const bars: DatafeedBar[] = [];

      if (barsData.length > 0) {
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
              volume: +d.v,
              // volume: +volumeConversion(
              //   volumeUnit,
              //   symbolInfo.volume_multiplier,
              //   +d.v,
              //   (open + close) / 2,
              //   symbolInfo.volume_precision!
              // ),
            });
          }
        }
      }
      if (firstDataRequest) {
        this._lastData = bars[bars.length - 1] ?? null;
      }
      onResult(bars, { noData: bars.length === 0 });
    } catch (e) {
      onResult([], { noData: true });
    }
    this._options.onDataLoadEnd?.();
  }

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

    // operator.unsubscribe(key);
    const handleDataUpdate = (updatedData: any) => {
      let result = updatedData.data[0];
      const url = new URL(window.location.href);
      const pathname = url.pathname;
      const address = pathname.split('/').pop();

      // console.log("数据更新",result.symbol,"时间",result.type, result)
      // console.log("数据更新-address",address,interval)

      if (!result) {
        return;
      }
      if (result?.address?.toLowerCase() != (address?.toLowerCase() ?? '')) {
        return;
      }
      if (result?.type != interval) {
        return;
      }

      // console.log('result?.address?.toLowerCase() != address', result?.address?.toLowerCase() != address);
      const volumeUnit = this._options.volumeUnit;
      const open = Number(result?.o);
      const close = Number(result?.c);
      const bar: DatafeedBar = {
        time: Number(result.unixTime) * 1000,
        timestamp: Number(result.unixTime) * 1000,
        open,
        high: Number(result.h),
        low: Number(result.l),
        close,
        volume: +volumeConversion(
          volumeUnit,
          symbolInfo.volume_multiplier,
          +result.v,
          (open + close) / 2,
          symbolInfo.volume_precision!
        ),
      };
      let isBroken = false;
      if (this._lastData) {
        if (bar.time === this._lastData.time) {
          this._lastData = { ...bar };
        } else {
          if (bar.time > this._lastData.time) {
            const period = interval.replace(/\d+/g, '');
            const diff = parseInt(resolution);
            // const diff * 60 * 1000
            switch (period) {
              case 'm': {
                if (bar.time - this._lastData.time > diff * 60 * 1000) {
                  isBroken = true;
                }
                break;
              }
              case 'h': {
                if (bar.time - this._lastData.time > diff * 60 * 60 * 1000) {
                  isBroken = true;
                }
                break;
              }
              case 'd': {
                if (bar.time - this._lastData.time > diff * 24 * 60 * 60 * 1000) {
                  isBroken = true;
                }
                break;
              }
              case 'w': {
                const lastDate = dayjs(this._lastData.time).tz('Asia/Shanghai');
                const barDate = dayjs(bar.time).tz('Asia/Shanghai');
                if (barDate.day() !== 1 || lastDate.diff(barDate, 'week', true) > diff) {
                  isBroken = true;
                }
                break;
              }
              case 'M': {
                const lastDate = dayjs(this._lastData.time).tz('Asia/Shanghai');
                const barDate = dayjs(bar.time).tz('Asia/Shanghai');
                if (barDate.date() !== 1 || lastDate.diff(barDate, 'month', true) > diff) {
                  isBroken = true;
                }
                break;
              }
            }
          }
        }
      }
      if (isBroken) {
        // operator.unsubscribe(key);
        this._options.brokenNotify();
      } else {
        this._lastData = { ...bar };
        onTick(bar);
      }
    };
    // useSpotMetaData.getState().chain
    // const eventKey = `dataUpdated:${useSpotMetaData.getState().chain}:PRICE_DATA`;
    // WebSocketAPI.eventBus.on(eventKey, handleDataUpdate);
    // WebSocketAPI.eventBus.on('dataUpdated:PRICE_DATA', handleDataUpdate);
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

  cancel() {
    this._requestCancels.forEach(cancel => {
      try {
        cancel('');
      } catch {}
    });
    this._requestCancels = [];
  }
}
