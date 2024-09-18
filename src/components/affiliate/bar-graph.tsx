import Image from '@/components/image';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { BarGraphDataItem, BarGraphType, Summary, currencyAll } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { MediaInfo, getActive } from '@/core/utils';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useLayoutEffect } from 'react';
import css from 'styled-jsx/css';
import CoinLogo from '../coin-logo';
import { DateRangePicker } from '../date-range-picker';
import { Desktop, DesktopOrTablet, Mobile } from '../responsive';
import AffiliateSelect from './select';

const BarGraph = () => {
  const { isDark } = useTheme();
  const { isMobile } = useResponsive(false);
  const { locale } = useAppContext();

  const {
    barGraphCurrency,
    barGraphDateRangeValue,
    barGraphDateRangeStart,
    barGraphDateRangeEnd,
    barGraphData,
    barGraphType,
    barGraphDirectSum,
    barGraphAllSum,
  } = Summary.state;
  const DateList = [
    {
      value: 7,
      label: `7${LANG('天')}`,
    },
    {
      value: 30,
      label: `30${LANG('天')}`,
    },
    {
      value: 90,
      label: `90${LANG('天')}`,
    },
  ];

  const TypeList = [
    {
      value: BarGraphType.Invite,
      label: LANG('邀请人数'),
    },
    {
      value: BarGraphType.Deposit,
      label: LANG('充值人数'),
    },
    {
      value: BarGraphType.Trade,
      label: LANG('交易人数'),
    },
    {
      value: BarGraphType.Income,
      label: LANG('佣金收入'),
    },
  ];

  const renderChart = (data: BarGraphDataItem[]) => {
    const $dom1 = document.getElementById('affiliate-bar-charts') as any;
    const myChart = echarts.init($dom1);
    const position = isMobile
      ? {
          bottom: 0,
          left: 'center',
        }
      : {
          right: 0,
          top: 16,
        };
    myChart.setOption({
      color: [locale === 'ko' ? '#1772F8' : '#FFD30F', '#43BC9C'],
      legend: {
        textStyle: {
          color: '#9E9E9D',
        },
        data: [
          {
            name: LANG('直属数据'),
            icon: 'circle',
            itemStyle: {
              color: 'transparent',
              borderWidth: 2,
              borderColor: locale === 'ko' ? '#1772F8' : '#FFD30F',
            },
          },
          {
            name: LANG('团队数据'),
            icon: 'circle',
            itemStyle: {
              color: 'transparent',
              borderWidth: 2,
              borderColor: '#43BC9C',
            },
          },
        ],
        ...position,
      },
      tooltip: {
        formatter: `${
          barGraphDateRangeValue === 90 ? LANG('本周') : LANG('本日')
        }{a}<br />{b}<span class="count">{c}</span>`,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#9E9E9D',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: data.map((item) => dayjs(item.date).format('MM/DD')),
      },
      yAxis: {
        axisLabel: {
          color: '#9E9E9D',
          align: 'left',
          backgroundColor: isDark ? '#313535' : '#fff',
          width: 50,
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#515656' : '#E5E5E4',
            type: [4, 5],
          },
        },
      },
      grid: {
        x: 10,
        x2: isMobile ? 0 : 20,
        y: isMobile ? 30 : 80,
        y2: isMobile ? 50 : 20,
      },
      series: [
        {
          name: LANG('直属数据'),
          type: 'bar',
          data: data.map((item) => item.value1),
          barWidth: 10,
          barGap: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: LANG('团队数据'),
          type: 'bar',
          data: data.map((item) => item.value2),
          barWidth: 10,
          barGap: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    });

    window.addEventListener('resize', () => {
      myChart.resize({
        width: window.innerWidth - 623,
        height: 414,
      });
    });
  };

  useLayoutEffect(() => {
    const shouldRenderCharts = typeof document !== 'undefined' && barGraphData.length > 0;
    shouldRenderCharts && renderChart(barGraphData);
  }, [barGraphData, isDark, barGraphDateRangeValue]);

  return (
    <>
      <div className='container'>
        <DesktopOrTablet>
          <div className='header'>
            <span className='title'>{LANG('直属/团队合约')}</span>
            <AffiliateSelect
              value={barGraphCurrency}
              size='small'
              onChange={(val) => Summary.onChangeBarGraphCurrency(String(val))}
              list={currencyAll.map((item) => ({ value: item, label: item }))}
              renderItem={(item) => (
                <>
                  <CoinLogo coin={String(item.value)} width='16' height='16' alt={String(item.value)} />
                  <span>{item.value}</span>
                </>
              )}
            />
            <Tooltip color='#fff' placement='top' title={LANG('下列数据，每1小时更新一次')}>
              <div style={{ padding: '4px' }}>
                <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
              </div>
            </Tooltip>
            <div className='date-wrapper'>
              <Desktop>
                <DateRangePicker
                  onChange={Summary.onChangeBarGraphDateRangePicker}
                  value={[dayjs(barGraphDateRangeStart), dayjs(barGraphDateRangeEnd)]}
                />
              </Desktop>
              <AffiliateSelect
                value={barGraphDateRangeValue}
                onChange={(val) => Summary.onChangeBarGraphDateRangeValue(Number(val))}
                list={DateList}
              />
              <AffiliateSelect
                value={barGraphType}
                onChange={(val) => Summary.onChangeBarGraphType(Number(val))}
                list={TypeList}
              />
            </div>
            <div className='count-wrapper'>
              <div>
                {LANG('累计直属数据')}
                <span>{barGraphDirectSum}</span>
              </div>
              <div>
                {LANG('累计团队数据')}
                <span>{barGraphAllSum}</span>
              </div>
            </div>
          </div>
        </DesktopOrTablet>
        <Mobile>
          <div className='mobile-header'>
            <div className='title'>{LANG('直属/团队合约')}</div>
            <div className='select-wrapper'>
              <div className='select-wrapper'>
                <AffiliateSelect
                  value={barGraphCurrency}
                  onChange={(val) => Summary.onChangeBarGraphCurrency(String(val))}
                  list={currencyAll.map((item) => ({ value: item, label: item }))}
                  renderItem={(item) => (
                    <>
                      <CoinLogo coin={String(item.value)} width='16' height='16' alt={String(item.value)} />
                      <span>{item.value}</span>
                    </>
                  )}
                />
                <Tooltip color='#fff' placement='top' title={LANG('下列数据，每1小时更新一次')}>
                  <div style={{ padding: '4px' }}>
                    <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
                  </div>
                </Tooltip>
              </div>

              <AffiliateSelect
                value={barGraphType}
                onChange={(val) => Summary.onChangeBarGraphType(Number(val))}
                list={TypeList}
              />
            </div>

            <div className='date-wrapper'>
              {DateList.map((item) => (
                <button
                  key={item.value}
                  onClick={() => Summary.onChangeBarGraphDateRangeValue(item.value)}
                  className={getActive(barGraphDateRangeValue === item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className='count-wrapper'>
              <div>
                {LANG('累计直属数据')}
                <span>{barGraphDirectSum}</span>
              </div>
              <div>
                {LANG('累计团队数据')}
                <span>{barGraphAllSum}</span>
              </div>
            </div>
          </div>
        </Mobile>
        <div id='affiliate-bar-charts' />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default BarGraph;

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    padding: 26px 20px;
    margin-top: 20px;
    width: 100%;
    @media ${MediaInfo.mobile} {
      margin-top: 10px;
      padding: 14px 10px;
    }
    @media ${MediaInfo.tablet} {
      margin-top: 10px;
    }
    .header {
      display: flex;
      align-items: center;
      color: var(--theme-common-color);
      position: relative;
      .title {
        font-size: 16px;
        font-weight: 500;
        margin-right: 20px;
      }
      .date-wrapper {
        margin-left: auto;
        display: flex;
        align-items: center;
        :global(.picker-content) {
          background-color: inherit;
          border: 1px solid var(--theme-border-color-2);
          border-radius: 8px;
          :global(input) {
            font-size: 14px;
            font-weight: 400;
          }
        }
        :global(.ant-select-selector) {
          width: max-content;
          border: 1px solid var(--theme-border-color-2);
          height: 30px;
          margin-left: 12px;
        }
      }
      .count-wrapper {
        position: absolute;
        top: 50px;
        left: 0;
        > div {
          display: inline-block;
          margin-right: 33px;
          &:first-child {
            color: var(--skin-primary-color);
          }
          &:last-child {
            color: #43bc9c;
          }
          span {
            margin-left: 4px;
          }
        }
      }
    }
    .mobile-header {
      color: var(--theme-common-color);
      position: relative;
      .title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
      }
      .select-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        :global(> .container) {
          padding-left: 0;
        }
      }
      :global(.ant-select-selector) {
        border: 1px solid var(--theme-border-color-2) !important;
        height: 30px;
      }
      .date-wrapper {
        margin: 16px 0;
        display: flex;
        align-items: center;
        button {
          flex: 1;
          margin-right: 8px;
          border: 1px solid var(--theme-background-color-8);
          background-color: var(--theme-background-color-8);
          color: var(--theme-font-color-1);
          border-radius: 6px;
          &.active {
            border-color: var(--skin-primary-color);
            color: var(--skin-primary-color);
            background-color: inherit;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .count-wrapper {
        > div {
          display: inline-block;
          margin-right: 33px;
          &:first-child {
            color: var(--skin-primary-color);
          }
          &:last-child {
            color: #43bc9c;
          }
          span {
            margin-left: 4px;
          }
        }
      }
    }
    #affiliate-bar-charts {
      width: 100%;
      height: 414px;
      display: flex;
      justify-content: center;
      align-items: center;
      :global(.count) {
        font-weight: 600;
        float: right;
      }
    }
  }
`;
