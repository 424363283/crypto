import React, { useEffect, useCallback, useState } from 'react';
import css from 'styled-jsx/css';
import CopyData from './copyData';
import CopyYieldsRatio from './copyYieldsRatio';
import Overview from './Overview';
import TotalImcome from './totalImcome';
import Follower from './follower';
import PositionDistribution from './positionDistribution';
import { formatTimeDiff } from '@/core/shared/src/copy/utils';
import Preference from './preference';
import { MediaInfo,formatNumber2Ceil } from '@/core/utils';
import { Copy } from '@/core/shared';
import { LANG } from '@/core/i18n';
import {  useRouter } from '@/core/hooks';
import { BRING_DATA, OVERVIEW_DATA, FOLLOWERS_DATA } from '@/core/shared/src/copy/types';
import dayjs from 'dayjs';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
export default function CopyTradingPreformance(props: { tabKey: string }) {
  const tabKey = props.tabKey;
   const router = useRouter();
  const { id } =  router.query
  const [dateActive, setDateActive] = useState(7);
  const [bringData, setBringData] = useState({} as BRING_DATA);
  const [overviewData, setOverviewData] = useState({} as OVERVIEW_DATA);
  const [followersData, setFollowersData] = useState([] as FOLLOWERS_DATA[]);
  const [preferenceeData, setPreferenceeData] = useState([]);
  const [historyData, setHistoryData] = useState({
    positiveList: [] as any,
    negativeList: [] as any
  });
  const [configInfoY, setConfigInfoY] = useState({
    max: 100,
    min:0
  });
  const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const [chartData, setChartData] = useState({
    profitAmountList: [],
    profitRateList: []
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
  // 带单数据
  const fetchBringData = async (bringData:any) => {
    // const bringData = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: dateActive, uid: id });
    if (bringData.code === 200) {
      setBringData(bringData.data);
    }
  };

  // 带单员总览
  const fetchOverviewData = async (overview:any) => {
    // const overview = await Copy.fetchCopyTradeuserBase({ uid: id });
    if (overview.code === 200) {
      setOverviewData({
        ...overview.data
      });
    }
  };
  // 跟随者
  const fetchTraderList = async (follower:any) => {
    if (follower.code === 200) {
      setFollowersData(follower.data.pageData || []);
    }
  };
  //总收益&收益率
  const fetchChartData = async (chart:any) => {
    // const chart = await Copy.fetchCopyTradeuserStatisticsList({ cycle: dateActive, uids: id });
    if (chart.code === 200) {
      const profitAmount: any = [];
      const profitRate: any = [];
      const result: any = chart.data[0].list;
      result.forEach((ele: any) => {
        profitAmount.push({
          time: ele.ctime,
          ctime: dayjs(ele.ctime).format('MM-DD'),
          incomeAmount: Number((ele?.unRealizedPnl||0)?.add(ele?.pnl||0)?.toFixed(2)) || 0
        });
        profitRate.push({
          time: ele.ctime,
          ctime: dayjs(ele.ctime).format('MM-DD'),
          profitRate: Number(ele.profitRate.mul(100).toFixed(Copy.copyFixed)) || 0
        });
      });
      setChartData({
        profitAmountList: profitAmount.sort((a, b) => Number(a.time) - Number(b.time)),
        profitRateList: profitRate.sort((a, b) => Number(a.time) - Number(b.time))
      });
    }
  };
  // 持仓分布用历史持仓查询接口，有开仓时间和平仓时间，每个仓位根据平仓-开仓算出持仓时间。然后盈利用仓位已实现盈亏，字段名realizedPnl
  const fetchHistoryList = async (res:any) => {
    const startDate = dayjs()
      .subtract(dateActive - 1, 'day')
      .startOf('day')
      .valueOf(); // 7天前（含今天）
    const endDate = dayjs().endOf('day').valueOf(); // 今天结束时间
    const params: any = {
      uid: id,
      page: 1,
      size: 1000,
      beginDate: startDate,
      endDate: endDate
    };
    // const res: any = await Copy.getPageCopyTradePositionHistory(params);
    if (res.code === 200) {
      const data = res?.data?.pageData
      const positiveList: any = [];
      const negativeList: any = [];
      data.forEach(pnl => {
        const diffTime = Number(pnl.mtime.sub(pnl.ctime))
        const holdTime = formatTimeDiff(diffTime)
        if (pnl.tradePnl > 0) {
          positiveList.push({
            positionId: pnl.positionId,
            diffTime:diffTime,
            name: LANG('盈利'),
            holdTime: holdTime,
            tradePnl: formatNumber2Ceil(pnl?.tradePnl,Copy.copyFixed,false),
            holdTimeName: `${LANG('持仓时间')} ${holdTime} `
          });
        } else {
          negativeList.push({
            positionId: pnl.positionId,
            diffTime:diffTime,
            name: LANG('亏损'),
            holdTime: holdTime,
            tradePnl:formatNumber2Ceil(pnl?.tradePnl,Copy.copyFixed,false),
            holdTimeName: `${LANG('持仓时间')} ${holdTime} `
          });
        }
      });
      const minY = Math.min(...negativeList.map(d => d.tradePnl)); // 最小值减5作为缓冲
      const MaxY = Math.max(...positiveList.map(d => d.tradePnl)); // 最小值减5作为缓冲
      setConfigInfoY({
        min:minY,
        max:MaxY
      });
      setHistoryData({
        positiveList: positiveList.sort((a, b) => Number(a.holdTime) - Number(b.holdTime)),
        negativeList: negativeList.sort((a, b) => Number(a.holdTime) - Number(b.holdTime))
      });
    }
  };
  // 币种偏好
  const fetchPreference = async (preference:any) => {
    // const preference = await Copy.fetchCopyTradeUserTradProportion({ uid: id, cycle: dateActive });
    if (preference?.code === 200) {
      const copyPreferenceColor = ['var(--brand)', '#627EEA', 'var(--yellow)', '#5AB8DB', '#2AB26C', 'var(--red)'];
      const showData =
        preference?.data &&
        preference.data?.sort((a: any, b: any) => Number(b.currentAmount) - Number(a.currentAmount)).slice(0, 5);
      const preTotal = showData?.reduce((total: number, item: any) => total + item.currentAmount, 0);
      const total = preference?.data?.reduce((total: number, item: any) => total + item.currentAmount, 0); // 总的total
      // 前五个综合加起来不等于
      if (preTotal && preTotal !== total && showData?.length > 0) {
        const otherValue = total.sub(preTotal);
        showData.push({
          symbol: LANG('其他'),
          currentAmount: otherValue
        });
      }
      const showTotal = 0;
      let forMatData: any = showData.map((item, idx) => {
        const calValue = item?.currentAmount?.div(total);
        showTotal.add(calValue);
        const calValueRate = calValue.mul(100)?.toRound(2);
        return {
          ...item,
          color: copyPreferenceColor[idx],
          value: calValueRate,
          currentValue: Number(calValueRate),
          name: item?.symbol.replace('-', '')?.toUpperCase()
        };
      });
      const calAddCurrent = forMatData?.reduce((dd: number, item: any) => dd + Number(item.value), 0);
      if (forMatData?.length > 1 && calAddCurrent !== 100) {
        const sliceLastArr = forMatData?.slice(0, forMatData?.length - 1);
        const subLen = forMatData?.length && forMatData?.length - 1;
        const calPreValue = sliceLastArr.reduce((total: number, item: any) => total + Number(item.value), 0);
        const obj = forMatData[subLen] || { value: '' };
        obj.value = ('100'.sub(calPreValue.toRound(2)) );
      }
      setPreferenceeData(forMatData);
    }
  };
  const fetchAllData = useCallback(async () => {
    try {
      const startDate = dayjs()
      .subtract(dateActive - 1, 'day')
      .startOf('day')
      .valueOf(); // 7天前（含今天）
    const endDate = dayjs().endOf('day').valueOf(); // 今天结束时间
    const params: any = {
      uid: id,
      page: 1,
      size: 1000,
      beginDate: startDate,
      endDate: endDate,
      subWallet: 'COPY'
    };
      const [
        bring,overview, follower, 
        chart, history, preference
      ] = await Promise.all([
        Copy.fetchCopyTradeuserStatisticsSummary({ cycle: dateActive, uid: id }),
        Copy.fetchCopyTradeuserBase({ uid: id }),
        Copy.getCopyFollowList({ lUid: id, page: 1, size: 10 }),
        Copy.fetchCopyTradeuserStatisticsList({ cycle: dateActive, uids: id }),
        Copy.getPageCopyTradePositionHistory(params),
        Copy.fetchCopyTradeUserTradProportion({ uid: id, cycle: dateActive })
      ]);
      fetchBringData(bring)
      fetchOverviewData(overview)
      fetchTraderList(follower)
      fetchChartData(chart)
      fetchHistoryList(history)
      fetchPreference(preference)
    } catch (err) {
      console.error('请求失败:', err);
    }
  }, [dateActive]); // 依赖 dateActive

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  const PreformanceData = () => {
    return (
      <>
        {(tabKey === 'performanceData' || tabKey === 'performance') && (
          <div className="copy-preformance-left">
            <CopyData overviewData={overviewData} bringData={bringData} cycle={dateActive} />
            <Overview overviewData={overviewData} />
            <Follower followersData={followersData} overviewData={overviewData} />
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
            <CopyYieldsRatio profitRateList={chartData.profitRateList} />
            <TotalImcome profitAmountList={chartData.profitAmountList} />
            <div className="copy-preformance-dis">
              <Preference preferenceData={preferenceeData}/>
              <PositionDistribution data={historyData} configInfoY={configInfoY} />
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
      margin: 8px 0 24px;
      display: flex;
      align-items: center;
      color: var(--text_2);
      text-align: center;
       font-family: "Lexend";
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
      border: 1px solid var(--fill_line_3);
      cursor: pointer;
    }
    .copy-date-atice {
      background: var(--fill_3);
      color: var(--text_1);
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
      color: var(--text_3);
       font-family: "Lexend";
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
