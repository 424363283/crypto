import CommonIcon from '@/components/common-icon';
import { EmptyComponent } from '@/components/empty';
import { LANG, TradeLink } from '@/core/i18n';
import { DEFAULT_ORDER, Group, MarketItem, SwapTradeItem, TradeMap } from '@/core/shared';
import { LOCAL_KEY, resso, storeTradeCollapse, useResso } from '@/core/store';
import { clsx } from '@/core/utils';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListItem } from './item';
import QuoteSearch from './search';

enum SORT_TYPE {
  'NAME' = 'name',
  'PRICE' = 'price',
  'CHANGE' = 'change',
}

type ListProps = {
  data: MarketItem[];
  zone?: string;
  type?: string;
  unit?: string;
  isSwap?: boolean;
  renderSearchBottom?: () => ReactNode;
  visible?: boolean;
  onClickItem?: Function;
  toast?: boolean;
};

const store = resso<{ searchHistory: string[] }>(
  { searchHistory: [] },
  { nameSpace: LOCAL_KEY.TRADE_UI_QUOTE_LIST_LIST }
);

// 排序函数
function customSpotCoinSort(a: any, b: any, sortOrder: string[]) {
  const indexA = sortOrder.indexOf(a.id);
  const indexB = sortOrder.indexOf(b.id);

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  } else if (indexA !== -1) {
    return -1;
  } else if (indexB !== -1) {
    return 1;
  } else {
    return a.id.localeCompare(b.id);
  }
}

export const List = ({
  data = [],
  zone,
  type,
  unit,
  isSwap,
  visible = true,
  onClickItem,
  toast,
  renderSearchBottom,
}: ListProps) => {
  const [sort, setSort] = useState<{ [key: string]: 1 | -1 }>({});
  const [scrollKey, setScrollKey] = useState(() => +new Date());
  const [search, setSearch] = useState('');
  const [liteHotIds, setLiteHotIds] = useState<string[]>([]);
  const [hotIds, setHotIds] = useState<string[]>([]);
  const [newIds, setNewIds] = useState<string[]>([]);
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const _ = useRef<any>({ searchFocus: false, searchFocusTimer: null });

  const { searchHistory: _searchHistory } = useResso(store);
  const searchHistory = _searchHistory.filter((v) => data.find((i) => i.id === v));
  const searchHistoryData = data.filter((v) => searchHistory.includes(v.id));
  const [isScroll, setIsScroll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [swapTradeMap, setSwapTradeMap] = useState<Map<string, SwapTradeItem> | undefined>();

  useEffect(() => {
    isSwap &&
      TradeMap.getSwapTradeMap().then((data) => {
        if (data) {
          setSwapTradeMap(data);
        }
      });
  }, [isSwap]);

  const clickSort = useCallback(
    (type: SORT_TYPE) => {
      if (!sort[type]) setSort({ [type]: 1 });
      if (sort[type] === 1) setSort({ [type]: -1 });
      if (sort[type] === -1) setSort({});
    },
    [sort]
  );

  // 获取新币热币 ids
  const getIds = async () => {
    const group = await Group.getInstance();
    const hot_ids = group.getHotIds();
    const new_ids = group.getNewIds();
    setHotIds(hot_ids);
    setNewIds(new_ids);
    setLiteHotIds(hot_ids.filter((key) => !/-|_/.test(key)));
  };

  useEffect(() => {
    getIds();
    const handleScroll = () => setIsScroll(true);
    listRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      listRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sortData = useCallback(
    (data: MarketItem[]) => {
      if (zone && zone !== 'All') {
        if (isSwap) {
          data = data.filter((v) => swapTradeMap?.get(v.id)?.partition.includes(zone));
        } else {
          data = data.filter((item) => item.zone?.includes(zone));
        }

        let lvtsList: MarketItem[] = [];
        // LVTs固定排序
        if (zone === 'LVTs') {
          DEFAULT_ORDER.forEach((key) => {
            const findRes = data.find((item) => item?.coin === key);
            findRes && lvtsList.push(findRes);
          });
          data = [...new Set(lvtsList.concat(data))];
        }
      }

      // All 固定排序
      if (zone === 'All') {
        data = data.sort((a, b) => customSpotCoinSort(a, b, hotIds));
      }

      let hotList: MarketItem[] = [];
      liteHotIds.forEach((key) => {
        const findRes = data.find((item) => item?.id === key);
        findRes && hotList.push(findRes);
      });

      data = [...new Set(hotList.concat(data))];

      if (type) {
        data = data.filter((item) => item.type?.includes(type));
      }
      if (unit) {
        data = data.filter((item) => item.unit?.includes(unit));
      }
      if (search) {
        data = data.filter((item) => (!isSwap ? item.coin : item.name)?.includes(search));
      }
      if (sort[SORT_TYPE.NAME]) {
        data.sort((a, b) => {
          if (sort[SORT_TYPE.NAME] === 1) return a.name.localeCompare(b.name);
          if (sort[SORT_TYPE.NAME] === -1) return b.name.localeCompare(a.name);
          return 0;
        });
      }

      if (sort[SORT_TYPE.PRICE]) {
        data.sort((a, b) => {
          if (!+a.price) return 1;
          if (!+b.price) return -1;
          if (sort[SORT_TYPE.PRICE] === 1) return +a.price - +b.price;
          if (sort[SORT_TYPE.PRICE] === -1) return +b.price - +a.price;
          return 0;
        });
      }

      if (sort[SORT_TYPE.CHANGE]) {
        data.sort((a, b) => {
          if (!+a.rate) return 1;
          if (!+b.rate) return -1;
          if (sort[SORT_TYPE.CHANGE] === 1) return +a.rate - +b.rate;
          if (sort[SORT_TYPE.CHANGE] === -1) return +b.rate - +a.rate;
          return 0;
        });
      }
      return data;
    },
    [sort, zone, type, unit, search, liteHotIds, swapTradeMap]
  );

  const onChange = useCallback((value: string) => setSearch(value), []);

  const TitleMemo = useMemo(() => {
    return (
      <>
        <div className='title'>
          <div className='title-item' onClick={clickSort.bind(this, SORT_TYPE.NAME)}>
            {LANG('名称')}
            <span>
              <CommonIcon
                className='up'
                name={sort[SORT_TYPE.NAME] === 1 ? 'common-sort-up-active-0' : 'common-sort-up-0'}
                width={5}
                height={5}
                enableSkin
              />
              <CommonIcon
                name={sort[SORT_TYPE.NAME] === -1 ? 'common-sort-down-active-0' : 'common-sort-down-0'}
                width={5}
                height={5}
                enableSkin
              />
            </span>
          </div>
          <div className='title-item' onClick={clickSort.bind(this, SORT_TYPE.PRICE)}>
            <span>
              <CommonIcon
                className='up'
                name={sort[SORT_TYPE.PRICE] === 1 ? 'common-sort-up-active-0' : 'common-sort-up-0'}
                width={5}
                height={5}
                enableSkin
              />
              <CommonIcon
                name={sort[SORT_TYPE.PRICE] === -1 ? 'common-sort-down-active-0' : 'common-sort-down-0'}
                width={5}
                height={5}
                enableSkin
              />
            </span>
            {LANG('最新价')}
          </div>
          <div className='title-item' onClick={clickSort.bind(this, SORT_TYPE.CHANGE)}>
            <span>
              <CommonIcon
                className='up'
                name={sort[SORT_TYPE.CHANGE] === 1 ? 'common-sort-up-active-0' : 'common-sort-up-0'}
                width={5}
                height={5}
                enableSkin
              />
              <CommonIcon
                name={sort[SORT_TYPE.CHANGE] === -1 ? 'common-sort-down-active-0' : 'common-sort-down-0'}
                width={5}
                height={5}
                enableSkin
              />
            </span>
            {LANG('涨跌幅')}
          </div>
        </div>
        <style jsx>{`
          .title {
            display: flex;
            height: 30px;
            display: flex;
            align-items: center;
            font-size: 12px;
            white-space: nowrap;
            > div {
              color: var(--theme-font-color-2);
              cursor: pointer;
              display: flex;
              align-items: center;
              user-select: none;
              span {
                display: flex;
                flex-direction: column;
                margin-left: 2px;
                :global(.up) {
                  margin-bottom: 2px;
                }
              }
            }
            > div:nth-child(1) {
              padding-left: 10px;
              width: 140px;
            }
            > div:nth-child(2) {
              padding-right: 20px;
              flex-flow: row-reverse;
            }
            > div:nth-child(3) {
              padding-right: 10px;
              flex-flow: row-reverse;
              flex: 1;
            }
          }
        `}</style>
      </>
    );
  }, [sort]);

  const isLite = window.location?.pathname.indexOf('lite') > -1;
  const collapse = isLite ? !storeTradeCollapse.lite : !storeTradeCollapse.spot;

  useEffect(() => {
    if (visible) {
      onChange('');
      setScrollKey(+new Date());
    }
  }, [visible]);
  return (
    <>
      <div className='quote-wrapper'>
        <QuoteSearch
          onChange={onChange}
          value={search}
          onFocus={() => {
            clearTimeout(_.current.searchFocusTimer);
            _.current.searchFocus = true;
            setSearchFocus(true);
          }}
          onBlur={() => {
            _.current.searchFocus = false;
            // setSearchFocus(false);
            _.current.searchFocusTimer = setTimeout(() => {
              if (!_.current.searchFocus) setSearchFocus(false);
            }, 200);
          }}
        />
      </div>
      {renderSearchBottom?.()}
      {toast && searchFocus && search.length === 0 ? (
        <div key={scrollKey} className={clsx('scroll-list', 'hide-scroll-bar')}>
          {searchHistory.length > 0 && (
            <div className='history-list'>
              <div className='header'>
                {LANG('搜索历史')}
                <div
                  className='icon'
                  onClick={() => {
                    store.searchHistory = [];
                  }}
                >
                  <CommonIcon name='common-delete-0' size={16} />
                </div>
              </div>
              <div className='grid'>
                {searchHistoryData.map((v) => (
                  <TradeLink id={v.id} key={v.id} onClick={() => onClickItem?.(v)}>
                    {v.name}
                  </TradeLink>
                ))}
              </div>
            </div>
          )}
          <div className='hot-list'>
            <div className='header'>{LANG('热门搜索')}</div>
            <div className='grid'>
              {data
                .filter((v) => hotIds.includes(v.id))
                .map((item, index) => {
                  if (index > 50 && !isScroll) return null;
                  return (
                    <ListItem
                      renderStar={() => <div style={{ marginRight: 3 }}>{`${index + 1}.`}</div>}
                      onClick={() => {
                        // const history = store.searchHistory;
                        // if (!history.includes(item.id)) store.searchHistory = [...history, item.id];
                        onClickItem?.(item);
                      }}
                      item={{ ...item }}
                      key={item.id}
                      isHot={hotIds.includes(item.id)}
                      isNew={newIds.includes(item.id)}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {TitleMemo}
          <div className='list' ref={listRef}>
            {sortData(data).map((item: MarketItem, index) => {
              if (index > 50 && !isScroll) return null;
              return (
                <ListItem
                  onClick={() => {
                    const history = store.searchHistory;
                    if (!history.includes(item.id)) store.searchHistory = [...history, item.id];
                    onClickItem?.(item);
                  }}
                  item={{ ...item }}
                  key={item.id}
                  isHot={hotIds.includes(item.id)}
                  isNew={newIds.includes(item.id)}
                />
              );
            })}
            {sortData(data).length === 0 && (
              <div className='empty-wrapper'>
                <EmptyComponent text={LANG('暂无商品')} active />
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .quote-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          padding-bottom: 3px;
          :global(.search-wrap) {
            flex: 1;
          }
        }
        .list {
          display: flex;
          flex-direction: column;
          overflow: auto;
          flex: 1;
          content-visibility: auto;
          .empty-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
          }
        }
        .scroll-list {
          display: flex;
          flex-direction: column;
          overflow: auto;
          flex: 1;
        }
        .hot-list {
          color: var(--theme-trade-text-color-1);
          .header {
            padding-top: 20px;
            padding-bottom: 10px;
            font-size: 12px;
            padding-left: 10px;
            padding-right: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
        .history-list {
          color: var(--theme-trade-text-color-1);
          .header {
            padding-top: 12px;
            padding-bottom: 7px;
            font-size: 12px;
            padding-left: 10px;
            padding-right: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .icon {
              cursor: pointer;
            }
          }
          .grid {
            padding-left: 10px;
            padding-right: 10px;
            display: flex;
            flex-wrap: wrap;

            :global(a) {
              display: block;
              width: 33.33%;
              font-size: 13px;
              color: var(--theme-trade-text-color-3) !important;
            }
            :global(> *) {
              line-height: 27px;

              &:nth-child(3n-1) {
                text-align: center;
              }
              &:nth-child(3n) {
                text-align: right;
              }
            }
          }
        }
      `}</style>
    </>
  );
};
