import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import CopyData from './copyData';
import CopyYieldsRatio from './copyYieldsRatio';
import Overview from './Overview';
import TotalImcome from './totalImcome';
import Follower from './follower';
import PositionDistribution from './positionDistribution';
import Preference from './preference';
import { MediaInfo } from '@/core/utils';
import { Copy } from '@/core/shared';
import { LANG } from '@/core/i18n';
import { BRING_DATA, OVERVIEW_DATA, FOLLOWERS_DATA,PREFERENCE_DATA } from '@/core/shared/src/copy/types';
export default function CopyTradingPreformance(props: { tabKey: string }) {
  const tabKey = props.tabKey;
  const [dateActive, setDateActive] = useState(7);
  const [performanceData, setPerformanceData] = useState({
    bringData: {} as BRING_DATA,
    overviewData: {} as OVERVIEW_DATA,
    followersData:[] as FOLLOWERS_DATA[],
    preferenceData:[] as PREFERENCE_DATA[],
    chartData: []
  });
  const copyDetailTab = [
    {
      label: LANG('近{days}日', { days: 7 }),
      key: 7
    },
    {
      label: LANG('近{days}日', { days: 30 }),
      key: 30
    },
    {
      label: LANG('近{days}日', { days: 90 }),
      key: 90
    },
    {
      label: LANG('近{days}日', { days: 180 }),
      key: 180
    }
  ];
  const onChange = (key: string) => {
    console.log(key, 'key');
  };
  //
  const user = useMemo(()=>{
    const userInfo: any = Copy.getUserInfo();
    return userInfo
  },[])
  // 带单数据
  const fetchBringData = async () => {
    const bringData = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: dateActive, uid: user?.user?.uid });
    console.log(bringData, 'bringData=====');
    if (bringData.code === 200) {
      setPerformanceData({
        ...performanceData,
        bringData: bringData.data
      });
    }
  };

  // 带单员总览
  const fetchOverviewData = async () => {
    const overview = await Copy.fetchCopyTradeuserBase({ uid: user?.user?.uid });
    console.log(overview, 'overview=====');
    if (overview.code === 200) {
      setPerformanceData({
        ...performanceData,
        overviewData: overview.data
      });
    }
  };
  // 跟随者
  const fetchTraderList = async () => {
    const follower = await Copy.getCopyTraderList({ lUid: user?.user?.uid, page: 1, size: 10 });
    console.log(follower, 'follower=====');
    if (follower.code === 200) {
      setPerformanceData({
        ...performanceData,
        followersData: follower.data.pageData || []
      });
    }
  };
  //总收益&收益率
  const fetchChartData = async () => {
    const chart = await Copy.fetchCopyTradeuserStatisticsList({ cycle: dateActive, uids: user?.user?.uid });
    console.log(chart, 'chart=====');
    if (chart.code === 200) {
      setPerformanceData({
        ...performanceData,
        chartData: chart.data
      });
    }
  };


  const selectDate = () => {
    fetchBringData()
    fetchChartData()
  }
  const fetchData = () => {
    fetchOverviewData();
    fetchBringData();
    fetchTraderList();
    fetchChartData();
  };
 
  useEffect(() => {
    fetchData();
  }, []);
  const PreformanceData = () => {
    return (
      <>
        {(tabKey === 'performanceData' || tabKey === 'performance') && (
          <div className="copy-preformance-left">
            <CopyData overviewData={performanceData.overviewData}  bringData={performanceData.bringData} cycle={dateActive}/>
            <Overview overviewData={performanceData.overviewData} />
            <Follower followersData={performanceData.followersData}  overviewData={performanceData.overviewData}/>
          </div>
        )}
        <style jsx>{styles}</style>
      </>
    );
  };
  const PreformanceChart = () => {
    return (
      <>
        {(tabKey === 'performanceChart' || tabKey === 'performance') && (
          <div className="copy-preformance-right">
            <CopyYieldsRatio />
            <TotalImcome />
            <div className="copy-preformance-dis">
              <Preference preferenceData={performanceData.preferenceData} />
              <PositionDistribution />
            </div>
          </div>
        )}
        <style jsx>{styles}</style>
      </>
    );
  };
  return (
    <>
      <div className="copy-preformance-box">
        <div className="copy-preformance">
          <div className="copy-detail-date">
            {copyDetailTab.map(item => {
              return (
                <div
                  className={`${item.key === dateActive ? 'copy-date-item copy-date-atice' : 'copy-date-item '}`}
                  key={item.key}
                  onClick={() => {
                    setDateActive(item.key);
                    selectDate()
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="copy-preformance-chart">
          <PreformanceData />
          <PreformanceChart />
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

const styles = css`
  .copy-preformance-box {
    @media ${MediaInfo.mobile} {
      margin: 0 24px;
    }
  }
  .copy-preformance {
    .copy-detail-date {
      margin: 24px 0;
      display: flex;
      align-items: center;
      color: var(--text-secondary, #787d83);
      text-align: center;
      font-family: 'HarmonyOS Sans SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      gap: 16px;
    }
    .copy-date-item {
      padding: 8px 16px;
      border: 1px solid;
      border-radius: 6px;
      border: 1px solid var(--line-3);
      cursor: pointer;
    }
    .copy-date-atice {
      background: var(--fill-3);
      color: var(--text-primary);
    }
    &-chart {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    &-left {
      width: 480px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      color: var(--text-tertiary);
      font-family: 'HarmonyOS Sans SC';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      @media ${MediaInfo.mobile} {
        flex: 1;
      }
    }

    &-right {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 24px;
    }
    &-dis {
      height: 346px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 24px;
    }
  }
`;
