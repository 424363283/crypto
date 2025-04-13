import MiniChart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import { Mobile } from '@/components/responsive';
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
import { DEFAULT_ORDER, FAVORITE_TYPE, FAVORS_LIST, Favors, Group, MarketItem, Markets } from '@/core/shared';
import { Wait2AddFavorsList } from '@/pages/[locale]/markets/components/markets-view/favors-list';
import { CURRENT_TAB, store } from '@/pages/[locale]/markets/store';
import MarketTable from '@/pages/[locale]/markets/components/markets-view/table';
import MiddleOption from '@/pages/[locale]/markets/components/markets-view/components/middle-option';
import TopOptions from '@/pages/[locale]/markets/components/markets-view/components/top-option';
import { FAVORITE_OPTION_ID } from '@/pages/[locale]/markets/types';
import { useCascadeOptions } from '@/pages/[locale]/markets/components/hooks';
import { EmptyComponent } from '@/components/empty';
import { isLite } from '@/core/utils';
import { useResponsive } from '@/core/hooks';
import { Svg } from '@/components/svg';

export default function MarketsComponent() {
  const { isMobile } = useResponsive();
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const ids = useRef<{ [key: string]: string[] }>();
  const config = useCascadeOptions();
  const { secondItem, thirdItem, currentId, searchValue } = store;
  const { id: secondId, name: secondItemName } = secondItem;
  const { id: thirdId } = thirdItem;
  const [tab] = useState<string>('spot');
  const router = useRouter();
  const { getHrefAndQuery } = useTradeHrefData();
  const [miniChartData, setMiniChartData] = useState<any>({});
  const [list, setList] = useState<{ [key: string]: MarketItem[] }>({});
  const sortLiteCoins = (data: string[]): string[] => {
    const sorts = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'DOTUSDT', 'TRXUSDT', 'UNIUSDT'];
    const sortData = sorts.map(id => data.find(item => new RegExp(`^${id}`).test(item))).filter(v => v);
    return sortData.slice(0, 6) as string[];
  };

  const [favorsList, setFavorsList] = useState<FAVORS_LIST[]>([]);

  useEffect(() => {
    ids.current = undefined; // 清空 ids.current
    // if (tab === 'swapFavorIds') {
    //   store.currentId = CURRENT_TAB.FAVORITE;
    //   // store.secondItem.id = '1-1';
    //   // store.secondItem.name = '币币';
    //   store.secondItem.id = '1-2';
    //   store.secondItem.name = '合约';
    // }
  }, [currentId]);
  // console.log("tab",tab)

  const getIdsCallback = useCallback(async () => {
    const group = await Group.getInstance();
    const favors = await Favors.getInstance();
    // const spotIds = group.getSpotCoinIds('USDT');
    const spotIds = group.getHotSpotCoinIds();
    const swapUsdtIds = group.getHotSwapUsdtIds();
    const swapCoinIds = group.getSwapCoinIds();
    const liteIds = group.getLiteQuoteIds;
    const etfIds = group.getSpotEtfIds();
    const sortSpotIds = spotIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const sortSwapUsdtIds = swapUsdtIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const sortSwapCoinIds = swapCoinIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const sortLiteIds = sortLiteCoins(liteIds);
    const sortEtfIds = etfIds.sort(sortCoinBySpecificRank).slice(0, 6);
    // const all = [...sortSpotIds, ...sortSwapUsdtIds, ...sortSwapCoinIds, ...sortLiteIds, ...sortEtfIds];
    const swapFavorIds = favors.getSwapFavorsList()?.slice(0, 8); // 合约自选
    const spotFavorIds = favors.getSpotAndEtfFavorsList()?.slice(0, 8); // 币币自选
    const liteFavorIds = favors
      .getLiteFavorsList()
      ?.slice(0, 8)
      .map(id => group.getLiteQuoteCode(id)); // 简易合约自选
    const all = [
      ...sortSpotIds,
      ...sortSwapUsdtIds,
      ...sortSwapCoinIds,
      ...sortLiteIds,
      ...sortEtfIds,
      ...swapFavorIds,
      ...spotFavorIds,
      ...liteFavorIds
    ];

    ids.current = {
      spotIds: sortSpotIds,
      swapUsdtIds: sortSwapUsdtIds,
      swapCoinIds: sortSwapCoinIds,
      liteIds: sortLiteIds,
      etfIds: sortEtfIds,
      swapFavorIds,
      spotFavorIds,
      liteFavorIds,
      all
    };
    return ids.current;
  }, [currentId, secondId, favorsList]);

  useEffect(() => {
    const list = ids.current ?? {};
    for (let item of favorsList) {
      if (item.type === 'spot') {
        list.spotFavorIds = item.list;
      } else if (item.type === 'swap_usdt') {
        list.swapFavorIds = item.list;
      }
    }
  }, [favorsList]);

  // mini k线图数据
  useEffect(() => {
    if (ids.current) {
      const nowTime = Date.parse(String(new Date())) / 1000;
      // const oldTime = currentId === CURRENT_TAB.SPOT_GOODS ? 1800 : 60 * 60 * 24 * 15; // 10
      const oldTime = 1800; // 30 min
      const _ids = ids.current.all.join(',');
      if (_ids.length === 0) return;
      getTradeHistoryKlineApi(_ids, nowTime - oldTime, nowTime, 1).then(({ data }: any) => {
        if (data) {
          const _data: any = {};
          Object.entries(data || {}).map(([key, value]) => (_data[key] = (value as any).slice(-30)));
          setMiniChartData(_data);
        }
      });
    }
  }, [ids.current]);

  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
    // const isLoading = detail?.loading || false;
    // if (!isLoading) {
    //   Loading.end();
    // } else {
    //   Loading.start();
    // }

    const { secondItem, thirdItem, currentId, searchValue } = store;
    const { id: secondId, name: secondItemName } = secondItem;
    const { spotIds, swapUsdtIds, swapCoinIds, liteIds, etfIds, swapFavorIds, spotFavorIds, liteFavorIds } =
      await getIdsCallback();

    // console.log("获取收藏",swapFavorIds)

    setList({
      [FAVORITE_OPTION_ID.SPOT]: Markets.getMarketList(detail, spotFavorIds),
      [FAVORITE_OPTION_ID.SWAP_USDT]: Markets.getMarketList(detail, swapFavorIds),
      [FAVORITE_OPTION_ID.LITE]: Markets.getMarketList(detail, liteFavorIds),
      [CURRENT_TAB.SPOT_GOODS]: Markets.getMarketList(detail, spotIds),
      [CURRENT_TAB.PERPETUAL]: Markets.getMarketList(detail, swapUsdtIds),
      [CURRENT_TAB.LITE]: Markets.getMarketList(detail, liteIds),
      [CURRENT_TAB.ETF]: Markets.getMarketList(detail, etfIds)

      // spot: Markets.getMarketList(detail, spotIds),
      // swapFavorIds: Markets.getMarketList(detail, swapFavorIds),
      // spotFavorIds: Markets.getMarketList(detail, spotFavorIds),
      // swapUsdt: Markets.getMarketList(detail, swapUsdtIds),
      // swapCoin: Markets.getMarketList(detail, swapCoinIds),
      // lite: Markets.getMarketList(detail, liteIds),
      // etf: Markets.getMarketList(detail, etfIds),
    });
  });

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
  const resultList = useMemo(() => {
    let key: CURRENT_TAB | FAVORITE_OPTION_ID | string = currentId;
    if (currentId === CURRENT_TAB.FAVORITE) {
      key = secondId;
    }
    if (!list[key]) {
      return [];
    }
    let result = list[key];
    if (searchKey) {
      result = list[key].filter(item => {
        const lowerCaseSearchKey = searchKey.toLowerCase(); // 转为小写
        return (
          item.name.toLowerCase().indexOf(lowerCaseSearchKey) !== -1 ||
          item.fullName.toLowerCase().indexOf(lowerCaseSearchKey) !== -1 ||
          item.fullName.toLowerCase().indexOf(lowerCaseSearchKey) !== -1
        );
      });
    }

    if (sortDirection) {
      result = [...result].sort((a, b) => {
        const rateA = parseFloat(a.rate);
        const rateB = parseFloat(b.rate);
        return sortDirection === 'desc' ? rateB - rateA : rateA - rateB;
      });
    }

    return result;
  }, [searchKey, secondId, list, sortDirection]);

  const callback = useCallback(({ detail }: any) => {
    store.marketDetailList = detail;
  }, []);
  useEffect(() => {
    window.addEventListener(SUBSCRIBE_TYPES.ws3001, callback);
    return () => window.removeEventListener(SUBSCRIBE_TYPES.ws3001, callback);
  }, []);
  const fetchFavorsList = async () => {
    const favors = await Favors.getInstance();
    if (favors) {
      const favList = favors.getFavorsList();
      setFavorsList(favList);
    } else {
      setFavorsList([]);
    }
  };

  return (
    <MoreBtnMemo>
      <div className="filter-options">
        <Tabs onSearch={val => setSearchKey(val)} />
        {config.secondOptions.length > 1 && <MiddleOption />}
      </div>
      {store.currentId === CURRENT_TAB.FAVORITE && !resultList.length && !searchKey ? (
        <Wait2AddFavorsList onAddAllCallback={fetchFavorsList} />
      ) : (
        <div className={clsx('table')}>
          <ul className="thead row">
            <li>{LANG('币对')}</li>
            {isMobile ? (
              <>
                <li
                  onClick={() => {
                    setSortDirection(prev => {
                      if (prev === null) return 'desc';
                      if (prev === 'desc') return 'asc';

                      return null;
                    });
                  }}
                  className="sort"
                >
                  {LANG('最新价')}/{LANG('24H涨跌幅')}
                  <div className="sort-icons">
                    <Svg
                      src="/static/images/common/sort_up.svg"
                      width={10}
                      height={10}
                      className={clsx('up', sortDirection === 'asc' && 'selected')}
                    />
                    <Svg
                      src="/static/images/common/sort_up.svg"
                      width={10}
                      height={10}
                      className={clsx('down', sortDirection === 'desc' && 'selected')}
                    />
                  </div>
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
                        <CoinLogo width="32" height="32" className="icon" coin={item.coin} />
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
          {resultList.length > 0 ? (
            <TrLink href="/markets" className={clsx('view-more')}>
              {LANG('查看更多')}
              <YIcon.moreIcon />
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
      padding: 20px 0;
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
          background: var(--hover);
          color: var(--text-white);
        }
      }
    }
    li.row:hover {
      background: var(--fill-2);
      :global(.trade-btn-2) {
        &:hover {
          background: var(--hover);
          color: var(--text-white);
        }
      }
    }
    .tbody {
      margin: 0;
      padding: 0;
      min-height: 300px;
      .market_item {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        flex: 1;
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
          color: var(--text-primary);

          @media ${MediaInfo.mobile} {
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            align-items: flex-end;
          }
        }
        .name {
          display: flex;
          font-weight: 700;
          align-items: center;
          :global(.icon) {
            width: 26px !important;
            height: 26px;
            border-radius: 50%;
            margin-right: 10px;
          }
          span {
            font-weight: 500;
            color: var(--theme-font-color-2);
          }
          .coin_symbol {
            color: var(--text-primary);
            font-size: 16px;
            font-weight: 700;
          }
          .coin_alias {
            color: var(--text-primary);
            font-size: 16px;
            font-weight: 500;
          }
          .n-type {
            color: var(--theme-font-color-2);
            text-align: left;
          }
        }
      }
    }
    .thead {
      padding: 0;
    }
    .thead {
      li {
        color: var(--text-tertiary);
      }
    }
    .thead,
    :global(.market_item) {
      li {
        font-size: 16px;
        font-weight: 500;
      }
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
      }
    }
    :global(.view-more) {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 0 20px;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
      color: var(--text-tertiary);
    }
  }
  .sort {
    display: flex;
    align-items: center;
    flex-direction: row;
    :global(.svg) {
      display: inline-flex !important;
      :global(svg) {
        fill: var(--text-tertiary);
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
