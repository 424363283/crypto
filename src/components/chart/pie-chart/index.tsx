// 资产总览和个人中心页面 图表
import { useRouter } from '@/core/hooks';
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
        dataPointMouseEnter: function(event: Event, chartContext: any, config: any) {
          const { dataPointIndex } = config;
          onSelect(dataPointIndex);
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['var(--fill-3)']
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
      colors: ['var(--brand)', 'var(--yellow)', '#396FD9', '#CC783C'],
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
    // options.labels = ['1', '2', '3'];
    options.labels = ['1', '2'];

    options.series = [50, 50];
  }
  return options;
};
/* eslint-disable react/display-name */
const PieChart = memo(
  ({
    contractBalance,
    contractuBalance,
    spotBalance,
    p2pBalance,
    width = 120,
    height = 120,
    circleBorderWidth = 24
  }: {
    contractBalance: number;
    contractuBalance: number;
    spotBalance: number;
    p2pBalance?: number;
    width?: number;
    height?: number;
    circleBorderWidth?: number;
  }) => {
    const router = useRouter();
    const enableP2p = router.query.locale !== 'zh';
    const [selected, setSelect] = useState<number>(0);
    const [chartOptions, setChartOptions] = useState(() =>
      generateChartOptions({ data: [], onSelect: setSelect }, true)
    );
    const balances = enableP2p
      ? [spotBalance, contractuBalance, contractBalance, p2pBalance ?? 0]
      : [spotBalance, contractuBalance, contractBalance];

    const percents = useMemo(() => getPercents(...balances), balances);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (balances.some((v) => +v > 0)) {
          setChartOptions(
            generateChartOptions({
              data: enableP2p
                ? [
                  { label: '1', value: spotBalance || 0 },
                  { label: '2', value: contractuBalance || 0 },
                  { label: '3', value: contractBalance || 0 },
                  // { label: '4', value: p2pBalance || 0 },
                ]
                : [
                  { label: '1', value: spotBalance || 0 },
                  { label: '2', value: contractuBalance || 0 },
                  // { label: '3', value: contractBalance || 0 },
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



    return (
      <div className='chart'>
        <div className='percent'>
          {Number(chartOptions.empty ? 0 : percents[selected])}%
          {
            <div className='prompt'>
              {enableP2p
                ? [LANG('现货账户'), LANG('U本位账户'), LANG('币本位账户'), LANG('P2P账户')][selected]
                : [LANG('现货账户'), LANG('U本位账户')][selected]}
              {/* : [LANG('现货账户'), LANG('U本位账户'), LANG('币本位账户')][selected]} */}

            </div>
          }
        </div>
        <Chart
          className='content'
          options={chartOptions}
          series={chartOptions.series}
          type='donut'
          height={width}
          width={height}
        />
        <style jsx>{`
          .chart {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: ${width}px;
            min-width: ${width}px;
            height: ${height}px;
            min-height: ${height}px;
            user-select: none;
            @media ${MediaInfo.mobile} {
              position: relative;
            }
            &::before {
              content: '';
              z-index: 0;
              position: absolute;
              width: calc(100% - 48px); /* 外层圆环的宽度 */
              height: calc(100% - 48px); /* 外层圆环的高度 */
              background-color: var(--bg-1); /* 外层圆环的背景色 */
              border-radius: 50%;
              border: ${circleBorderWidth}px solid var(--fill-3);
              top: -1px;
              left: 0;
              box-sizing: content-box; /* 使用 content-box 让边框不占用容器的尺寸 */
            }

            :global(.content) {
              position: absolute;
            }

            .percent {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1;
              min-width: 70px;
              text-align: center;
              font-size: 16px;
              white-space: nowrap;
              font-weight: 500;
              color: var(--text-primary);
              line-height: 14px;
              .prompt {
                margin-top: 8px;
              }
            }
            .prompt {
              white-space: pre-wrap;
              word-break: break-all;
              font-size: 12px;
              font-weight: 400;
              color: var(--text-tertiary);
              max-width: 70px;
            }
          }
        `}</style>
      </div>
    );
  }
);
export default PieChart;

