import { Desktop, Mobile } from '@/components/responsive';
import { MediaInfo } from '@/core/utils';
import { memo } from 'react';
import HeaderAssetCard from '../../../components/asset-card';
import AssetTableCard from '../../../components/asset-table-card';
import { SpotTable } from '../../../components/spot-asset/spot-table';
import { WalletType } from '../../../components/types';
import { WalletBalanceCard } from '../../../components/walet-balance-card';
import { AssetContent } from './asset-content';
import { RecentTransactionCard } from './recent-transaction-card';

// 资产总览顶部卡片
const AssetAllUi = () => {
  return (
    <>
      <div className='assets-top-card'>
        <HeaderAssetCard>
          <WalletBalanceCard type={WalletType.ASSET_TOTAL} />
          <AssetContent />
        </HeaderAssetCard>
        <Desktop>
          <RecentTransactionCard />
        </Desktop>
      </div>
      <AssetTableCard>
        <SpotTable />
      </AssetTableCard>
      <Mobile>
        <RecentTransactionCard />
      </Mobile>
      <style jsx>{`
        .assets-top-card {
          display: flex;
          height: 412px;
          margin-bottom: 8px;
          @media ${MediaInfo.mobile} {
            margin-bottom: 10px;
          }
          @media ${MediaInfo.mobileOrTablet} {
            height: 100%;
          }
          @media ${MediaInfo.tablet} {
            border-radius: 15px;
          }
        }
      `}</style>
    </>
  );
};
export default memo(AssetAllUi);
