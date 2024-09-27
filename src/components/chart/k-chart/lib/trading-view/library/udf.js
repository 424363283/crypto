const lastBarsCaches = {};
class Datafeeds {
  DatafeedConfiguration = {
    supports_search: false,
    supports_group_request: false,
    supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', 'D', 'W', 'M'],
    exchanges: [],
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: false,
  };
  subscribers = {};
  _config = {};
  timezone = '';

  constructor(config, timezone) {
    this._config = config;
    this.timezone = timezone;
  }
  // 1.准备阶段 初始化配置
  onReady(callback) {
    setTimeout(() => callback(this.DatafeedConfiguration), 0);
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    const list = this._config.tradeList;
    const type = this._config.symbolType;
    const result = [];
    for (const symbol in list) {
      const item = list[symbol];
      if (item.name.indexOf(userInput.toUpperCase()) !== -1) {
        if (type == item['symbolType']) {
          result.push({
            symbol: item.name,
            full_name: item.name,
            exchange: process.env.NEXT_PUBLIC_APP_NAME,
            type: type,
            description: item.fullname,
            ticker: symbol,
          });
        }
      }
    }
    onResultReadyCallback(result);
  }
  // 2.获取商品信息
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    try {
      const { digit, name } = this._config.tradeList[symbolName] || {};
      // console.log('TradingView -> [resolveSymbol]: ', this._config.tradeList[symbolName]);
      setTimeout(() => {
        onSymbolResolvedCallback({
          symbol: symbolName,
          name: name,
          minmov: 1,
          volume_precision: 8,
          pricescale: Math.pow(10, digit || 1),
          has_intraday: true,
          session: '24x7',
          exchange: process.env.NEXT_PUBLIC_APP_NAME,
          full_name: name,
          listed_exchange: process.env.NEXT_PUBLIC_APP_NAME,
          intraday_multipliers: ['1', '3', '5', '15', '30', '60', '240', 'D'],
          timezone: this.timezone,
        });
      });
    } catch (err) {
      console.error(err);
      onResolveErrorCallback(err);
    }
  }
  // 3.获取历史数据
  getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
    const { firstDataRequest, from, to } = periodParams;
    if (resolution == '1D') {
      resolution = 'D';
    } else if (resolution > 60 && resolution != '240') {
      resolution = 60;
    }
    const path = `/api/tv/tradingView/${/S.*-SUSD(T)?$/i.test(symbolInfo.symbol) ? 'testnethistory' : 'history'}`;
    const url = `${path}?symbol=${symbolInfo.symbol}&resolution=${resolution}&from=${from}&to=${to}`;
    fetch(url)
      .then((str) => str.json())
      .then((data) => {
        const bars = [];
        if (data.s === 'ok') {
          (data.t || []).forEach((t, i) => {
            if (t >= from && t <= to) {
              bars.push({
                time: t * 1000,
                close: +data.c[i],
                open: +data.o[i],
                high: +data.h[i],
                low: +data.l[i],
                volume: +data.v[i],
              });
            }
          });

          if (firstDataRequest) {
            const lastBar = bars[bars.length - 1];
            lastBarsCaches[symbolInfo.symbol + '_' + resolution] = lastBar;
          }

          onHistoryCallback(bars);
        } else {
          onHistoryCallback(bars, { noData: true });
        }
      })
      .catch((err) => {
        onErrorCallback(err);
      });
  }
  // 4.订阅函数
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    if (this.subscribers[subscriberUID]) return;
    try {
      let r = '';
      if (resolution == '1D') {
        r = 'D';
      } else if (resolution > 60 && resolution != '240') {
        r = 60;
      } else {
        r = resolution;
      }
      const lastBar = lastBarsCaches[symbolInfo.symbol + '_' + r];
      if (lastBar) {
        this.subscribers[subscriberUID] = {
          lastBarTime: lastBar.time,
          listener: onRealtimeCallback,
          lastDailyBar: lastBar,
          resolution: resolution,
          symbolInfo: symbolInfo,
          onResetCacheNeededCallback: onResetCacheNeededCallback,
        };
        // console.log('TradingView -> [subscribeBars]: ', this.subscribers[subscriberUID]);
      } else {
        // console.log('TradingView -> [subscribeBars]: ', 'lastBar is null');
      }
    } catch (err) {
      console.error(err);
    }
  }
  // 5.退订函数
  unsubscribeBars(subscriberUID) {
    if (!this.subscribers[subscriberUID]) {
      return;
    }
    delete this.subscribers[subscriberUID];
  }
  // 6.实时更新更新函数
  updateBars(bar) {
    bar.time = bar.time * 1000;
    for (const subscriberUID in this.subscribers) {
      if (subscriberUID.includes(bar.id)) {
        const subscriptionRecord = this.subscribers[subscriberUID];
        if (bar.time < subscriptionRecord.lastBarTime) {
          // 如果实时数据时间小于最后一根k线的时间则跳过更新
          continue;
        }
        const _bar = this._formatData.Step1(bar, subscriptionRecord.lastDailyBar, subscriptionRecord.resolution);
        subscriptionRecord.lastBarTime = bar.time;
        subscriptionRecord.lastDailyBar = _bar;
        // console.log(_bar, bar, subscriptionRecord.lastDailyBar, subscriptionRecord.resolution);
        subscriptionRecord.listener(_bar);
      }
    }
  }
  // 7.重新获取历史
  refreshBars(widget) {
    const subscribers = this.subscribers;
    for (let SUID in subscribers) {
      subscribers[SUID].onResetCacheNeededCallback();
    }
    // console.log('widget', widget);
    widget.activeChart().resetData();
  }
  // 数据合成算法
  _formatData = {
    _s: undefined,
    _v: 0,
    _id: undefined,
    _r: undefined,
    Step1(_data, _oldData, resolution) {
      const s = new Date(_data.time).getMinutes();
      // 时间不同或者id不同或者分辨率不同
      if (this._s != s || _data.id != this._id || _data.resolution != this._r) {
        this._s = s;
        this._id = _data.id;
        this._r = _data.resolution;
        this._v = +_data.volume;
      } else {
        if (_data.volume > this._v) {
          let _now_v = +_data.volume - this._v;
          this._v = +_data.volume;
          _data.volume = _now_v;
        } else {
          this._v = +_data.volume;
          _data.volume = 0;
        }
      }
      const result = this.Step2([_oldData, _data], resolution);
      return result[result.length - 1];
    },
    Step2(data, resolution) {
      // console.log(resolution);
      let result = []; //
      let length = 1;
      let step = 1;
      const range = [];

      switch (resolution) {
        case '1':
          length = 60;
          step = 1;
          break;
        case '3':
          length = 60;
          step = 3;
          break;
        case '5':
          length = 60;
          step = 5;
          break;
        case '15':
          length = 60;
          step = 15;
          break;
        case '30':
          length = 60;
          step = 30;
          break;
        case '60':
          length = 24;
          step = 1;
          break;
        case '120':
          length = 24;
          step = 2;
          break;
        case '240':
          length = 24;
          step = 4;
          break;
        case '360':
          length = 24;
          step = 6;
          break;
        case '480':
          length = 24;
          step = 8;
          break;
        case '720':
          length = 24;
          step = 12;
          break;
        case '1D':
          length = 31;
          step = 1;
          break;
        case '1W':
          length = 7;
          step = 1;
          break;
        case '1M':
          length = 12;
          step = 1;
          break;
        default:
          length = 1;
          step = 1;
      }

      for (var i = 0; i < length / step; i++) {
        range.push([i * step, i * step + step]);
      }
      // console.log(range);

      let open;
      let close;
      let high;
      let low;
      let volume;
      let time;

      const isRange = (t, a, b, week) => {
        if (week) {
          return t !== 1;
        }
        return t >= a && t < b;
      };
      const getTime = (t) => {
        switch (resolution) {
          case '1':
            return new Date(t).getMinutes();
          case '3':
            return new Date(t).getMinutes();
          case '5':
            return new Date(t).getMinutes();
          case '15':
            return new Date(t).getMinutes();
          case '30':
            return new Date(t).getMinutes();
          case '60':
            return new Date(t).getHours();
          case '120':
            return new Date(t).getHours();
          case '240':
            return new Date(t).getHours();
          case '360':
            return new Date(t).getHours();
          case '480':
            return new Date(t).getHours();
          case '720':
            return new Date(t).getHours();
          case '1D':
            return new Date(t).getDate();
          case '1W':
            return new Date(t).getDay();
          case '1M':
            return new Date(t).getMonth();
        }
      };

      for (var i = 0; i < data.length; i++) {
        const _time = getTime(data[i].time);

        for (var j = 0; j < range.length; j++) {
          if (isRange(_time, range[j][0], range[j][1])) {
            if (!open) {
              open = data[i].open;
            }
            if (!high || data[i].high > high) {
              high = Math.max(data[i].high, data[i].close);
            }
            if (!low || data[i].low < low) {
              low = Math.min(data[i].low, data[i].close);
            }
            if (!volume) {
              volume = data[i].volume;
            } else {
              volume += data[i].volume;
            }
            if (!time) {
              time = data[i].time;
            }
            close = data[i].close;

            if (
              data.length - 1 == i ||
              !isRange(getTime(data[i + 1].time), range[j][0], range[j][1], resolution === '1W')
            ) {
              result.push({
                time: time,
                open: open,
                high: high,
                low: low,
                close: close,
                volume: volume,
              });
              open = undefined;
              close = undefined;
              high = undefined;
              low = undefined;
              volume = undefined;
              time = undefined;
            }
            break;
          }
        }
      }
      return result;
    },
  };
}

export default Datafeeds;
