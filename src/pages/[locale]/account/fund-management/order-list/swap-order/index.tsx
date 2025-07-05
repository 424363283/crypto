import TabBar from '@/components/tab-bar';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { getUrlQueryParams } from '@/core/utils';
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
const _isSwapDemo = isSwapDemo();
function SwapHistoryOrder({
  isSwapU,
  onTabChange,
}: {
  isSwapU: boolean;
  onTabChange: (url: string, { id }: { id: string }) => void;
}) {
  const queryId = (getUrlQueryParams('tab') as SWAP_HISTORY_ORDER_TYPE) || SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS;
  const [curTab, setCurTab] = useState<SWAP_HISTORY_ORDER_TYPE>(queryId);
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
          size={Size.XL}
          options={[
            { label: LANG('当前委托'), value: SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS },
            { label: LANG('历史委托'), value: SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS },
            { label: LANG('历史成交'), value: SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION },
            { label: LANG('资金流水'), value: SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW },
          ]}
          value={curTab}
          onChange={onChange}
        />
        <SwapFilterWithTable isSwapU={isSwapU} />
      </AssetTableCard>
      <style jsx>{styles}</style>
    </CommonContainer>
  );
}
const styles = css`
  :global(.swap-order-container) {
    min-height: 100% !important;
    :global(.asset-table-card) {
      width: var(--const-max-page-width);
      z-index: 11;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 8px 0px;
      margin-bottom: 20px;
    }
  }
`;
export default SwapHistoryOrder;
