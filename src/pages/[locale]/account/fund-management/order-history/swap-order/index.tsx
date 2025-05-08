import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { getUrlQueryParams, MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import AssetTableCard from '../../assets-overview/components/asset-table-card';
import { checkIsUsdtType } from '../../assets-overview/helper';
import CommonContainer from '../components/common-banner';
import { SWAP_HISTORY_ORDER_TYPE } from './types';
const SwapFilterWithTable = dynamic(() => import('./components/swap-filter-with-table'));

import { isSwapDemo } from '@/core/utils/src/is';
import { Size } from '@/components/constants';
import { useResponsive } from '@/core/hooks';
const _isSwapDemo = isSwapDemo();
function SwapHistoryOrder({
  isSwapU,
  onTabChange
}: {
  isSwapU: boolean;
  onTabChange: (url: string, { id }: { id: string }) => void;
}) {
  const queryId = (getUrlQueryParams('tab') as SWAP_HISTORY_ORDER_TYPE) || SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS;
  const [curTab, setCurTab] = useState<SWAP_HISTORY_ORDER_TYPE>(queryId);
  const { isMobile } = useResponsive();
  const onChange = (selectedTab: string) => {
    if (curTab !== selectedTab) {
      const swapUrl = `/account/fund-management/order-history/${!_isSwapDemo ? '' : 'demo/'}${
        isSwapU ? 'swap-u-order' : 'swap-order'
      }`;
      onTabChange(swapUrl, { id: selectedTab });
    }
  };

  useEffect(() => {
    Swap.Assets.fetchBalance(checkIsUsdtType());
    setCurTab(queryId);
    return Swap.fetchInitData();
  }, [queryId]);

  return (
    <CommonContainer>
      <AssetTableCard>
        <TabBar
          type={TAB_TYPE.CARD}
          // size ={isMobile? Size.SM : Size.XS}
          size={Size.XS}
          options={[
            { label: LANG('当前委托'), value: SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS },
            { label: LANG('历史委托'), value: SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS },
            { label: LANG('历史成交'), value: SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION },
            { label: LANG('历史仓位'), value: SWAP_HISTORY_ORDER_TYPE.HISTORY_POSITION },
            { label: LANG('资金流水'), value: SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW }
          ]}
          value={curTab}
          onChange={onChange}
          className="swap-tab"
        />
        <SwapFilterWithTable isSwapU={isSwapU} />
      </AssetTableCard>
      <style jsx>{styles}</style>
    </CommonContainer>
  );
}
const styles = css`
  :global(.order-history-common-container) {
    :global(.asset-table-card) {
      border: unset;
    }
    @media ${MediaInfo.mobile} {
      :global(.swap-tab) {
        width: auto;
        padding: 0;
        :global(.tabs) {
          gap: 16px;
          height: 56px;
          border-bottom: 1px solid var(--fill_line_1);
        }
        :global(.tab) {
          height: auto;
        }
        :global(.tab.card > div) {
          padding: 8px 12px;
          border-radius:4px;
        }
      }
    }
  }
`;
export default SwapHistoryOrder;
