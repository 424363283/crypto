import { getAccountProfitApi, getSwapTotalProfitsApi, getSwapUTotalProfitsApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { Account, Assets } from '@/core/shared';
import { MediaInfo, Polling, clsx, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { WalletType } from '../types';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

export const INTERVAL_DAY: { [key: string]: number } = {
  TODAY: 0,
  DAY7: 7,
  DAY30: 30
}

const TITLE_MAP: { [key: string]: string } = {
  0: LANG('今日盈亏'),
  1: LANG('今日盈亏'),
  7: LANG('7日盈亏'),
  30: LANG('30日盈亏'),
};

interface DaysPNLProps {
  type: WalletType;
  wallet: WalletKey;
  dayType?: number;
}
interface SpotProfits {
  balance: number;
  dateType: number;
  netIncome: number;
}
interface SwapProfits {
  pnl: number;
  totalPnl: number;
  totalPnlRate: number;
  indexDay: number;
}

export const SwapDayProfitAndLoss = (props: SwapProfits) => {
  const { ...item } = props;
  return (
    <div className={clsx('day-profit-card', +item.totalPnl < 0 ? 'negative-card' : 'positive-card')} key={item.indexDay}>
      <p className='name'>{TITLE_MAP[item.indexDay]}</p>
      <p className='price'>${item.totalPnl?.toFixed(2) || '0.00'}</p>
      <p className='rate'>({item.totalPnlRate?.mul(100).toFixed(2) || '0.00'} %)</p>
      <style jsx>{`
          .day-profit-card {
            display: flex;
            margin: -8px 16px 16px;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            @media ${MediaInfo.mobile} {
              margin: 10px 0 0;
            }
            .name {
              margin-right: 8px;
              color: var(--text_3);
            }       
            .rate {
              margin-right: 8px;
            }       
            .price {
              margin-right: 8px;
            }       
          }     
          .negative-card {
            color: var(  --color-red);
          }     
          .positive-card {
            color: var(--color-green);
          }  
            
        `}</style>

    </div>
  )
}
const defaultSpotProfits: SpotProfits[] = [ {balance:0, dateType:0, netIncome:0}, {balance:0, dateType:0, netIncome:0}, {balance:0, dateType:0, netIncome:0}] 
const defaultSwapProfits: SwapProfits[] = [ {indexDay:0, totalPnl:0, totalPnlRate:0, pnl:0}, {indexDay:7, totalPnl:0, totalPnlRate:0, pnl:0}, {indexDay:30, totalPnl:0, totalPnlRate:0, pnl:0}] 
// 今日/7日/30日盈亏
export const DaysProfitAndLossSmallCard = (props: DaysPNLProps) => {
  const { type, wallet, dayType } = props;
  const [state, setState] = useImmer({
    spotProfits: defaultSpotProfits as SpotProfits[],
    swapProfits: defaultSwapProfits as SwapProfits[],
  });
  const { spotProfits, swapProfits } = state;
  const { spotAssetsStore } = Account.assets;
  const { spotTotalBalance } = spotAssetsStore;
  //TO-DO 添加钱包类型筛选数据(如跟单数据)
  const getAccountProfit = async () => {
    const PROFITS_REQUESTS: any = {
      [WalletType.ASSET_SPOT]: async () => await getAccountProfitApi({ type: 2 }),
      [WalletType.ASSET_SWAP]: async () => await getSwapTotalProfitsApi(),
      [WalletType.ASSET_SWAP_U]: async () => await getSwapUTotalProfitsApi({subWallet: wallet}),
    };
    const res = await PROFITS_REQUESTS[type]();
    if (res.code === 200) {
      setState((draft) => {
        draft.spotProfits = res.data || [];
        draft.swapProfits = res.data || [];
      });
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    getAccountProfit();
    if (type !== WalletType.ASSET_SPOT) return;
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
  }, [type, wallet]);

  if (dayType !== undefined) {
    if (type === WalletType.ASSET_SWAP || type === WalletType.ASSET_SWAP_U) {
      const item = swapProfits.find(elem => elem.indexDay === dayType) || swapProfits[0] || { indexDay: dayType };
      return <SwapDayProfitAndLoss {...item} />

    } else {
      return null;
    }

  }
  if (type === WalletType.ASSET_SPOT) {
    const spotElements = spotProfits.map((item) => {
      // 盈亏
      const specificProfit = spotTotalBalance.sub(item.balance).sub(item.netIncome).toFixed(2) || '0.00';
      const PROFIT_MAP: { [key: string]: string } = {
        0: specificProfit,
        7: specificProfit,
        30: specificProfit,
      };
      const profit = PROFIT_MAP[item.dateType];
      // 盈亏率
      const totalProfit = Number(item.balance.add(item.netIncome));
      const specificRate = totalProfit === 0 ? '0.00' : profit.div(totalProfit).mul(100).toFixed(2);
      const RATE_AMP: { [key: string | number]: string } = {
        0: specificRate,
        7: specificRate,
        30: specificRate,
      };
      return (
        <div className={clsx('card', +profit < 0 ? 'negative-card' : 'positive-card')} key={item.dateType}>
          <p className='name'>{TITLE_MAP[item.dateType]}</p>
          <p className='rate'>{RATE_AMP[item.dateType]} %</p>
          <p className='price'>≈${profit}</p>
          <style jsx>{styles}</style>
        </div>
      );
    });
    return <>{spotElements}</>;
  }
  const swapElements = swapProfits.map((item) => {
    return (
      <div className={clsx('card', +item.totalPnl < 0 ? 'negative-card' : 'positive-card')} key={item.indexDay}>
        <p className='name'>{TITLE_MAP[item.indexDay]}</p>
        <p className='rate'>{item.totalPnlRate?.mul(100).toFixed(2) || '0.00'} %</p>
        <p className='price'>≈${item.totalPnl?.toFixed(2) || '0.00'}</p>
        <style jsx>{styles}</style>
      </div>
    );
  });
  return <>{swapElements}</>;
};
const styles = css`
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    border-right: 1px solid var(--theme-border-color-2);
    flex-grow: 1;
    .name {
      color: var(--theme-font-color-3);
      padding: 4px 0;
    }
    .rate {
      font-size: 14px;
      font-weight: 500;
      padding: 4px 0;
      word-break: break-all;
    }
    .price {
      word-break: break-all;
      padding: 4px 0;
    }
    &:first-child {
      align-items: flex-start;
    }
    &:last-child {
      align-items: flex-end;
      border-right: none;
    }
  }
  .negative-card {      
    color: var(  --color-red);
  }     
  .positive-card {
    color: var( --color-green);
  }
`;
