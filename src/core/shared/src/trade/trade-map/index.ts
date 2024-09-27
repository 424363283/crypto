import { getLiteTradeListApi, getSpotTradeListApi, getSwapTradeListApi } from '@/core/api';
import { R } from '@/core/network';
import { asyncFactory } from '@/core/utils/src/async-instance';
import { LiteTradeItem } from './lite';
import { SpotTradeItem } from './spot';
import { SwapTradeItem } from './swap';

/**
 * @fileoverview TradeList class
 * @author 0x
 * @license MIT
 * @version 0.0.1
 * @module core/shared/trade/trade-list
 * @ignore
 * @todo Add description for class, @member, @method, @param, @returns, @example etc...
 */
class TradeMap {
  private static _cacheSpotHttp: Promise<R<{ [key: string]: any }[]>>;
  private static _cacheLiteHttp: Promise<R<{ [key: string]: any }[]>>;
  private static _cacheSwapHttp: Promise<R<{ [key: string]: any }[]>>;

  private static _spot = new Map<string, SpotTradeItem>();
  private static _lite = new Map<string, LiteTradeItem>();
  private static _swap = new Map<string, SwapTradeItem>();

  public static async getSpotTradeMap(): Promise<Map<string, SpotTradeItem>> {
    if (TradeMap._spot.size > 0) return TradeMap._spot;
    return await asyncFactory.getInstance<Map<string, SpotTradeItem>>(async (): Promise<Map<string, SpotTradeItem>> => {
      if (!TradeMap._cacheSpotHttp) TradeMap._cacheSpotHttp = getSpotTradeListApi();
      const { data } = await this._cacheSpotHttp;
      for (const item of data) {
        TradeMap._spot.set(item.symbol, new SpotTradeItem(item));
      }
      return TradeMap._spot;
    }, 'getSpotTradeMap');
  }

  public static async getLiteTradeMap(): Promise<Map<string, LiteTradeItem>> {
    if (TradeMap._lite.size > 0) return TradeMap._lite;
    return await asyncFactory.getInstance<Map<string, LiteTradeItem>>(async (): Promise<Map<string, LiteTradeItem>> => {
      if (!TradeMap._cacheLiteHttp) TradeMap._cacheLiteHttp = getLiteTradeListApi();
      const { data } = await this._cacheLiteHttp;
      for (const key in data) {
        TradeMap._lite.set(key, new LiteTradeItem(data[key]));
      }
      return TradeMap._lite;
    }, 'getLiteTradeMap');
  }

  public static async getSwapTradeMap(): Promise<Map<string, SwapTradeItem>> {
    if (TradeMap._swap.size > 0) return TradeMap._swap;
    return await asyncFactory.getInstance<Map<string, SwapTradeItem>>(async (): Promise<Map<string, SwapTradeItem>> => {
      if (!TradeMap._cacheSwapHttp) TradeMap._cacheSwapHttp = getSwapTradeListApi();
      const { data } = await this._cacheSwapHttp;
      for (const item of data) {
        if(!item){
          //  console.log('');
        }
        TradeMap._swap.set(item.symbol.toUpperCase(), new SwapTradeItem(item));
      }
      return TradeMap._swap;
    }, 'getSwapTradeMap');
  }

  public static async getSwapById(id: string): Promise<SwapTradeItem | undefined> {
    try {
      const _swap = await TradeMap.getSwapTradeMap();
      return _swap.get(id?.toUpperCase());
    } catch (e) {
      return undefined;
    }
  }

  public static async getSpotById(id: string): Promise<SpotTradeItem | undefined> {
    const _spot = await TradeMap.getSpotTradeMap();
    return _spot.get(id?.toUpperCase());
  }

  public static async getLiteById(id: string): Promise<LiteTradeItem | undefined> {
    const _lite = await TradeMap.getLiteTradeMap();
    return _lite?.get(id?.toUpperCase());
  }
}

export { LiteTradeItem, SpotTradeItem, SwapTradeItem, TradeMap };
