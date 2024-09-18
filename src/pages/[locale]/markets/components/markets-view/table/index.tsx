import Table from '@/components/table';
import { useIndexedDB, useRouter } from '@/core/hooks';
import { LANG, useTradeHrefData } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { FAVORITE_TYPE, FAVORS_LIST, Favors, Group, MarketItem, Markets, MarketsMap, TradeMap } from '@/core/shared';
import { IDB_STORE_KEYS } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import { frameRun } from '@/core/utils/src/frame-run';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { store } from '../../../store';
import {
  CURRENT_TAB,
  FAVORITE_OPTION_ID,
  LITE_OPTION_ID,
  PERPETUAL_OPTION_ID,
  SPOT_GOODS_OPTION_ID,
} from '../../../types';
import { useLiteList } from '../../hooks';
import { Wait2AddFavorsList } from '../favors-list';
import { formatCoinName } from './helper';
import { customSpotCoinSort, sortCoinItem } from './sort-coin';
import { DataType, ListObject } from './types';
import { useColumns } from './useColumns';

const MarketTable = () => {
  const liteList = useLiteList();
  const { getHrefAndQuery } = useTradeHrefData();
  const [list, setList] = useImmer<{ [key: string]: MarketItem[] }>({
    spot: [],
    swapUsdt: [],
    swapCoin: [],
    lite: [],
    etf: [],
  });
  const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [columnKey, setKey] = useState('');
  const [order, setOrder] = useState('');
  const [idbKey, setIdbKey] = useState<string>(IDB_STORE_KEYS.MARKETS_DATA_SPOT_USDT_LIST);

  const [favorsList, setFavorsList] = useState<FAVORS_LIST[]>([]);
  const { secondItem, thirdItem, currentId, searchValue } = store;
  const { id: secondId, name: secondItemName } = secondItem;
  const { id: thirdId } = thirdItem;
  const router = useRouter();

  // 筛选的现货ids
  const [filterSpotIds, setFilterSpotIds] = useState<string[]>([]);
  // 筛选的永续ids
  const [filterSwapIds, setFilterSwapIds] = useState<string[]>([]);
  // table数据
  const [tableData, setTableData] = useState<MarketItem[]>([]);
  const [marketsLocalData, setMarketsData] = useIndexedDB(idbKey, tableData);

  const getIdsCallback = async (detail: any, curId: string) => {
    const group = await Group.getInstance();

    const setSpotIds = () => {
      const isLoading = detail?.spotLoading;
      if (secondId === SPOT_GOODS_OPTION_ID.USDT) {
        setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_SPOT_USDT_LIST);
      }
      if (secondId === SPOT_GOODS_OPTION_ID.USDC) {
        setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_SPOT_USDC_LIST);
      }
      if (!isLoading) {
        const hotIds = group.getHotIds();
        const spotIds = group.getSpotIds;
        const spots = Markets.getMarketList(detail, spotIds);
        setList((draft) => {
          // 创建 spots 数组的副本并排序
          const sortedSpots = [...spots].sort((a, b) => customSpotCoinSort(a, b, hotIds));
          draft.spot = sortedSpots;
        });
      }
    };
    const setSwapCoinIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_SWAP_COIN_LIST);
      const swapCoinIds = group.getSwapCoinIds();
      setList((draft) => {
        draft.swapCoin = Markets.getMarketList(detail, swapCoinIds);
      });
    };
    const setSwapUsdtIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_SWAP_FEATURE_LIST);
      const swapUsdtIds = group.getSwapUsdtIds();
      setList((draft) => {
        draft.swapUsdt = Markets.getMarketList(detail, swapUsdtIds);
      });
    };
    const setLiteIds = () => {
      const liteIds = group.getLiteIds;
      setList((draft) => {
        draft.lite = Markets.getMarketList(detail, liteIds);
      });
    };
    const setEtfIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_ETF_LIST);
      const etfIds = group.getSpotEtfIds();
      setList((draft) => {
        draft.etf = Markets.getMarketList(detail, etfIds);
      });
    };
    const TABLE_IDS_MAP: any = {
      [CURRENT_TAB.FAVORITE]: () => {
        const FAV_LIST: any = {
          [FAVORITE_OPTION_ID.SWAP_USDT]: setSwapUsdtIds(),
          [FAVORITE_OPTION_ID.SWAP_COIN]: setSwapCoinIds(),
          [FAVORITE_OPTION_ID.SPOT]: setSpotIds(),
          [FAVORITE_OPTION_ID.LITE]: setLiteIds(),
          [FAVORITE_OPTION_ID.ETF]: setEtfIds(),
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
      },
    };
    if (TABLE_IDS_MAP.hasOwnProperty(curId)) {
      TABLE_IDS_MAP[curId]();
    }
  };
  useEffect(() => {
    getIdsCallback(marketsDetail, currentId);
  }, [marketsDetail, currentId, secondId]);

  useEffect(() => {
    //获取二三级联动币种切换的数据
    const getToggleAllSpotList = async () => {
      const group = await Group.getInstance();
      const thirdItemName = thirdItem.name;
      console.log('thirdItem.name spot', thirdItem.name, LANG('全部'));
      const ids = group.getSpotByIds(secondItemName, thirdItemName === LANG('全部') ? 'All' : thirdItemName);
      setFilterSpotIds(ids);
    };
    const getToggleAllSwapList = async () => {
      const swapMap = await TradeMap.getSwapTradeMap();
      const group = await Group.getInstance();
      const thirdItemName = thirdItem.name;
      const ids =
        [LANG('全部'), 'All'].includes(thirdItemName) || secondId === PERPETUAL_OPTION_ID.SWAP_COIN
          ? group.getSwapByIds()
          : group.getSwapByIds().filter((v) => swapMap.get(v)?.partition.includes(thirdItemName));

      setFilterSwapIds(ids);
    };
    if (currentId === CURRENT_TAB.SPOT_GOODS) {
      getToggleAllSpotList();
    }
    if (currentId === CURRENT_TAB.PERPETUAL) {
      getToggleAllSwapList();
    }
  }, [secondId, thirdId, currentId, LANG('全部')]);
  const fetchFavorsList = async () => {
    const favors = await Favors.getInstance();
    const favList = favors.getFavorsList();
    setFavorsList(favList);
  };
  useEffect(() => {
    fetchFavorsList();
  }, [currentId]);

  useEffect(() => {
    setPage(1); // 切换筛选tab时，重置分页
  }, [thirdId, secondId]);

  // 现货列表
  const getSpotList = () => {
    const { spot = [] } = list;
    const filterSpotItems = spot.filter((item) => {
      return filterSpotIds.includes(item.id);
    });
    return filterSpotItems;
  };
  // 永续列表
  const getSwapUsdtList = () => {
    const { swapUsdt = [], swapCoin = [] } = list;
    const SWAP_LIST_MAP: { [key: string]: MarketItem[] } = {
      [PERPETUAL_OPTION_ID.SWAP_USDT]: swapUsdt,
      [PERPETUAL_OPTION_ID.SWAP_COIN]: swapCoin,
    };
    let result: MarketItem[] = [];
    if (SWAP_LIST_MAP.hasOwnProperty(secondId)) {
      result = SWAP_LIST_MAP[secondId];
    }
    const filterSwapItems = result.filter((item) => {
      return filterSwapIds.includes(item.id);
    });
    return filterSwapItems;
  };
  // 简单合约
  const getLiteList = () => {
    const { lite = [] } = list;
    const { mainListIds, liteOrderListIds, liteInnovateListIds } = liteList;
    const mainList = lite.filter((item) => {
      return mainListIds.includes(item.id);
    });
    const liteOrderList = lite.filter((item) => {
      return liteOrderListIds.includes(item.id);
    });
    const liteInnovateList = lite.filter((item) => {
      return liteInnovateListIds.includes(item.id);
    });
    const LIST_MAP: { [key: string]: MarketItem[] } = {
      [LITE_OPTION_ID.ALL]: lite,
      [LITE_OPTION_ID.MAIN_STREAM]: mainList,
      [LITE_OPTION_ID.CREATIVE_AREA]: liteInnovateList,
      [LITE_OPTION_ID.COPY_ORDER]: liteOrderList,
    };
    if (LIST_MAP.hasOwnProperty(secondId)) {
      return LIST_MAP[secondId];
    }
    return [];
  };
  // 杠杆代币
  const getLeverageList = () => {
    const { etf = [] } = list;
    return etf;
  };
  const getFilterFavorsListById = (list: ListObject[]) => {
    const FAVORS_LIST_MAP: { [key: string]: any[] } = {
      [FAVORITE_OPTION_ID.SPOT]: list.filter((item) => item.type === FAVORITE_TYPE.SPOT && item.zone !== 'LVTs'),
      [FAVORITE_OPTION_ID.ETF]: list.filter((item) => item.type === FAVORITE_TYPE.SPOT && item.zone === 'LVTs'),
      [FAVORITE_OPTION_ID.SWAP_USDT]: list.filter((item) => item.type === FAVORITE_TYPE.SWAP_USDT),
      [FAVORITE_OPTION_ID.SWAP_COIN]: list.filter((item) => item.type === FAVORITE_TYPE.SWAP_COIN),
      [FAVORITE_OPTION_ID.LITE]: list.filter((item) => item.type === FAVORITE_TYPE.LITE),
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
    favorsList?.forEach((arr1Obj) => {
      const listName = _toCamelCase(arr1Obj.type); // remove underscore for consistency
      const allListObj = list[listName];
      if (allListObj) {
        arr1Obj.list.forEach((id) => {
          const matchedObj = allListObj.find((obj) => obj.id === id);
          if (matchedObj) {
            filteredList.push({
              ...matchedObj,
              type: arr1Obj.type,
            });
          }
        });
      }
    });
    return getFilterFavorsListById(filteredList);
  };

  const getTabData = () => {
    const data: DataType[] = [];
    const TAB_DATA_MAP = {
      [CURRENT_TAB.SPOT_GOODS]: getSpotList(),
      [CURRENT_TAB.PERPETUAL]: getSwapUsdtList(),
      [CURRENT_TAB.LITE]: getLiteList(),
      [CURRENT_TAB.ETF]: getLeverageList(),
      [CURRENT_TAB.FAVORITE]: getFavoriteList(),
    };
    return TAB_DATA_MAP[currentId] || data;
  };

  function convertStringToNumber(str: string) {
    const numberString = str.replace(/[+,%]/g, '');
    const number = parseFloat(numberString);
    const ret = Number.isNaN(number) ? 0 : number;
    return ret;
  }
  // 初始加载不会执行
  const handleTableChange = (data: any[]) => {
    const sortedData = [...data];
    const getSortItemCoinName = (a: any, b: any) => {
      const coinNameA = getCoinName({
        coin: formatCoinName(a.name),
        quoteCoin: a.quoteCoin,
        name: a.name,
      });
      const coinNameB = getCoinName({
        coin: formatCoinName(b.name),
        quoteCoin: b.quoteCoin,
        name: b.name,
      });
      return {
        coinNameA,
        coinNameB,
      };
    };
    if (order === 'ascend') {
      if (columnKey === 'coinName') {
        sortedData.sort((a: any, b: any) => {
          const { coinNameA, coinNameB } = getSortItemCoinName(a, b);
          return coinNameA.localeCompare(coinNameB);
        });
      } else {
        sortedData.sort((a: any, b: any) => {
          return convertStringToNumber(a[columnKey]) - convertStringToNumber(b[columnKey]);
        });
      }
    } else if (order === 'descend') {
      if (columnKey === 'coinName') {
        sortedData.sort((a: any, b: any) => {
          const { coinNameA, coinNameB } = getSortItemCoinName(a, b);
          return coinNameB.localeCompare(coinNameA);
        });
      } else {
        sortedData.sort((a: any, b: any) => {
          return convertStringToNumber(b[columnKey]) - convertStringToNumber(a[columnKey]);
        });
      }
    }
    setTableData(sortedData);
  };
  const marketList = getTabData();
  useEffect(() => {
    // 处理搜索
    const filterData = marketList.filter((item: ListObject) => {
      return item.id.includes(searchValue) || item.name.includes(searchValue);
    });
    setDataSource(filterData);
  }, [searchValue, currentId, secondId, thirdItem.id, list, favorsList]);

  useEffect(() => {
    if (columnKey && order) {
      frameRun(() => handleTableChange(dataSource));
    } else {
      const isEtf = currentId === CURRENT_TAB.ETF || thirdItem.name === 'LVTs';
      if (currentId === CURRENT_TAB.SPOT_GOODS) {
        frameRun(() => setTableData(dataSource));
      } else {
        frameRun(() => setTableData(sortCoinItem(dataSource, isEtf)));
      }
    }
  }, [dataSource, columnKey]);

  const getCoinName = ({ coin, quoteCoin, name }: { coin: string; quoteCoin: string; name: string }) => {
    if (currentId === CURRENT_TAB.SPOT_GOODS || currentId === CURRENT_TAB.ETF) {
      return coin + '/' + quoteCoin;
    }
    return name;
  };

  const onFavorite = useCallback((latestFavorsList: FAVORS_LIST[]) => {
    setFavorsList(latestFavorsList);
    getFavoriteList();
  }, []);
  const columns = useColumns(onFavorite);

  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    frameRun(() => setMarketDetail(detail));
  });
  const handleRowClick = (record: any) => {
    // 点击行时跳转到另一个页面
    const { href, query } = getHrefAndQuery(record.id);
    router.push({ pathname: href, query });
  };
  const handlePaginationChange = () => {
    // 切换分页时滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePageChange = (pag: number) => {
    setPage(pag);
    handlePaginationChange();
  };
  useEffect(() => {
    if (tableData.length) {
      setMarketsData(tableData);
    }
  }, [tableData, secondId]);

  const MARKETS_TABLE_CONTAINER = (
    <div className='markets-table-container'>
      <Table
        columns={columns}
        className='market-table'
        dataSource={marketsLocalData}
        rowKey={(record: any) => record.id}
        style={{ tableLayout: 'fixed' }}
        showSorterTooltip={false}
        onRow={(record: any) => {
          return {
            onClick: () => handleRowClick(record),
          };
        }}
        onChange={(pagination: any, filters: any, sorter: any) => {
          setKey(sorter.columnKey);
          setOrder(sorter.order);
        }}
        pagination={{ pageSize: 30, current: page, onChange: handlePageChange, showQuickJumper: false }}
      />
      <style jsx>{styles}</style>
    </div>
  );
  return currentId === CURRENT_TAB.FAVORITE && !tableData.length && !searchValue ? (
    <Wait2AddFavorsList onAddAllCallback={fetchFavorsList} />
  ) : (
    MARKETS_TABLE_CONTAINER
  );
};
export default MarketTable;

const styles = css`
  .markets-table-container {
    overflow-x: auto;
    height: 100%;
    :global(.market-table) {
      :global(.ant-table-cell) {
        font-weight: 500;
        :global(.sub-price) {
          font-size: 12px;
          color: var(--theme-font-color-3);
        }
        @media ${MediaInfo.mobile} {
          padding-right: 0;
          padding-left: 0;
        }
      }
      :global(.ant-table-column-title) {
        font-size: 13px;
      }
      :global(.ant-table-container table) {
        min-width: var(--const-max-page-width) !important;
        @media ${MediaInfo.mobile} {
          min-width: 100% !important;
        }
      }
    }
    :global(.trade_pair) {
      display: flex;
      align-items: center;
      :global(.coin-logo-wrapper) {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        margin-left: 10px;
      }
      :global(.right-coin) {
        display: flex;
        flex-direction: column;
        :global(.full-name) {
          font-size: 12px;
          color: var(--theme-font-color-3);
        }
        :global(.trade_pair_name) {
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
        }
      }
    }
    :global(.highest-price) {
      color: var(--theme-font-color-1);
      font-weight: 500;
      font-size: 14px;
    }
    :global(.action-btn-area) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      :global(.trade) {
        color: var(--theme-font-color-1);
        font-size: 14px;
        border: 1px solid var(--theme-border-color-2);
        font-weight: 500;
        padding: 7px 16px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 111;
        display: flex;
        min-width: 70px;
        justify-content: center;
        align-items: center;
        display: inline-block;
        margin-left: 10px;
      }
    }

    :global(.change-rate) {
      font-size: 14px;
      font-weight: 500;
    }
    :global(.latest-price) {
      font-size: 14px;
      font-weight: 500;
      @media ${MediaInfo.mobile} {
        font-size: 16px;
        font-weight: 500;
      }
    }
    :global(.bottom-pagination) {
      padding: 15px 0;
    }
    :global(.common-table .ant-table-column-sorters) {
      justify-content: flex-start;
      :global(.ant-table-column-title) {
        flex: none;
      }
    }
    :global(.ant-table) {
      table-layout: fixed !important;
    }
    :global(.ant-table-container .ant-table-content .ant-table-tbody .ant-table-row) {
      &:hover {
        :global(.trade) {
          background-color: var(--skin-primary-color);
          color: var(--skin-font-color);
        }
      }
    }
  }
`;
