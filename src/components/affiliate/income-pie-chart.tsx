import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Summary } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import * as echarts from 'echarts';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

const Colors = ['#EBB30E', '#43BC9C', '#F04E3F', '#C5C5C4'];

const IncomePieChart = () => {
  const { isDark } = useTheme();
  const { totalIncome, totalIncomeArray } = Summary.state;
  const renderChart = (data: { currency: string; hcommissionValue: number }[]) => {
    const $dom1 = document.getElementById('affiliate-pie-charts') as HTMLCanvasElement;
    const myChart = echarts.init($dom1);
    myChart.setOption({
      color: data.length === 1 && data[0].hcommissionValue === 0 ? ['#C5C5C4'] : Colors,
      tooltip: {
        trigger: 'item',
        formatter: `{b}<span class="count">{c}%</span>`,
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '65%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              color: '#4c4a4a',
              formatter: '{total|' + totalIncome.toFixed(4) + '}' + '\n\r' + `{active|${LANG('累计发放佣金')}}`,
              rich: {
                total: {
                  fontSize: 22,
                  color: isDark ? '#FFFFFF' : '#141717',
                  fontWeight: 500,
                },
                active: {
                  fontSize: 12,
                  color: '#9E9E9D',
                  lineHeight: 20,
                },
              },
            },
            emphasis: {
              show: false,
            },
          },
          emphasis: {
            label: {
              show: false,
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item) => ({ value: item.hcommissionValue, name: item.currency })),
        },
      ],
    });
  };

  useEffect(() => {
    typeof document !== 'undefined' && renderChart(totalIncomeArray);
  }, [totalIncomeArray, totalIncome, isDark]);

  return (
    <>
      <div className='affiliate-pie-charts-container'>
        <div id='affiliate-pie-charts' />
        <div className='title-wrapper'>
          <div className='value' style={{ color: isDark ? '#FFFFFF' : '#141717' }}>
            {totalIncome.toFixed(4)}
          </div>
          <div className='title'>{LANG('累计发放佣金')}</div>
        </div>
        <div className={`legend-wrapper`}>
          <ul>
            {totalIncomeArray.map((item, index) => (
              <li key={item.currency}>
                <div className='rect' style={{ backgroundColor: Colors[index] }} />
                {item.currency}
                <span className={`percent ${index % 2 === 0 ? 'marginRight' : ''}`} style={{ color: Colors[index] }}>
                  {item.hcommissionValue}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default IncomePieChart;

const styles = css`
  .affiliate-pie-charts-container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    width: 100%;
    position: relative;
    bottom: 10px;
    height: 260px;
    .title-wrapper {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--theme-font-color-1);
      .value {
        font-size: 22px;
        font-weight: 500;
      }
    }
    .legend-wrapper {
      width: 100%;
      position: absolute;
      bottom: -30px;
      left: 0;
      @media ${MediaInfo.mobile} {
        bottom: -15px;
      }

      ul {
        margin: 0;
        padding: 0;
        color: var(--theme-font-color-3);
        font-size: 12px;
        li {
          display: inline-block;
          width: 50%;
          margin-bottom: 10px;
          .rect {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            margin-right: 4px;
          }
          .percent {
            float: right;
            &.marginRight {
              margin-right: 10px;
            }
          }
        }
      }
    }
    #affiliate-pie-charts {
      width: 100%;
      height: 260px;
      display: flex;
      justify-content: center;
      align-items: center;
      :global(.count) {
        font-weight: 600;
        float: right;
        margin-left: 40px;
      }
    }
  }
`;
