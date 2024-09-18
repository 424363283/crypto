import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CryptoSelect from './components/CryptoSelect';

const Chart = ({
  cryptoOptions,
  cryptoValue,
  onCryptoChange,
  xData,
  yInterval,
  data = [],
  yFormatter,
  chartId = 'chart',
  title,
  setLimit,
  limitArr,
  tFormatter,
}: any) => {
  const [dateIndex, setDateIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState('');
  let myChart: any;
  const { isDark } = useTheme();
  const isLight = !isDark;
  const lineColor = isLight ? '#333' : '#858C99';
  const tooltipBg = isLight ? '#fff' : '#28303F';
  const splitLineColor = isLight ? '#EBEDF0' : '#2D3644';
  useEffect(() => {
    import('echarts').then((echarts) => {
      const echart = document.getElementById(chartId) as HTMLElement;
      myChart = echarts.init(echart);
      const interval = (Math.max(...data) - Math.min(...data)) / yInterval;
      const option: any = {
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#767D8F',
            },
          },
          data: xData,
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#767D8F',
            },
          },
          axisLabel: {
            formatter: yFormatter,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: [splitLineColor],
              width: 1,
              type: 'solid',
            },
          },
        },
        series: [
          {
            data,
            type: 'line',
            symbol: 'circle',

            symbolSize: 10,
            lineStyle: {
              color: lineColor,
            },
            itemStyle: {
              color: '#fff',
              borderWidth: 1,
              borderColor: lineColor,
            },
            emphasis: {
              itemStyle: {
                borderColor: '#efcc79',
                shadowColor: '#efcc79',
                shadowBlur: 3,
              },
            },
          },
        ],
        grid: {
          top: '5%',
          left: '2%',
          bottom: '5%',
          right: '3%',
          containLabel: true,
        },
        tooltip: {
          show: true,
          formatter: tFormatter,
          backgroundColor: tooltipBg,
          borderColor: tooltipBg,
        },
      };
      yInterval && (option.yAxis.interval = interval);
      myChart.setOption(option);
    });
  }, [xData, data]);

  // 选择最近历史时间
  const _selectDate = (index: number) => {
    setDateIndex(index);
    setLimit(limitArr[index]);
  };

  // 保存图标到本地
  const _download = () => {
    var picInfo = myChart.getDataURL({ type: 'png', backgroundColor: '#fff' });
    setImgSrc(picInfo);
  };

  return (
    <div className={'charts-box'}>
      <div className={'header'}>
        <CryptoSelect options={cryptoOptions} onChange={onCryptoChange} value={cryptoValue} />
        <div className={'download-btn'} onClick={_download}>
          <a className={'btn'} download='download.png' href={imgSrc}>
            {LANG('保存为')} PNG
          </a>
        </div>
      </div>
      <div className={'content'}>
        <div className={'info-box'}>
          <p className={'c-title'}>{title}</p>
          <div className={'date-box'}>
            {limitArr?.map((o: any, i: number) => {
              return (
                <span
                  key={i}
                  onClick={() => {
                    _selectDate(i);
                  }}
                  className={clsx('date', dateIndex === i && 'active')}
                >
                  {LANG('最近{date}天', { date: o })}
                </span>
              );
            })}
          </div>
        </div>
        <div id={chartId} style={{ height: '265px' }}></div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .charts-box {
    margin: 15px 0;
    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .content {
      .info-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        .c-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-3);
        }
        .date-box {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: 15px;
          .date {
            cursor: pointer;
            font-size: 12px;
            font-weight: 400;
            display: inline-block;
            padding: 2px 6px;
            text-align: center;
            color: var(--theme-font-color-3);
            border-radius: 11px;
            border: 1px solid var(--theme-border-color-1);
          }
          .active {
            color: var(--skin-primary-color);
            border-color: var(--skin-primary-color);
          }
        }
      }
    }
    .download-btn {
      cursor: pointer;
      display: flex;
      padding: 0 10px;
      height: 27px;
      border-radius: 3px;
      border: 1px solid var(--skin-primary-color);
      justify-content: center;
      align-items: center;
      .btn {
        font-size: 12px;
        font-weight: 400;
        color: var(--skin-primary-color);
      }
    }
  }
`;

export default Chart;
