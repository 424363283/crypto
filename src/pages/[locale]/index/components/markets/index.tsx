import MiniChart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { getTradeHistoryKlineApi } from '@/core/api';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { useRouter } from '@/core/hooks/src/use-router';
import { useTradeHrefData } from '@/core/i18n/src/components/trade-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
// import { Group, MarketItem, Markets } from '@/core/shared';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import { sortCoinBySpecificRank } from '@/core/utils/src/sort';
import Image from 'next/image';
import YIcon from '@/components/YIcons';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import css from 'styled-jsx/css';
import MoreBtnMemo from './more-btn';
import Tabs from './tabs';
import TradeBtn from './trade-btn';
import { TrLink } from '@/core/i18n';
import { DEFAULT_ORDER, FAVORITE_TYPE, FAVORS_LIST, Favors, Group, MarketItem, Markets, MarketsMap } from '@/core/shared';
import { Wait2AddFavorsList } from '@/pages/[locale]/markets/components/markets-view/favors-list';
import { CURRENT_TAB, store } from '@/pages/[locale]/markets/store';
import MiddleOption from '@/pages/[locale]/markets/components/markets-view/components/middle-option';
import TopOptions from '@/pages/[locale]/markets/components/markets-view/components/top-option';
import { FAVORITE_OPTION_ID, PERPETUAL_OPTION_ID } from '@/pages/[locale]/markets/types';
import { useCascadeOptions } from '@/pages/[locale]/markets/components/hooks';
import { EmptyComponent } from '@/components/empty';
import { isLite } from '@/core/utils';
import { useResponsive } from '@/core/hooks';
import { Svg } from '@/components/svg';
import { useQuoteSearchStore } from '@/store/quote-search';
import Star from '@/components/star';
import { frameRun } from '@/core/utils/src/frame-run';
import { useImmer } from 'use-immer';
import { DataType, ListObject } from '@/pages/[locale]/markets/components/markets-view/table/types';

export default function MarketsComponent() {
  const { isMobile } = useResponsive();
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<{ key: string; order: string }>({ key: '', order: '' });
  // const ids = useRef<{ [key: string]: string[] }>();
  const config = useCascadeOptions();
  const { secondItem, thirdItem, currentId, searchValue } = store;
  const { id: secondId, name: secondItemName } = secondItem;
  const { id: thirdId } = thirdItem;
  const [tab] = useState<string>('spot');
  const router = useRouter();
  const { getHrefAndQuery } = useTradeHrefData();
  const [miniChartData, setMiniChartData] = useState<any>({});
  // const [list2, setList2] = useState<{ [key: string]: MarketItem[] }>({});
  const [list, setList] = useImmer<{ [key: string]: MarketItem[] }>({
    spot: [],
    swapUsdt: [],
    swapCoin: [],
    lite: [],
    etf: []
  });
  const searchTerm = useQuoteSearchStore(state => state.searchTerm);
  const sortLiteCoins = (data: string[]): string[] => {
    const sorts = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'DOTUSDT', 'TRXUSDT', 'UNIUSDT'];
    const sortData = sorts.map(id => data.find(item => new RegExp(`^${id}`).test(item))).filter(v => v);
    return sortData.slice(0, maxViewCount) as string[];
  };

  const [favorsList, setFavorsList] = useState<FAVORS_LIST[]>([]);
  const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  // 筛选的现货ids
  const [filterSpotIds, setFilterSpotIds] = useState<string[]>([]);
  // 筛选的永续ids
  const [filterSwapIds, setFilterSwapIds] = useState<string[]>([]);
  // 筛选的简易合约ids
  const [filterLiteIds, setFilterLiteIds] = useState<string[]>([]);
  const maxViewCount: number = 6;

  const fetchFavorsList = async () => {
    const favors = await Favors.getInstance();
    if (favors) {
      const favList = favors.getFavorsList();
      setFavorsList(favList);
    } else {
      setFavorsList([]);
    }
  };

  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
    frameRun(() => setMarketDetail(detail));
  });

  // useEffect(() => {
  //   ids.current = undefined; // 清空 ids.current
  //   // if (tab === 'swapFavorIds') {
  //   //   store.currentId = CURRENT_TAB.FAVORITE;
  //   //   // store.secondItem.id = '1-1';
  //   //   // store.secondItem.name = '币币';
  //   //   store.secondItem.id = '1-2';
  //   //   store.secondItem.name = '合约';
  //   // }
  // }, [currentId]);
  // console.log("tab",tab)

  // const getIdsCallback2 = useCallback(async () => {
  //   const group = await Group.getInstance();
  //   const favors = await Favors.getInstance();
  //   // const spotIds = group.getSpotCoinIds('USDT');
  //   const spotIds = group.getHotSpotCoinIds();
  //   const swapUsdtIds = group.getHotSwapUsdtIds();
  //   const swapCoinIds = group.getSwapCoinIds();
  //   const liteIds = group.getLiteQuoteIds;
  //   const etfIds = group.getSpotEtfIds();
  //   const sortSpotIds = spotIds.sort(sortCoinBySpecificRank).slice(0, 6);
  //   const sortSwapUsdtIds = swapUsdtIds.sort(sortCoinBySpecificRank).slice(0, 6);
  //   const sortSwapCoinIds = swapCoinIds.sort(sortCoinBySpecificRank).slice(0, 6);
  //   const sortLiteIds = sortLiteCoins(liteIds);
  //   const sortEtfIds = etfIds.sort(sortCoinBySpecificRank).slice(0, 6);
  //   // const all = [...sortSpotIds, ...sortSwapUsdtIds, ...sortSwapCoinIds, ...sortLiteIds, ...sortEtfIds];
  //   const swapFavorIds = favors.getSwapFavorsList()?.slice(0, 8); // 合约自选
  //   const spotFavorIds = favors.getSpotAndEtfFavorsList()?.slice(0, 8); // 币币自选
  //   const liteFavorIds = favors
  //     .getLiteFavorsList()
  //     ?.slice(0, 8)
  //     .map(id => group.getLiteQuoteCode(id)); // 简易合约自选
  //   const all = [
  //     ...sortSpotIds,
  //     ...sortSwapUsdtIds,
  //     ...sortSwapCoinIds,
  //     ...sortLiteIds,
  //     ...sortEtfIds,
  //     ...swapFavorIds,
  //     ...spotFavorIds,
  //     ...liteFavorIds
  //   ];
  //
  //   ids.current = {
  //     spotIds: sortSpotIds,
  //     swapUsdtIds: sortSwapUsdtIds,
  //     swapCoinIds: sortSwapCoinIds,
  //     liteIds: sortLiteIds,
  //     etfIds: sortEtfIds,
  //     swapFavorIds,
  //     spotFavorIds,
  //     liteFavorIds,
  //     all
  //   };
  //   return ids.current;
  // }, [currentId, secondId, favorsList]);

  // 现货列表
  const getSpotList = () => {
    const { spot = [] } = list;
    const filterSpotItems = spot.filter(item => {
      return filterSpotIds.includes(item.id);
    });
    return filterSpotItems.slice(0, maxViewCount);;
  };
  // 永续列表
  const getSwapUsdtList = () => {
    const { swapUsdt = [], swapCoin = [] } = list;
    const SWAP_LIST_MAP: { [key: string]: MarketItem[] } = {
      [PERPETUAL_OPTION_ID.SWAP_USDT]: swapUsdt,
      [PERPETUAL_OPTION_ID.SWAP_COIN]: swapCoin
    };
    let result: MarketItem[] = [];
    if (SWAP_LIST_MAP.hasOwnProperty(secondId)) {
      result = SWAP_LIST_MAP[secondId];
    }
    const filterSwapItems = result.filter(item => {
      return filterSwapIds.includes(item.id);
    });
    return filterSwapItems.slice(0, maxViewCount);;
  };

  // 简单合约
  const getLiteList = () => {
    const { lite = [] } = list;
    const filterLiteItems = lite.filter(item => {
      return filterLiteIds.includes(item.id);
    });
    return filterLiteItems.slice(0, maxViewCount);;
  };

  // 杠杆代币
  const getLeverageList = () => {
    const { etf = [] } = list;
    return etf.slice(0, maxViewCount);
  };

  const getFilterFavorsListById = (list: ListObject[]) => {
    const FAVORS_LIST_MAP: { [key: string]: any[] } = {
      [FAVORITE_OPTION_ID.SPOT]: list.filter(item => item.type === FAVORITE_TYPE.SPOT && item.zone !== 'LVTs'),
      [FAVORITE_OPTION_ID.ETF]: list.filter(item => item.type === FAVORITE_TYPE.SPOT && item.zone === 'LVTs'),
      [FAVORITE_OPTION_ID.SWAP_USDT]: list.filter(item => item.type === FAVORITE_TYPE.SWAP_USDT),
      [FAVORITE_OPTION_ID.SWAP_COIN]: list.filter(item => item.type === FAVORITE_TYPE.SWAP_COIN),
      [FAVORITE_OPTION_ID.LITE]: list.filter(item => item.type === FAVORITE_TYPE.LITE)
    };
    return FAVORS_LIST_MAP[secondId] || [];
  };

  const _toCamelCase = (str: string): string => {
    let words = str.split('_');
    let capitalizedWords = words.map((word, index) => {
      if (index === 0) {
        return word;
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    });
    return capitalizedWords.join('');
  };

  // 自选列表
  const getFavoriteList = () => {
    const filteredList: ListObject[] = [];
    favorsList?.forEach(arr1Obj => {
      const listName = _toCamelCase(arr1Obj.type); // remove underscore for consistency
      const allListObj = list[listName];
      if (allListObj) {
        arr1Obj.list.forEach(id => {
          const matchedObj = allListObj.find(obj => obj.id === id);
          if (matchedObj) {
            filteredList.push({
              ...matchedObj,
              type: arr1Obj.type
            });
          }
        });
      }
    });
    return getFilterFavorsListById(filteredList).slice(0, maxViewCount);
  };

  const getIdsCallback = async (detail: any, curId: string) => {
    const group = await Group.getInstance();

    const setSpotIds = () => {
      const isLoading = detail?.spotLoading;
      if (!isLoading) {
        const spotIds = group?.getSpotIds;
        const sortSpotIds = [...spotIds].sort(sortCoinBySpecificRank);
        setList(draft => {
          draft.spot = Markets.getMarketList(detail, sortSpotIds);
        });
      }
    };
    const setSwapCoinIds = () => {
      const swapCoinIds = group?.getSwapCoinIds();
      const sortedSwapCoinIds = [...swapCoinIds].sort(sortCoinBySpecificRank);
      setList(draft => {
        draft.swapCoin = Markets.getMarketList(detail, sortedSwapCoinIds);
      });
    };
    const setSwapUsdtIds = () => {
      const swapUsdtIds = group?.getSwapUsdtIds();
      const sortedSwapUsdtIds = [...swapUsdtIds].sort(sortCoinBySpecificRank);
      setList(draft => {
        draft.swapUsdt = Markets.getMarketList(detail, sortedSwapUsdtIds);
      });
    };
    const setLiteIds = () => {
      const liteIds = group?.getLiteQuoteIds;
      const sortedLiteIds = [...liteIds].sort(sortCoinBySpecificRank);
      setList(draft => {
        draft.lite = Markets.getMarketList(detail, sortedLiteIds);
      });
    };
    const setEtfIds = () => {
      const etfIds = group?.getSpotEtfIds();
      const sortedEtfIds = [...etfIds].sort(sortCoinBySpecificRank);
      setList(draft => {
        draft.etf = Markets.getMarketList(detail, sortedEtfIds);
      });
    };
    const TABLE_IDS_MAP: any = {
      [CURRENT_TAB.FAVORITE]: () => {
        const FAV_LIST: any = {
          [FAVORITE_OPTION_ID.SWAP_USDT]: setSwapUsdtIds(),
          [FAVORITE_OPTION_ID.SWAP_COIN]: setSwapCoinIds(),
          [FAVORITE_OPTION_ID.SPOT]: setSpotIds(),
          [FAVORITE_OPTION_ID.LITE]: setLiteIds(),
          [FAVORITE_OPTION_ID.ETF]: setEtfIds()
        };
        FAV_LIST[secondId];
      },
      [CURRENT_TAB.SPOT_GOODS]: () => {
        setSpotIds();
      },
      [CURRENT_TAB.PERPETUAL]: () => {
        if (secondId === PERPETUAL_OPTION_ID.SWAP_USDT) {
          setSwapUsdtIds();
        } else {
          setSwapCoinIds();
        }
      },
      [CURRENT_TAB.LITE]: () => {
        setLiteIds();
      },
      [CURRENT_TAB.ETF]: () => {
        setEtfIds();
      }
    };
    if (TABLE_IDS_MAP.hasOwnProperty(curId)) {
      TABLE_IDS_MAP[curId]();
    }
  };

  useEffect(() => {
    getIdsCallback(marketsDetail, currentId);
  }, [marketsDetail, currentId, secondId]);

  // useEffect(() => {
  //   const list = ids.current ?? {};
  //   for (let item of favorsList) {
  //     if (item.type === 'spot') {
  //       list.spotFavorIds = item.list;
  //     } else if (item.type === 'swap_usdt') {
  //       list.swapFavorIds = item.list;
  //     }
  //   }
  // }, [favorsList]);

  // mini k线图数据
  // useEffect(() => {
  //   if (ids.current) {
  //     const nowTime = Date.parse(String(new Date())) / 1000;
  //     // const oldTime = currentId === CURRENT_TAB.SPOT_GOODS ? 1800 : 60 * 60 * 24 * 15; // 10
  //     const oldTime = 1800; // 30 min
  //     const _ids = ids.current.all.join(',');
  //     if (_ids.length === 0) return;
  //     getTradeHistoryKlineApi(_ids, nowTime - oldTime, nowTime, 1).then(({ data }: any) => {
  //       if (data) {
  //         const _data: any = {};
  //         Object.entries(data || {}).map(([key, value]) => (_data[key] = (value as any).slice(-30)));
  //         setMiniChartData(_data);
  //       }
  //     });
  //   }
  // }, [ids.current]);

  // 行情数据
  // useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
  //   // const isLoading = detail?.loading || false;
  //   // if (!isLoading) {
  //   //   Loading.end();
  //   // } else {
  //   //   Loading.start();
  //   // }
  //
  //   const { secondItem, thirdItem, currentId, searchValue } = store;
  //   const { id: secondId, name: secondItemName } = secondItem;
  //   const { spotIds, swapUsdtIds, swapCoinIds, liteIds, etfIds, swapFavorIds, spotFavorIds, liteFavorIds } =
  //     await getIdsCallback2();
  //
  //   // console.log("获取收藏",swapFavorIds)
  //
  //   setList2({
  //     [FAVORITE_OPTION_ID.SPOT]: Markets.getMarketList(detail, spotFavorIds),
  //     [FAVORITE_OPTION_ID.SWAP_USDT]: Markets.getMarketList(detail, swapFavorIds),
  //     [FAVORITE_OPTION_ID.LITE]: Markets.getMarketList(detail, liteFavorIds),
  //     [CURRENT_TAB.SPOT_GOODS]: Markets.getMarketList(detail, spotIds),
  //     [CURRENT_TAB.PERPETUAL]: Markets.getMarketList(detail, swapUsdtIds),
  //     [CURRENT_TAB.LITE]: Markets.getMarketList(detail, liteIds),
  //     [CURRENT_TAB.ETF]: Markets.getMarketList(detail, etfIds)
  //
  //     // spot: Markets.getMarketList(detail, spotIds),
  //     // swapFavorIds: Markets.getMarketList(detail, swapFavorIds),
  //     // spotFavorIds: Markets.getMarketList(detail, spotFavorIds),
  //     // swapUsdt: Markets.getMarketList(detail, swapUsdtIds),
  //     // swapCoin: Markets.getMarketList(detail, swapCoinIds),
  //     // lite: Markets.getMarketList(detail, liteIds),
  //     // etf: Markets.getMarketList(detail, etfIds),
  //   });
  // });

  const { setResponsiveClsx } = useResponsiveClsx();
  const tabs: any = {
    [CURRENT_TAB.SPOT_GOODS]: LANG('现货'),
    [CURRENT_TAB.FAVORITE]: LANG('自选'),
    [CURRENT_TAB.PERPETUAL]: LANG('U本位合约'),
    [CURRENT_TAB.LITE]: LANG('简易合约'),
    [CURRENT_TAB.ETF]: LANG('杠杆代币')

    // spot: LANG('现货'),
    // swapFavorIds: LANG('自选'),
    // swapUsdt: LANG('U本位合约'),
    // swapCoin: LANG('币本位合约'),
    // lite: LANG('简易合约'),
    // etf: LANG('杠杆代币'),
  };

  const _goToTrade = (id: string) => {
    const { href, query }: any = getHrefAndQuery(id.toUpperCase());
    router.push({
      pathname: href,
      query
    });
  };

  // console.log("list=======",list)
  // const resultList2 = useMemo(() => {
  //   let key: CURRENT_TAB | FAVORITE_OPTION_ID | string = currentId;
  //   if (currentId === CURRENT_TAB.FAVORITE) {
  //     key = secondId;
  //   }
  //   if (!list2[key]) {
  //     return [];
  //   }
  //   let result = list2[key];
  //   if (searchTerm) {
  //     result = list2[key].filter(item => {
  //       const lowerCaseSearchKey = searchTerm.toLowerCase(); // 转为小写
  //       return (
  //         item.name.toLowerCase().indexOf(lowerCaseSearchKey) !== -1 ||
  //         item.fullName.toLowerCase().indexOf(lowerCaseSearchKey) !== -1
  //       );
  //     });
  //   }
  //
  //   if (sortDirection.order) {
  //     result = [...result].sort((a, b) => {
  //       if (sortDirection.key === 'rate') {
  //         const rateA = parseFloat(a.rate);
  //         const rateB = parseFloat(b.rate);
  //         return sortDirection.order === 'desc' ? rateB - rateA : rateA - rateB;
  //       }
  //
  //       return sortDirection.order === 'desc' ? (b.id > a.id ? 1 : -1) : a.id > b.id ? 1 : -1;
  //     });
  //   }
  //
  //   return result;
  // }, [searchTerm, secondId, list2, sortDirection]);

  const resultList = useMemo(() => {
    const data: DataType[] = [];
    const TAB_DATA_MAP = {
      [CURRENT_TAB.SPOT_GOODS]: getSpotList(),
      [CURRENT_TAB.PERPETUAL]: getSwapUsdtList(),
      [CURRENT_TAB.LITE]: getLiteList(),
      [CURRENT_TAB.ETF]: getLeverageList(),
      [CURRENT_TAB.FAVORITE]: getFavoriteList()
    };
    let result = TAB_DATA_MAP[currentId] || data;
    if (searchKey) {
      result = result.filter(item => {
        const lowerCaseSearchKey = searchKey.toLowerCase(); // 转为小写
        return (
          item.name.toLowerCase().indexOf(lowerCaseSearchKey) !== -1 ||
          item.fullName.toLowerCase().indexOf(lowerCaseSearchKey) !== -1
        );
      });
    }
    if (sortDirection.order) {
      result = [...result].sort((a, b) => {
        if (sortDirection.key === 'rate') {
          const rateA = parseFloat(a.rate);
          const rateB = parseFloat(b.rate);
          return sortDirection.order === 'desc' ? rateB - rateA : rateA - rateB;
        }

        return sortDirection.order === 'desc' ? (b.id > a.id ? 1 : -1) : a.id > b.id ? 1 : -1;
      });
    }
    return result;

  }, [searchKey, secondId, list, sortDirection]);

  const resultIdList = useMemo(() => {
    const data: string[] = [];
    const TAB_DATA_MAP = {
      [CURRENT_TAB.SPOT_GOODS]: filterSpotIds,
      [CURRENT_TAB.PERPETUAL]: filterSwapIds,
      [CURRENT_TAB.LITE]: filterLiteIds,
      [CURRENT_TAB.ETF]: [],
      [CURRENT_TAB.FAVORITE]: getFavoriteList()
    };
    if (currentId === CURRENT_TAB.FAVORITE) {
      if (secondId === FAVORITE_OPTION_ID.SPOT || secondId === FAVORITE_OPTION_ID.ETF) {
        TAB_DATA_MAP[CURRENT_TAB.FAVORITE] = favorsList.find(item => item.type === FAVORITE_TYPE.SPOT)?.list || [];

      } else if (secondId === FAVORITE_OPTION_ID.SWAP_USDT) {
        TAB_DATA_MAP[CURRENT_TAB.FAVORITE] = favorsList.find(item => item.type === FAVORITE_TYPE.SWAP_USDT)?.list || [];

      } else if (secondId === FAVORITE_OPTION_ID.SWAP_COIN) {
        TAB_DATA_MAP[CURRENT_TAB.FAVORITE] = favorsList.find(item => item.type === FAVORITE_TYPE.SWAP_COIN)?.list || [];

      } else if (secondId === FAVORITE_OPTION_ID.LITE) {
        TAB_DATA_MAP[CURRENT_TAB.FAVORITE] = favorsList.find(item => item.type === FAVORITE_TYPE.LITE)?.list || [];

      }

    }
    let result = TAB_DATA_MAP[currentId] || data;
    if (searchKey) {
      result = result.filter(item => {
        const lowerCaseSearchKey = searchKey.toLowerCase(); // 转为小写
        return item.toLowerCase().indexOf(lowerCaseSearchKey) !== -1;
      });
    }
    return result;

  }, [searchKey, secondId, filterSpotIds, filterSwapIds, filterLiteIds, favorsList]);

  const callback = useCallback(({ detail }: any) => {
    store.marketDetailList = detail;
  }, []);

  useEffect(() => {
    window.addEventListener(SUBSCRIBE_TYPES.ws3001, callback);
    return () => window.removeEventListener(SUBSCRIBE_TYPES.ws3001, callback);
  }, []);


  const getFavorType = useCallback(() => {
    if (store.currentId === CURRENT_TAB.PERPETUAL) {
      return FAVORITE_TYPE.SWAP_USDT;
    }
    if (store.currentId === CURRENT_TAB.LITE) {
      return FAVORITE_TYPE.LITE;
    }
    return FAVORITE_TYPE.SPOT;
  }, [store.currentId]);

  useEffect(() => {
    const getHostSymbols = async () => {
      const group = await Group.getInstance();
      const spotIds = group.getHotSpotCoinIds();
      const swapUsdtIds = group.getHotSwapUsdtIds();
      const liteIds = group.getHotLiteIds();
      setFilterSpotIds(spotIds);
      setFilterSwapIds(swapUsdtIds);
      setFilterLiteIds(liteIds);
    }
    getHostSymbols();

  }, []);

  useEffect(() => {
    fetchFavorsList();
  }, [currentId]);

  // mini k线图数据
  useEffect(() => {
    let isLatestRequest = true;
    setMiniChartData({});
    const fetchResults = async () => {
      const group = await Group.getInstance();
      const symbolList = resultIdList.map(id => {
        if (isLite(id)) {
          return group.getLiteQuoteCode(id);
        } else {
          return id;
        }
      });
      console.log(11);
      if (symbolList.length > 0) {
        const nowTime = Date.parse(String(new Date())) / 1000;
        // const oldTime = currentId === CURRENT_TAB.SPOT_GOODS ? 1800 : 60 * 60 * 24 * 15; // 10
        const oldTime = 1800; // 30 min
        const _ids = symbolList.join(',');
        if (_ids.length === 0) return;
        getTradeHistoryKlineApi(_ids, nowTime - oldTime, nowTime, 1).then(({ data }: any) => {
          if (data) {
            const _data: any = {};
            Object.entries(data || {}).map(([key, value]) => (_data[key] = (value as any).slice(-30)));
            if (isLatestRequest) {
              setMiniChartData(_data);
            }
          }
        });
      }
    };
    fetchResults();

    return () => {
      isLatestRequest = false;
    };

  }, [secondId, filterSpotIds, filterSwapIds, filterLiteIds, favorsList]);

  return (
    <MoreBtnMemo>
      <div className="filter-options">
        <Tabs onSearch={setSearchKey} />
        {config.secondOptions.length > 1 && <MiddleOption />}
      </div>
      {store.currentId === CURRENT_TAB.FAVORITE && !resultList.length && !searchKey ? (
        <Wait2AddFavorsList onAddAllCallback={fetchFavorsList} />
      ) : (
        <div className={clsx('table')}>
          <ul className="thead row">
            <li
              className={isMobile ? 'sort' : ''}
              onClick={() => {
                // if (isMobile) {
                //   setSortDirection(prev => {
                //     const order =
                //       prev.key !== 'code' && prev.order
                //         ? prev.order
                //         : !prev.order
                //           ? 'desc'
                //           : prev.order === 'desc'
                //             ? 'asc'
                //             : '';
                //
                //     return { key: 'code', order };
                //   });
                // }
              }}
            >
              {LANG('交易对')}{' '}
              {/* isMobile && (
                <div className="sort-icons">
                  <Svg
                    src="/static/images/common/sort_up.svg"
                    width={6}
                    height={6}
                    className={clsx('up', sortDirection.key === 'code' && sortDirection.order === 'asc' && 'selected')}
                  />
                  <Svg
                    src="/static/images/common/sort_up.svg"
                    width={6}
                    height={6}
                    className={clsx(
                      'down',
                      sortDirection.key === 'code' && sortDirection.order === 'desc' && 'selected'
                    )}
                  />
                </div>
              ) */}
            </li>
            {isMobile ? (
              <>
                <li
                  onClick={() => {
                    // setSortDirection(prev => {
                    //   const order =
                    //     prev.key !== 'rate' && prev.order
                    //       ? prev.order
                    //       : !prev.order
                    //         ? 'desc'
                    //         : prev.order === 'desc'
                    //           ? 'asc'
                    //           : '';
                    //
                    //   return { key: 'rate', order };
                    // });
                  }}
                  className="sort"
                >
                  {LANG('最新价')}/{LANG('24H涨跌幅')}
                  {/* <div className="sort-icons">
                    <Svg
                      src="/static/images/common/sort_up.svg"
                      width={6}
                      height={6}
                      className={clsx(
                        'up',
                        sortDirection.key === 'rate' && sortDirection.order === 'asc' && 'selected'
                      )}
                    />
                    <Svg
                      src="/static/images/common/sort_up.svg"
                      width={6}
                      height={6}
                      className={clsx(
                        'down',
                        sortDirection.key === 'rate' && sortDirection.order === 'desc' && 'selected'
                      )}
                    />
                  </div> */}
                </li>
              </>
            ) : (
              <>
                <li>{LANG('价格')}</li>
                <li>{LANG('24H涨跌幅')}</li>
                <li>{LANG('K线图')}</li>
                <li>{LANG('操作')}</li>
              </>
            )}
          </ul>
          <ul className="tbody">
            {resultList?.length > 0 ? (
              resultList?.map((item: MarketItem, key: number) => {
                const chartData = miniChartData[isLite(item.id) ? item.quoteCode : item.id] || [];
                const DIRECTION_ICON = item.isUp
                  ? '/static/images/common/up-green-icon.png'
                  : '/static/images/common/down-red-icon.png';
                return (
                  <li className="row" key={key} onClick={() => _goToTrade(item.id)}>
                    <ul className="market_item">
                      <li className="name">
                        {/* isMobile && <Star code={item.id} type={getFavorType()} width={24} height={24} /> */}
                        <CoinLogo
                          width={isMobile ? 20 : 32}
                          height={isMobile ? 20 : 32}
                          className="icon"
                          coin={item.coin}
                        />
                        <div>
                          {item.type?.toUpperCase() === 'SPOT' || item.type?.toUpperCase() === 'ETF' ? (
                            <>
                              <span className="coin_symbol">
                                {item.coin}/{item.quoteCoin}
                              </span>
                            </>
                          ) : (
                            <span className="coin_alias">{item.name}</span>
                          )}
                          {/* <Mobile>
                            <div className="n-type">{tabs[currentId]}</div>
                          </Mobile> */}
                        </div>
                      </li>
                      {isMobile ? (
                        <>
                          <li className="price">
                            <div>{item.price.toFormat(item.digit)}</div>
                            <div className={clsx('rate', item.isUp ? 'positive-text' : 'negative-text')}>
                              {item.rate}%
                            </div>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="price">{item.price.toFormat(item.digit)}</li>
                          <li className={clsx('rate', item.isUp ? 'positive-text' : 'negative-text')}>{item.rate}%</li>
                          <li>
                            <MiniChart
                              symbol={item.id}
                              data={chartData}
                              showLine={false}
                              style={{ width: 75, height: 28 }}
                              lineWidth={1.5}
                              lineColor={item?.isUp ? 'var(--color-green)' : 'var(--color-red)'}
                              areaColorOpacity={50}
                            />
                          </li>
                          <TradeBtn coin={item.coin} id={item.id} tab={tab} />
                        </>
                      )}
                    </ul>
                  </li>
                );
              })
            ) : (
              <EmptyComponent text={LANG('暂无数据')} style={{ height: 300 }} />
            )}
          </ul>
          {resultList?.length > 0 ? (
            <TrLink href={ `/markets?top=${store.currentId}` } className={clsx('view-more')}>
              {LANG('查看更多')}
              <DesktopOrTablet>
                <YIcon.moreIcon width={24} height={24}/>
              </DesktopOrTablet>
              <Mobile>
                <YIcon.moreIcon width={20} height={20}/>
              </Mobile>
            </TrLink>
          ) : null}
        </div>
      )}
      <style jsx>{style}</style>
    </MoreBtnMemo>
  );
}

const style = css`
  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    :global(.tabs-wrapper) {
      height: 56px;
      @media ${MediaInfo.mobile} {
        height: auto;
      }
    }
    :global(.option2-wrapper) {
      margin-bottom: 16px;
    }
    @media ${MediaInfo.mobile} {
      width: 100%;
      justify-content: space-between;
    }
  }
  .table {
    .row {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px;
      margin: 16px 0;
      text-align: left;
      @media ${MediaInfo.mobile} {
        padding: 0;
      }
      :global(.trade-btn-2) {
        border: 1px solid var(--brand);
        background: var(--brand);
        border-radius: 24px;
        &:hover {
          background: var(--btn_brand_hover);
          color: var(--text_white);
        }
      }
    }
    li.row:hover {
      background: var(--fill_bg_2);
      :global(.trade-btn-2) {
        &:hover {
          background: var(--btn_brand_hover);
          color: var(--text_white);
        }
      }
    }
    .tbody {
      margin: 0;
      padding: 0;
      .market_item {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        flex: 1;
        height: auto;
        @media ${MediaInfo.mobile} {
          height: 40px;
        }
        .rate {
          display: flex;
          align-items: center;
        }
        :global(a) {
          &:nth-child(2) {
            margin-left: 10px;
          }
        }
        .red,
        .green {
          font-size: 16px;
          font-weight: 500;
        }
        .price {
          font-size: 16px;
          font-weight: 500;
          color: var(--text_1);

          @media ${MediaInfo.mobile} {
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            align-items: flex-end;
            font-size: 16px;
            font-weight: 400;
            gap: 4px;
          }
          .rate {
            font-size: 12px;
            font-weight: 400;
          }
        }
        .name {
          display: flex;
          align-items: center;
          :global(.icon) {
            width: 26px !important;
            height: 26px;
            border-radius: 50%;
            margin-right: 10px;
            @media ${MediaInfo.mobile} {
              width: 20px !important;
              height: 20px;
              margin: 0;
            }
          }
          span {
            font-weight: 500;
            color: var(--theme-font-color-2);
          }
          .coin_symbol {
            color: var(--text_1);
            font-size: 16px;
            font-weight: 600;
            @media ${MediaInfo.mobile} {
              font-weight: 500;
            }
          }
          .coin_alias {
            color: var(--text_1);
            font-size: 16px;
            font-weight: 600;
            @media ${MediaInfo.mobile} {
              font-weight: 500;
            }
          }
          .n-type {
            color: var(--theme-font-color-2);
            text-align: left;
          }
          @media ${MediaInfo.mobile} {
            gap: 8px;
          }
        }
      }
      @media ${MediaInfo.mobile} {
        min-height: auto;
      }
    }
    .thead {
      padding: 0 16px;
      @media ${MediaInfo.mobile} {
        padding: 0;
      }
    }
    .thead {
      li {
        font-size: 14px;
        font-weight: 300;
        color: var(--text_3);
      }
    }
    :global(.market_item) {
      li {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .thead,
    :global(.market_item) {
      :global(li) {
        &:nth-child(1) {
          width: 250px;
        }
        &:nth-child(2) {
          flex: 1;
          padding-right: 20px;
        }
        &:nth-child(3) {
          flex: 1;
          padding-right: 20px;
        }
        &:nth-child(4) {
          flex: 1;
          padding-right: 20px;
        }
        &:nth-child(5) {
          min-width: 190px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 15px;
        }
      }

      @media ${MediaInfo.mobile} {
        :global(li) {
          padding: 0 !important;
          white-space: nowrap;
        }
        :global(.sort:last-child) {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    :global(.view-more) {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 0 16px;
      justify-content: center;
      font-size: 16px;
      font-weight: 300;
      color: var(--text_3);
      @media ${MediaInfo.mobile} {
        font-size: 14px;
        font-weight: 300;
      }
    }
  }
  .sort {
    display: flex;
    align-items: center;
    flex-direction: row;
    @media ${MediaInfo.mobile} {
      gap: 4px;
    }

    :global(.svg) {
      display: inline-flex !important;
      :global(svg) {
        fill: var(--text_3);
      }
    }

    :global(.down) {
      transform: rotate(-180deg);
    }

    :global(.selected) {
      :global(svg) {
        fill: var(--brand);
      }
    }

    &-icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
`;
