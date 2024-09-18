import { isLite, isSpot, isSpotCoin, isSpotEtf, isSwap, isSwapCoin, isSwapSLCoin, isSwapSLUsdt, isSwapUsdt } from '@/core/utils';
import { MarketItem } from './item';
import { MarketsMap } from './types';

// 所有商品集合
const MarketsData = {
  loading: true,
  spotLoading: true,
  swapLoading: true,
  // 获取永续行情列表
  getSwapList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSwap(key)) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取永续币本位行情列表
  getSwapCoinList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSwapCoin(key) || isSwapSLCoin(key)) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取永续USDT本位行情列表
  getSwapUsdtList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSwapUsdt(key) || isSwapSLUsdt(key)) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取简单合约行情列表
  getLiteList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isLite(key) && _this[key] instanceof MarketItem) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取简单合约带单行情列表
  getLiteCopyList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isLite(key) && _this[key] instanceof MarketItem) {
          if (_this[key].copy) {
            arr.push(_this[key] as MarketItem);
          }
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取简单合约zone行情列表
  getLiteZoneList: function (zone: string): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isLite(key) && _this[key] instanceof MarketItem) {
          if (_this[key].zone.includes(zone)) {
            arr.push(_this[key] as MarketItem);
          }
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取现货行情列表
  getSpotList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSpot(key)) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取现货Zone行情列表
  getSpotZoneList: function (zone: string): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSpot(key)) {
          if (_this[key].zone.includes(zone)) {
            arr.push(_this[key] as MarketItem);
          }
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取现货unit行情列表
  getSpotUnitList: function (unit: string): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSpot(key)) {
          if (_this[key].unit.includes(unit)) {
            arr.push(_this[key] as MarketItem);
          }
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取现货zone,unit行情列表
  getSpotZoneUnitList: function (zone: string, unit: string): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSpot(key)) {
          if (_this[key].zone.includes(zone) && _this[key].unit.includes(unit)) {
            arr.push(_this[key] as MarketItem);
          }
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取现货ETF行情列表
  getSpotEtfList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSpotEtf(key)) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
  // 获取现货币币行情列表
  getSpotCoinList: function (): Array<MarketItem> {
    try {
      const arr: Array<MarketItem> = [];
      const _this = this as MarketsMap;
      for (let key in _this) {
        if (isSpotCoin(key)) {
          arr.push(_this[key] as MarketItem);
        }
      }
      return arr;
    } catch {
      return [];
    }
  },
};
export { MarketsData };
