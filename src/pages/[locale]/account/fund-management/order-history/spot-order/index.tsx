import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { LANG } from '@/core/i18n';
import { getUrlQueryParams, MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import AssetTableCard from '../../assets-overview/components/asset-table-card';
import CommonContainer from '../components/common-banner';
import { SpotCurrentCommissionTable } from './components/current-commission/table';
import { SpotHistoryCommissionTable } from './components/history-commission/table';
import { SpotHistoryTransactionTable } from './components/history-transaction/table';
import { SPOT_HISTORY_TAB_KEY } from './types';
import { Size } from '@/components/constants';
import { Mobile } from '@/components/responsive';

function SpotHistoryOrder({ onTabChange }: { onTabChange: (url: string, { id }: { id: string }) => void }) {
  const queryId = (getUrlQueryParams('tab') as SPOT_HISTORY_TAB_KEY) || SPOT_HISTORY_TAB_KEY.CURRENT_COMMISSION;
  const [curTab, setCurTab] = useState<SPOT_HISTORY_TAB_KEY>(queryId);
  const onChange = (selectedTab: string) => {
    if (curTab !== selectedTab) {
      const spotUrl = `/account/fund-management/order-history/spot-order`;
      onTabChange(spotUrl, { id: selectedTab });
    }
  };
  useEffect(() => {
    setCurTab(queryId);
  }, [queryId]);
  const renderTabContent = () => {
    const TAB_CONTENT_MAP: { [key: string]: JSX.Element } = {
      [SPOT_HISTORY_TAB_KEY.CURRENT_COMMISSION]: <SpotCurrentCommissionTable />,
      [SPOT_HISTORY_TAB_KEY.HISTORY_COMMISSION]: <SpotHistoryCommissionTable />,
      [SPOT_HISTORY_TAB_KEY.HISTORY_TRANSACTION]: <SpotHistoryTransactionTable />
    };
    if (TAB_CONTENT_MAP.hasOwnProperty(curTab)) {
      return TAB_CONTENT_MAP[curTab];
    }
    return <></>;
  };
  return (
    <CommonContainer>
      <AssetTableCard border={false} rounded={false}>
        <TabBar
          type={TAB_TYPE.CARD}
          size={Size.XS}
          options={[
            { label: LANG('当前委托'), value: SPOT_HISTORY_TAB_KEY.CURRENT_COMMISSION },
            { label: LANG('历史委托'), value: SPOT_HISTORY_TAB_KEY.HISTORY_COMMISSION },
            { label: LANG('历史成交'), value: SPOT_HISTORY_TAB_KEY.HISTORY_TRANSACTION },
          ]}
          value={curTab}
          onChange={onChange}
          className="spot-tab"
        />
        <Mobile>
          <div className='line'></div>
        </Mobile>
        {renderTabContent()}
      </AssetTableCard>
      <style jsx>{styles}</style>
    </CommonContainer>
  );
}
const styles = css`
  :global(.order-history-common-container) {
    min-height: 100% !important;
    :global(.asset-table-card) {
      .line {
        border-bottom: 1px solid var(--fill_line_1);
      }
    }
  }
  @media ${MediaInfo.mobile} {
    :global(.spot-tab) {
      width: auto;
      padding: 0 !important;
      :global(.tabs) {
        width:100%;
        gap: 16px;
      }
      :global(.tab) {
        height: auto !important;
      }
      :global(.tab.card > div) {
        padding: 8px 12px !important;
        border-radius: 4px !important;
      }
    }
  }
`;
export default SpotHistoryOrder;
