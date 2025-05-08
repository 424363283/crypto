import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { CommonFundHistoryRecord } from '../components/fund-history-record';
import { FUND_HISTORY_TAB_KEY } from '../types';
import { Size } from '@/components/constants';
import { MediaInfo } from '@/core/utils';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import Image from 'next/image';
import { DesktopOrTablet, Mobile } from '@/components/responsive';

const PrevIcon = () => {
  return (
    <div className="mobile-arrow-left">
      <Image src="/static/images/common/arrow_left.svg" width={16} height={16} alt="icon" />
    </div>
  );
};
const NextIcon = () => {
  return (
    <div className="mobile-arrow-right">
      <Image src="/static/images/common/arrow_right.svg" width={16} height={16} alt="icon" />
    </div>
  );
};

function FundHistory() {
  const router = useRouter();
  const { isMobile } = useResponsive();
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
    <div className="fund-history-column border-1 rounded-1">
      <DesktopOrTablet>
        <TabBar
          type={TAB_TYPE.TEXT}
          size={isMobile ? Size.LG : Size.XL}
          options={[
            { label: LANG('划转记录'), value: FUND_HISTORY_TAB_KEY.MOVE_RECORD },
            { label: LANG('充币记录'), value: FUND_HISTORY_TAB_KEY.RECHARGE_RECORD },
            { label: LANG('提币记录'), value: FUND_HISTORY_TAB_KEY.WITHDRAW_RECORD },
            { label: LANG('内部转账记录'), value: FUND_HISTORY_TAB_KEY.TRANSFER_RECORD }
            // { label: LANG('法币记录'), value: FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD },
            // { label: LANG('闪兑记录'), value: FUND_HISTORY_TAB_KEY.FLASH_EXCHANGE_RECORD },
          ]}
          value={curTab}
          onChange={onChange}
          className="fund-history-tab"
        />
      </DesktopOrTablet>
      <Mobile>
        <ScrollXWrap prevIcon={<PrevIcon />} wrapClassName="mobile-list" nextIcon={<NextIcon />}>
          {[
            { label: LANG('划转记录'), value: FUND_HISTORY_TAB_KEY.MOVE_RECORD },
            { label: LANG('充币记录'), value: FUND_HISTORY_TAB_KEY.RECHARGE_RECORD },
            { label: LANG('提币记录'), value: FUND_HISTORY_TAB_KEY.WITHDRAW_RECORD },
            { label: LANG('内部转账记录'), value: FUND_HISTORY_TAB_KEY.TRANSFER_RECORD }
            // { label: LANG('法币记录'), value: FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD },
            // { label: LANG('闪兑记录'), value: FUND_HISTORY_TAB_KEY.FLASH_EXCHANGE_RECORD },
          ].map(item => (
            <div
              key={item.value}
              onClick={() => onChange(item.value)}
              className={curTab === item.value ? 'active' : ''}
            >
              {item.label}
            </div>
          ))}
        </ScrollXWrap>
      </Mobile>
      {renderTabContent()}
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .fund-history-column {
    background-color: var(--fill_bg_1);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    min-height: calc(100vh - 82px);
    padding-bottom: 20px;
    @media ${MediaInfo.mobile} {
      padding: 12px;
      :global(.mobile-list) {
        display: flex;
        align-items: center;
        gap: 24px;
        width: 100%;
        margin: 0;

        div {
          height: 28px;
          line-height: 24px;
        }
        .active {
          color: var(--text_brand);
          border-bottom: 1px solid var(--brand);
        }
      }
      :global(.scroll-wrap) {
        border-bottom: 1px solid var(--fill_line_1);
        // padding-bottom: 12px;

        :global(.prev) {
          left: 0;
        }
        :global(.next) {
          right: 0;
        }
      }

      // :global(.fund-history-tab) {
      //   width: auto;
      //   padding: 0;
      //   :global(.tabs) {
      //     width: auto;
      //     gap: 24px;
      //     border-bottom: 1px solid var(--fill_line_1);
      //   }
      //   :global(.tab) {
      //     display: flex;
      //     align-items: flex-start;
      //     justify-content: center;
      //     height: 28px;
      //     white-space: nowrap;
      //   }
      //   :global(.tab.active) {
      //     border-bottom: 1px solid var(--brand);
      //   }
      // }
    }
  }
`;
export default FundHistory;
