import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MediaInfo } from '@/core/utils';
import { Tabs, Input } from 'antd';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import type { TabsProps } from 'antd';
import Performance from './performance';
import TraderFollower from './traderFollower';
import TraderFollowerSetting from './traderFollowerSetting';
import TraderHistory from './traderHistory';
import TraderCurrent from './traderCurrent';
import CopyBtn from './copyBtn';
import CopyInput from './copyInput';
import { CopyTradeType, CopyTradeSetting } from './types';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
export default function CopyTradingTab() {
  const { isMobile } = useResponsive();
  const { copyUserType, copyActiveType, copyUserId } = useCopyState();
  const [tabsActive, setTabsActive] = useState('current');
  const copyDetailTab: TabsProps['items'] = [
    {
      label: LANG('表现'),
      key: 'performance',
      tabKey: 'pc',
      children: <Performance tabKey={'performance'} />
    },
    {
      label: LANG('数据'),
      tabKey: 'mobile',
      key: 'performanceData',
      children: <Performance tabKey={'performanceData'} />
    },
    {
      label: LANG('图表'),
      tabKey: 'mobile',
      key: 'performanceChart',
      children: <Performance tabKey={'performanceChart'} />
    },
    {
      label: copyUserType === CopyTradeType.myFllow ? LANG('当前仓位') : LANG('当前带单'),
      key: 'current',
      children: <TraderCurrent />
    },
    {
      label: copyUserType === CopyTradeType.myFllow ? LANG('历史仓位') : LANG('历史带单'),
      key: 'history',
      children: <TraderHistory />
    },
    {
      label: copyUserType === CopyTradeType.myFllow ? LANG('跟随交易员') : LANG('跟随者'),
      key: 'follower',
      children: <TraderFollower />
    }
  ];
  const onChange = (key: string) => {
    console.log(key, 'key');
    setTabsActive(key);
  };
  const showCopyTab = useMemo(() => {
    const isMobileTab = isMobile
      ? copyDetailTab.filter(item => item.tabKey !== 'pc')
      : copyDetailTab.filter(item => item.tabKey !== 'mobile');
    if (copyUserType === CopyTradeType.myFllow) {
      const copyList = isMobileTab.filter((item: any) => item.key !== 'performance' && item.key !== 'follower');
      if (copyActiveType === CopyTradeSetting.followDetial) {
        return [
          ...copyList,
          {
            label: LANG('跟单设置'),
            key: 'followerSetting',
            children: <TraderFollowerSetting />
          }
        ];
      } else {
        return isMobileTab.filter((item: any) => item.key !== 'performance');
      }
    } else {
      return isMobileTab;
    }
  }, [copyUserType, copyActiveType, copyUserId, isMobile]);
  const onSearch = (value: string) => {};
  const TabBarContent = () => {
    return (
      <>
        {!isMobile && (
          <>
            {/* 我的跟单/当前仓位 */}
            {CopyTradeType.myFllow === copyUserType && tabsActive === 'current' && (
              <>
                <div className="flexEnd ">
                  <CopyInput placeTxt={LANG('搜索交易员')} />
                  <CopyBtn btnTxt={LANG('一键全平')} />
                </div>
              </>
            )}
            {/* 我的跟单/历史仓位 */}
            {CopyTradeType.myFllow === copyUserType && tabsActive === 'history' && (
              <>
                <div className="flexEnd">
                  <CopyInput placeTxt={LANG('搜索交易员')} />
                </div>
              </>
            )}
            {CopyTradeType.myBring === copyUserType && tabsActive === 'current' && (
              <CopyBtn btnTxt={LANG('一键全平')} />
            )}
          </>
        )}
        <style jsx>{styles}</style>
      </>
    );
  };
  return (
    <>
      <div className="copy-detail-tab">
        <Tabs
          defaultActiveKey={tabsActive}
          tabBarExtraContent={<TabBarContent />}
          items={showCopyTab}
          tabBarStyle={{ borderBottom: 'unset' }}
          onChange={onChange}
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

const styles = css`
  .copy-detail-tab {
    margin-bottom: 120px;
    :global(.ant-tabs-tab) {
      color: var(--text-tertiary);
      font-family: 'HarmonyOS Sans SC';
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    :global(.ant-tabs-top > .ant-tabs-nav::before) {
      border-bottom: 1px solid var(--line-3);
    }

    :global(.ant-tabs-nav-wrap) {
      @media ${MediaInfo.mobile} {
        padding-left: 20px;
      }
    }
    :global(.ant-tabs-tab-btn) {
      font-family: 'HarmonyOS Sans SC';
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      @media ${MediaInfo.mobile} {
        font-size: 16px;
      }
    }
    :global(.ant-tabs .ant-tabs-tab:hover) {
      color: var(--brand);
    }
    :global(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: var(--brand);
      text-shadow: 0 0 0.25px currentcolor;
    }
    :global(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: var(--brand);
      text-shadow: 0 0 0.25px currentcolor;
    }
    :global(.ant-tabs .ant-tabs-ink-bar) {
      background: transparent;
    }
  }

  .flexEnd {
    display: flex;
    gap: 16px;
  }
`;
