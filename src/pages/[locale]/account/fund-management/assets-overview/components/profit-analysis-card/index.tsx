import { LANG } from '@/core/i18n';
import { clsx, getDayjsDateRange } from '@/core/utils';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { useSwapPnlData } from '../hooks/use-swap-pnl-data';
import { WalletType } from '../types';
import { DaysProfitAndLossSmallCard } from './days-pnl-card'; // 今日盈亏 7日盈亏
import { PnlNavButton } from './pnl-nav-button';
import { SwapPnlInfoCard } from './swap-pnl-card';
// import YieldTrendChart from './yield-trend-chart';
const YieldTrendChart = dynamic(() => import('./yield-trend-chart'), { ssr: false });

export const ProfitAnalysisCard = ({ type }: { type: WalletType }) => {
  const [state, setState] = useImmer({
    currentDay: {
      date: LANG('7日'),
      value: 0,
    },
  });
  const DATES_OPTIONS = [LANG('7日'), LANG('30日'), LANG('90日')];
  const { currentDay } = state;
  const intervalDay: { [key: number]: number } = {
    0: 7,
    1: 30,
    2: 90,
  };
  const { start = '', end = '' } = getDayjsDateRange(new Date(), intervalDay[currentDay.value], true);
  // 永续盈亏汇总
  const { totalProfit, totalLoss } = useSwapPnlData({
    startDate: start.valueOf(),
    endDate: end.valueOf(),
    type,
  });
  // 现货收益率走势
  const renderSpotYieldTrend = () => {
    return (
      <div className='charts-container'>
        <div className='title'>
          <span className={clsx('dot', 'btc-dot')}></span>
          <span className='btc'>BTC{LANG('涨跌幅')}</span>
          <span className={clsx('dot', 'rate-dot')}></span>
          <span className='rate'>{LANG('收益率')}</span>
        </div>
        <YieldTrendChart startDate={start} endDate={end} bottom={70} width='350px' />
      </div>
    );
  };
  // 日期切换
  const onDayOptionClick = (day: string, index: number) => {
    setState((draft) => {
      draft.currentDay.date = day;
      draft.currentDay.value = index;
    });
  };
  return (
    <div className='profit-analysis-container'>
      <div className='header'>
        <p className='title'>{LANG('盈亏分析')}</p>
        <PnlNavButton type={type} />
      </div>
      <div className='line'></div>
      <div className='profit-container'>
        <div className='main-days-profit-card'>
          <DaysProfitAndLossSmallCard type={type} />
        </div>
        <div className='days-profit-detail-card'>
          <div className='date-filter'>
            {DATES_OPTIONS.map((day, index) => {
              return (
                <span
                  onClick={() => onDayOptionClick(day, index)}
                  key={day}
                  className={clsx('date-opt', currentDay.date === day && 'current-date')}
                >
                  {day}
                </span>
              );
            })}
          </div>
          {type === WalletType.ASSET_SPOT ? (
            renderSpotYieldTrend()
          ) : (
            <SwapPnlInfoCard type={type} totalProfit={totalProfit} totalLoss={totalLoss} />
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .profit-analysis-container {
    width: 368px;
    border-radius: 15px;
    height: 100%;
    background-color: var(--theme-background-color-2);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 19px 15px 13px 13px;
      .title {
        color: var(--theme-font-color-6);
        font-size: 16px;
        font-weight: 500;
      }
    }
    .line {
      border: 1px solid var(--theme-border-color-2);
      margin-right: 15px;
    }
    .profit-container {
      padding: 18px 15px 20px;
      width: 368px;
      .main-days-profit-card {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 60px;
      }
      .days-profit-detail-card {
        margin-top: 14px;
        .date-opt {
          font-size: 12px;
          color: var(--theme-font-color-3);
          margin-right: 16px;
          cursor: pointer;
        }
        .current-date {
          color: var(--theme-font-color-1);
        }
        :global(.charts-container) {
          :global(.title) {
            display: flex;
            align-items: center;
            margin-top: 12px;
            margin-bottom: 21px;
            color: var(--theme-font-color-1);
            :global(.dot) {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              margin-right: 6px;
            }
            :global(.btc-dot) {
              background-color: var(--skin-primary-color);
            }
            :global(.rate-dot) {
              background-color: #f04e3f;
              margin-left: 20px;
            }
            :global(.btc) {
            }
          }
        }
      }
    }
  }
`;
