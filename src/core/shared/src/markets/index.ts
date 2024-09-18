import { SUBSCRIBE_TYPES, WS, wsType } from '@/core/network';
import { asyncFactory } from '@/core/utils/src/async-instance';
import { WorkerStore } from '@/core/workers';
import { Group } from '../group';
import { MarketItem } from './item';
import { MarketsData } from './markets-map';
import { MarketsMap } from './types';

type params<T = {}> = { lite?: boolean; spot?: boolean; swap?: boolean; swapSL?: boolean; key: string } & T;

class Markets {
  private static instance?: Markets;
  private static cahceMarketsStatus = '';
  private static isLite = false;
  private static isSpot = false;
  private static isSwap = false;
  private static isSwapSL = false;

  private liteIds: Array<string> = []; // 简单合约id列表
  private spotIds: Array<string> = []; // 现货合约id列表
  private swapIds: Array<string> = []; // 永续合约id列表
  private swapSLIds: Array<string> = []; // 永续合约模拟盘id列表

  public static markets: MarketsMap = Object.create(MarketsData); // 所有商品集合

  private constructor(group: Group, subscribe?: boolean) {
    console.log('group', group);
    this.init(group, subscribe);
    window.dispatchEvent(new CustomEvent(SUBSCRIBE_TYPES.ws3001, { detail: Markets.markets }));
  }

  public get log() {
    return Markets.markets;
  }

  private init(group: Group, subscribe?: boolean): any {
    if (subscribe === true) return this.subscribeWS();
    // 简单合约
    if (Markets.isLite && this.liteIds.length === 0) {
      this.liteIds = group.getLiteIds;
      group.getLiteList.forEach((item) => {
        if (!Markets.markets[item.id]) {
          Markets.markets[item.id] = new MarketItem(item);
        }
      });
    }
    // 现货
    if (Markets.isSpot && this.spotIds.length === 0) {
      this.spotIds = group.getSpotIds;
      group.getSpotList.forEach((item) => {
        if (!Markets.markets[item.id]) {
          Markets.markets[item.id] = new MarketItem(item);
        }
      });
    }
    // 永续合约
    if (Markets.isSwap && this.swapIds.length === 0) {
      this.swapIds = group.getSwapIds;
      group.getSwapList.forEach((item) => {
        if (!Markets.markets[item.id]) {
          Markets.markets[item.id] = new MarketItem(item);
        }
      });
    }
    // 永续合约模拟盘
    if (Markets.isSwapSL && this.swapSLIds.length === 0) {
      this.swapSLIds = group.getSwapSLIds;
      group.getSwapSLList.forEach((item) => {
        if (!Markets.markets[item.id]) {
          Markets.markets[item.id] = new MarketItem(item);
        }
      });
    }

    this.subscribeWS();
  }

  public async subscribeWS(): Promise<void> {
    if (Markets.isSwap) {
      WS.subscribe3001(this.swapIds, wsType.SWAP);
    }
    if (Markets.isLite && Markets.isSpot) {
      WS.subscribe3001(this.spotIds.concat(this.liteIds), wsType.SPOT_LITE);
      return;
    }
    if (Markets.isSpot) {
      WS.subscribe3001(this.spotIds, wsType.SPOT_LITE);
      return;
    }
    if (Markets.isLite) {
      WS.subscribe3001(this.liteIds, wsType.SPOT_LITE);
      return;
    }
    if (Markets.isSwapSL) {
      WS.subscribe3001(this.swapSLIds, wsType.SWAP_SL);
      return;
    }
  }

  public static async getInstance({ lite = false, spot = false, swap = false, swapSL = false, key }: params): Promise<Markets> {
    const cacheStr = `${lite}${spot}${swap}${swapSL}${key}`;
    Markets.isLite = !!lite;
    Markets.isSpot = !!spot;
    Markets.isSwap = !!swap;
    Markets.isSwapSL = !!swapSL;

    if (Markets.instance) {
      if (Markets.cahceMarketsStatus === cacheStr) {
        Markets.instance.init({} as any, true);
        return Markets.instance;
      } else {
        Markets.cahceMarketsStatus = cacheStr;
        const group = await Group.getInstance();
        Markets.instance.init(group);
        console.log('instance', Markets.instance);
        return Markets.instance;
      }
    }
    return await asyncFactory.getInstance<Markets>(async (): Promise<Markets> => {
      const group = await Group.getInstance();
      Markets.instance = new Markets(group);
      return Markets.instance;
    }, Markets);
  }

  private static _spotLoading = true;
  private static _swapLoading = true;
  public static onMessage(message: any, wstype: wsType): void {
    WorkerStore.wsWorker.mergeMarkets(message, Markets.markets).then((data: any) => {
      if (this._spotLoading && wstype === wsType.SPOT_LITE) this._spotLoading = false;
      if (this._swapLoading && wstype === wsType.SWAP) this._swapLoading = false;
      const obj = Object.create({
        ...MarketsData,
        loading: false,
        spotLoading: this._spotLoading,
        swapLoading: this._swapLoading,
      });
      Markets.markets = Object.assign(obj, data);
      window.dispatchEvent(new CustomEvent(SUBSCRIBE_TYPES.ws3001, { detail: Markets.markets }));
    });
  }

  public async unsubscribeWS() {
    if (Markets.isSwap) {
      WS.unsubscribe3001(this.swapIds, wsType.SWAP);
    }
    if (Markets.isLite && Markets.isSpot) {
      WS.unsubscribe3001(this.spotIds.concat(this.liteIds), wsType.SPOT_LITE);
      return;
    }
    if (Markets.isSpot) {
      WS.unsubscribe3001(this.spotIds, wsType.SPOT_LITE);
      return;
    }
    if (Markets.isLite) {
      WS.unsubscribe3001(this.liteIds, wsType.SPOT_LITE);
      return;
    }
    if (Markets.isSwapSL) {
      WS.unsubscribe3001(this.swapSLIds, wsType.SWAP_SL);
      return;
    }
  }

  // 通过这个方法获取真实存在的商品
  public static getMarketList(list: MarketsMap, ids: string[]): MarketItem[] {
    if (!ids.length) return [];
    if (!list) return [];
    const marketList: MarketItem[] = [];
    for (const id of ids) {
      const item = list[id];
      if (item) {
        marketList.push(item);
      }
    }
    return marketList;
  }
}

export { MarketItem, Markets };
