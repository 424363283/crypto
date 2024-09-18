import TabBar from '@/components/tab-bar';
import { LANG } from '@/core/i18n';
import { WS3001 } from '@/core/network';
import { Assets } from '@/core/shared';
import { useEffect, useState } from 'react';
import HeaderAssetCard from '../../components/asset-card';
import AssetTableCard from '../../components/asset-table-card';
import { WalletType } from '../../components/types';
import { WalletBalanceCard } from '../../components/walet-balance-card';
import { LiteAssetsContent } from './components/assets-content';
import { FirmPosition } from './components/firm-position';
import { HistoryDeal } from './components/history-deal';
import { PlanCommission } from './components/plan-commission';

enum TAB_KEY {
  FIRM_POSITION = 'FIRM_POSITION',
  PLAN_COMMISSION = 'PLAN_COMMISSION',
  HISTORICAL_TRANSACTION = 'HISTORICAL_TRANSACTION',
}

function AssetLitePage() {
  const [curTab, setCurTab] = useState(TAB_KEY.FIRM_POSITION);
  const onChange = (value: string) => {
    setCurTab(value as TAB_KEY);
  };

  useEffect(() => {
    Assets.dispatchWsListener();
    return () => {
      Assets.destroyWsListener();
    };
  }, []);

  const renderTabContent = () => {
    const TAB_CONTENT_MAP = {
      [TAB_KEY.FIRM_POSITION]: <FirmPosition />,
      [TAB_KEY.PLAN_COMMISSION]: <PlanCommission />,
      [TAB_KEY.HISTORICAL_TRANSACTION]: <HistoryDeal />,
    };
    return TAB_CONTENT_MAP[curTab];
  };
  return (
    <>
      <HeaderAssetCard>
        <WalletBalanceCard type={WalletType.ASSET_LITE} />
        <LiteAssetsContent />
      </HeaderAssetCard>
      <AssetTableCard>
        <TabBar
          options={[
            { label: LANG('实盘持仓'), value: TAB_KEY.FIRM_POSITION },
            { label: LANG('计划委托'), value: TAB_KEY.PLAN_COMMISSION },
            { label: LANG('历史成交'), value: TAB_KEY.HISTORICAL_TRANSACTION },
          ]}
          value={curTab}
          onChange={onChange}
        />
        {renderTabContent()}
      </AssetTableCard>
    </>
  );
}

export default WS3001(AssetLitePage, { lite: true });
