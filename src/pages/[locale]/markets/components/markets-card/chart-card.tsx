// 顶部四个行情小卡片
import Chart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import { RateText } from '@/components/rate-text';
import { useLocalStorage, useMiniChartData } from '@/core/hooks';
import { LANG, TradeLink } from '@/core/i18n';
import { MarketItem } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { clsx, formatVolume, isSpot, isSwap } from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { CURRENT_TAB, store } from '../../store';

const ChartCard = () => {
  const { currentId } = store;
  const isFilterSpot: boolean = false;
  const defaultCoinList = isFilterSpot ? ['BTC_USDT', 'ETH_USDT'] : ['BTC-USDT', 'ETH-USDT'];
  const [chartCardList, setChartCardList] = useState<MarketItem[]>([]);
  const [coinList, setCoinList] = useState<string[]>(defaultCoinList);
  const { miniChartData, setSymbols, isLoading } = useMiniChartData();
  const { marketDetailList } = store;
  const colorHex = RootColor.getColorHex;
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
        if(isFilterSpot) {
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

    // const containsAll = firstTwoSymbols.every((b) => coinList.includes(b));
    // if (!containsAll) {
    //   setCoinList([...coinList, ...firstTwoSymbols.slice(0, 2)]);
    // }

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
      {localChartCardList.map((item: MarketItem) => {
        const chartData = (miniChartData as any)[item.id] || [];
        // console.log("获取当前的id",item)
        return (
          <TradeLink className={clsx('chart-link-container')} key={item.id} id={item.id} native>
            <div className='chart-content'>
              <div className='top-area'>
                <div className='left'>
                  <CoinLogo coin={item.coin} alt='YMEX' width='24' height='24' />
                  {`${item.coin}${item.type === 'SPOT' ? '/' : ''}${item.quoteCoin} ` || `--${item.type === 'SPOT' ? '/' : ''}--`}
                </div>
                <span style={{ color: item?.isUp ? 'var(--color-green)' : 'var(--color-red)' }} className='right rate'>
                  {item?.rate || '- -'}%
                </span>
              </div>
              <div className='bottom-area'>
                <div className='left'>
                  <span className='price'>
                    <RateText money={item.price} prefix useFormat scale={item?.digit || 4} />
                  </span>
                  <span className='volume'>
                    {LANG('成交额')} {formatVolume(item?.total) || '- -'}
                  </span>
                </div>
                <div className='right'>
                  <div className='mini-chart'>
                    {item.price ? (
                      <Chart
                        id={'_markets_card'}
                        showLine={false}
                        style={{ width: 95.9, height: 30 }}
                        data={chartData}
                        symbol={item.coin}
                        lineWidth={1.5}
                        areaColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
                        lineColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
                        areaColorOpacity={50}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <style jsx>{styles}</style>
          </TradeLink>
        );
      })}
    </>
  );
};
const styles = css`
  :global(.chart-link-container) {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    flex: 1 0 0;
    border-radius: 16px;
    border: 0.5px solid var(--text-tertiary);
    :global(.chart-content) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      align-self: stretch;
      :global(.top-area) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .left {
          display: flex;
          width: 142px;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
        :global(img) {
          width: 24px;
          height: auto;
        }
      }
      :global(.bottom-area) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          flex: 1 0 0;
          .price {
            color: var(--text-primary);
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          .volume {
            color: var(--text-primary);
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
        }
        :global(.volume) {
          font-size: 12px;
          font-weight: 500;
          color: var(--theme-font-color-3);
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    :global(.mini-chart) {
      height: 30px;
      width: 100px;
      right: 16px;
      top: 15px;
    }
  }
`;
export default ChartCard;
