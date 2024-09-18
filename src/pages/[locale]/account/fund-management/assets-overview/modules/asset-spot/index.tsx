import Image from '@/components/image';
import { Desktop } from '@/components/responsive';
import { TrLink } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import HeaderAssetCard from '../../components/asset-card';
import AssetTableCard from '../../components/asset-table-card';
import { AssetsBottomTitle } from '../../components/assets-bottom-title';
import { ProfitAnalysisCard } from '../../components/profit-analysis-card';
import { SpotTable } from '../../components/spot-asset/spot-table';
import { WalletType } from '../../components/types';
import { WalletBalanceCard } from '../../components/walet-balance-card';
// import { PieCharts } from '../../components/pie-chart';
const PieCharts = dynamic(() => import('../../components/pie-chart'), { ssr: false });

function AssetSpot() {
  return (
    <>
      <div className='spot-header-card'>
        <HeaderAssetCard>
          <WalletBalanceCard type={WalletType.ASSET_SPOT} />
          <div className='bottom-assets-card'>
            <AssetsBottomTitle />
            <div className='bottom-container'>
              <PieCharts />
              <Desktop>
                <TrLink href='/novice-task' target='_blank'>
                  <Image
                    src='/static/images/account/fund/new-user-banner.svg'
                    className='banner'
                    enableSkin
                    width={206}
                    height={135}
                  />
                </TrLink>
              </Desktop>
            </div>
          </div>
        </HeaderAssetCard>
        <Desktop>
          <ProfitAnalysisCard type={WalletType.ASSET_SPOT} />
        </Desktop>
      </div>
      <AssetTableCard>
        <SpotTable />
      </AssetTableCard>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  .spot-header-card {
    margin-bottom: 20px;
    display: flex;
    height: 380px;
    width: 100%;
    @media ${MediaInfo.mobile} {
      height: 100%;
    }
    .bottom-assets-card {
      background-color: var(--theme-background-color-2);
      z-index: 0;
      position: relative;
      border-radius: 15px;
      @media ${MediaInfo.mobile} {
        margin-top: 10px;
      }
      .bottom-container {
        display: flex;
        justify-content: space-between;
        @media ${MediaInfo.desktop} {
          padding: 10px 18px 20px 20px;
        }
        @media ${MediaInfo.tablet} {
          padding-top: 10px;
        }
        @media ${MediaInfo.mobile} {
          padding: 10px 10px 14px;
        }
        :global(.banner) {
          border-radius: 8px;
          margin-top: 10px;
        }
      }
    }
  }
`;
export default AssetSpot;
