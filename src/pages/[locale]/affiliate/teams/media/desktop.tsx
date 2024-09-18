import AffiliateTable from '@/components/affiliate/affiliate-table';
import AffiliateFilterButton from '@/components/affiliate/filter-button';
import AffiliateSearchInput from '@/components/affiliate/search-input';
import AffiliateTableUserInfo from '@/components/affiliate/table-userinfo';
import CommonIcon from '@/components/common-icon';
import { DateRangePicker } from '@/components/date-range-picker';
import Image from '@/components/image';
import { AffiliateDesktopLayout } from '@/components/layouts/media/affiliate/desktop';
import { ModalClose } from '@/components/mobile-modal';
import { AlertFunction } from '@/components/modal';
import { Svg } from '@/components/svg';
import { useCurrencyScale, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Teams, TradeTab, UserListItem, currencyAll } from '@/core/shared';
import { THEME } from '@/core/store';
import { getActive } from '@/core/utils';
import { Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const DesktopTeamsManage = () => {
  const {
    uid,
    dateRangeStart,
    dateRangeEnd,
    userList,
    page,
    total,
    filterModalOpen,
    username,
    currency,
    dateRangeValue,
    type,
    ratio,
    spotStepsList,
    swapStepsList,
    orderBy,
    order,
    upgradeModalOpen,
    upgradeUid,
    upgradeType,
    upgradeRatio,
    listExpandedRows,
    nextLevelList,
  } = Teams.state;
  const { theme, isDark } = useTheme();
  const { scale } = useCurrencyScale('USDT');

  const [stashFetchUids, setStashFetchUids] = useState<string[]>([]);

  useEffect(() => {
    Teams.fetchStepsList();
    Teams.fetchList();
  }, []);

  const getSvgUrl = (type: 'asc' | 'desc', index: number) => {
    return `/static/images/affiliate/filter-arrow-up-${getActive(order === type && orderBy === index)}.svg`;
  };

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
      title: LANG('用户'),
      dataIndex: 'username',
      render: (username: string, item: UserListItem) => {
        return (
          <div className='userinfo-wrapper'>
            <AffiliateTableUserInfo
              avatar={item.avatar}
              username={item.username}
              uid={item.uid}
              distance={item.distance}
            />
          </div>
        );
      },
    },
    {
      title: LANG('直属交易量'),
      dataIndex: 'subTradeAmount',
      render: (subTradeAmount: number) => subTradeAmount?.toFormat(scale),
    },
    {
      title: (
        <div className='sort-wrapper' onClick={() => Teams.onOrderByChange(4)}>
          {LANG('代理比例')}
          <div className='icon-wrapper'>
            <Svg src={getSvgUrl('asc', 4)} width={6} height={5.5} />
            <Svg src={getSvgUrl('desc', 4)} className='arrow-down' width={6} height={5.5} />
          </div>
        </div>
      ),
      dataIndex: 'ratio',
      render: (ratio: number) => <span className='yellow'>{ratio?.mul(100) + '%'}</span>,
    },
    {
      title: LANG('总返佣'),
      dataIndex: 'commission',
      render: (commission: number) => <span className='commission'>{commission?.toFormat(scale)}</span>,
    },
    {
      title: (
        <div className='sort-wrapper' onClick={() => Teams.onOrderByChange(1)}>
          {LANG('团队总人数')}
          <div className='icon-wrapper'>
            <Svg src={getSvgUrl('asc', 1)} width={6} height={5.5} />
            <Svg src={getSvgUrl('desc', 1)} className='arrow-down' width={6} height={5.5} />
          </div>
        </div>
      ),
      dataIndex: 'invites',
      render: (invites: number) => invites?.toFormat(),
    },
    {
      title: (
        <div className='sort-wrapper' onClick={() => Teams.onOrderByChange(2)}>
          {LANG('充值总人数')}
          <div className='icon-wrapper'>
            <Svg src={getSvgUrl('asc', 2)} width={6} height={5.5} />
            <Svg src={getSvgUrl('desc', 2)} className='arrow-down' width={6} height={5.5} />
          </div>
        </div>
      ),
      dataIndex: 'deposit',
      render: (deposit: number) => deposit?.toFormat(),
    },
    {
      title: (
        <div className='sort-wrapper' onClick={() => Teams.onOrderByChange(3)}>
          {LANG('交易总人数')}
          <div className='icon-wrapper'>
            <Svg
              src={`/static/images/affiliate/filter-arrow-up-${getActive(order === 'asc' && orderBy === 3)}.svg`}
              width={6}
              height={5.5}
            />
            <Svg
              src={`/static/images/affiliate/filter-arrow-up-${getActive(order === 'desc' && orderBy === 3)}.svg`}
              className='arrow-down'
              width={6}
              height={5.5}
            />
          </div>
        </div>
      ),
      dataIndex: 'trading',
      render: (trading: number) => trading?.toFormat(),
    },
    {
      title: <div className='tr-time-wrapper'>{LANG('注册时间')}</div>,
      dataIndex: 'registerTime',
      align: 'right',
      render: (registerTime: string, { uid }: any) => {
        return (
          <div className='last-td'>
            <div>
              <div>{dayjs(registerTime).format('YYYY/MM/DD')}</div>
              <span className='time'>{dayjs(registerTime).format('HH:mm:ss')}</span>
            </div>
            <div className='arrow-wrapper'>
              <Svg
                src='/static/images/affiliate/team-table-arrow.svg'
                className={`collapse-icon ${getActive(listExpandedRows.includes(uid))}`}
                width={12}
                height={12}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const renderChart = async (uid: string) => {
    if (!stashFetchUids.includes(uid)) {
      setTimeout(async () => {
        if (typeof document === 'undefined') return;
        const $dom = document.getElementById(`chart-${uid}`) as HTMLCanvasElement;
        setStashFetchUids([...stashFetchUids, uid]);
        let data = await Teams.getTradeDataByUid(uid);
        data = [...data].sort((a, b) => +new Date(a.date) - +new Date(b.date));
        const myChart = echarts.init($dom);
        myChart.setOption({
          color: ['#FFD30F'],
          legend: {
            show: false,
          },
          tooltip: {
            formatter: `<span style='color: #9E9E9D'>${LANG(
              '本周交易量'
            )}{a}&emsp;{b}</span><br /><span class="count">{c}</span>`,
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
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: isDark ? '#515656' : '#E5E5E4',
                type: [4, 5],
              },
            },
            axisTick: {
              show: false,
            },
          },
          grid: {
            x: 5,
            x2: 10,
            y: 15,
            y2: 25,
          },
          series: [
            {
              name: '',
              type: 'bar',
              data: data.map((item) => item.value),
              barWidth: 11,
              barGap: '50%',
              itemStyle: {
                borderRadius: [4, 4, 0, 0],
                color: '#E5E5E4',
              },
              emphasis: {
                disabled: false,
                itemStyle: {
                  color: '#FFD30F',
                },
              },
            },
          ],
        });
        window.addEventListener('resize', myChart.resize as any);
      }, 30);
    }
  };

  const expandedRowRender = ({ tradeAmount, uid, username }: any) => {
    return (
      <div className='expand-wrapper'>
        <div className='text-wrapper'>
          <div className='title-wrapper'>
            <CommonIcon name='common-affiliate-table-chart' width={16} height={14} enableSkin />
            <span className='title'>{LANG('团队总交易量')}</span>
          </div>
          <div className='amount'>{tradeAmount?.toFormat(scale)}</div>
          <div className='btn-wrapper'>
            <button onClick={() => Teams.onFetchNextLevelData(uid, username)}>{LANG('查看下级')}</button>
            <button
              className='upgrade'
              onClick={() => {
                Teams.handleOpenUpgradeModal();
                Teams.onUpgradeUidChange(uid);
              }}
            >
              {LANG('升点')}
            </button>
          </div>
        </div>
        <div className='chart-wrapper' id={`chart-${uid}`}></div>
      </div>
    );
  };

  const onUpgradeOk = async () => {
    const result = await Teams.onUpgradeModalConfirmClicked();
    if (result?.code === 500) {
      AlertFunction({
        className: 'invite',
        hideHeaderIcon: true,
        theme: localStorage.getItem('theme') as THEME,
        children: (
          <div className='alert-wrapper'>
            {result?.message}
            <div>
              {LANG('市场经理联系邮箱')}: <span>bd@YMEX.exchange</span>
            </div>
          </div>
        ),
        v2: true,
        onOk: () => {},
      });
    } else if (result?.code === 200) {
      setStashFetchUids([]);
    }
  };

  return (
    <AffiliateDesktopLayout>
      <div className='container'>
        <div className='header'>
          {nextLevelList.length == 0 ? (
            LANG('团队管理')
          ) : (
            <div className='back-wrapper' onClick={Teams.onFetchPrevLevelData}>
              <Svg src='/static/images/affiliate/team-table-arrow.svg' className='back-icon' width={14} height={14} />
              {LANG('查看下级')}: <span>{nextLevelList[nextLevelList.length - 1].username}</span>
            </div>
          )}
          <button onClick={Teams.handleOpenUpgradeModal}>{LANG('升点')}</button>
        </div>
        <div className='filter-wrapper'>
          <AffiliateSearchInput
            value={uid}
            onChange={(val) => Teams.onUidChange(val)}
            onSearch={() => {
              Teams.onSearchBtnClicked();
              setStashFetchUids([]);
            }}
            placeholder={LANG('请输入用户ID')}
          />
          <Tooltip color='#333' placement='top' title={LANG('下列数据，每1小时更新一次')}>
            <div style={{ padding: '4px' }}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
            </div>
          </Tooltip>
          <div className='date-wrapper'>
            <DateRangePicker
              onChange={Teams.onChangeTradeDateRangePicker}
              value={[dayjs(dateRangeStart), dayjs(dateRangeEnd)]}
            />
            <AffiliateFilterButton onClick={Teams.handleOpenFilterModal} />
          </div>
        </div>
        <div className='user-table-wrapper'>
          <AffiliateTable
            dataSource={userList}
            columns={columns}
            total={total}
            page={page}
            paginationOnChange={(val) => {
              Teams.onPageChange(val);
              Teams.fetchList();
              setStashFetchUids([]);
            }}
            renderRowKey={(v: any) => v.uid}
            expandable={{
              expandedRowRender,
              expandRowByClick: true,
              expandIcon: () => null,
              onExpandedRowsChange: (expandedRows: any) => {
                Teams.onListExpandedRowsChange(expandedRows);
                expandedRows.forEach((uid: string) => {
                  renderChart(uid);
                });
                document.querySelectorAll('.ant-table-row').forEach((item) => {
                  if (expandedRows.includes(item.getAttribute('data-row-key'))) {
                    item.className = 'ant-table-row ant-table-row-level-0 active';
                  } else {
                    item.className = 'ant-table-row ant-table-row-level-0';
                  }
                });
              },
            }}
          />
        </div>
      </div>
      <Modal
        title={LANG('筛选')}
        open={filterModalOpen}
        onCancel={Teams.handleCloseFilterModal}
        className='user-detail-filter-modal'
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        destroyOnClose
        onOk={() => {
          Teams.onFilterModalConfirmClicked();
          setStashFetchUids([]);
        }}
        closeIcon={null}
        closable={false}
      >
        <ModalClose onClose={Teams.handleCloseFilterModal} className='close-icon' />
        <div className='content'>
          <div className='item'>
            <div className='label'>{LANG('用户名')}</div>
            <input
              type='text'
              value={username}
              onChange={(e) => Teams.onUsernameChange(e.currentTarget.value)}
              placeholder={LANG('请输入用户名')}
            />
          </div>
          <div className='item'>
            <div className='label'>{LANG('类型')}</div>
            <ul>
              <li className={getActive(type === TradeTab.Spot)} onClick={() => Teams.onTypeChange(TradeTab.Spot)}>
                {LANG('现货')}
                {type === TradeTab.Spot && (
                  <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                )}
              </li>
              <li className={getActive(type === TradeTab.Swap)} onClick={() => Teams.onTypeChange(TradeTab.Swap)}>
                {LANG('永续合约')}
                {type === TradeTab.Swap && (
                  <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                )}
              </li>
            </ul>
          </div>
          <div className='item'>
            <div className='label'>{LANG('比例')}</div>
            <ul>
              <li className={getActive(ratio === 0)} onClick={() => Teams.onRatioChange(0)}>
                All
                {ratio === 0 && (
                  <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                )}
              </li>
              {(type === TradeTab.Spot ? spotStepsList : swapStepsList).map((item) => (
                <li
                  key={item.value}
                  className={`${getActive(ratio === item.value)} ${item.disabled ? 'hidden' : ''}`}
                  onClick={() => Teams.onRatioChange(item.value)}
                >
                  {item.value.mul(100) + '%'}
                  {ratio === item.value && (
                    <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className='item'>
            <div className='label'>{LANG('币种')}</div>
            <ul>
              {currencyAll.map((item, index) => (
                <li
                  key={item}
                  className={`${getActive(item === currency)} ${index === 3 ? 'no-margin-left' : ''}`}
                  onClick={() => Teams.onCurrencyChange(item)}
                >
                  {item}
                  {item === currency && (
                    <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className='item'>
            <div className='label'>{LANG('时间')}</div>
            <ul>
              {DateList.map((item) => (
                <li
                  key={item.value}
                  className={getActive(item.value === dateRangeValue)}
                  onClick={() => Teams.onDateRangeValueChange(item.value)}
                >
                  {item.label}
                  {item.value === dateRangeValue && (
                    <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
      <Modal
        title={LANG('升点')}
        open={upgradeModalOpen}
        onCancel={Teams.handleCloseUpgradeModal}
        className='user-detail-filter-modal'
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        destroyOnClose
        onOk={onUpgradeOk}
        closeIcon={null}
        closable={false}
        okButtonProps={{
          disabled: upgradeUid === '' || upgradeRatio === 0,
        }}
      >
        <ModalClose onClose={Teams.handleCloseUpgradeModal} className='close-icon' />
        <div className='content'>
          <div className='item'>
            <div className='label'>{LANG('升级用户')}</div>
            <input
              type='text'
              value={upgradeUid}
              onChange={(e) => Teams.onUpgradeUidChange(e.currentTarget.value)}
              placeholder={LANG('请输入用户ID')}
            />
          </div>
          <div className='item'>
            <div className='label'>{LANG('类型')}</div>
            <ul>
              <li
                className={getActive(upgradeType === TradeTab.Spot)}
                onClick={() => Teams.onUpgradeTypeChange(TradeTab.Spot)}
              >
                {LANG('现货')}
                {upgradeType === TradeTab.Spot && (
                  <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                )}
              </li>
              <li
                className={getActive(upgradeType === TradeTab.Swap)}
                onClick={() => Teams.onUpgradeTypeChange(TradeTab.Swap)}
              >
                {LANG('永续合约')}
                {upgradeType === TradeTab.Swap && (
                  <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                )}
              </li>
            </ul>
          </div>
          <div className='item'>
            <div className='label'>{LANG('比例')}</div>
            <ul>
              {(upgradeType === TradeTab.Spot ? spotStepsList : swapStepsList).map((item) => (
                <li
                  key={item.value}
                  className={`${getActive(upgradeRatio === item.value)} ${item.disabled ? 'hidden' : ''}`}
                  onClick={() => Teams.onUpgradeRatioChange(item.value)}
                >
                  {item.value.mul(100) + '%'}
                  {upgradeRatio === item.value && (
                    <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
      <style jsx>{styles}</style>
    </AffiliateDesktopLayout>
  );
};

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    flex: 1;
    margin-right: 20px;
    height: 100%;
    .header {
      font-size: 20px;
      font-weight: 500;
      line-height: 80px;
      color: var(--theme-font-color-1);
      border-bottom: 1px solid var(--theme-deep-border-color-1);
      padding: 0 26px;
      display: flex;
      align-items: center;
      button {
        margin-left: auto;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;
        background-color: var(--skin-primary-color);
        color: var(--skin-font-color);
        font-size: 12px;
        border-radius: 8px;
        font-weight: 500;
        width: 126px;
        cursor: pointer;
      }
      .back-wrapper {
        cursor: pointer;
        display: flex;
        align-items: center;
        :global(.back-icon) {
          transform: rotate(90deg);
          margin-right: 10px;
          position: relative;
          top: 2px;
        }
      }
    }
    .filter-wrapper {
      display: flex;
      align-items: center;
      padding: 21px 25px;
      .date-wrapper {
        margin-left: auto;
        display: flex;
        align-items: center;
        :global(.date-container) {
          height: 36px;
          margin-right: 9px;
        }
        :global(.picker-content) {
          background-color: inherit;
          border: 1px solid var(--theme-border-color-2);
          margin-right: 20px;
          padding-top: 2px;
          padding-bottom: 2px;
          border-radius: 8px;
          :global(input) {
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }
    .user-table-wrapper {
      margin: 0 25px;
      padding-top: 0;
      overflow-x: auto;
      :global(.userinfo-wrapper) {
        display: flex;
        align-items: center;
        :global(.avatar) {
          width: 32px;
          height: 32px;
          margin-right: 10px;
          border-radius: 50%;
        }
        :global(.info-wrapper) {
          width: 200px;
        }
        :global(.username) {
          :global(span) {
            margin-left: 9px;
            color: var(--skin-primary-color);
            display: inline-block;
            padding: 0 7px;
            background-color: var(--skin-primary-bg-color-opacity-1);
            height: 14px;
            line-height: 14px;
            border-radius: 3px;
            font-weight: 400;
            font-size: 12px;
          }
        }
        :global(.copy) {
          color: var(--theme-font-color-3);
          font-weight: 400;
          :global(img) {
            margin-left: 4px;
            cursor: pointer;
          }
        }
      }
      :global(.last-td) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 0;
        :global(.arrow-wrapper) {
          width: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 30px;
          :global(.collapse-icon.active) {
            transform: rotate(180deg);
          }
        }
      }
      :global(.tr-time-wrapper) {
        width: 72px;
      }
      :global(.time) {
        font-weight: 400;
        color: var(--theme-font-color-3);
        font-size: 12px;
      }
      :global(.commission) {
        color: #43bc9c;
      }
      :global(.sort-wrapper) {
        display: flex;
        align-items: center;
        cursor: pointer;
        :global(.icon-wrapper) {
          display: flex;
          align-items: center;
          flex-direction: column;
          margin-left: 8px;
          :global(.arrow-down) {
            transform: rotate(180deg);
            margin-top: 2px;
          }
        }
      }
      :global(.ant-table-column-sorter-up.active),
      :global(.ant-table-column-sorter-down.active) {
        color: var(--skin-primary-color) !important;
      }
      :global(.yellow) {
        color: var(--skin-primary-color);
      }
      :global(.ant-table-row),
      :global(.ant-table-thead) {
        :global(td),
        :global(th) {
          &:nth-child(2) {
            padding-left: 0 !important;
            border-start-start-radius: 0;
            text-wrap: nowrap;
          }
          &:last-child {
            padding-right: 0 !important;
            border-start-end-radius: 0;
          }
        }
      }
      :global(.ant-table-thead) {
        :global(th) {
          text-wrap: nowrap;
        }
      }
      :global(.ant-table-row.active) {
        :global(td) {
          border-color: var(--theme-background-color-2) !important;
        }
      }
      :global(.ant-table-row-expand-icon-cell) {
        display: none;
      }
      :global(.expand-wrapper) {
        display: flex;
        align-items: center;
        :global(.text-wrapper) {
          width: auto;
          :global(.title-wrapper) {
            display: flex;
            align-items: center;
            :global(.title) {
              margin-left: 8px;
              color: var(--theme-font-color-3);
              font-size: 12;
            }
          }
          :global(.amount) {
            color: var(--theme-font-color-1);
            font-size: 20px;
            font-weight: 700;
            margin-top: 9px;
            padding-left: 22px;
          }
          :global(.btn-wrapper) {
            margin-top: 40px;
            padding-left: 22px;
            display: flex;
            align-items: center;
            :global(button) {
              text-wrap: nowrap;
              background-color: var(--theme-background-color-2) !important;
              height: 30px;
              width: auto;
              border: 1px solid var(--theme-deep-border-color-1);
              color: var(--theme-font-color-1);
              outline: none;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              cursor: pointer;
            }
            :global(button.upgrade) {
              color: var(--skin-primary-color);
              border-color: var(--skin-primary-color);
              margin-left: 5px;
            }
          }
        }
        :global(.chart-wrapper) {
          flex: 1;
          height: 140px;
        }
      }
      :global(.count) {
        font-weight: 600;
      }
    }
  }
  :global(.user-detail-filter-modal) {
    width: 375px !important;
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 10px;
    }
    :global(.ant-modal-content) {
      padding: 5px 0;
      border-radius: 8px;
      background: var(--theme-background-color-2);
    }
    :global(.ant-modal-header) {
      background: var(--theme-trade-modal-color);
      height: 50px;
      padding: 0;
      margin-bottom: 0;
      :global(.ant-modal-title) {
        margin-left: 20px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
    }
    :global(.ant-modal-body) {
      padding: 0 20px;
    }
    :global(.ant-modal-footer) {
      display: flex;
      justify-content: center;
      padding: 10px 20px;
      :global(.ant-btn) {
        background: var(--theme-sub-button-bg);
        color: var(--theme-font-color-1);
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        padding: 0;
        border-radius: 8px;
        margin-inline-start: 0 !important;
      }
      :global(.ant-btn-primary) {
        box-shadow: none;
        background-color: var(--skin-primary-color);
        color: var(--skin-font-color);
        &:disabled {
          opacity: 0.3;
        }
      }
      :global(.ant-btn-default) {
        display: none;
      }
    }
    .content {
      .item {
        margin-bottom: 15px;
        margin-top: 10px;
        .label {
          color: var(--theme-font-color-1);
          font-size: 12px;
          margin-bottom: 6px;
        }
        input {
          display: flex;
          align-items: center;
          padding: 0 5px;
          height: 34px;
          background-color: var(--theme-background-color-8);
          width: 100%;
          border: none;
          outline: none;
          border-radius: 8px;
          font-size: 12px;
          color: var(--theme-font-color-1);
          &::placeholder {
            color: var(--theme-font-color-3);
          }
        }
        ul {
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          li {
            margin-left: 16px;
            margin-bottom: 12px;
            position: relative;
            width: 30%;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--theme-background-color-4);
            border-radius: 6px;
            height: 28px;
            color: var(--theme-font-color-3);
            background-color: var(--theme-background-color-4);
            font-size: 12px;
            cursor: pointer;
            &:first-child {
              margin-left: 0;
            }
            &.active {
              border-color: var(--skin-primary-color);
              color: var(--skin-primary-color);
              background-color: var(--skin-primary-bg-color-opacity-3);
            }
            :global(img) {
              position: absolute;
              top: -1px;
              right: -1px;
            }
            &:nth-child(3n + 1) {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  :global(.alert-wrapper) {
    margin-top: 20px;
    :global(span) {
      color: var(--skin-primary-color);
    }
  }
`;
export default DesktopTeamsManage;
