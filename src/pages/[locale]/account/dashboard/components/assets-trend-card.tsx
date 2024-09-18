// import LineChart from '@/components/chart/line-chart';
import { getAccountProfitHistoryApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { getSpecificRangeOfDay } from '@/core/utils';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const LineChart = dynamic(() => import('@/components/chart/line-chart'), { ssr: false });

interface AssetsTrendProps {
  dateRange: number;
  accountType?: number; // 1、总账户 2、现货账户
}
export const AssetsTrendCard = (props: AssetsTrendProps) => {
  const { dateRange, accountType = 1 } = props;
  const [yAxisProfits, setYAxisProfits] = useState<number[]>([]);
  const [xAxisDate, setXAxisDate] = useState<string[]>([]);
  const { isMobile } = useResponsive();
  const fetchAccountProfitHistory = async (day: number) => {
    const { createTimeGe, createTimeLe } = getSpecificRangeOfDay(day + 1);
    const res = await getAccountProfitHistoryApi({
      startTime: dayjs(createTimeGe).valueOf(),
      endTime: dayjs(createTimeLe).valueOf(),
      type: accountType,
    });
    if (res.code === 200) {
      const formatTimeData = res.data.map((item) => {
        return dayjs(item.date).format('MM-DD');
      });
      const balanceArray = res.data.map((item) => {
        return Number(item.balance.toFixed(2));
      });
      setYAxisProfits(balanceArray);
      setXAxisDate(formatTimeData);
    }
    return res;
  };
  useEffect(() => {
    fetchAccountProfitHistory(dateRange);
  }, [dateRange]);
  return (
    <LineChart
      data={{ dates: xAxisDate, prices: yAxisProfits }}
      width='100%'
      height='236px'
      xInterval={isMobile && xAxisDate.length > 20 ? 5 : isMobile ? 1 : undefined}
      splitLine={{
        show: false,
      }}
    />
  );
};
