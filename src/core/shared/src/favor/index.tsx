/**
 * 1. 未登录，自选缓存在本地
 * 2. 登录后，自选使用服务器数据
 */
import { addCommonFavoritesApi, getCommonFavoritesListApi, postCommonRemoveFavoritesApi } from '@/core/api';
import { FavorEmitter } from '@/core/events/src/favor';
import { R } from '@/core/network';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { getCookie } from '@/core/utils';
import { asyncFactory } from '@/core/utils/src/async-instance';
import { isSwapDemo } from '@/core/utils/src/is';
import { FAVORITE_TYPE, FAVORS_LIST } from './types';

class Favors {
  static instance: Favors;
  public favorsList: FAVORS_LIST[] = []; // [{type: 'etf', list: ['ETH3L_USDT']}, {type: 'lite', list: ['ETHUSDT', 'BTCUSDT']}]
  public FavoriteCodes: string[] = [];
  private constructor(data: any) {
    this.favorsList = data;
  }
  public static isLogin = () => !!getCookie('TOKEN');
  private static cacheFavors: Promise<R<object[]>>;
  public get localFavors() {
    const localData = localStorageApi.getItem(LOCAL_KEY.FAVORS_TOKEN) as FAVORS_LIST[];
    if (!localData) {
      localStorageApi.setItem(LOCAL_KEY.FAVORS_TOKEN, []);
    }
    return (localStorageApi.getItem(LOCAL_KEY.FAVORS_TOKEN) as FAVORS_LIST[]) || [];
  }
  private _fetchFavorsList = async () => {
    const res = {data : [] };// TODO await getCommonFavoritesListApi();
    this.favorsList = res.data;
  };
  static async getInstance(): Promise<Favors> {
    return await asyncFactory.getInstance<Favors>(async (): Promise<Favors> => {
      let data = {};
      if (this.isLogin()) data = [];// TODO (await getCommonFavoritesListApi()).data;
      Favors.instance = new Favors(data);
      return Favors.instance;
    }, Favors);
  }
  public addFavors = async (symbols: string[], type: FAVORITE_TYPE) => {
    if (Favors.isLogin()) {
      const res = await addCommonFavoritesApi(symbols, type); // etf视作spot
      if (res.code === 200) {
        await this._fetchFavorsList();
        this.favorsUpdated();
        return true;
      }
      return false;
    }
    const localFavors = this.localFavors;
    for (let k of localFavors) {
      if (k?.type === type) {
        k.list = [...k.list, ...symbols];
        break;
      }
    }
    if (!localFavors.some((k) => k?.type === type)) {
      localFavors.push({
        type,
        list: symbols,
      });
    }
    if (!localFavors.length) {
      localFavors.push({
        type,
        list: symbols,
      });
    }
    localStorageApi.setItem(LOCAL_KEY.FAVORS_TOKEN, localFavors);
    this.favorsUpdated();
    return true;
  };
  private favorsUpdated() {
    FavorEmitter.emit(FavorEmitter.Update);
  }
  public removeFavors = async (symbols: string[], type: FAVORITE_TYPE) => {
    if (Favors.isLogin()) {
      const res = await postCommonRemoveFavoritesApi(symbols, type);
      if (res.code === 200) {
        await this._fetchFavorsList();
        this.favorsUpdated();
        return true;
      }
      return false;
    }
    const localFavors = this.localFavors;
    localFavors.map((item) => {
      if (item.type === type) {
        item.list = item.list.filter((item) => !symbols.includes(item));
      }
    });
    localStorageApi.setItem(LOCAL_KEY.FAVORS_TOKEN, localFavors);
    this.favorsUpdated();
    return true;
  };

  private _getAllListItems(arr: FAVORS_LIST[] = []): string[] {
    return arr?.reduce((acc, item: any) => {
      return acc?.concat(item.list);
    }, []);
  }
  //是否收藏
  public isFavor(code: string): boolean {
    if (Favors.isLogin()) {
      this.FavoriteCodes = this._getAllListItems(this.favorsList);
    } else {
      this.FavoriteCodes = this._getAllListItems(this.localFavors);
    }
    return this.FavoriteCodes.includes(code);
  }

  // 根据id判断是否已收藏，是的话调用removeFavors，否则调用addFavors
  public async toggleFavors(code: string, type: FAVORITE_TYPE): Promise<boolean> {
    if (this.isFavor(code)) {
      return await this.removeFavors([code], type);
    } else {
      return await this.addFavors([code], type);
    }
  }

  // 获取最新的自选列表，包括本地和服务器
  public getFavorsList(): FAVORS_LIST[] {
    if (Favors.isLogin()) {
      return this.favorsList;
    } else {
      return this.localFavors;
    }
  }

  // 获取简单合约的自选列表
  public getLiteFavorsList(): string[] {
    const list = this.getFavorsList();
    const liteList = list?.find((item) => item.type === FAVORITE_TYPE.LITE);
    return liteList?.list || [];
  }
  // 获取现货的自选列表(包含ETF)
  public getSpotAndEtfFavorsList(): string[] {
    const list = this.getFavorsList() || [];
    const spotList = list?.find((item) => item.type === FAVORITE_TYPE.SPOT);
    const spotEtfList = list?.find((item) => item.type === FAVORITE_TYPE.ETF);
    return spotList?.list.concat(spotEtfList?.list || []) || [];
  }
  // 获取永续的自选列表
  public getSwapFavorsList(): string[] {
    const list = this.getFavorsList() || [];
    const isDemo = isSwapDemo();
    const swapUsdtList = list?.find((item) => item.type === (!isDemo ? FAVORITE_TYPE.SWAP_USDT : FAVORITE_TYPE.SWAP_USDT_TESTNET));
    const swapCoinList = list?.find((item) => item.type === (!isDemo ? FAVORITE_TYPE.SWAP_COIN : FAVORITE_TYPE.SWAP_COIN_TESTNET));
    return swapUsdtList?.list.concat(swapCoinList?.list || []) || [];
  }
}

export { FAVORITE_TYPE, Favors };
