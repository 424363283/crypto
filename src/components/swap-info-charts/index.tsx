import { useTheme, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CryptoSelect from './components/CryptoSelect';
import CommonIcon from '../common-icon';
import { Dropdown } from 'antd';

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
  tFormatter
}: any) => {
  const [dateIndex, setDateIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState('');
  const [dateRangeVisible, setDateRangeVisible] = useState(false);
  let myChart: any;
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const isLight = !isDark;
  const lineColor = isLight ? '#07828B' : '#07828B';
  const tooltipBg = isLight ? '#fff' : '#121212';
  const splitLineColor = isLight ? '#1F2124' : '#F4F5F6';
  const isBorderLine = !isLight ? '#34343B' : '#D7D9DE';
  useEffect(() => {
    import('echarts').then(echarts => {
      const echart = document.getElementById(chartId) as HTMLElement;
      myChart = echarts.init(echart);
      const interval = (Math.max(...data) - Math.min(...data)) / yInterval;
      const option: any = {
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'var(--fill_line_1)'
            }
          },
          data: xData
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              // color: "#A5A8AC",
              color: isBorderLine
            }
          },
          axisLabel: {
            formatter: yFormatter,
            color: splitLineColor
          },
          splitLine: {
            show: true,
            lineStyle: {
              // color: [splitLineColor],
              color: isBorderLine,
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [
          {
            data,
            type: 'line',
            symbol: 'circle',

            symbolSize: 10,
            lineStyle: {
              color: lineColor
            },
            itemStyle: {
              color: '#fff',
              borderWidth: 1,
              borderColor: lineColor
            },
            emphasis: {
              itemStyle: {
                borderColor: '#07828B',
                shadowColor: '#07828B',
                shadowBlur: 3,
                color: '#07828B'
              }
            }
          }
        ],
        grid: {
          top: '5%',
          left: '2%',
          bottom: '5%',
          right: '3%',
          containLabel: true
        },
        tooltip: {
          show: true,
          color: '#07828B',
          // formatter: tFormatter,
          backgroundColor: tooltipBg,
          borderColor: tooltipBg,
          textStyle: {
            color: 'var(--text_1)' // Change this to your desired hover text color
          },
          axisPointer: {
            lineStyle: {
              color: 'var(--text_1)' // Change this to your desired hover line color
            }
          },
          formatter: (params: any) => {
            const date = params?.name;
            const value = params?.value;
            return `${date}<br/><span style="color: #07828B;">${value}%</span>`;
          }
        }
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

  const _blur = () => {
    const time = setTimeout(() => {
      setDateRangeVisible(false);
      clearTimeout(time);
    }, 200);
  };

  if (isMobile) {
    const overlay = (
      <div className={'date-select-menus'}>
        {limitArr?.map((day: any, i: number) => (
          <div key={i} className={clsx('menu', i === dateIndex && 'active')} onClick={() => _selectDate(i)}>
            {LANG('最近{date}天', { date: day })}
          </div>
        ))}
        <style jsx>{`
          .date-select-menus {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            border-radius: 8px;
            background: var(--fill_pop);
            box-shadow: 0px 0px 8px 0px var(--fill_shadow);
            padding: 4px 0;
            .menu {
              height: 1.5rem;
              line-height: 1.5rem;
              font-size: 12px;
              font-weight: 500;
              color: var(--text_2);
              &.active {
                color: var(--brand);
              }
            }
          }
        `}</style>
      </div>
    );

    return (
      <div className={'charts-box'}>
        <div className="header_topContent">
          <div className="top">
            <div className="left">
              <span>{LANG('合约')}</span>
              <CryptoSelect options={cryptoOptions} onChange={onCryptoChange} value={cryptoValue} />
            </div>
            <div className="right">
              <div className="content">
                <Dropdown
                  dropdownRender={menu => overlay}
                  open={dateRangeVisible}
                  // open={true}
                >
                  <div className={'select'} tabIndex={1} onFocus={() => setDateRangeVisible(true)} onBlur={_blur}>
                    {LANG('最近{date}天', { date: limitArr[dateIndex] })}
                  </div>
                </Dropdown>
              </div>
              <div className="save" onClick={_download}>
                <CommonIcon name="common-save" size={24} />
              </div>
            </div>
          </div>
          <div className="bottom">{title}</div>
        </div>
        <div className={'content'}>
          <div id={chartId} style={{ height: '240px', marginTop: '0' }}></div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className={'charts-box'}>
      <div className="header_topContent">
        <div className="header_topLeft">
          <div>
            <CryptoSelect options={cryptoOptions} onChange={onCryptoChange} value={cryptoValue} />
          </div>
          <div className={'c-title'}>{title}</div>
        </div>
        <div className="header_topRight">
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
          <div className={'download-btn'} onClick={_download}>
            <a className={'btn'} download="download.png" href={imgSrc}>
              {LANG('保存为')} PNG
            </a>
          </div>
        </div>
      </div>
      <div className={'content'}>
        <div id={chartId} style={{ height: '280px', marginTop: '46px' }}></div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .header_topLeft {
    display: flex;
    align-items: center;

    .c-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-3);
      margin-left: 16px;
    }
  }
  .header_topRight {
    display: flex;
    align-items: center;
    .date-box {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 15px;
      margin-right: 40px;
      .date {
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        display: inline-block;
        padding: 8px 16px;
        text-align: center;
        color: var(--theme-font-color-3);
        border-radius: 18px;
        border: 1px solid var(--theme-border-color-1);
      }
      .active {
        color: var(--skin-primary-color);
        border-color: var(--skin-primary-color);
      }
    }
  }
  .header_topContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
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
      height: 32px;
      border-radius: 3px;
      border: 1px solid var(--skin-primary-color);
      justify-content: center;
      align-items: center;
      border-radius: 40px;
      background: var(--brand);

      .btn {
        font-size: 12px;
        font-weight: 400;
        color: #fff;
      }
    }
  }
  @media ${MediaInfo.mobile} {
    .charts-box {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin: 0;
      .header_topContent {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 2.875rem;
        gap: 8px;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .left,
          .right {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .left {
            justify-content: flex-start;
            :global(.content) {
              padding: 0;
              border-radius: 4px;
            }
          }
          .right {
            justify-content: flex-end;
          }
          :global(.content) {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          :global(.select) {
            position: relative;
            display: flex;
            align-items: center;
            line-height: 1.5rem;
            border-radius: 4px;
            height: 1.5rem;
            padding: 0 1rem;
            gap: 8px;
            font-size: 12px;
            min-width: 4.375rem;
            background: var(--fill_3);
            color: var(--text_1);
            &::after {
              content: '';
              display: block;
              position: absolute;
              right: 1rem;
              top: 50%;
              transform: translateY(-50%);
              width: 0;
              height: 0;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-top: 5px solid var(--text_3);
            }
          }
        }
        .bottom {
          font-size: 12px;
          font-weight: 500;
          color: var(--text_3);
        }
      }
    }
  }
`;

export default Chart;
