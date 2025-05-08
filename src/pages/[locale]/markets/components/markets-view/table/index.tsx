import Table from '@/components/table';
import { useIndexedDB, useRouter } from '@/core/hooks';
import { LANG, useTradeHrefData } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { FAVORITE_TYPE, FAVORS_LIST, Favors, Group, MarketItem, Markets, MarketsMap, TradeMap } from '@/core/shared';
import { IDB_STORE_KEYS } from '@/core/store';
import { useQuoteSearchStore } from '@/store/quote-search';
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
  SPOT_GOODS_OPTION_ID
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
  const searchTerm = useQuoteSearchStore(state => state.searchTerm);
  const [list, setList] = useImmer<{ [key: string]: MarketItem[] }>({
    spot: [],
    swapUsdt: [],
    swapCoin: [],
    lite: [],
    etf: []
  });
  const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [columnKey, setKey] = useState('');
  const [order, setOrder] = useState('');
  const [idbKey, setIdbKey] = useState<string>(IDB_STORE_KEYS.MARKETS_DATA_SWAP_FEATURE_LIST);

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
  const [marketsLocalData, setMarketsData] = useState<MarketItem[]>(tableData);
  // const [marketsLocalData, setMarketsData] = useIndexedDB(idbKey, tableData);

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
        const hotIds = group?.getHotIds();
        const spotIds = group?.getSpotIds;
        const spots = Markets.getMarketList(detail, spotIds);
        setList(draft => {
          // 创建 spots 数组的副本并排序
          const sortedSpots = [...spots].sort((a, b) => customSpotCoinSort(a, b, hotIds));
          draft.spot = sortedSpots;
        });
      }
    };
    const setSwapCoinIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_SWAP_COIN_LIST);
      const swapCoinIds = group?.getSwapCoinIds();
      setList(draft => {
        draft.swapCoin = Markets.getMarketList(detail, swapCoinIds);
      });
    };
    const setSwapUsdtIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_SWAP_FEATURE_LIST);
      const swapUsdtIds = group?.getSwapUsdtIds();
      setList(draft => {
        draft.swapUsdt = Markets.getMarketList(detail, swapUsdtIds);
      });
    };
    const setLiteIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_LITE_LIST);

      const liteIds = group?.getLiteQuoteIds;
      setList(draft => {
        draft.lite = Markets.getMarketList(detail, liteIds);
      });
    };
    const setEtfIds = () => {
      setIdbKey(IDB_STORE_KEYS.MARKETS_DATA_ETF_LIST);
      const etfIds = group?.getSpotEtfIds();
      setList(draft => {
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
          : group.getSwapByIds().filter(v => swapMap.get(v)?.partition.includes(thirdItemName));

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
    if (favors) {
      const favList = favors.getFavorsList();
      setFavorsList(favList);
    } else {
      setFavorsList([]);
    }
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
    const filterSpotItems = spot.filter(item => {
      return filterSpotIds.includes(item.id);
    });
    return filterSpotItems;
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
    return filterSwapItems;
  };
  // 简单合约
  const getLiteList = () => {
    const { lite = [] } = list;
    const { liteCryptoIds, liteDerivIds, liteUStockIds, liteHKStockIds, liteOrderListIds } = liteList;

    const liteCryptoList = lite.filter(item => {
      return liteCryptoIds.includes(item.id);
    });
    const liteDerivList = lite.filter(item => {
      return liteDerivIds.includes(item.id);
    });
    const liteUStockList = lite.filter(item => {
      return liteUStockIds.includes(item.id);
    });
    const liteHKStockList = lite.filter(item => {
      return liteHKStockIds.includes(item.id);
    });
    const liteOrderList = lite.filter(item => {
      return liteOrderListIds.includes(item.id);
    });
    const LIST_MAP: { [key: string]: MarketItem[] } = {
      [LITE_OPTION_ID.ALL]: lite,
      [LITE_OPTION_ID.CRYPTO]: liteCryptoList,
      [LITE_OPTION_ID.DERIV]: liteDerivList,
      [LITE_OPTION_ID.USTOCK]: liteUStockList,
      [LITE_OPTION_ID.HKSTOCK]: liteHKStockList,
      [LITE_OPTION_ID.COPY_ORDER]: liteOrderList
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
    return getFilterFavorsListById(filteredList);
  };

  const getTabData = () => {
    const data: DataType[] = [];
    const TAB_DATA_MAP = {
      [CURRENT_TAB.SPOT_GOODS]: getSpotList(),
      [CURRENT_TAB.PERPETUAL]: getSwapUsdtList(),
      [CURRENT_TAB.LITE]: getLiteList(),
      [CURRENT_TAB.ETF]: getLeverageList(),
      [CURRENT_TAB.FAVORITE]: getFavoriteList()
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
        name: a.name
      });
      const coinNameB = getCoinName({
        coin: formatCoinName(b.name),
        quoteCoin: b.quoteCoin,
        name: b.name
      });
      return {
        coinNameA,
        coinNameB
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
  }, [searchValue, currentId, secondId, thirdItem.id, list, favorsList, filterSpotIds, filterSwapIds]);

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
  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
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
    setMarketsData(tableData.filter(item => (searchTerm ? item.name.toUpperCase().includes(searchTerm) : true)));
    // if (searchValue || tableData.length) {
    //   setMarketsData(tableData);
    // }
  }, [tableData, secondId, searchTerm]);

  const MARKETS_TABLE_CONTAINER = (
    <div className="markets-table-container">
      <Table
        columns={columns}
        className="market-table"
        dataSource={marketsLocalData}
        rowKey={(record: any) => record.id}
        style={{ tableLayout: 'fixed' }}
        showSorterTooltip={false}
        isHistoryList
        isHeaderColumn
        sortOrder={{ columnKey, order }}
        onRow={(record: any) => {
          return {
            onClick: () => handleRowClick(record)
          };
        }}
        onChange={(pagination: any, filters: any, sorter: any) => {
          setKey(sorter.columnKey);
          setOrder(sorter.order);
        }}
        pagination={{ pageSize: 8, current: page, onChange: handlePageChange, showQuickJumper: false }}
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
    height: 100%;
    min-height: 500px;
    @media ${MediaInfo.mobile} {
      padding: 0 1.5rem;
      min-height: 0;
      :global(.ant-empty-description) {
        line-height: 14px;
      }
      :global(.bottom-pagination) {
        justify-content: center;
        padding: 0;
        :global(.ant-pagination) {
          gap: 8px;
        }
        :global(.page-button) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.25rem;
          height: 1.25rem;
          background: transparent;
          border-radius: 5px;
          font-weight: 500;
          :global(> img) {
            width: 14px;
            height: 14px;
          }
        }
        :global(.ant-pagination-item) {
          border: none;
          width: 1.25rem;
          min-width: 1.25rem;
          color: var(--text_1);
          height: 1.25rem;
          line-height: 1.25rem;
          border-radius: 50%;
          background-color: transparent;
          margin: 0;
          font-size: 12px;
          font-weight: 500;
        }
        :global(.ant-pagination-prev),
        :global(.ant-pagination-next) {
          width: 1.25rem;
          height: 1.25rem !important;
          min-width: 1.25rem;
          margin: 0;
          &:focus,
          &:hover {
          }
        }
        :global(.ant-pagination-item-link) {
          width: 1rem;
          height: 1rem !important;
          :global(.ant-pagination-item-link-icon) {
            color: var(--text_brand) !important;
            font-size: 10px;
            :global(svg) {
              width: 10px;
              height: 10px;
            }
          }
          :global(.ant-pagination-item-ellipsis) {
            border-radius: 1.25rem;
            color: var(--text_1);
            width: 1.25rem;
            height: 1.25rem;
            font-size: 10px;
          }
        }
        :global(.ant-pagination-item:hover),
        :global(.ant-pagination-item:focus),
        :global(.ant-pagination-item-active) {
          background: var(--brand);
          color: var(--text-white);
          font-weight: 500;
        }
      }
      :global(.mobile-item > div:last-child) {
        gap: 4px;
      }
    }
    :global(.market-table) {
      :global(.ant-table-cell) {
        font-weight: 400;
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
        font-size: 14px;
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
      width: 200px;
      align-items: center;
      gap: 16px;
      :global(.right-coin) {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1 0 0;
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
      gap: 8px;
    }

    :global(.change-rate) {
      font-size: 14px;
      font-weight: 500;
      @media ${MediaInfo.mobile} {
        font-size: 12px;
      }
    }
    :global(.latest-price) {
      font-size: 14px;
      font-weight: 500;
      @media ${MediaInfo.mobile} {
        // font-size: 16px;
        font-weight: 500;
        color: var(--text_1);
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
    :global(.ant-table-content, .ant-table-tbody) {
      min-height: 500px;
    }

    :global(.ant-table-container .ant-table-thead > tr > th),
    :global(.ant-table-container .ant-table-tbody > tr > td) {
      &:first-child {
        padding: 16px;
      }
      &:last-child {
        padding: 16px;
      }
    }
    :global(.ant-table-container .ant-table-content .ant-table-tbody .ant-table-row) {
      &:hover {
      }
    }
  }
`;
