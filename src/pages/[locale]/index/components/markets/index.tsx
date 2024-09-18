import MiniChart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import { Mobile } from '@/components/responsive';
import { getTradeHistoryKlineApi } from '@/core/api';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { useRouter } from '@/core/hooks/src/use-router';
import { useTradeHrefData } from '@/core/i18n/src/components/trade-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Group, MarketItem, Markets } from '@/core/shared';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import { sortCoinBySpecificRank } from '@/core/utils/src/sort';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import MoreBtnMemo from './more-btn';
import Tabs from './tabs';
import TradeBtn from './trade-btn';

export default function MarketsComponent() {
  const ids = useRef<{ [key: string]: string[] }>();
  const [tab, setTab] = useState<string>('spot');
  const router = useRouter();
  const { getHrefAndQuery } = useTradeHrefData();
  const [miniChartData, setMiniChartData] = useState<any>({});
  const [list, setList] = useState<{ [key: string]: MarketItem[] }>({});
  const sortLiteCoins = (data: string[]): string[] => {
    const sorts = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'DOTUSDT', 'TRXUSDT', 'UNIUSDT'];
    const sortData = sorts.map((id) => data.find((item) => new RegExp(`^${id}`).test(item))).filter((v) => v);
    return sortData.slice(0, 6) as string[];
  };
  const getIdsCallback = useCallback(async () => {
    if (ids.current) return ids.current;
    const group = await Group.getInstance();
    const spotIds = group.getSpotCoinIds('USDT');
    const swapUsdtIds = group.getSwapUsdtIds();
    const swapCoinIds = group.getSwapCoinIds();
    const liteIds = group.getLiteIds;
    const etfIds = group.getSpotEtfIds();
    const sortSpotIds = spotIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const sortSwapUsdtIds = swapUsdtIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const sortSwapCoinIds = swapCoinIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const sortLiteIds = sortLiteCoins(liteIds);
    const sortEtfIds = etfIds.sort(sortCoinBySpecificRank).slice(0, 6);
    const all = [...sortSpotIds, ...sortSwapUsdtIds, ...sortSwapCoinIds, ...sortLiteIds, ...sortEtfIds];
    ids.current = {
      spotIds: sortSpotIds,
      swapUsdtIds: sortSwapUsdtIds,
      swapCoinIds: sortSwapCoinIds,
      liteIds: sortLiteIds,
      etfIds: sortEtfIds,
      all,
    };
    return ids.current;
  }, []);

  // mini k线图数据
  useEffect(() => {
    if (ids.current) {
      const nowTime = Date.parse(String(new Date())) / 1000;
      const oldTime = tab === 'spot' ? 1800 : 60 * 60 * 24 * 15; // 10
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
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    // const isLoading = detail?.loading || false;
    // if (!isLoading) {
    //   Loading.end();
    // } else {
    //   Loading.start();
    // }
    const { spotIds, swapUsdtIds, swapCoinIds, liteIds, etfIds } = await getIdsCallback();
    setList({
      spot: Markets.getMarketList(detail, spotIds),
      swapUsdt: Markets.getMarketList(detail, swapUsdtIds),
      swapCoin: Markets.getMarketList(detail, swapCoinIds),
      lite: Markets.getMarketList(detail, liteIds),
      etf: Markets.getMarketList(detail, etfIds),
    });
  });
  const handelCurrentTab = useCallback((tab: string) => {
    setTab(tab);
  }, []);

  const { setResponsiveClsx } = useResponsiveClsx();
  const tabs: any = {
    spot: LANG('现货'),
    swapUsdt: LANG('U本位合约'),
    swapCoin: LANG('币本位合约'),
    lite: LANG('简易合约'),
    etf: LANG('杠杆代币'),
  };

  const _goToTrade = (id: string) => {
    const { href, query }: any = getHrefAndQuery(id.toUpperCase());
    router.push({
      pathname: href,
      query,
    });
  };

  return (
    <MoreBtnMemo tab={tab}>
      <Tabs tab={tab} setTab={handelCurrentTab} />
      <div className={clsx('table', setResponsiveClsx('t-pc', 't-pad', 't-phone'))}>
        <ul className='thead row'>
          <li>{LANG('名称')}</li>
          <li>{LANG('价格')}</li>
          <li>{LANG('24H涨跌幅')}</li>
          <li>{LANG('K线图')}</li>
          <li>{LANG('操作')}</li>
        </ul>
        <ul className='tbody'>
          {list[tab]?.map((item: MarketItem, key: number) => {
            const chartData = miniChartData[item.id] || [];
            const DIRECTION_ICON = item.isUp
              ? '/static/images/common/up-green-icon.png'
              : '/static/images/common/down-red-icon.png';
            return (
              <li className='row' key={key} onClick={() => _goToTrade(item.id)}>
                <ul className='market_item'>
                  <li className='name'>
                    <CoinLogo width='26' height='26' className='icon' coin={item.coin} />
                    <div>
                      {['spot', 'etf'].includes(tab) ? (
                        <>
                          <span className='coin_alias'>{item.coin}/</span>
                          <span>{item.quoteCoin}</span>
                        </>
                      ) : (
                        <span className='coin_alias'>{item.name}</span>
                      )}
                      <Mobile>
                        <div className='n-type'>{tabs[tab]}</div>
                      </Mobile>
                    </div>
                  </li>
                  <li className='price'>
                    {item.price.toFormat(item.digit)}
                    <Mobile>
                      <div className={clsx('rate', item.isUp ? 'green' : 'red')}>
                        {item.rate}%
                        <Image alt='up icon' src={DIRECTION_ICON} width='24' height='24' />
                      </div>
                    </Mobile>
                  </li>
                  <li className={clsx('rate', item.isUp ? 'green' : 'red')}>
                    {item.rate}%
                    <Image alt='down icon' src={DIRECTION_ICON} width='24' height='24' />
                  </li>
                  <li>
                    <MiniChart
                      symbol={item.id}
                      data={chartData}
                      showLine={false}
                      style={{ width: 75, height: 28 }}
                      lineWidth={1.5}
                      areaColor={item?.isUp ? 'var(--color-green)' : 'var(--color-red)'}
                      lineColor={item?.isUp ? 'var(--color-green)' : 'var(--color-red)'}
                      areaColorOpacity={50}
                    />
                  </li>
                  <TradeBtn coin={item.coin} id={item.id} tab={tab} />
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <style jsx>{style}</style>
    </MoreBtnMemo>
  );
}

const style = css`
  .table {
    .row {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 16px;
      text-align: left;
    }
    li.row:hover {
      background: var(--theme-background-color-8);
      border-radius: 8px;
      :global(.trade-btn-1) {
        background: var(--theme-sub-button-bg-1);
        border-color: transparent !important;
      }
      :global(.trade-btn-2) {
        background: var(--skin-primary-color);
        color: var(--skin-font-color);
        border-color: transparent !important;
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
        .rate {
          display: flex;
          align-items: center;
        }
        :global(a) {
          &:nth-child(2) {
            margin-left: 10px;
          }
        }

        .green {
          color: var(--color-green);
        }
        .red {
          color: var(--color-red);
        }
        .red,
        .green {
          font-size: 16px;
          font-weight: 500;
        }
        .price {
          font-size: 16px;
          font-weight: 500;
        }
        .name {
          display: flex;
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
          .coin_alias {
            color: var(--theme-font-color-1);
          }
          .n-type {
            color: var(--theme-font-color-2);
            text-align: left;
          }
        }
      }
    }
    .thead {
      padding-bottom: 0;
    }
    .thead,
    :global(.market_item) {
      li {
        font-size: 15px;
        font-weight: 400;
        color: var(--theme-font-color-1);
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
    }

    @media ${MediaInfo.tablet} {
      :global(li) {
        &:nth-child(4) {
          display: none;
        }
      }
    }
    @media ${MediaInfo.mobile} {
      .thead {
        display: none;
      }
      .market_item {
        :global(li) {
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5) {
            display: none !important;
          }

          &:nth-child(2) {
            text-align: right;
            width: auto;
            div {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              font-size: 14px !important;
              :global(img) {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
    }
  }
`;
