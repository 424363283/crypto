import { useOnlineById, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { RecentTradeItem, Swap, TradeMap } from '@/core/shared';
import { resso } from '@/core/store';
import { clsx, isSpot, isSwapCoin, isSwapSLCoin, isSwapSLUsdt, isSwapUsdt, MediaInfo } from '@/core/utils';
import { useEffect, useMemo, useState } from 'react';
import { RecentItem } from './recent-item';

const store = resso({ list: [] });
export const RecentTrades = () => {
  const { id, mode } = useRouter().query;
  const router = useRouter();
  const { pathname } = router;
  const { isSmallDesktop, isTablet, isDesktop } = useResponsive();
  const online = useOnlineById(id);
  const { list } = store;
  const setList = (v: any) => (store.list = v);
  useWs(SUBSCRIBE_TYPES.ws6001, data => setList([...data]));
  const [a, b] = (id as string)?.split('-') || [];
  const [quoteCoin, setQuoteCoin] = useState('');
  const [coin, setCoin] = useState('');
  const swapSymbol = Swap.Info.getUnitText({ symbol: id });

  useEffect(() => {
    if (isSpot(id)) {
      TradeMap.getSpotById(id).then(res => {
        if (res) {
          setQuoteCoin(res?.quoteCoin || '');
          setCoin(res.coin);
        }
      });
    }
  }, [id]);
  const showSmall = useMemo(() => {
    return (pathname.includes('swap') || mode === 'pro') && isSmallDesktop;
  }, [pathname, mode, isSmallDesktop]);
  const swapTable = useMemo(() => {
    return pathname.includes('swap') && isTablet;
  }, [pathname, isSmallDesktop, isTablet]);
  const swapSmall = useMemo(() => {
    return pathname.includes('swap') && isSmallDesktop;
  }, [pathname, isSmallDesktop, isTablet]);

  // const isSpotCoin = isSpot(id as string);
  return (
    <>
      <div className="recent-trades">
        {/* {isSpotCoin && (isSmallDesktop || isDesktop) && (
          <div className='recent-trades-title'>
            <span>{LANG('最近成交')}</span>
          </div>
        )} */}
        <div className={clsx('recent-trades-list-title', showSmall && 'small')}>
          {(isSwapUsdt(id as string) || isSwapSLUsdt(id as string)) && (
            <>
              <span>{LANG('时间')}</span>
              <span>
                {LANG('价格')}({b})
              </span>
              <span>
                {LANG('数量')}({swapSymbol})
              </span>
            </>
          )}
          {(isSwapCoin(id as string) || isSwapSLCoin(id as string)) && (
            <>
              <span>{LANG('时间')}</span>
              <span>
                {LANG('价格')}({b})
              </span>
              <span>
                {LANG('数量')}({swapSymbol})
              </span>
            </>
          )}
          {isSpot(id as string) && (
            <>
              <span>{LANG('时间')}</span>
              <span>
                {LANG('价格')}({quoteCoin})
              </span>
              <span>
                {LANG('数量')}({coin})
              </span>
            </>
          )}
        </div>
        <div
          className={clsx(
            'recent-trades-content',
            showSmall && 'small',
            swapTable && 'swap-table',
            swapSmall && 'swap-small'
          )}
        >
          <div className={clsx('recent-list', showSmall && 'small')}>
            {online &&
              list.map((item: RecentTradeItem, index: number) => {
                return <RecentItem item={item} key={index} />;
              })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .recent-trades {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .recent-trades-title {
          height: 35px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: var(--theme-trade-text-color-1);
          font-weight: 500;
        }
        .recent-trades-list-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0 6.5px;
          color: var(--theme-trade-text-color-2);
          font-size: 12px;
          font-weight: 400;
          flex-shrink: 0;
          @media ${MediaInfo.mobile} {
            padding: 0;
            padding-top: 1rem;
            padding-bottom: 10px;
            font-size: 10px;
            color: var(--text_3);
          }

          &.small {
            padding: 12px 0 6.5px;
          }
          > span {
            flex: 1;
          }
          > span:nth-child(1) {
            padding-left: 12px;
            text-align: left;
            @media ${MediaInfo.mobile} {
              padding-left: 1rem;
            }
          }
          > span:nth-child(2) {
            padding-right: 12px;
            text-align: right;
            @media ${MediaInfo.mobile} {
              padding-right: 1rem;
            }
          }
          > span:nth-child(3) {
            padding-right: 12px;
            text-align: right;
            text-wrap: nowrap;
            @media ${MediaInfo.mobile} {
              padding-right: 1rem;
            }
          }
        }
        .recent-trades-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          &.small {
            flex: none;
            height: 326px;
            overflow: auto;
          }
          &.swap-table {
            flex: none;
            height: 456px;
            overflow: auto;
          }
          &.swap-small {
            flex: none;
            height: 423px;
            overflow: auto;
          }
          .recent-list {
            display: flex;
            flex-direction: column;
            overflow: auto;
            flex: 1;
          }
        }
      `}</style>
    </>
  );
};
