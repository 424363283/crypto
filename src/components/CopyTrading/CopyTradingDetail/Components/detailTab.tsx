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
import TraderSharingData from './traderSharingData';
import TraderHistory from './traderHistory';
import TraderCurrent from './traderCurrent';
import CopyBtn from './copyBtn';
import { message } from '@/core/utils';
import CopyInput from './copyInput';
import { CopyTradeType, CopyTradeSetting, CopyTabActive } from './types';
import { Copy } from '@/core/shared';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
export default function CopyTradingTab() {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { userType, id, copyActiveType } = router.query;
  const hasAllClose = useCopyTradingSwapStore.use.hasAllClose();
  const setfetchAllClose = useCopyTradingSwapStore.use.setfetchAllClose();
  const setTabsActive = useCopyTradingSwapStore.use.setTabsActive();
  const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const copyDetailTab: TabsProps['items'] = [
    {
      label: LANG('表现'),
      key: CopyTabActive.performance,
      tabKey: 'pc',
      children: <Performance tabKey={CopyTabActive.performance} />
    },
    {
      label: LANG('数据'),
      tabKey: 'mobile',
      key: CopyTabActive.performanceData,
      children: <Performance tabKey={CopyTabActive.performanceData} />
    },
    {
      label: LANG('图表'),
      tabKey: 'mobile',
      key: CopyTabActive.performanceChart,
      children: <Performance tabKey={CopyTabActive.performanceChart} />
    },
    {
      label: userType === CopyTradeType.myFllow ? LANG('当前仓位') : LANG('当前带单'),
      key: CopyTabActive.current,
      children: <TraderCurrent />
    },
    {
      label: userType === CopyTradeType.myFllow ? LANG('历史仓位') : LANG('历史带单'),
      key: CopyTabActive.history,
      children: <TraderHistory />
    },
    {
      label: userType === CopyTradeType.myFllow ? LANG('跟随交易员') : LANG('跟随者'),
      key: CopyTabActive.follower,
      children: <TraderFollower />
    }
  ];
  const onChange = (key: string) => {
    setTabsActive(key);
  };
  const showCopyTab = useMemo(() => {
    const isMobileTab = isMobile
      ? copyDetailTab.filter(item => item.tabKey !== 'pc')
      : copyDetailTab.filter(item => item.tabKey !== 'mobile');
    if (userType === CopyTradeType.myFllow) {
      const copyList = isMobileTab.filter(
        (item: any) => item.key !== CopyTabActive.performance && item.key !== CopyTabActive.follower
      );
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
        return isMobileTab.filter((item: any) => item.key !== CopyTabActive.performance);
      }
    } else if (userType === CopyTradeType.myBring) {
      return [
        ...isMobileTab,
        {
          label: LANG('分润数据'),
          key: CopyTabActive.sharingData,
          children: <TraderSharingData />
        }
      ];
    } else {
      return isMobileTab;
    }
  }, [userType, copyActiveType, id, isMobile]);

  const showAllClose = useMemo(() => {
    return hasAllClose;
  }, [hasAllClose]);
  const handleAllColse = async () => {
    const res = await Copy.fetchSwapPositionCloseAll({
      source: 1,
      subWallet: 'COPY'
    });
    if (res.code === 200) {
      message.success('操作成功');
      setfetchAllClose(true);
    }
  };
  const TabBarContent = () => {
    console.log(222222222);
    return (
      <>
        {!isMobile && (
          <>
            {/* 我的跟单/当前仓位 */}
            {CopyTradeType.myFllow === userType && tabsActive === CopyTabActive.current && (
              <>
                <div className="flexEnd ">
                  <CopyInput placeTxt={'搜索交易员'} />
                  {showAllClose && (
                    <div className={'mb8'}>
                      <CopyBtn textSize={'textSize16'} onClick={handleAllColse} btnTxt={LANG('一键全平')} />
                    </div>
                  )}
                </div>
              </>
            )}
            {/* 我的跟单/历史仓位 */}
            {CopyTradeType.myFllow === userType && tabsActive === CopyTabActive.history && (
              <>
                <div className="flexEnd mb8">
                  <CopyInput placeTxt={'搜索交易员'} />
                </div>
              </>
            )}
            {CopyTradeType.myBring === userType && tabsActive === CopyTabActive.current && showAllClose && (
              <div className={'mb8'}>
                <CopyBtn textSize={'textSize16'} onClick={handleAllColse} btnTxt={LANG('一键全平')} />
              </div>
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
      color: var(--text_3);
      font-family: 'HarmonyOS Sans SC';
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
    }
    :global(.ant-tabs-top > .ant-tabs-nav::before) {
      border-bottom: 1px solid var(--fill_line_3);
    }

    :global(.ant-tabs-nav-wrap) {
      @media ${MediaInfo.mobile} {
        padding-left: 20px;
      }
    }
    :global(.ant-tabs-tab-btn) {
      text-shadow: none !important;
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
    :global(.ant-tabs-tab.ant-tabs-tab-focus .ant-tabs-tab-btn) {
      outline: none;
      outline-offset: 0;
    }
    :global(.ant-tabs .ant-tabs-ink-bar) {
      background: transparent;
    }
  }

  .flexEnd {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
  }
  .mb8 {
    margin-bottom: 8px;
  }
`;
