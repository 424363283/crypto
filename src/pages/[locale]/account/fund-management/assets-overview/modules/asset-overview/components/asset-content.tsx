import { useCalcSwapAssets, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import React from 'react';
import css from 'styled-jsx/css';
import { AssetsBottomTitle } from '../../../components/assets-bottom-title';
import { AssetItem } from './asset-item';
const PieChart = dynamic(() => import('@/components/chart/pie-chart'), { ssr: false });
import { Desktop } from '@/components/responsive';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { useResponsive } from '@/core/hooks';

interface AssetsProps {
  color?: string;
}
/* eslint-disable react/display-name */
export const AssetContent: React.FC<AssetsProps> = React.memo(({ color }) => {
  const classNames = ['asset-card-list', `color-${color}`];
  const { liteAssetsStore, spotAssetsStore } = Account.assets;
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const router = useRouter();
  const enableP2p = false;//router.query.locale !== 'zh';
  const { spotTotalBalance } = spotAssetsStore;
  const p2pTotalBalance = 0;
  const { assets, occupiedBalance, floatProfit } = liteAssetsStore;
  // const swapUBalance = useCalcSwapAssets({ isSwapU: true }).total.totalMargin2;
  const { wallets, total: calcTotal } = useCalcSwapAssets({ isSwapU: true });
  const swapUBalance = wallets.find(item => item.wallet === WalletKey.SWAP_U)?.totalMargin2 || 0;
  const swapCopyBalance = wallets.find(item => item.wallet === WalletKey.COPY)?.totalMargin2 || 0;
  const swapBalance = useCalcSwapAssets({ isSwapU: false }).total.totalMargin2;


  const liteBalance = enableLite ? occupiedBalance.add(assets.money).add(floatProfit || 0) : '0';
  const _spotTotalBalance = Number(spotTotalBalance) < 0 ? 0 : +spotTotalBalance || 0;
  const totalBalance = enableP2p
    ? _spotTotalBalance.add(swapBalance).add(swapUBalance).add(swapCopyBalance).add(p2pTotalBalance)
    : _spotTotalBalance.add(swapBalance).add(swapUBalance).add(swapCopyBalance);
    const { isMobile } = useResponsive();
  return (
    <div className='assets-bottom-card'>
      <Desktop>
        <AssetsBottomTitle />
      </Desktop>
      <div className={classNames.join(' ')}>
        <PieChart
          contractuBalance={+swapUBalance}
          contractBalance={+swapBalance}
          contractCopyBalance={+swapCopyBalance}
          spotBalance={_spotTotalBalance}
          p2pBalance={+p2pTotalBalance}
          width={isMobile?200:120}
          height={isMobile?200:120}
        />
        <div className='assets-list'>
          <AssetItem
            title={LANG('现货账户')}
            amount={_spotTotalBalance}
            color='var(--brand)'
            percent={_spotTotalBalance.div(totalBalance)}
          />

          <AssetItem
            title={LANG('U本位账户')}
            amount={swapUBalance}
            color='var(--yellow)'
            percent={swapUBalance.div(totalBalance)}
          />
          <AssetItem
            title={LANG('跟单账户')}
            amount={swapCopyBalance}
            color='#396FD9'
            percent={swapCopyBalance.div(totalBalance)}
          />
          { 
          // <AssetItem
          //   title={LANG('币本位账户')}
          //   amount={swapBalance}
          //   color='#2C66D1'
          //   percent={swapBalance.div(totalBalance)}
          // /> 
          }
          {enableP2p ? (
            <AssetItem
              title={LANG('P2P账户')}
              amount={p2pTotalBalance}
              color='#CC783C'
              percent={p2pTotalBalance.div(totalBalance)}
            />
          ) : null}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
});
const styles = css`
  .assets-bottom-card {
    display: flex;
    flex-direction: column;
    flex: 1 auto;
    overflow: hidden;
    background-color: var(--fill_bg_1);
    border: 1px solid var(--line);
    @media ${MediaInfo.mobile} {
      margin-top: 10px;
      border-radius: 15px;
    }
    @media ${MediaInfo.tablet} {
      border-radius: 15px;
      border:none;
    }
    .asset-card-list {
      overflow: hidden;
      background: var(--fill_bg_1);
      position: relative;
      width: 100%;
      display: flex;
      flex: 1 auto;
      flex-direction: row;
      align-items: center;
      border-radius: 15px;
      justify-content: space-between;
      padding: 0 0 0 48px;
      gap: 64px;
      @media ${MediaInfo.tablet} {
        border-radius: 15px;
      }
      @media ${MediaInfo.mobile} {
        margin-top: 15px;
        padding:0;
        gap: 14px;
        flex-direction: column;
      }
      :global(.chart) {
        @media ${MediaInfo.mobile} {
          position: relative;
        }
      }
      .assets-list {
        display: flex;
        flex: 1 auto;
        flex-direction: column;
        max-height: 146px;
        overflow: auto;
        justify-content: space-around;
        gap: 16px;
        @media ${MediaInfo.mobile} {
          // width:200px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          width: 96%;
        }
      }
    }
  }
`;
