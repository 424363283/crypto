import { StoreApi, UseBoundStore, create } from 'zustand';
import { isServerSideRender } from '@/utils';

interface TokenStore {
  quoteChange: string;
  indexPrice: string;
  marketPrice: string;
  fundingRate: {
    fundingRate?: string;
    fundingValue?: string | number;
  };
  interest: string;
  high: string;
  low: string;
  volumeBtc: string;
  volumeUsdt: string;
  collections: string[];
  loginCollections: string[];
  showGuide: boolean;
  refresh: boolean;
  setMarketInfo: (data: any) => void;
  setLoginCollections: (symbol: any) => void;
  addCollections: (symbol: string) => void;
  removeCollections: (symbol: string) => void;
  displayGuide: (display: boolean) => void;
  changeRefresh: (display: boolean) => void;
}

// interface TokenPriceInfo {
//   quoteChange: string;
//   indexPrice: string;
//   marketPrice: string;
//   fundingRate: {
//     fundingRate?: string;
//     fundingValue?: string | number;
//   };
//   interest: string;
//   high: string;
//   low: string;
//   volumeBtc: string;
//   volumeUsdt: string;
// }

export const useTokenStore: UseBoundStore<StoreApi<TokenStore>> = create(set => {
  const initalizeState: any = {
    quoteChange: '',
    indexPrice: '',
    marketPrice: '',
    fundingRate: {},
    interest: '',
    high: '',
    low: '',
    volumeBtc: '',
    volumeUsdt: '',
    /** 未登录-收藏 */
    collections: [],
    /** 已登录-收藏 */
    loginCollections: []
  };

  if (!isServerSideRender()) {
    try {
      const collections = JSON.parse(localStorage.favorite);
      if (Array.isArray(collections)) initalizeState.collections = collections;
    } catch (error) {
    }

    try {
      const collections = JSON.parse(localStorage.favoriteLoginIds);
      if (Array.isArray(collections)) initalizeState.loginCollections = collections;
    } catch (error) {
    }
  }
  return {
    ...initalizeState,

    showGuide: false,
    refresh: false,

    /** 已登录 - 设置收藏 */
    setLoginCollections: (symbolList: any) =>
      set(state => {
        localStorage?.setItem('favoriteLoginIds', JSON.stringify(symbolList));
        return {
          ...state,
          loginCollections: symbolList
        };
      }),

    /** 未登录 - 增加收藏 */
    addCollections: (symbol: string) =>
      set(state => {
        if (!state.collections.includes(symbol)) {
          const collections = [symbol, ...state.collections];
          localStorage?.setItem('favorite', JSON.stringify(collections));
          return {
            ...state,
            collections
          };
        }
        return state;
      }),

    /** 未登录 - 移出收藏 */
    removeCollections: (symbol: string) => set(state => {
      const collections = state.collections.filter((s: string) => s !== symbol);
      localStorage?.setItem('favorite', JSON.stringify(collections));
      return { ...state, collections };
    }),

    setMarketInfo: (market: any) => set(state => {
      return { ...state, ...market };
    }),

    /** 新手引导 */
    displayGuide: (display: boolean) => set(state => ({ ...state, showGuide: display })),

    changeRefresh: (refresh: boolean) => set(state => ({ ...state, refresh: refresh }))
  };
});

// export const TokenPriceStore: UseBoundStore<StoreApi<TokenPriceInfo>> = create(() => ({
//   quoteChange: '',
//   indexPrice: '',
//   marketPrice: '',
//   fundingRate: {},
//   interest: '',
//   high: '',
//   low: '',
//   volumeBtc: '',
//   volumeUsdt: ''
// }));

// export function setTokenPriceStore(tokenInfo: TokenPriceInfo) {
//   TokenPriceStore.setState(state => ({
//     ...state,
//     ...tokenInfo
//   }));
// }

// export function getTokenPriceStore() {
//   return TokenPriceStore.getState();
// }
