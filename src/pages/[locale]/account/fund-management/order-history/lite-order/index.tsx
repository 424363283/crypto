import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { LANG } from '@/core/i18n';
import { getUrlQueryParams } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import AssetTableCard from '../../assets-overview/components/asset-table-card';
import CommonContainer from '../components/common-banner';
import { LiteCurrentCommissionTable } from './components/current-commission/table';
import { LiteHistoryTransactionTable } from './components/history-transaction/table';
import { LiteHistoryFundsTable } from './components/history-funds/table';
import { LITE_HISTORY_TAB_KEY } from './types';
import { Size } from '@/components/constants';

function LiteHistoryOrder({ onTabChange }: { onTabChange: (url: string, { id }: { id: string }) => void }) {
  const queryId = (getUrlQueryParams('tab') as LITE_HISTORY_TAB_KEY) || LITE_HISTORY_TAB_KEY.CURRENT_COMMISSION;
  const [curTab, setCurTab] = useState<LITE_HISTORY_TAB_KEY>(queryId);
  const onChange = (selectedTab: string) => {
    if (curTab !== selectedTab) {
      const liteUrl = `/account/fund-management/order-history/lite-order`;
      onTabChange(liteUrl, { id: selectedTab });
    }
  };
  useEffect(() => {
    setCurTab(queryId);
  }, [queryId]);
  const renderTabContent = () => {
    const TAB_CONTENT_MAP: { [key: string]: JSX.Element } = {
      [LITE_HISTORY_TAB_KEY.CURRENT_COMMISSION]: <LiteCurrentCommissionTable />,
      [LITE_HISTORY_TAB_KEY.HISTORY_TRANSACTION]: <LiteHistoryTransactionTable />,
      [LITE_HISTORY_TAB_KEY.ASSET_FLOW]: <LiteHistoryFundsTable />,
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
          type ={TAB_TYPE.CARD}
          size ={Size.XS}
          options={[
            { label: LANG('当前委托'), value: LITE_HISTORY_TAB_KEY.CURRENT_COMMISSION },
            { label: LANG('历史成交'), value: LITE_HISTORY_TAB_KEY.HISTORY_TRANSACTION },
            { label: LANG('资金流水'), value: LITE_HISTORY_TAB_KEY.ASSET_FLOW },
          ]}
          value={curTab}
          onChange={onChange}
        />
        {renderTabContent()}
      </AssetTableCard>
    </CommonContainer>
  );
}

export default LiteHistoryOrder;
