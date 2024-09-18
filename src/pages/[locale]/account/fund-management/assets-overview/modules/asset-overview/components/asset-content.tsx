import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import React from 'react';
import css from 'styled-jsx/css';
import { AssetsBottomTitle } from '../../../components/assets-bottom-title';
import { useCalcSwapAssets } from '../../../hooks/use-swap-balance';
import { AssetItem } from './asset-item';
const PieChart = dynamic(() => import('@/components/chart/pie-chart'), { ssr: false });

interface AssetsProps {
  color?: string;
}
/* eslint-disable react/display-name */
export const AssetContent: React.FC<AssetsProps> = React.memo(({ color }) => {
  const classNames = ['asset-card-list', `color-${color}`];
  const { liteAssetsStore, spotAssetsStore } = Account.assets;
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const { spotTotalBalance } = spotAssetsStore;
  const { assets, occupiedBalance, floatProfit } = liteAssetsStore;
  const swapUBalance = useCalcSwapAssets({ isSwapU: true }).total.totalMargin2;
  const swapBalance = useCalcSwapAssets({ isSwapU: false }).total.totalMargin2;

  const liteBalance = enableLite ? occupiedBalance.add(assets.money).add(floatProfit || 0) : '0';
  const _spotTotalBalance = Number(spotTotalBalance) < 0 ? 0 : +spotTotalBalance || 0;
  const totalBalance = _spotTotalBalance.add(swapBalance).add(swapUBalance);

  return (
    <div className='assets-bottom-card'>
      <AssetsBottomTitle />
      <div className={classNames.join(' ')}>
        <PieChart contractuBalance={+swapUBalance} contractBalance={+swapBalance} spotBalance={_spotTotalBalance} />
        <div className='assets-list'>
          <AssetItem
            title={LANG('现货账户')}
            amount={_spotTotalBalance}
            color='#FFD30F'
            percent={_spotTotalBalance.div(totalBalance)}
          />
          <AssetItem
            title={LANG('U本位账户')}
            amount={swapUBalance}
            color='#43BC9C'
            percent={swapUBalance.div(totalBalance)}
          />
          <AssetItem
            title={LANG('币本位账户')}
            amount={swapBalance}
            color='#2C66D1'
            percent={swapBalance.div(totalBalance)}
          />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
});
const styles = css`
  .assets-bottom-card {
    background-color: var(--theme-background-color-2);
    @media ${MediaInfo.mobile} {
      margin-top: 10px;
      border-radius: 15px;
    }
    @media ${MediaInfo.tablet} {
      border-radius: 15px;
    }
    .asset-card-list {
      background: var(--theme-background-color-2);
      position: relative;
      width: 100%;
      display: flex;
      margin-top: 30px;
      flex-direction: row;
      align-items: center;
      border-radius: 15px;
      justify-content: space-between;
      @media ${MediaInfo.tablet} {
        border-radius: 15px;
      }
      @media ${MediaInfo.mobile} {
        flex-direction: column;
        padding: 0px 11px 17px 9px;
        margin-top: 15px;
      }
      :global(.chart) {
        margin-left: 45px;
        margin-right: 65px;
        @media ${MediaInfo.mobile} {
          position: relative;
          top: 0;
          left: 0;
        }
      }
      .assets-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-left: 225px;
        @media ${MediaInfo.mobile} {
          margin-top: 150px;
          margin-left: 0px;
        }
      }
    }
  }
`;
