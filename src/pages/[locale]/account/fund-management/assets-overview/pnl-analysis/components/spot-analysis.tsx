import CommonIcon, { AssetValueToggleIcon } from '@/components/common-icon';
import Image from '@/components/image';
import Nav from '@/components/nav';
import { Desktop, DesktopOrTablet } from '@/components/responsive';
import { DateRangeSelector, SearchButton } from '@/components/table-filter-bar';
import { getAccountProfitApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { Account, Assets } from '@/core/shared';
import { MediaInfo, Polling, clsx, getDayjsDateRange, message } from '@/core/utils';
import { AssetsTrendCard } from '@/pages/[locale]/account/dashboard/components/assets-trend-card';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { AssetsBalanceAfter, AssetsBalanceBefore } from '../../../../dashboard/components/assets-balance';
import { HidePrice } from './hide-price';
import { PnlRank } from './pnl-rank';
import { SpotPnlCalendar } from './spot-pnl-calendar';
const SharePnlModal = dynamic(() => import('./share-pnl-modal'));
const YieldTrendChart = dynamic(() => import('../../components/profit-analysis-card/yield-trend-chart'), {
  ssr: false,
});
interface SpotProfits {
  balance: number;
  dateType: number;
  netIncome: number;
}
const ShareBtn = ({ profitsData, symbolUnit }: any) => {
  const [state, setState] = useImmer({
    sharePnlModalVisible: false,
  });
  const { sharePnlModalVisible } = state;
  const onShareBtnClick = () => {
    setState((draft) => {
      draft.sharePnlModalVisible = true;
    });
  };
  const onCloseSharePnlModal = () => {
    setState((draft) => {
      draft.sharePnlModalVisible = false;
    });
  };
  return (
    <>
      <div className='share-btn' onClick={onShareBtnClick}>
        <CommonIcon name='common-share-icon-0' size={16} />
        {LANG('分享')}
      </div>
      <SharePnlModal
        open={sharePnlModalVisible}
        symbolUnit={symbolUnit}
        profitsData={profitsData}
        onCancel={onCloseSharePnlModal}
      />
      <style jsx>{styles}</style>
    </>
  );
};
export default function SpotAnalysis() {
  const TITLE_MAP: { [key: string]: string } = {
    0: LANG('当日盈亏'),
    1: LANG('当日盈亏'),
    7: LANG('7日盈亏'),
    30: LANG('30日盈亏'),
  };
  const [eyeOpen, setEyeOpen] = useState(true);
  const [state, setState] = useImmer({
    spotProfits: [] as SpotProfits[],
    startDate: '',
    endDate: '',
    selectedDayRange: 7,
  });
  const { spotProfits, selectedDayRange, startDate, endDate } = state;
  const { spotAssetsStore } = Account.assets;
  const { spotTotalBalance } = spotAssetsStore;

  const symbolUnit = 'USD';

  useEffect(() => {
    const getSpotProfits = async () => {
      const res = await getAccountProfitApi({ type: 2 });
      if (res.code === 200) {
        setState((draft) => {
          draft.spotProfits = res.data || [];
        });
      } else {
        message.error(res.message);
      }
    };
    getSpotProfits();
    const polling = new Polling({
      interval: 4000,
      callback: () => {
        Account.assets.getAllSpotAssets(true);
      },
    });
    polling.start();
    Assets.dispatchWsListener();
    return () => {
      polling.stop();
      Assets.destroyWsListener();
    };
  }, []);
  const onEyeIconClick = () => {
    setEyeOpen(!eyeOpen);
  };
  const onDateRangeChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    const daysDiff = dayjs(endDate).diff(dayjs(startDate), 'day');
    setState((draft) => {
      draft.startDate = startDate;
      draft.endDate = endDate;
      draft.selectedDayRange = daysDiff;
    });
  };
  const onSearchClick = async () => {};

  const onChangeDateMode = (value: { label: string; value: number }[], index: number) => {
    const intervalDay: { [key: number]: number } = {
      0: 7,
      1: 30,
      2: 90,
    };
    const { start = '', end = '' } = getDayjsDateRange(new Date(), intervalDay[index] - 1, true);
    setState((draft) => {
      draft.selectedDayRange = value[0].value;
      draft.startDate = String(start);
      draft.endDate = String(end);
    });
  };
  const getSpotPnl = ({ balance, netIncome, dateType }: any) => {
    const specificProfit = spotTotalBalance.sub(balance).sub(netIncome).toFixed(2) || '0.00';
    const handleZeroProfit = specificProfit === '-0.00' ? '0.00' : specificProfit;
    const PROFIT_MAP: { [key: string]: string } = {
      0: handleZeroProfit,
      7: handleZeroProfit,
      30: handleZeroProfit,
    };
    const profit = PROFIT_MAP[dateType];
    return profit;
  };
  const getSpotPnlRate = ({ profit, dateType, balance, netIncome }: any) => {
    const totalProfit = Number(balance.add(netIncome));
    const specificRate = totalProfit === 0 ? '0.00' : profit.div(totalProfit);
    const RATE_AMP: { [key: string | number]: string } = {
      0: specificRate,
      7: specificRate,
      30: specificRate,
    };
    const spotRate = RATE_AMP[dateType];
    return spotRate;
  };
  const formatSpotProfits = () => {
    return spotProfits.map((item) => {
      const { balance, netIncome, dateType } = item;
      const profit = getSpotPnl({ balance, netIncome, dateType });
      const spotRate = getSpotPnlRate({ profit, dateType, balance, netIncome });
      return {
        indexDay: item.dateType === 0 ? 1 : item.dateType,
        pnl: 0,
        totalPnl: profit,
        totalPnlRate: spotRate,
      };
    });
  };
  const SpotPnlDetailCard = () => {
    const renderBottomValue = () => {
      const swapElements = spotProfits.map((item) => {
        const { balance, netIncome, dateType } = item;
        const profit = getSpotPnl({ balance, netIncome, dateType });
        const spotRate = getSpotPnlRate({ profit, dateType, balance, netIncome });
        return (
          <div className={clsx('card')} key={item.dateType}>
            <p className='name'>{TITLE_MAP[item.dateType]}</p>
            <p className='price'>
              <HidePrice eyeOpen={eyeOpen}>{profit?.toFormat(2) + symbolUnit || '0.00'}</HidePrice>
            </p>
            <span
              className={clsx('rate')}
              style={+spotRate < 0 ? { color: 'var(--color-red)' } : { color: 'var(--color-green)' }}
            >
              <HidePrice eyeOpen={eyeOpen}>{spotRate?.mul(100).toFixed(2) || '0.00'} %</HidePrice>
            </span>
            <style jsx>{styles}</style>
          </div>
        );
      });
      return swapElements;
    };
    return (
      <div className='pnl-detail-card'>
        <Desktop>
          <Image
            src='/static/images/account/fund/pnl-indicator.png'
            width={130}
            height={112}
            enableSkin
            className='pnl-card-img'
          />
        </Desktop>
        <div className='pnl-right-card'>
          <div className='top-title-area'>
            <p className='title'>
              {LANG('总资产')}
              <AssetValueToggleIcon show={eyeOpen} onClick={onEyeIconClick} className='eye-icon' size={18} />
            </p>
            <DesktopOrTablet>
              <ShareBtn profitsData={formatSpotProfits()} symbolUnit={symbolUnit} />
            </DesktopOrTablet>
          </div>
          <div className='bottom-value-area'>
            <div className='assets-area'>
              <AssetsBalanceBefore
                assetsBalance={spotTotalBalance}
                selectedCurrency='USDT'
                enableHideBalance={!eyeOpen}
              />
              <AssetsBalanceAfter assetsBalance={spotTotalBalance} enableHideBalance={!eyeOpen} />
            </div>
            <div className='pnl-assets-container'>{renderBottomValue()}</div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };
  return (
    <div className='spot-analysis-container'>
      <SpotPnlDetailCard />
      <div className='spot-bottom-card'>
        <div className='left-column'>
          <div className='filter-bar'>
            <DateRangeSelector
              dayOptionWidth={92}
              onDateRangeChange={onDateRangeChange}
              onSelectChange={onChangeDateMode}
            />
            <SearchButton onSearchClick={onSearchClick} />
          </div>
          <PnlRank eyeOpen={eyeOpen} />
        </div>
        <div className='right-column'>
          <div className='chart-card'>
            <p className='title'>{LANG('收益率走势')}</p>
            <YieldTrendChart startDate={startDate} endDate={endDate} width='100%' height='236px' />
          </div>
          <div className='chart-card'>
            <p className='title'>{LANG('资产走势')}</p>
            <AssetsTrendCard accountType={2} dateRange={selectedDayRange} />
          </div>
          <SpotPnlCalendar eyeOpen={eyeOpen} />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .spot-analysis-container {
    :global(.nav-title) {
      :global(.title) {
        font-size: 20px;
      }
    }
    .pnl-detail-card {
      display: flex;
      align-items: center;
      background-color: var(--theme-background-color-8);
      padding: 14px 30px 14px 23px;
      @media ${MediaInfo.tablet} {
        padding: 20px;
      }
      @media ${MediaInfo.mobile} {
        padding: 12px 14px;
      }
      border-radius: 8px;
      .pnl-right-card {
        width: 100%;
        @media ${MediaInfo.desktop} {
          margin-left: 47px;
        }
        .top-title-area,
        .bottom-value-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .top-title-area {
          font-size: 16px;
          font-weight: 500;
          @media ${MediaInfo.mobile} {
            font-size: 14px;
          }
          .title {
            color: var(--theme-font-color-1);
            display: flex;
            align-items: center;
            :global(.eye-icon) {
              padding-left: 6px;
              cursor: pointer;
            }
          }
          .share-btn {
            color: var(--theme-font-color-1);
            cursor: pointer;
            display: flex;
            align-items: center;
            :global(img) {
              margin-right: 3px;
            }
          }
        }
        .bottom-value-area {
          margin-top: 16px;
          position: relative;
          @media ${MediaInfo.mobile} {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 10px;
          }
          .assets-area {
            @media ${MediaInfo.tablet} {
              margin-right: 80px;
            }
            :global(.assets-before) {
              font-size: 26px;
              font-weight: 500;
              color: var(--theme-font-color-1);
              margin-top: 10px;
              @media ${MediaInfo.mobile} {
                font-size: 20px;
                margin-top: 0;
              }
            }
            :global(.hide-balance) {
              color: var(--theme-font-color-1);
            }
            :global(.assets-after) {
              font-size: 16px;
              font-weight: 500;
              @media ${MediaInfo.mobile} {
                font-size: 12px;
              }
              color: var(--theme-font-color-3);
            }
          }
          .pnl-assets-container {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            @media ${MediaInfo.desktop} {
              max-width: 565px;
              position: absolute;
              left: 405px;
            }
            @media ${MediaInfo.mobile} {
              margin-top: 20px;
              width: 100%;
              justify-content: space-between;
            }
          }
          .card {
            margin-left: 10px;
            @media ${MediaInfo.mobile} {
              margin-left: 0px;
              &:nth-child(2) {
                margin: 0 10px;
              }
            }
            .name {
              color: var(--theme-font-color-3);
              margin-bottom: 7px;
              font-size: 14px;
            }
            .price {
              color: var(--theme-font-color-1);
              font-size: 16px;
              font-weight: 500;
              word-break: break-all;
              @media ${MediaInfo.mobile} {
                font-size: 14px;
              }
            }
            .rate {
              font-weight: 500;
              font-size: 14px;
              @media ${MediaInfo.mobile} {
                font-size: 12px;
              }
            }
            .rate.negative {
              color: var(--color-red);
            }
            .rate.positive {
              color: var(--color-red);
            }
            &:last-child {
              text-align: right;
            }
          }
        }
      }
    }
    .spot-bottom-card {
      display: flex;
      margin-top: 30px;
      @media ${MediaInfo.tablet} {
        margin-top: 20px;
      }
      @media ${MediaInfo.mobile} {
        margin-top: 15px;
      }
      @media ${MediaInfo.mobileOrTablet} {
        flex-direction: column;
      }
      .filter-bar {
        display: flex;
        align-items: center;
        :global(.select-wrapper) {
          margin-right: 5px;
        }
        :global(.search-button) {
          margin-left: 5px;
        }
      }
      .left-column {
        width: 100%;
        @media ${MediaInfo.desktop} {
          width: 356px;
        }
        margin-right: 80px;
      }
      .right-column {
        width: 100%;
        @media ${MediaInfo.desktop} {
          width: 767px;
        }
        .chart-card {
          .title {
            color: var(--theme-font-color-1);
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
`;
