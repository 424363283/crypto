import { getCommonSymbolsApi } from '@/core/api';
import { SESSION_KEY, SessionStorageApi } from '@/core/store/src/session-storage';
import { asyncFactory } from '@/core/utils/src/async-instance';
import { decodeDomain } from '@/core/utils/src/crypto';
import { isSwapDemo } from '@/core/utils/src/is';
import { WorkerStore } from '@/core/workers';
import { GroupItem } from './item';

/**
 * @class Group
 * @description 所有商品分组统一管理
 * @example
 * const group = await Group.getInstance();
 */

class Group {
  private lite_list: GroupItem[] = []; // 简单合约列表
  private spot_list: GroupItem[] = []; // 现货合约列表
  private swap_real_list: GroupItem[] = []; // 永续合约列表
  private swapSL_list: GroupItem[] = []; // 永续模拟盘合约列表
  private swapIM_list: GroupItem[] = []; // 永续合约im列表
  private swapZones: string[] = []; // 永续分组列表

  private spotUnits: string[] = []; // 现货分类单位列表
  private spotZones: string[] = []; // 现货分组列表

  private priceDigit: { [key: string]: number } = {}; // 价格精度
  private volumeDigit: { [key: string]: number } = {}; // 成交量精度
  private liteQuote: { [key: string]: number } = {}; // 合约map

  public spotQuoteDomains: string[] = []; // 现货行情域名
  public swapQuoteDomains: string[] = []; // 永续行情域名
  public swapSLQuoteDomains: string[] = []; // 永续模拟盘行情域名

  public getLiteIds: string[] = []; // 简单合约id列表
  public getLiteQuoteIds: string[] = []; // 简单合约id列表
  public getSpotIds: string[] = []; // 现货合约id列表(包含ETF)
  public getSwapIds: string[] = []; // 永续合约id列表(usdt和币本位)
  public getSwapSLIds: string[] = []; // 永续模拟盘合约id列表(usdt和币本位)

  public hotIds: string[] = []; // 热门币id
  public newIds: string[] = []; // 新币id

  public liteQuoteCoinList = new Set(); //简单合约计价单位列表
  public spotQuoteCoinList = new Set(); //现货合约计价单位列表
  public swapQuoteCoinList = new Set(); //永续合约计价单位列表
  public swapSLQuoteCoinList = new Set(); //永续模拟盘合约计价单位列表

  private _cache: { [key: string]: any } = {};

  get SWAP_USDT_CACHE_KEY() {
    return !isSwapDemo() ? 'swap_usd_list' : 'swap_demo_usd_list';
  }
  get SWAP_COIN_CACHE_KEY() {
    return !isSwapDemo() ? 'swap_coin_list' : 'swap_demo_coin_list';
  }
  get swap_list() {
    return !isSwapDemo() ? this.swap_real_list : this.swapSL_list;
  }

  // 初始化
  private constructor(data: any = {}) {
    // super();
    const {
      spot_list,
      swap_list,
      swapSL_list,
      swapIM_list,
      getSwapSLIds,
      lite_list,
      spotQuoteCoinList,
      swapQuoteCoinList,
      liteQuoteCoinList,
      swapSLQuoteCoinList,
      getSpotIds,
      getSwapIds,
      getLiteIds,
      getLiteQuoteIds,
      getNewIds,
      getHotIds,
      spot_quote_domain,
      swap_quote_domain,
      swapSL_quote_domain,
      spot_units,
      spot_zones,
      swap_zones,
      priceDigit,
      volumeDigit,
      liteQuote,
    } = data;
    this.spot_list = spot_list;
    this.swap_real_list = swap_list;
    this.lite_list = lite_list;
    this.swapSL_list = swapSL_list;
    this.swapIM_list = swapIM_list;

    this.spotQuoteCoinList = spotQuoteCoinList;
    this.swapQuoteCoinList = swapQuoteCoinList;
    this.liteQuoteCoinList = liteQuoteCoinList;
    this.swapSLQuoteCoinList = swapSLQuoteCoinList;

    this.getSpotIds = getSpotIds;
    this.getSwapIds = getSwapIds;
    this.getLiteIds = getLiteIds;
    this.getLiteQuoteIds = getLiteQuoteIds;
    this.getSwapSLIds = getSwapSLIds;

    this.newIds = getNewIds;
    this.hotIds = getHotIds;

    this.priceDigit = priceDigit;
    this.volumeDigit = volumeDigit;
    this.liteQuote = liteQuote;

    this.spotQuoteDomains = spot_quote_domain;//decodeDomain(spot_quote_domain);
    this.swapQuoteDomains = swap_quote_domain;//decodeDomain(swap_quote_domain);
    this.swapSLQuoteDomains = swapSL_quote_domain;

    this.spotUnits = spot_units;
    this.spotZones = spot_zones;
    this.swapZones = swap_zones;
  }

  // 获取单例
  public static async getInstance(isNotCache?: boolean): Promise<Group> {
    return await asyncFactory.getInstance<Group>(async (): Promise<Group> => {
      let data = SessionStorageApi.get(SESSION_KEY.SYMBOLS);
      if (isNotCache) {
        data = (await getCommonSymbolsApi()).data;
        SessionStorageApi.set(SESSION_KEY.SYMBOLS, data, 1);
      } else if (!data) {
        data = (await getCommonSymbolsApi()).data;
        SessionStorageApi.set(SESSION_KEY.SYMBOLS, data, 1); //缓存http数据
      }
      const _result = await WorkerStore.wsWorker.processSymbols(data);
      return new Group(_result);
    }, Group);
  }

  // 获取现货列表
  public get getSpotList(): GroupItem[] {
    return this.spot_list;
  }
  // 获取永续列表
  public get getSwapList(): GroupItem[] {
    return this.swap_list;
  }
  // 获取永续模拟盘列表
  public get getSwapSLList(): GroupItem[] {
    return this.swapSL_list;
  }
  // 获取永续im列表
  public get getSwapIMList(): GroupItem[] {
    return this.swapIM_list;
  }
  // 获取简单合约列表
  public get getLiteList(): GroupItem[] {
    return this.lite_list;
  }
  // 获取ETF列表
  public get getEtfList(): GroupItem[] {
    if (this._cache['etf_list']) return this._cache['etf_list'];
    const result: GroupItem[] = [];
    for (const item of this.spot_list) {
      if (item.type === 'ETF') result.push(item);
    }
    this._cache['etf_list'] = result;
    return this._cache['etf_list'];
  }
  // 获取U本位永续合约列表
  public get getSwapUsdList(): GroupItem[] {
    if (this._cache[this.SWAP_USDT_CACHE_KEY]) return this._cache[this.SWAP_USDT_CACHE_KEY];
    const result: GroupItem[] = [];
    for (const item of this.swap_list) {
      if (/-s?usdt$/i.test(item.id) && item) {
        result.push(item);
      }
    }
    this._cache[this.SWAP_USDT_CACHE_KEY] = result;
    return this._cache[this.SWAP_USDT_CACHE_KEY];
  }
  // 获取币本位永续合约列表
  public get getSwapCoinList(): GroupItem[] {
    if (this._cache[this.SWAP_COIN_CACHE_KEY]) return this._cache[this.SWAP_COIN_CACHE_KEY];
    const result: GroupItem[] = [];
    for (const item of this.swap_list) {
      if (/-s?usd$/i.test(item.id)) result.push(item);
    }
    this._cache[this.SWAP_COIN_CACHE_KEY] = result;
    return this._cache[this.SWAP_COIN_CACHE_KEY];
  }
  // 获取简单合约的带单区列表
  public get getLiteOrderList(): GroupItem[] {
    if (this._cache['lite_order_list']) return this._cache['lite_order_list'];
    const result: GroupItem[] = [];
    for (const item of this.lite_list) {
      if (item.copy) result.push(item);
    }
    this._cache['lite_order_list'] = result;
    return this._cache['lite_order_list'];
  }
  // 获取简单合约的 crypto
  public get getLiteCryptoList(): GroupItem[] {
    if (this._cache['lite_crypto_list']) return this._cache['lite_crypto_list'];
    const result: GroupItem[] = [];
    for (const item of this.lite_list) {
      if (item.zone?.includes('加密货币')) {
        result.push(item);
      }
    }
    this._cache['lite_crypto_list'] = result;
    return this._cache['lite_crypto_list'];
  }

  // 获取简单合约的 - Deriv
  public get getLiteDerivList(): GroupItem[] {
    if (this._cache['lite_deriv_list']) return this._cache['lite_deriv_list'];
    const result: GroupItem[] = [];
    for (const item of this.lite_list) {
      if (item.zone?.includes('期货')) {
        result.push(item);
      }
    }
    this._cache['lite_deriv_list'] = result;
    return this._cache['lite_deriv_list'];
  }


  // 获取简单合约的 - UStock
  public get getLiteUStockList(): GroupItem[] {
    if (this._cache['lite_ustock_list']) return this._cache['lite_ustock_list'];
    const result: GroupItem[] = [];
    for (const item of this.lite_list) {
      if (item.zone?.includes('美股')) {
        result.push(item);
      }
    }
    this._cache['lite_ustock_list'] = result;
    return this._cache['lite_ustock_list'];
  }


  // 获取简单合约的 - HKtock
  public get getLiteHKStockList(): GroupItem[] {
    if (this._cache['lite_hkstock_list']) return this._cache['lite_hkstock_list'];
    const result: GroupItem[] = [];
    for (const item of this.lite_list) {
      if (item.zone?.includes('港股')) {
        result.push(item);
      }
    }
    this._cache['lite_hkstock_list'] = result;
    return this._cache['lite_hkstock_list'];
  }


  // 获取现货的币币交易ids
  public getSpotCoinIds(quoteCoin?: string): string[] {
    if (this._cache['spot_coin_ids' + quoteCoin]) return this._cache['spot_coin_ids' + quoteCoin];
    const result: string[] = [];
    for (const item of this.spot_list) {
      if (item.type == 'SPOT' && (!quoteCoin || item.quoteCoin == quoteCoin)) {
        result.push(item.id);
      }
    }
    this._cache['spot_coin_ids' + quoteCoin] = result;
    return this._cache['spot_coin_ids' + quoteCoin];
  }
  // 获取现货的ETF交易ids
  public getSpotEtfIds(quoteCoin?: string): string[] {
    if (this._cache['spot_etf_ids' + quoteCoin]) return this._cache['spot_etf_ids' + quoteCoin];
    const result: string[] = [];
    for (const item of this.spot_list) {
      if (item.type == 'ETF' && (!quoteCoin || item.quoteCoin == quoteCoin)) {
        result.push(item.id);
      }
    }
    this._cache['spot_etf_ids' + quoteCoin] = result;
    return this._cache['spot_etf_ids' + quoteCoin];
  }
  // 获取永续的币本位ids 目前只有USD
  public getSwapCoinIds(): string[] {
    if (this._cache['swap_coin_ids']) return this._cache['swap_coin_ids'];
    const result: string[] = [];
    for (const item of this.swap_list) {
      if (/-s?usd$/i.test(item.id)) {
        result.push(item.id);
      }
    }
    this._cache['swap_coin_ids'] = result;
    return this._cache['swap_coin_ids'];
  }
  // 获取永续的U本位ids
  public getSwapUsdtIds(): string[] {
    if (this._cache['swap_usdt_ids']) return this._cache['swap_usdt_ids'];
    const result: string[] = [];
    for (const item of this.swap_list) {
      if (/-s?usdt$/i.test(item.id)) {
        result.push(item.id);
      }
    }
    this._cache['swap_usdt_ids'] = result;
    return this._cache['swap_usdt_ids'];
  }

  // 获取永续分组列表
  public getSwapZones(): string[] {
    if (this._cache['swap_zones']) return this._cache['swap_zones'];
    this._cache['swap_zones'] = this.swapZones.map((_: any) => _.code);
    return this._cache['swap_zones'];
  }
  // 获取现货分类列表
  public getSpotUnits(unit?: string): string[] {
    if (!unit) return this.spotUnits;
    if (this._cache['spot_units' + unit]) return this._cache['spot_units' + unit];
    const result: string[] = [];
    for (const item of this.spot_list) {
      const { id, unit: _unit } = item as any;
      if (_unit === unit) {
        result.push(id);
      }
    }
    this._cache['spot_units' + unit] = result;
    return this._cache['spot_units' + unit];
  }
  // 获取现货分组列表
  public getSpotZones(): string[] {
    if (this._cache['spot_zones']) return this._cache['spot_zones'];
    this._cache['spot_zones'] = this.spotZones.map((_: any) => _.code);
    return this._cache['spot_zones'];
  }
  // 通过分类分区获取现货列表
  public getSpotByIds(unit: string, zone: string): string[] {
    if (this._cache['spot_list' + unit + zone]) return this._cache['spot_list' + unit + zone];
    const result: string[] = [];
    for (const item of this.spot_list) {
      const { id, unit: _unit, zone: _zone } = item as any;
      if (_unit === unit && (_zone?.includes?.(zone) || zone == 'All')) {
        result.push(id);
      }
    }
    this._cache['spot_list' + unit + zone] = result;
    return this._cache['spot_list' + unit + zone];
  }
  // 获取所有简单合约的ids
  public getLiteByIds(): string[] {
    if (this._cache['lite_ids']) return this._cache['lite_ids'];
    this._cache['lite_ids'] = this.getLiteList.map((_: any) => _.id);
    return this._cache['lite_ids'];
  }
  // 获取所有简单合约-加密货币的ids
  public getLiteCryptoByIds(): string[] {
    if (this._cache['lite_crypto_ids']) return this._cache['lite_crypto_ids'];
    this._cache['lite_crypto_ids'] = this.getLiteCryptoList.map((_: any) => _.id);
    return this._cache['lite_crypto_ids'];
  }

  // 获取所有简单合约-deriv的ids
  public getLiteDerivByIds(): string[] {
    if (this._cache['lite_innovate_ids']) return this._cache['lite_deriv_ids'];
    this._cache['lite_deriv_ids'] = this.getLiteDerivList.map((_: any) => _.id);
    return this._cache['lite_deriv_ids'];
  }

  // 获取所有简单合约-ustock的ids
  public getLiteUStockByIds(): string[] {
    if (this._cache['lite_ustock_ids']) return this._cache['lite_ustock_ids'];
    this._cache['lite_ustock_ids'] = this.getLiteUStockList.map((_: any) => _.id);
    return this._cache['lite_ustock_ids'];
  }


  // 获取所有简单合约-hkstock的ids
  public getLiteHKStockByIds(): string[] {
    if (this._cache['lite_hkstock_ids']) return this._cache['lite_hkstock_ids'];
    this._cache['lite_hkstock_ids'] = this.getLiteHKStockList.map((_: any) => _.id);
    return this._cache['lite_hkstock_ids'];
  }

  // 获取所有简单合约-带单区的ids
  public getLiteOrderByIds(): string[] {
    if (this._cache['lite_order_ids']) return this._cache['lite_order_ids'];
    this._cache['lite_order_ids'] = this.getLiteOrderList.map((_: any) => _.id);
    return this._cache['lite_order_ids'];
  }
  // 获取所有永续合约的ids
  public getSwapByIds(): string[] {
    if (this._cache['swap_ids']) return this._cache['swap_ids'];
    this._cache['swap_ids'] = this.getSwapList.map((_: any) => _.id);
    return this._cache['swap_ids'];
  }
  // 获取所有ETF合约的ids
  public getEtfByIds(): string[] {
    if (this._cache['etf_ids']) return this._cache['etf_ids'];
    this._cache['etf_ids'] = this.getEtfList.map((_: any) => _.id);
    return this._cache['etf_ids'];
  }
  // 获取所有币本位永续合约的ids
  public getSwapCoinByIds(): string[] {
    if (this._cache['swap_coin_ids']) return this._cache['swap_coin_ids'];
    this._cache['swap_coin_ids'] = this.getSwapCoinList.map((_: any) => _.id);
    return this._cache['swap_coin_ids'];
  }
  // 获取所有U本位永续合约的ids
  public getSwapUsdByIds(): string[] {
    if (this._cache['swap_usd_ids']) return this._cache['swap_usd_ids'];
    this._cache['swap_usd_ids'] = this.getSwapUsdList.map((_: any) => _.id);
    return this._cache['swap_usd_ids'];
  }
  // 获取热币的ids
  public getHotIds(): string[] {
    return this.hotIds;
  }
  // 获取现货的币币交易ids
  public getHotSpotCoinIds(quoteCoin?: string): string[] {
    const result: string[] = [];
    for (const item of this.hotIds) {
      if (/_s?usdt$/i.test(item) && item) {
        result.push(item);
      }
    }
    return result;
  }
// 获取合约的u本位交易ids
  public getHotSwapUsdtIds(quoteCoin?: string): string[] {
    const result: string[] = [];
    for (const item of this.hotIds) {
      if (/-s?usdt$/i.test(item) && item) {
        result.push(item);
      }
    }
    return result;
  }
  // 获取新币种的ids
  public getNewIds(): string[] {
    return this.newIds;
  }
  // 获取排序优先币种
  public getPriorityCoins(): string[] {
    return ['BTC', 'ETH', 'XRP', 'DOT', 'LINK'];
  }
  // 获取币种价格的精度,基本上用于行情
  public getPriceDigit(id: string): number {
    return this.priceDigit[id] || 2;
  }
  // 获取币种成交量的精度,基本上用于行情
  public getVolumeDigit(id: string): number {
    return this.volumeDigit[id] || 4;
  }

  // 获取是否为新币
  public getIsNewCoin = (id: string): boolean => {
    if (this.newIds.length === 0) return false;
    return this.newIds.includes(id);
  };

  // 获取是否为热门币
  public getIsHotCoin = (id: string): boolean => {
    if (this.hotIds.length === 0) return false;
    return this.hotIds.includes(id);
  };

  // 获取简单合约行情
  public getLiteQuoteCode = (id: string): string => {
    return this.liteQuote[id] || '';
  };



}

export { Group, GroupItem };
