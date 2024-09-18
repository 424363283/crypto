import Nav from '@/components/nav';
import TabBar from '@/components/tab-bar';
import { DateRangeSelector, SearchButton } from '@/components/table-filter-bar';
import ProTooltip from '@/components/tooltip';
import { getSwapTotalProfitsApi, getSwapUTotalProfitsApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, getUrlQueryParams, message } from '@/core/utils';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { useSwapPnlData } from '../../components/hooks/use-swap-pnl-data';
import { WalletType } from '../../components/types';
import { HidePrice } from './hide-price';
import { PnlListItem } from './pnl-list-item';
import { SwapPnlDetailCard } from './swap-pnl-detail-card';
const SwapOverviewCard = dynamic(() => import('./swap-overview-card'));
const SwapDetailCard = dynamic(() => import('./swap-detail-card'));
interface SwapProfits {
  pnl: number;
  totalPnl: number;
  totalPnlRate: number;
  indexDay: number;
}

const SwapPnlRightColumn = (props: { symbolUnit: 'USD' | 'USDT'; reportPnls: any }) => {
  const { symbolUnit, reportPnls } = props;
  const [state, setState] = useImmer({
    subTabId: 1,
  });
  const { subTabId } = state;
  const onOverViewDetailTabChange = (id: number) => {
    setState((draft) => {
      draft.subTabId = id;
    });
  };
  return (
    <div className='right-column'>
      <div className='tab'>
        <div className={clsx('tab-item', subTabId === 1 && 'active')} onClick={() => onOverViewDetailTabChange(1)}>
          {LANG('总览')}
        </div>
        <div className={clsx('tab-item', subTabId === 2 && 'active')} onClick={() => onOverViewDetailTabChange(2)}>
          {LANG('详情')}
        </div>
      </div>
      {subTabId === 1 && <SwapOverviewCard symbolUnit={symbolUnit} reportPnls={reportPnls} />}
      {subTabId === 2 && <SwapDetailCard reportPnls={reportPnls} symbolUnit={symbolUnit} />}
      <style jsx>{styles}</style>
    </div>
  );
};

const CommonTabBar = () => {
  const router = useRouter();
  const type = (getUrlQueryParams('type') as WalletType) || WalletType.ASSET_SWAP_U;
  const [curTab, setCurTab] = useState(type);
  const onTabChange = (tab: any) => {
    router.replace(`/account/fund-management/assets-overview/pnl-analysis?type=${tab}`);
    setCurTab(tab);
  };
  return (
    <TabBar
      options={[
        { label: LANG('U本位合约'), value: WalletType.ASSET_SWAP_U },
        { label: LANG('币本位合约'), value: WalletType.ASSET_SWAP },
      ]}
      value={curTab}
      onChange={onTabChange}
    />
  );
};

export default function SwapAnalysis() {
  const type = (getUrlQueryParams('type') as WalletType) || WalletType.ASSET_SWAP_U;

  const [eyeOpen, setEyeOpen] = useState(true);
  const [state, setState] = useImmer({
    swapProfits: [] as SwapProfits[],
    startDate: '',
    endDate: '',
  });
  const { swapProfits, startDate, endDate } = state;

  const {
    totalProfit,
    totalLoss,
    reportPnls,
    avgProfit,
    avgLoss,
    pnlRate,
    profitDay,
    lossDay,
    flatDay,
    winRate,
    getSwapPnlReports,
  } = useSwapPnlData({
    startDate: dayjs(startDate).valueOf(),
    endDate: dayjs(endDate).valueOf(),
    type,
  });
  const symbolUnit = type === WalletType.ASSET_SWAP_U ? 'USDT' : 'USD';

  useEffect(() => {
    const getSwapProfitData = async () => {
      const PROFITS_REQUESTS: any = {
        [WalletType.ASSET_SWAP]: async () => await getSwapTotalProfitsApi(),
        [WalletType.ASSET_SWAP_U]: async () => await getSwapUTotalProfitsApi(),
      };
      if (!PROFITS_REQUESTS.hasOwnProperty(type)) {
        return;
      }
      const res = await PROFITS_REQUESTS[type]();
      if (res.code === 200) {
        setState((draft) => {
          draft.swapProfits = res.data || [];
        });
      } else {
        message.error(res.message);
      }
    };
    getSwapProfitData();
  }, [type]);

  const onDateRangeChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setState((draft) => {
      draft.startDate = startDate;
      draft.endDate = endDate;
    });
  };
  const onSearchClick = async () => {
    await getSwapPnlReports({
      start: dayjs(startDate).valueOf(),
      end: dayjs(endDate).valueOf(),
    });
  };
  const PNL_list = [
    {
      tips: LANG('平均盈利/平均亏损'),
      name: LANG('盈亏比率'),
      value: `${pnlRate?.mul(100)?.toFormat(2)}%`,
    },
    {
      tips: LANG('期间单日已实现盈亏为正的天数'),
      name: LANG('盈利天数'),
      value: `${profitDay}${LANG('天')}`,
    },
    {
      tips: LANG('期间单日已实现盈亏为负的天数'),
      name: LANG('亏损天数'),
      value: `${lossDay}${LANG('天')}`,
    },
    {
      tips: LANG('期间单日已实现盈亏为零的天数'),
      name: LANG('持平天数'),
      value: `${flatDay}${LANG('天')}`,
    },
    {
      tips: LANG('总盈利/盈利天数'),
      name: LANG('平均盈利'),
      value: avgProfit.toFormat(2),
    },
    {
      tips: LANG('总亏损/亏损天数'),
      name: LANG('平均亏损'),
      value: avgLoss.toFormat(2),
    },
  ];
  const totalValue = totalProfit.sub(Math.abs(totalLoss)).toFormat(2);
  const BASIC_PNL_DATA = [
    {
      name: LANG('总盈利'),
      value: totalProfit > 0 ? `+${totalProfit.toFixed(2)} ${symbolUnit}` : totalProfit?.toFixed(2) + symbolUnit,
      tips: LANG('期间所有已实现获利加总'),
    },
    {
      name: LANG('总亏损'),
      value: totalLoss?.toFixed(2) + symbolUnit,
      tips: LANG('期间所有已实现亏损加总'),
    },
    {
      name: LANG('净盈利/亏损'),
      value: +totalValue > 0 ? `+${totalValue} ${symbolUnit}` : totalValue + symbolUnit,
      tips: LANG('总盈利') + '-' + LANG('总亏损'),
    },
    {
      name: LANG('胜率'),
      tips: LANG('盈利天数/(盈利天数 + 亏损天数 + 持平天数)'),
      value: `${winRate?.mul(100)?.toFormat(2)}%`,
    },
  ];
  const BasicPnlCard = () => {
    return (
      <>
        {BASIC_PNL_DATA.map((item) => {
          const pureNumber = item.value.replace(/USDT|%/, '');
          return (
            <div className='basic-pnl-card' key={item.name}>
              <ProTooltip title={item.tips}>
                <p className='title'>{item.name}</p>
              </ProTooltip>
              <p className={clsx('value', +pureNumber > 0 ? 'green' : +pureNumber < 0 ? 'red' : '')}>
                <HidePrice eyeOpen={eyeOpen}>{item.value}</HidePrice>
              </p>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className='swap-analysis'>
      <Nav title={LANG('盈亏分析详情')} />
      <CommonTabBar />
      <SwapPnlDetailCard eyeOpen={eyeOpen} setEyeOpen={setEyeOpen} symbolUnit={symbolUnit} swapProfits={swapProfits} />
      <div className='swap-bottom-card'>
        <div className='left-column'>
          <div className='top-area'>
            <div className='filter-bar'>
              <DateRangeSelector dayOptionWidth={105} onDateRangeChange={onDateRangeChange} />
              <SearchButton onSearchClick={onSearchClick} />
            </div>
            <div className='basic-pnl-container'>
              <BasicPnlCard />
            </div>
          </div>
          <div className='bottom-area'>
            {PNL_list.map((item) => {
              return (
                <PnlListItem
                  eyeOpen={eyeOpen}
                  key={item.name}
                  name={item.name}
                  value={item.value}
                  tooltips={item.tips}
                />
              );
            })}
          </div>
        </div>
        <SwapPnlRightColumn symbolUnit={symbolUnit} reportPnls={reportPnls} />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .swap-analysis {
    :global(.tab-bar) {
      border-bottom: none;
      padding: 0;
    }
    :global(.nav-title) {
      @media ${MediaInfo.mobile} {
        padding-bottom: 5px;
      }
    }
    .swap-bottom-card {
      margin-top: 27px;
      display: flex;
      @media ${MediaInfo.mobileOrTablet} {
        flex-direction: column;
      }
      .left-column {
        @media ${MediaInfo.tablet} {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        @media ${MediaInfo.mobile} {
          margin-bottom: 42px;
        }
        .top-area {
          @media ${MediaInfo.mobileOrTablet} {
            margin-right: 44px;
          }
        }
        .top-area,
        .bottom-area {
          @media ${MediaInfo.mobileOrTablet} {
            flex: 1;
          }
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
        :global(.basic-pnl-container) {
          display: grid;
          grid-template-columns: repeat(2, 2fr);
          grid-gap: 16px 8px;
          margin-top: 20px;
          margin-bottom: 20px;
          :global(.basic-pnl-card) {
            border: 1px solid var(--theme-border-color-2);
            width: 178px;
            height: 81px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            :global(.title) {
              color: var(--theme-font-color-3);
              font-size: 12px;
              border-bottom: 1px solid var(--theme-font-color-placeholder);
            }
            :global(.value) {
              color: var(--theme-font-color-1);
              font-size: 16px;
              font-weight: 500;
              margin-top: 5px;
            }
            :global(.value.green) {
              color: var(--color-green);
            }
            :global(.value.red) {
              color: var(--color-red);
            }
          }
        }
      }
      .right-column {
        width: 100%;
        @media ${MediaInfo.desktop} {
          margin-left: 80px;
        }
        .tab {
          border-radius: 5px;
          display: flex;
          align-items: center;
          min-width: 160px;
          margin-bottom: 25px;
          .tab-item {
            background-color: var(--theme-background-color-3);
            cursor: pointer;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px 10px;
            min-width: 80px;
            font-size: 14px;
            color: var(--theme-font-color-3);
            border-radius: 5px;
          }
          .tab-item.active {
            height: 26px;
            background-color: var(--skin-primary-color);
            color: var(--skin-font-color);
          }
        }
        :global(.bottom-pagination) {
          padding: 30px 0;
        }
      }
    }
  }
`;
