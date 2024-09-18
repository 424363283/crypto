import { getAccountProfitApi, getSwapTotalProfitsApi, getSwapUTotalProfitsApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { Account, Assets } from '@/core/shared';
import { Polling, clsx, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { WalletType } from '../types';

interface DaysPNLProps {
  type: WalletType;
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

// 今日/7日/30日盈亏
export const DaysProfitAndLossSmallCard = (props: DaysPNLProps) => {
  const { type } = props;
  const [state, setState] = useImmer({
    spotProfits: [] as SpotProfits[],
    swapProfits: [] as SwapProfits[],
  });
  const { spotProfits, swapProfits } = state;
  const { spotAssetsStore } = Account.assets;
  const { spotTotalBalance } = spotAssetsStore;
  const TITLE_MAP: { [key: string]: string } = {
    0: LANG('今日盈亏'),
    1: LANG('今日盈亏'),
    7: LANG('7日盈亏'),
    30: LANG('30日盈亏'),
  };
  const getAccountProfit = async () => {
    const PROFITS_REQUESTS: any = {
      [WalletType.ASSET_SPOT]: async () => await getAccountProfitApi({ type: 2 }),
      [WalletType.ASSET_SWAP]: async () => await getSwapTotalProfitsApi(),
      [WalletType.ASSET_SWAP_U]: async () => await getSwapUTotalProfitsApi(),
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
  }, []);

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
    border-right: 1px solid var(--theme-border-color-2);
    flex-grow: 1;
    .name {
      color: var(--theme-font-color-3);
      font-size: 12px;
    }
    .rate {
      margin: 4px 0;
      word-break: break-all;
    }
    .price {
      font-size: 12px;
      word-break: break-all;
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
    color: var(--color-red);
    font-size: 14px;
    font-weight: 500;
  }
  .positive-card {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-green);
  }
`;
