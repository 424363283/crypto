import { Desktop, Mobile } from '@/components/responsive';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import HeaderAssetCard from '../../components/asset-card';
import AssetTableCard from '../../components/asset-table-card';
import { AssetsBottomTitle } from '../../components/assets-bottom-title';
import { SpotTable } from '../../components/spot-asset/spot-table';
import { WalletType } from '../../components/types';
import { WalletBalanceCard } from '../../components/walet-balance-card';
const PieCharts = dynamic(() => import('../../components/pie-chart'), { ssr: false });

function AssetSpot() {
  return (
    <>
      <div className='spot-header-card'>
        <HeaderAssetCard>
          <WalletBalanceCard type={WalletType.ASSET_SPOT} />
          <div className='bottom-assets-card'>
            <Desktop>
              <AssetsBottomTitle />
            </Desktop>
            <div className='bottom-container'>
              <PieCharts />
              {/* <Desktop>
                <TrLink href='/novice-task' target='_blank'>
                  <Image
                    src='/static/images/account/fund/new-user-banner.svg'
                    className='banner'
                    enableSkin
                    width={206}
                    height={135}
                  />
                </TrLink>
              </Desktop> */}
            </div>
          </div>
        </HeaderAssetCard>
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
    margin-bottom: 8px;
    display: flex;
    height: 412px;
    width: 100%;
    @media ${MediaInfo.mobile} {
      height: 100%;
    }
    :global(.assets-overview-card) {
      margin-right: 0px;
    }
    .bottom-assets-card {
      display: flex;
      flex-direction: column;
      flex: 1 auto;
      background-color: var(--bg-1);
      z-index: 0;
      position: relative;
      overflow: hidden;
      @media ${MediaInfo.mobile} {
        margin-top: 10px;
      }
      .bottom-container {
        display: flex;
        flex: 1 auto;
        justify-content: space-between;
        overflow: hidden;
        @media ${MediaInfo.desktop} {
          padding: 0;
        }
        @media ${MediaInfo.tablet} {
          padding-top: 10px;
        }
        @media ${MediaInfo.mobile} {
          padding: 10px 10px 14px;
        }
        :global(.pie-chart) {
          padding: 0 0 0 48px;
          @media ${MediaInfo.mobile} {
            padding: 0;
          }
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
