import CoinLogo from '@/components/coin-logo';
import { RateText } from '@/components/rate-text';
import { useLocalStorage, useMiniChartData } from '@/core/hooks';
import { TradeLink } from '@/core/i18n';
import { MarketItem } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { clsx, isSpot, isSwap } from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import { store } from '../../store';
const Marquee = dynamic(() => import('react-fast-marquee'), {
  ssr: false,
  loading: () => <div />
});



const HotQuote = () => {
  const isFilterSpot: boolean = false;
  const defaultCoinList = isFilterSpot ? ['BTC_USDT', 'ETH_USDT'] : ['BTC-USDT', 'ETH-USDT'];
  const [chartCardList, setChartCardList] = useState<MarketItem[]>([]);
  const [coinList, setCoinList] = useState<string[]>(defaultCoinList);
  const { setSymbols, isLoading } = useMiniChartData();
  const { marketDetailList } = store;
  const [localChartCardList, setLocalChartCardList] = useLocalStorage(LOCAL_KEY.MARKET_MINI_CHART_DATA, chartCardList);
  const getCardListData = useCallback((detailList: any) => {
    const data = coinList.map((item: string) => detailList[item]).filter(Boolean);
    const filteredList = Object.values(detailList).filter(
      // (item: any) => item.type !== 'SPOT' && item.quoteCoin === 'USDT' && item.rate !== '--' && !coinList.includes(item.quoteCode)
      (item: any) => {
        // if (isFilterSpot) {
        //   return item.type === 'SPOT' && item.quoteCoin === 'USDT' && item.rate !== '--' && !coinList.includes(item.quoteCode)
        // } else {
        //   return item.type !== 'SPOT' && item.quoteCoin === 'USDT' && item.rate !== '--' && !coinList.includes(item.quoteCode)
        // }
        if (isFilterSpot) {
          return isSpot(item.id) && item.rate !== '--' && !coinList.includes(item.quoteCode);
        } else {
          return isSwap(item.id) && item.rate !== '--' && !coinList.includes(item.quoteCode);
        }
      }
    );
    if (!filteredList.length || isLoading) return;
    filteredList.sort((a: any, b: any) => {
      if (a.rate === '--' && b.rate === '--') {
        return 0;
      } else if (a.rate === '--') {
        return 1;
      } else if (b.rate === '--') {
        return -1;
      } else {
        const rateA = parseFloat(a.rate);
        const rateB = parseFloat(b.rate);
        return rateB - rateA;
      }
    });

    const firstTwoMaxRateValue = filteredList.slice(0, 2);

    const firstTwoSymbols = firstTwoMaxRateValue.map((item: any) => item.id);
    setCoinList([...coinList, ...firstTwoSymbols.slice(0, 2)]);

    const newData = data.concat(firstTwoMaxRateValue);
    setLocalChartCardList(newData.slice(0, 4));
    setChartCardList(newData);
  }, []);
  useEffect(() => {
    getCardListData(marketDetailList);
  }, [marketDetailList]);
  useEffect(() => {
    if (coinList.length > 2) {
      setSymbols(coinList);
    }
  }, [JSON.stringify(coinList)]);
  return (
    <>
      <div className="hot-quote-container">
        <Marquee pauseOnClick={true} speed={30}>
          <div className="hot-quote-wrapper">
            {localChartCardList.map((item: MarketItem) => {
              return (
                <TradeLink className={clsx('hot-quote-item')} key={item.id} id={item.id} native>
                  <CoinLogo coin={item.coin} alt="YMEX" width="20" height="20" />
                  <span>
                    {`${item.coin}${item.type === 'SPOT' ? '/' : ''}${item.quoteCoin} ` ||
                      `--${item.type === 'SPOT' ? '/' : ''}--`}
                  </span>
                  <span>
                    <RateText money={item.price} useFormat scale={item?.digit || 4} />
                  </span>
                  <span style={{ color: item?.isUp ? 'var(--color-green)' : 'var(--color-red)' }}>
                    {item?.rate || '- -'}%
                  </span>
                </TradeLink>
              );
            })}
          </div>
        </Marquee>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .hot-quote-container {
    display:flex;
    align-items:center;
    width: 100%;
    height: 3rem;
    padding: 0 1.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    background: var(--fill_2);
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .hot-quote-wrapper {
    display: inline-flex;
    align-items: center;
    // padding: 0 1.5rem;
    padding-right: 1.5rem;
    min-width: max-content;
    height: 100%;
    gap: 1.5rem;
  }
  :global(.hot-quote-item) {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    span {
      font-size: 12px;
      font-weight: 500;
      color: var(--text_1);
    }
  }
`;

export default HotQuote;
