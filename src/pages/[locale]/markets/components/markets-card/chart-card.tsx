// 顶部四个行情小卡片
import Chart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import { RateText } from '@/components/rate-text';
import { useLocalStorage, useMiniChartData } from '@/core/hooks';
import { LANG, TradeLink } from '@/core/i18n';
import { MarketItem } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { clsx, formatVolume } from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../../store';

const ChartCard = () => {
  const [chartCardList, setChartCardList] = useState<MarketItem[]>([]);
  const [coinList, setCoinList] = useState<string[]>(['BTC_USDT', 'ETH_USDT']);
  const { miniChartData, setSymbols, isLoading } = useMiniChartData();
  const { marketDetailList } = store;
  const colorHex = RootColor.getColorHex;
  const [localChartCardList, setLocalChartCardList] = useLocalStorage(LOCAL_KEY.MARKET_MINI_CHART_DATA, chartCardList);
  const getCardListData = useCallback((detailList: any) => {
    const data = coinList.map((item: string) => detailList[item]).filter(Boolean);
    const filteredList = Object.values(detailList).filter(
      (item: any) => item.type === 'SPOT' && item.unit === 'USDT' && item.rate !== '--'
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

    const containsAll = firstTwoSymbols.every((b) => coinList.includes(b));
    if (!containsAll) {
      setCoinList([...coinList, ...firstTwoSymbols.slice(0, 2)]);
    }

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
        return (
          <TradeLink className={clsx('chart-link-container')} key={item.id} id={item.id} native>
            <div className='chart-content'>
              <div className='top-area'>
                <CoinLogo coin={item.coin} alt='y-mex' width='24' height='24' />
                {`${item.coin}/${item.quoteCoin} ` || '--/--'}
              </div>
              <div className='center-area'>
                <span className='price'>
                  <RateText money={item.price} prefix useFormat scale={item?.digit || 4} />
                </span>
              </div>
              <div className='bottom-area'>
                <span className='volume'>
                  {LANG('成交量')} {formatVolume(item?.total) || '- -'}
                </span>
                <span style={{ color: item?.isUp ? 'var(--color-green)' : 'var(--color-red)' }} className='rate'>
                  {item?.rate || '- -'}%
                </span>
              </div>
            </div>
            <div className='mini-chart'>
              {item.price ? (
                <Chart
                  id={'_markets_card'}
                  showLine={false}
                  style={{ width: 100, height: 60 }}
                  data={chartData}
                  symbol={item.coin}
                  lineWidth={1.5}
                  areaColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
                  lineColor={item?.isUp ? colorHex['up-color-hex'] : colorHex['down-color-hex']}
                  areaColorOpacity={50}
                />
              ) : null}
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
    border-radius: 10px;
    padding: 20px 15px 0;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    background-color: var(--theme-background-color-2);
    :global(.chart-content) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      :global(.top-area) {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        line-height: 19px;
        display: flex;
        align-items: center;
        :global(img) {
          width: 24px;
          height: auto;
          margin-right: 6px;
        }
      }
      :global(.center-area) {
        display: flex;
        align-items: center;
        padding-top: 10px;
        border-bottom: 1px solid var(--theme-border-color-2);
        padding-bottom: 12px;
        :global(.price) {
          font-size: 20px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          line-height: 25px;
          white-space: nowrap;
        }
        :global(.rate) {
          font-size: 14px;
          font-weight: 500;
          color: #00c86f;
          margin-left: 5px;
        }
      }
      :global(.bottom-area) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 42px;
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
      height: 60px;
      width: 100px;
      position: absolute;
      right: 16px;
      top: 15px;
    }
  }
`;
export default ChartCard;
