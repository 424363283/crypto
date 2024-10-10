// 资产总览和个人中心页面 图表
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { memo, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

let flag = true;

const getPercents = (...args: number[]) => {
  const all = args.reduce((r, v) => r + (v ? Number(v) : 0), 0);
  return args.map((v) => (v ? ((Number(v) / all) * 100).toFixed(2) : '0.00'));
};

const generateChartOptions = (
  { data = [], onSelect }: { data?: { label: string; value: number }[]; onSelect: (index: number) => void },
  empty?: boolean
) => {
  const options = {
    empty,
    legend: {
      show: false,
    },
    chart: {
      id: 'AssetAllPieChart',
      events: {
        dataPointMouseEnter: function (event: Event, chartContext: any, config: any) {
          const { dataPointIndex } = config;
          onSelect(dataPointIndex);
        },
      },
    },
    stroke: {
      width: 0,
    },
    labels: data.map((v) => v.label),
    series: data.map((v) => (v.value ? +v.value : 0)),
    dataLabels: {
      minAngleToShowLabel: 0,
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    fill: {
      colors: ['#FFD30F', '#00A478', '#396FD9'],
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '80%',
        },
      },
    },
  };
  if (empty) {
    options.labels = ['1', '2', '3'];
    options.series = [50, 50, 50];
  }
  return options;
};
/* eslint-disable react/display-name */
const PieChart = memo(
  ({
    contractBalance,
    contractuBalance,
    spotBalance,
  }: {
    contractBalance: number;
    contractuBalance: number;
    spotBalance: number;
  }) => {
    const [selected, setSelect] = useState<number>(0);
    const [chartOptions, setChartOptions] = useState(() =>
      generateChartOptions({ data: [], onSelect: setSelect }, true)
    );
    const balances = [spotBalance, contractuBalance, contractBalance];

    const percents = useMemo(() => getPercents(...balances), balances);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (balances.some((v) => v > 0)) {
          setChartOptions(
            generateChartOptions({
              data: [
                { label: '1', value: spotBalance || 0 },
                { label: '2', value: contractuBalance || 0 },
                { label: '3', value: contractBalance || 0 },
              ],
              onSelect: (index) => {
                flag = false;
                setSelect(index);
              },
            })
          );
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }, percents);

    useEffect(() => {
      flag = true;
    }, []);

    // useEffect(() => {
    //   const max = Math.max(...balances);
    //   if (flag) {
    //   }
    //   setSelect(balances.findIndex((item) => max === item));
    // }, [balances, selected]);
    return (
      <div className='chart'>
        <div className='percent'>
          {Number(chartOptions.empty ? 0 : percents[selected])}%
          {<div className='prompt'>{[LANG('现货账户'), LANG('U本位账户'), LANG('币本位账户')][selected]}</div>}
        </div>
        <Chart
          className='content'
          options={chartOptions}
          series={chartOptions.series}
          type='donut'
          height={140}
          width={300}
        />
        <style jsx>{styles}</style>
      </div>
    );
  }
);
const styles = css`
  .chart {
    position: absolute;
    top: 10px;
    left: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100%;
    user-select: none;
    @media ${MediaInfo.mobile} {
      position: relative;
    }
    &::before {
      content: '';
      z-index: 0;
      position: absolute;
      width: 120px; /* 外层圆环的宽度 */
      height: 120px; /* 外层圆环的高度 */
      background-color: var(--theme-background-color-2-4); /* 外层圆环的背景色 */
      border-radius: 50%;
      border: 26px solid var(--theme-background-color-2-4);
      top: -10px;
      left: -8px;
      box-sizing:border-box;
    }
    &::after {
      content: '';
      z-index: 0;
      position: absolute;
      width: 68px; /* 中间圆形的宽度 */
      height: 68px; /* 中间圆形的高度 */
      background-color: var(--theme-background-color-2); /* 中间圆形的背景色 */
      border-radius: 50%;
      top: 13px; /* 调整中间圆形的位置 */
      left: 19px; /* 调整中间圆形的位置 */
    }
    :global(.content) {
      position: absolute;
      left: -98px;
      top: 0;
    }

    .percent {
      z-index: 1;
      position: absolute;
      min-width: 60px;
      text-align: center;
      font-size: 12px;
      white-space: nowrap;
      font-weight: 500;
      color: var(--theme-font-color-6);
      top: 45px;
      left: 24px;
    }
    .prompt {
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      max-width: 70px;
    }
  }
`;
export default PieChart;
