import TabBar from '@/components/tab-bar';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { CommonFundHistoryRecord } from '../components/fund-history-record';
import { FUND_HISTORY_TAB_KEY } from '../types';

function FundHistory() {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.asPath);
  const tabId = (searchParams.get('tab') as FUND_HISTORY_TAB_KEY) || FUND_HISTORY_TAB_KEY.MOVE_RECORD;
  const [curTab, setCurTab] = useState<FUND_HISTORY_TAB_KEY>(tabId);
  const onChange = (selectedTab: string) => {
    if (curTab !== selectedTab) {
      router.replace(`/account/fund-management/assets-overview?type=fund-history&tab=${selectedTab}`);
      setCurTab(selectedTab as FUND_HISTORY_TAB_KEY);
    }
  };
  const renderTabContent = () => {
    return <CommonFundHistoryRecord tabKey={curTab} />;
  };
  useEffect(() => {
    setCurTab(tabId);
  }, [tabId]);
  return (
    <div className='fund-history-column'>
      <TabBar
        options={[
          { label: LANG('划转记录'), value: FUND_HISTORY_TAB_KEY.MOVE_RECORD },
          { label: LANG('法币记录'), value: FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD },
          { label: LANG('充币记录'), value: FUND_HISTORY_TAB_KEY.RECHARGE_RECORD },
          { label: LANG('提币记录'), value: FUND_HISTORY_TAB_KEY.WITHDRAW_RECORD },
          { label: LANG('转账记录'), value: FUND_HISTORY_TAB_KEY.TRANSFER_RECORD },
          { label: LANG('闪兑记录'), value: FUND_HISTORY_TAB_KEY.FLASH_EXCHANGE_RECORD },
        ]}
        value={curTab}
        onChange={onChange}
      />
      {renderTabContent()}
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .fund-history-column {
    background-color: var(--theme-background-color-2);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    min-height: calc(100vh - 82px);
    padding-bottom: 20px;
  }
`;
export default FundHistory;
