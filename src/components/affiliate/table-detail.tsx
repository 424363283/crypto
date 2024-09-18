import Image from '@/components/image';
import { useCurrencyScale, useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { BarGraphDataItem, BarGraphDataType, Summary, TradeListItem, TradeTab, currencyAll } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { MediaInfo, getActive } from '@/core/utils';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CoinLogo from '../coin-logo';
import { DateRangePicker } from '../date-range-picker';
import { Desktop, DesktopOrTablet, Mobile } from '../responsive';
import AffiliateTable from './affiliate-table';
import { List } from './list';
import AffiliateSelect from './select';

const Item = ({ data: item }: { data: TradeListItem }) => {
  const { scale } = useCurrencyScale('USDT');
  return (
    <>
      <div className='container'>
        <div className='item'>
          <div className='label'>{LANG('日期')}</div>
          <div className='value'>{dayjs(item.date).format('YYYY/MM/DD')}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('交易人数')}</div>
          <div className='value'>{item.trading.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('佣金收入')}</div>
          <div className='value'>{item.commission.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('交易笔数')}</div>
          <div className='value'>{item.count.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('交易量')}</div>
          <div className='value yellow'>{item.amount.toFormat()}</div>
        </div>
      </div>
      <style jsx>{`
        .container {
          padding-top: 16px;
          border-bottom: 1px solid var(--theme-border-color-2);
          .item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            margin-bottom: 12px;
            .label {
              color: var(--theme-font-color-3);
            }
            .value {
              color: var(--theme-font-color-1);
              &.yellow {
                color: var(--skin-primary-color);
              }
            }
          }
          .marginTop {
            margin-top: 16px;
          }
        }
      `}</style>
    </>
  );
};

const TableDetail = () => {
  const { isDark } = useTheme();
  const { isDesktop } = useResponsive();
  const { locale } = useAppContext();

  const { scale } = useCurrencyScale('USDT');

  const {
    tradeTabValue,
    tradeCurrency,
    tradeDateRangeValue,
    tradeDateRangeStart,
    tradeDateRangeEnd,
    tradeData,
    tradeDetailType,
    directList,
    teamList,
    tradeListPage,
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

  const columns = [
    {
      title: LANG('日期'),
      dataIndex: 'date',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: LANG('交易人数'),
      dataIndex: 'trading',
      align: 'center',
      render: (trading: number) => trading,
    },
    {
      title: LANG('佣金收入'),
      dataIndex: 'commission',
      align: 'center',
      render: (commission: number) => commission.toFormat(scale),
    },
    {
      title: LANG('交易笔数'),
      dataIndex: 'count',
      align: 'center',
      render: (count: number) => count,
    },
    {
      title: LANG('交易量'),
      dataIndex: 'amount',
      align: 'right',
      render: (amount: number) => <span className='yellow'>{amount}</span>,
    },
  ];

  // 初始化折线图
  const renderChart = (data: BarGraphDataItem[]) => {
    data = [...data].sort((a, b) => +new Date(a.date) - +new Date(b.date));
    const $dom2 = document.getElementById('affiliate-line-charts') as any;
    const myChart = echarts.init($dom2);
    const position = isDesktop
      ? {
          right: 0,
          top: 16,
        }
      : {
          bottom: 0,
          left: 'center',
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
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => dayjs(item.date).format('MM/DD')),
        axisLabel: {
          color: '#9E9E9D',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        boundaryGap: false,
      },
      yAxis: {
        axisLabel: {
          color: '#9E9E9D',
          align: 'left',
          margin: 60,
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#515656' : '#E5E5E4',
            type: [4, 5],
          },
        },
      },
      grid: {
        x: 60,
        x2: 20,
        y: isDesktop ? 60 : 40,
        y2: isDesktop ? 40 : 70,
      },
      series: [
        {
          name: LANG('直属数据'),
          symbol: 'none',
          data: data.map((item) => item.value1),
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(240, 96, 63, 0.15)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(240, 78, 63, 0)', // 100% 处的颜色
                },
              ],
            },
          },
        },
        {
          name: LANG('团队数据'),
          symbol: 'none',
          data: data.map((item) => item.value2),
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(27, 162, 122, 0.3)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(67, 188, 156, 0)', // 100% 处的颜色
                },
              ],
            },
          },
        },
      ],
    });
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  const [mobileList, setMobileList] = useState<TradeListItem[]>([]);

  useEffect(() => {
    const originList = tradeDetailType === BarGraphDataType.Direct ? directList : teamList;
    let result = [];

    if (originList.length > 10) {
      result = originList.slice((tradeListPage - 1) * 10, tradeListPage * 10);
    } else {
      result = originList;
    }
    setMobileList(result);
  }, [tradeListPage, tradeDetailType, directList, teamList]);

  useEffect(() => {
    tradeData.length > 0 && typeof document !== 'undefined' && renderChart(tradeData);
  }, [tradeData, isDark]);

  const paginationOnChange = (page: number) => {
    Summary.onChangeTradeDetailPage(page);
  };

  return (
    <>
      <div className='container'>
        <DesktopOrTablet>
          <div className='header'>
            <ul>
              <li
                onClick={() => Summary.onClickTradeType(TradeTab.Swap)}
                className={getActive(tradeTabValue === TradeTab.Swap)}
              >
                {LANG('永续合约')}
              </li>
              <li
                onClick={() => Summary.onClickTradeType(TradeTab.Spot)}
                className={getActive(tradeTabValue === TradeTab.Spot)}
              >
                {LANG('币币交易')}
              </li>
            </ul>
            <AffiliateSelect
              value={tradeCurrency}
              size='small'
              onChange={(val) => Summary.onChangeTradeCurrency(String(val))}
              list={currencyAll.map((item) => ({ value: item, label: item }))}
              renderItem={(item) => (
                <>
                  <CoinLogo coin={String(item.value)} width='16' height='16' alt={String(item.value)} />
                  <span>{item.value}</span>
                </>
              )}
            />
            <div className='select-wrapper'>
              <Desktop>
                <DateRangePicker
                  onChange={Summary.onChangeTradeDateRangePicker}
                  value={[dayjs(tradeDateRangeStart), dayjs(tradeDateRangeEnd)]}
                />
              </Desktop>
              <AffiliateSelect
                value={tradeDateRangeValue}
                onChange={(val) => Summary.onChangeTradeDateRangeValue(Number(val))}
                list={DateList}
              />
            </div>
            <Tooltip color='#fff' placement='top' title={LANG('下列数据，每1小时更新一次')}>
              <div style={{ padding: '4px' }}>
                <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
              </div>
            </Tooltip>
          </div>
        </DesktopOrTablet>
        <Mobile>
          <div className='mobile-header'>
            <ul>
              <li
                onClick={() => Summary.onClickTradeType(TradeTab.Swap)}
                className={getActive(tradeTabValue === TradeTab.Swap)}
              >
                {LANG('永续合约')}
              </li>
              <li
                onClick={() => Summary.onClickTradeType(TradeTab.Spot)}
                className={getActive(tradeTabValue === TradeTab.Spot)}
              >
                {LANG('币币交易')}
              </li>
            </ul>
            <div className='select-wrapper'>
              <AffiliateSelect
                value={tradeCurrency}
                onChange={(val) => Summary.onChangeTradeCurrency(String(val))}
                list={currencyAll.map((item) => ({ value: item, label: item }))}
                renderItem={(item) => (
                  <>
                    <CoinLogo coin={String(item.value)} width='16' height='16' alt={String(item.value)} />
                    <span>{item.value}</span>
                  </>
                )}
              />
              <div className='date-wrapper'>
                {DateList.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => Summary.onChangeTradeDateRangeValue(item.value)}
                    className={getActive(tradeDateRangeValue === item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <Tooltip color='#fff' placement='top' title={LANG('下列数据，每1小时更新一次')}>
              <div style={{ padding: '4px' }}>
                <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
              </div>
            </Tooltip>
          </div>
        </Mobile>
        <div id='affiliate-line-charts' />
        <div className='table-wrapper'>
          <ul>
            <li
              className={getActive(tradeDetailType === BarGraphDataType.Direct)}
              onClick={() => Summary.onChangeTradeDetailType(BarGraphDataType.Direct)}
            >
              {LANG('直属数据')}
            </li>
            <li
              className={getActive(tradeDetailType === BarGraphDataType.All)}
              onClick={() => Summary.onChangeTradeDetailType(BarGraphDataType.All)}
            >
              {LANG('团队数据')}
            </li>
          </ul>
          <DesktopOrTablet>
            <div className='table-container'>
              <AffiliateTable
                dataSource={tradeDetailType === BarGraphDataType.Direct ? directList : teamList}
                columns={columns}
                total={tradeDateRangeValue}
                paginationOnChange={paginationOnChange}
                page={tradeListPage}
                renderRowKey={(v) => v.date}
              />
            </div>
          </DesktopOrTablet>
          <Mobile>
            <div className='list-container'>
              <List list={mobileList} page={tradeListPage} total={tradeDateRangeValue} onChange={paginationOnChange}>
                {(index) => {
                  const item = mobileList[index];
                  return <Item key={index} data={item} />;
                }}
              </List>
            </div>
          </Mobile>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default TableDetail;

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    padding: 24px 21px;
    padding-top: 0;
    margin-top: 20px;
    width: 100%;
    @media ${MediaInfo.mobile} {
      margin-top: 10px;
      padding: 14px 10px;
    }
    @media ${MediaInfo.tablet} {
      padding-top: 0;
    }
    .header {
      display: flex;
      align-items: center;
      height: 70px;
      border-bottom: 1px solid var(--theme-deep-border-color-1);
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        color: var(--theme-font-color-3);
        font-size: 16px;
        font-weight: 500;
        li {
          margin-right: 33px;
          line-height: 67px;
          cursor: pointer;
          &.active {
            color: var(--theme-font-color-1);
            border-bottom: 2px solid var(--skin-primary-color);
          }
        }
      }
      .select-wrapper {
        display: flex;
        align-items: center;
        :global(.ant-select-selector) {
          width: 100px;
          border: 1px solid var(--theme-border-color-2);
          height: 30px;
          margin-left: 12px;
          border-radius: 8px;
        }
        :global(.picker-content) {
          background-color: inherit;
          border: 1px solid var(--theme-border-color-2);
          :global(input) {
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }
    .mobile-header {
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        color: var(--theme-font-color-3);
        font-size: 16px;
        font-weight: 500;
        li {
          margin-right: 32px;
          line-height: 40px;
          cursor: pointer;
          &.active {
            color: var(--theme-font-color-1);
            border-bottom: 2px solid var(--skin-primary-color);
          }
        }
      }
      .select-wrapper {
        margin-left: auto;
        display: flex;
        align-items: center;
        margin-top: 14px;
        :global(> .container) {
          padding-left: 0;
        }
        :global(.ant-select-selector) {
          width: 100px;
          border: 1px solid var(--theme-border-color-2);
          height: 30px;
          margin-left: 0;
        }
        .date-wrapper {
          margin-left: 10px;
          flex: 1;
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
      }
    }
    #affiliate-line-charts {
      width: 100%;
      height: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
      :global(canvas) {
        width: 100% !important;
      }
    }
    .table-wrapper {
      overflow-x: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .title {
        font-size: 16px;
        color: var(--theme-common-color);
      }
      ul {
        padding: 0;
        margin: 0;
        font-size: 16px;
        color: var(--theme-font-color-3);
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--theme-deep-border-color-1);
        height: 60px;
        overflow-x: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          margin-right: 35px;
          line-height: 60px;
          cursor: pointer;
          text-wrap: nowrap;
          &.active {
            color: var(--theme-font-color-1);
            font-weight: 500;
          }
        }
      }
      :global(.ant-table-pagination) {
        margin-bottom: 0 !important;
      }
    }
    .table-container {
      margin-left: -20px;
      margin-right: -20px;
      padding: 5px 20px;
      :global(.yellow) {
        color: var(--skin-primary-color);
      }
      :global(.ant-table-row),
      :global(.ant-table-thead) {
        :global(td),
        :global(th) {
          &:first-child {
            border-start-start-radius: 0;
          }
          &:last-child {
            border-start-end-radius: 0;
          }
        }
      }
      :global(.ant-table-thead th) {
        border: none;
      }
      :global(.ant-table-tbody) {
        font-weight: 500;
        :global(.ant-table-row) {
          background-color: var(--theme-background-color-2) !important;
        }
        :global(.ant-table-row:nth-child(odd)) {
          :global(td:first-child) {
            border-radius: 8px 0 0 8px;
          }
          :global(td:last-child) {
            border-radius: 0 8px 8px 0;
          }
          :global(td) {
            background: var(--theme-table-odd-background) !important;
          }
        }
        :global(.ant-table-cell) {
          border-bottom: none !important;
        }
      }
    }
  }
`;
