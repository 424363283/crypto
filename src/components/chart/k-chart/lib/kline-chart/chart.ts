import { kChartEmitter } from '@/core/events';
import { GroupItem } from '@/core/shared';
import { LOCAL_KEY, localStorageApi, THEME } from '@/core/store';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { Chart, KLineData } from './index.d';
import { init } from './index.esm';

import { getKlineCTradeHistoryApi, getKlineUTradeHistoryApi } from '@/core/api';
import { isSwapDemoTradePage, isSwapTradePage, isSwapUsdt } from '@/core/utils';
import { message } from 'antd';
import { ResolutionType } from '../../components/k-header/resolution/config';
import { k_config } from '../config';
import { options } from './options';
import { ChartSetting, CommissionOrderItemStyle, KOptions, MyKlineData, PositionOrderItemStyle } from './types';

class Kline {
  private instance: Chart | null = null;
  private id: string = '';
  private isReady: boolean = false;
  private resolution: ResolutionType;
  private tradeList: { [key: string]: GroupItem };
  private swapIndex: boolean = false;
  private koptions: any = {};

  public constructor(koptions: KOptions) {
    console.log(koptions);
    this.koptions = koptions;
    this.tradeList = koptions.tradeList;
    this.swapIndex = koptions.swapIndex || false;
    this.instance = init(koptions.elementId, options(koptions, k_config(RootColor.getColorRGB)));
    if (koptions.vol) {
      this.instance?.createIndicator({
        name: 'VOL',
        calcParams: [],
      });
    }

    this.instance?.createIndicator(
      {
        name: 'MA',
        calcParams: [7, 25, 99],
      },
      true,
      { id: 'candle_pane' }
    );

    this.instance?.setOffsetRightDistance(200);
    this.instance?.setBarSpace(8);
    this.resolution = koptions.resolution;
    this.getKlineHistory(koptions.id, Date.now(), true, koptions.onReady, koptions.resolution);
    this.setPriceVolumePrecision();
    this.instance?.loadMore((timestamp) => {
      if (timestamp) {
        this.getKlineHistory(this.id, timestamp, false, () => {}, this.resolution);
      }
    });

    kChartEmitter.on(kChartEmitter.K_CHART_FULL_SCREEN, () => this.instance?.resize());
    window.addEventListener('resize', () => this.instance?.resize());

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        try {
          this.getKlineHistory(this.id, Date.now(), true, () => {}, this.resolution);
        } catch {}
      }
    });
  }

  public setPriceVolumePrecision() {
    try {
      let id = this.id;
      if (this.swapIndex) id = id.slice(1);
      const item = this.tradeList[id];
      if (item) {
        this.instance?.setPriceVolumePrecision(item.digit, item.volumeDigit);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public scrollToTimestamp(timestamp: number, animationDuration: number) {
    return this.instance?.scrollToTimestamp(timestamp, animationDuration);
  }

  private formatDataToKLineData(data: any): KLineData[] {
    const result = [];
    const { h, o, l, v, t, c } = data;
    for (let i = 0; i < t.length; i++) {
      result.push({
        high: h[i],
        open: o[i],
        low: l[i],
        volume: v[i],
        timestamp: t[i] * 1000,
        close: c[i],
      });
    }
    return result;
  }

  public async getKlineHistory(
    id: string,
    timestamp: number,
    isFirst: boolean,
    onReady?: () => void,
    resolution?: ResolutionType,
    fromTimestamp?: number
  ): Promise<void> {
    if (!this.instance) return;
    if (id === '') {
      id = this.id;
    } else {
      this.id = id;
    }
    if (resolution) this.resolution = resolution;
    const to = parseInt((timestamp / 1000).toFixed(0));

    const path = `/api/tv/tradingView/${/S.*-SUSD(T)?$/i.test(id) ? 'testnethistory' : 'history'}`;
    const __resolution = this.resolution.resolution;
    const from = fromTimestamp ?? to - this._getResolutionTime(__resolution) * 500;
    const url = path + `?symbol=${id}&resolution=${this._getResolutionValue(__resolution) + ''}&from=${from}&to=${to}`;
    if (isFirst && resolution) {
      this.instance.setStyles({
        candle: {
          // @ts-ignore
          type: resolution.key == 'Line' ? 'area' : 'candle_solid',
        },
      });
      this.getTradeHistory();
      // const cacheData = await IDB.get<KLineData[]>(IDB_STORE_KEYS.K_LINE_CHART_HISTORY(id, __resolution));
      // cacheData && this.instance?.applyNewData(cacheData as KLineData[]);
    }
    const response = await fetch(url);
    const data = await response.json();
    if (data.s === 'ok') {
      const result = this._formatData(this.formatDataToKLineData(data), __resolution);
      if (isFirst) {
        this.instance?.applyNewData(result);
      } else {
        if (data.t.length > 1) {
          this.instance?.applyMoreData(result.slice(0, -1), data.t.length > 1);
        }
      }
      if (isFirst) {
        this._lastBarData = result[result.length - 1];
        // IDB.set(IDB_STORE_KEYS.K_LINE_CHART_HISTORY(id, __resolution), result);
      }
    } else {
      if (isFirst) {
        // this.instance?.applyNewData([
        //   {
        //     high: 0,
        //     low: 0,
        //     timestamp: 0,
        //     open: 0,
        //     close: 0,
        //   },
        // ]);
      }
    }
    this.isReady = true;
    this.setPriceVolumePrecision();
    onReady?.();
  }

  public getTradeHistory() {
    if (isSwapTradePage() && !isSwapDemoTradePage()) {
      const fetchApi = isSwapUsdt(this.id) ? getKlineUTradeHistoryApi : getKlineCTradeHistoryApi;
      fetchApi(this.id, this.resolution.markingType || 1)
        .then((res) => {
          if (res?.code === 200) {
            console.log("获取历史数据",res.data)
            kChartEmitter.emit(kChartEmitter.K_CHART_SET_ORDER_MARKING_DATA, res?.data);
          }
        })
        .catch((err) => message.error(err?.message));
    }
  }

  public updateChartSetting(setting: ChartSetting) {
    switch (setting.chartType) {
      case 'candle':
        this.instance?.setStyles({
          candle: {
            // @ts-ignore
            type: setting.bullishCandleStick === 'solid' ? 'candle_solid' : 'candle_up_stroke',
            bar: {
              upColor: setting.upColor,
              downColor: setting.downColor,
              upBorderColor: setting.borderUpColor,
              downBorderColor: setting.borderDownColor,
              upWickColor: setting.wickUpColor,
              downWickColor: setting.wickDownColor,
              orderMarking: {
                type: setting.tradeMarker,
              },
            },
          },
        });
        break;
      case 'line':
        this.instance?.setStyles({
          candle: {
            // @ts-ignore
            type: 'area',
            area: {
              lineSize: setting.lineWidth,
              lineColor: setting.lineColor,
              backgroundColor: [
                {
                  offset: 0,
                  color: 'rgba(0, 0, 0, 0)',
                },
                {
                  offset: 1,
                  color: 'rgba(0, 0, 0, 0)',
                },
              ],
            },
            bar: {
              orderMarking: {
                type: setting.tradeMarker,
              },
            },
          },
        });
        break;
      case 'area':
        this.instance?.setStyles({
          candle: {
            // @ts-ignore
            type: 'area',
            area: {
              lineSize: 2,
              lineColor: setting.areaColor,
              backgroundColor: [
                {
                  offset: 0,
                  color: setting.areaBackgroundColor1 || 'rgba(0, 0, 0, 0)',
                },
                {
                  offset: 1,
                  color: setting.areaBackgroundColor2 || 'rgba(0, 0, 0, 0)',
                },
              ],
            },
            bar: {
              orderMarking: {
                type: setting.tradeMarker,
              },
            },
          },
        });
        break;
      case 'us_line':
        this.instance?.setStyles({
          candle: {
            // @ts-ignore
            type: 'ohlc',
            bar: {
              upColor: setting.upColor,
              downColor: setting.downColor,
              orderMarking: {
                type: setting.tradeMarker,
              },
            },
          },
        });
        break;
    }
  }

  // 更新数据
  _s: undefined | number = undefined;
  _v: number = 0;
  _lastBarData: any = {};
  public updateData(klineData: MyKlineData) {
    const { data, orderBook } = klineData;
    if (this.id !== data.id || !this.isReady || !this.instance) return;
    let _data: any = {
      high: data.h,
      open: data.o,
      low: data.l,
      close: data.c,
      volume: data.v,
      timestamp: data.t * 1000,
    };

    try {
      let _s = new Date(_data.timestamp).getMinutes();
      if (this._s != _s) {
        this._s = _s;
        this._v = +_data.volume;
      } else {
        let _v = +_data.volume;
        _data.volume = _v - this._v;
        this._v = _v;
      }
      _data.volume = Math.abs(+_data.volume);
      _data = this._formatData([this._lastBarData, _data], this.resolution.resolution);
      this._lastBarData = _data[_data.length - 1];
      this._lastBarData.high = Math.max(this._lastBarData.high, this._lastBarData.close);
      this._lastBarData.low = Math.min(this._lastBarData.low, this._lastBarData.close);
      this.instance.updateData({
        ...this._lastBarData,
        buyPrice: orderBook.buyPrice,
        sellPrice: orderBook.sellPrice,
      });
    } catch (e) {
      console.error(e);
    }
  }

  private _getResolutionTime(resolution: string) {
    switch (resolution) {
      case '1':
        return 60;
      case '3':
        return 60 * 3;
      case '5':
        return 60 * 5;
      case '15':
        return 60 * 15;
      case '30':
        return 60 * 30;
      case '60':
        return 60 * 60;
      case '120':
        return 60 * 60 * 2;
      case '240':
        return 60 * 60 * 4;
      case '360':
        return 60 * 60 * 6;
      case '480':
        return 60 * 60 * 8;
      case '720':
        return 60 * 60 * 12;
      case '1D':
        return 60 * 60 * 24;
      case '1W':
        return 60 * 60 * 24 * 7;
      case '1M':
        return 60 * 60 * 24 * 30;
      default:
        return 60;
    }
  }

  private _getResolutionValue(resolution: string) {
    switch (resolution) {
      case '1':
        return 1;
      case '3':
        return 3;
      case '5':
        return 5;
      case '15':
        return 15;
      case '30':
        return 30;
      case '60':
        return 60;
      case '120':
        return 60;
      case '240':
        // return 60;
        return '4h';
      case '360':
        return 60;
      case '480':
        return 60;
      case '720':
        return 60;
      case '1D':
        return 'D';
      case '1W':
        return 'D';
      case '1M':
        return 'D';
      default:
        return 1;
    }
  }

  // 数据合成算法
  private _formatData(data: any, resolution: any) {
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

    const isRange = (t: any, a: any, b: any, week?: any) => {
      if (week) {
        return t !== 1;
      }
      const minutes = ['1', '3', '5', '15', '30'];
      return t >= a && (minutes.includes(resolution) ? t < b : t <= b);
    };
    const getTime = (t: any) => {
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
      const _time = getTime(data[i].timestamp);

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
            time = data[i].timestamp;
          }
          close = data[i].close;

          if (
            data.length - 1 == i ||
            !isRange(getTime(data[i + 1].timestamp), range[j][0], range[j][1], resolution === '1W')
          ) {
            result.push({
              timestamp: time,
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
    // console.log(result);
    return result;
  }

  // 截图
  public screenshot() {
    if (this.instance) {
      const isDark = localStorageApi.getItem(LOCAL_KEY.THEME) == 'dark';
      return this.instance.getConvertPictureUrl(true, 'jpeg', isDark ? '#1a202e' : '#ffffff');
    }
    return '';
  }

  // 设置颜色
  public setColor(upColor: string, downColor: string) {
    console.log(upColor, downColor);
    // @ts-ignore
    this.instance?.setStyles(options(this.koptions, k_config(RootColor.getColorRGB)).styles);
  }

  // 设置是否显示画线下单按钮
  public setShowCrosshairOrderBtn(show: boolean) {
    this.instance?.setStyles({
      crosshair: {
        showAddBtn: show,
      },
    });
  }
  // 设置是否反转视图
  public setReverseView(reverse: boolean) {
    this.instance?.setStyles({
      yAxis: {
        reverse: reverse,
      },
    });
  }

  // 设置是否显示深度图
  public setShowOrderbook(show: boolean) {
    this.instance?.setStyles({
      candle: {
        priceMark: {
          last: {
            orderbook: {
              show: show,
            },
          },
        },
      },
    });
  }
  // 设置是否显示价格线
  public setShowPriceMark(show: boolean) {
    this.instance?.setStyles({
      candle: {
        priceMark: {
          last: {
            line: {
              show: show,
            },
          },
        },
      },
    });
  }

  // 设置持仓单
  public setPositionOrder(orderList: PositionOrderItemStyle[]) {
    this.instance?.setStyles({
      positionOrder: {
        orderList,
        onReverseClick: (id: string) => {
          kChartEmitter.emit(kChartEmitter.K_CHART_POSITION_REVERSE_CLICK, id);
        },
        onStopClick: (id: string) => {
          kChartEmitter.emit(kChartEmitter.K_CHART_POSITION_STOP_CLICK, id);
        },
      },
    });
  }

  // 设置委托单
  public setCommissionOrder(orderList: CommissionOrderItemStyle[]) {
    this.instance?.setStyles({
      commissionOrder: {
        orderList,
        onCloseClick: (id: string) => {
          kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_CLOSE_CLICK, id);
        },
        onMoveStart: () => {
          kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_MOVE_START);
        },
        onMoveEnd: (id: string, price: number) => {
          kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_MOVE_END, id, price);
        },
      },
    });
  }

  // 设置买卖打点数据
  public setLOrderMarkingData(historyList = []) {
    this.instance?.setStyles({
      candle: {
        bar: {
          orderMarking: {
            historyList,
          },
        },
      },
    });
  }

  // 设置主题
  public setTheme(theme: THEME) {
    this.instance?.setStyles({
      theme,
    });
  }

  // setShowCountdown
  public setShowCountdown(show: boolean) {
    this.instance?.setStyles({
      candle: {
        priceMark: {
          last: {
            countdown: {
              show: show,
            },
          },
        },
      },
    });
  }

  // 设置持仓单是否显示
  public setPositionOrderVisible(visible: boolean) {
    this.instance?.setStyles({
      positionOrder: {
        show: visible,
      },
    });
  }

  // 设置委托单是否显示
  public setCommissionOrderVisible(visible: boolean) {
    this.instance?.setStyles({
      commissionOrder: {
        show: visible,
      },
    });
  }
  // 设置买卖打点是否显示
  public setLOrderMarkingVisible(visible: boolean) {
    this.instance?.setStyles({
      candle: {
        bar: {
          orderMarking: {
            show: visible,
          },
        },
      },
    });
  }
}
export { Kline };
