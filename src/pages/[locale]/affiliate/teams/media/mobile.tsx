import AffiliateDatePicker from '@/components/affiliate/date-picker';
import AffiliateFilterButton from '@/components/affiliate/filter-button';
import { List } from '@/components/affiliate/list';
import AffiliateSearchInput from '@/components/affiliate/search-input';
import AffiliateTableUserInfo from '@/components/affiliate/table-userinfo';
import Image from '@/components/image';
import { AffiliateMobileLayout } from '@/components/layouts/media/affiliate/mobile';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import { Teams, TeamsListItem, TradeTab, currencyAll } from '@/core/shared';
import { getActive } from '@/core/utils';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

const Item = ({ data: item }: { data: TeamsListItem }) => {
  return (
    <>
      <div className='container'>
        <div className='item'>
          <div className='label'>
            <AffiliateTableUserInfo avatar={item?.avatar} username={item.username} uid={item.uid} />
          </div>
          <div className='value'>
            <div>{item?.ratio.mul(100)}%</div>
            <div>{LANG('代理比例')}</div>
          </div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('邀请方式')}</div>
          <div className='value'>{item.distance === 1 ? LANG('直属') : LANG('非直属')}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('直属交易量')}</div>
          <div className='value'>{item?.subTradeAmount?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('团队总交易量')}</div>
          <div className='value'>{item?.tradeAmount?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('团队总人数')}</div>
          <div className='value'>{item?.invites?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('充值总人数')}</div>
          <div className='value'>{item?.deposit?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('交易总人数')}</div>
          <div className='value'>{item?.trading?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('总返佣')}</div>
          <div className='value commission'>{item?.commission?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('注册时间')}</div>
          <div className='value'>{dayjs(item?.registerTime).format('YYYY/MM/DD hh:mm:ss')}</div>
        </div>
        <div className='item'>
          <div className='btn'>
            <button onClick={() => Teams.onFetchNextLevelData(item.uid, item.username)}>{LANG('查看下级')}</button>
          </div>
          <div className='btn'>
            <button
              onClick={() => {
                Teams.handleOpenUpgradeModal();
                Teams.onUpgradeUidChange(item.uid);
              }}
            >
              {LANG('升点')}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          padding: 16px 0;
          border-bottom: 1px solid var(--theme-border-color-2);
          &:first-child {
            padding-top: 0;
          }
          .item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            margin-bottom: 12px;
            &:last-child {
              margin-bottom: 0;
            }
            .label {
              color: var(--theme-font-color-3);
            }
            .value {
              color: var(--theme-font-color-1);
              &.commission {
                color: #43bc9c;
              }
              > div {
                text-align: right;
                &:first-child {
                  color: var(--skin-primary-color);
                }
                &:last-child {
                  color: var(--theme-font-color-3);
                }
              }
            }
            .btn {
              flex: 1;
              &:first-child {
                margin-right: 8px;
              }
              &:last-child {
                margin-left: 8px;
              }
              button {
                height: 32px;
                width: 100%;
                border: none;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: var(--theme-background-color-8);
                border-radius: 6px;
                cursor: pointer;
                color: var(--theme-font-color-1);
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

export const MobileTeamsManage = () => {
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
    nextLevelList,
  } = Teams.state;

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

  const OrderByList = [
    {
      value: 4,
      label: LANG('代理比例'),
    },
    {
      value: 1,
      label: LANG('团队总人数'),
    },
    {
      value: 2,
      label: LANG('充值总人数'),
    },
    {
      value: 3,
      label: LANG('交易总人数'),
    },
  ];

  return (
    <AffiliateMobileLayout>
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
            onSearch={Teams.onSearchBtnClicked}
            placeholder={LANG('请输入用户ID')}
          />

          <Tooltip color='#333' placement='top' title={LANG('下列数据，每1小时更新一次')}>
            <div style={{ padding: '4px' }}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
            </div>
          </Tooltip>
          <div className='date-wrapper'>
            <AffiliateFilterButton onClick={Teams.handleOpenFilterModal} />
          </div>
        </div>
        <div className='user-table-wrapper'>
          <ul className='sort-wrapper'>
            {OrderByList.map((item) => (
              <li key={item.value} onClick={() => Teams.onOrderByChange(item.value)}>
                {item.label}
                <div className='icon-wrapper'>
                  <Svg src={getSvgUrl('asc', item.value)} width={6} height={5.5} />
                  <Svg src={getSvgUrl('desc', item.value)} className='arrow-down' width={6} height={5.5} />
                </div>
              </li>
            ))}
          </ul>
          <List list={userList} page={page} total={total} onChange={(page) => Teams.onPageChange(page)}>
            {(index) => {
              const item = userList[index];
              return <Item key={index} data={item} />;
            }}
          </List>
        </div>
      </div>
      <MobileModal visible={filterModalOpen} onClose={Teams.handleCloseFilterModal} type='bottom'>
        <BottomModal
          title={LANG('筛选')}
          confirmText={LANG('确认')}
          onConfirm={() => Teams.onFilterModalConfirmClicked(true)}
        >
          <div className='teams-filter-modal'>
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
                {(type === TradeTab.Spot ? spotStepsList || [] : swapStepsList || []).map((item) => (
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
                {currencyAll.map((item) => (
                  <li key={item} className={getActive(item === currency)} onClick={() => Teams.onCurrencyChange(item)}>
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
                    onClick={() => Teams.onDateRangeValueChange(item.value, true)}
                  >
                    {item.label}
                    {item.value === dateRangeValue && (
                      <Image src='/static/images/affiliate/select-active.svg' width={14} height={14} enableSkin />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className='item'>
              <div className='label'>{LANG('自定义时间')}</div>
              <div className='date-wrapper'>
                <AffiliateDatePicker
                  onChange={Teams.onStartDateChange}
                  value={dateRangeStart}
                  placeholder={LANG('开始时间')}
                />
                <span>{LANG('到')}</span>
                <AffiliateDatePicker
                  onChange={Teams.onEndDateChange}
                  value={dateRangeEnd}
                  placeholder={LANG('结束时间')}
                />
              </div>
            </div>
          </div>
        </BottomModal>
      </MobileModal>
      <MobileModal visible={upgradeModalOpen} onClose={Teams.handleCloseUpgradeModal} type='bottom'>
        <BottomModal
          title={LANG('升点')}
          confirmText={LANG('确认')}
          onConfirm={Teams.onUpgradeModalConfirmClicked}
          disabledConfirm={upgradeUid === '' || upgradeRatio === 0}
        >
          <div className='teams-filter-modal'>
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
                {(upgradeType === TradeTab.Spot ? spotStepsList || [] : swapStepsList || []).map((item) => (
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
        </BottomModal>
      </MobileModal>
      <style jsx>{styles}</style>
    </AffiliateMobileLayout>
  );
};

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    flex: 1;
    height: 100%;
    .header {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      border-bottom: 1px solid var(--theme-deep-border-color-1);
      padding: 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
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
      padding: 10px;
      .date-wrapper {
        margin-left: 10px;
        display: flex;
        align-items: center;
      }
    }
    .user-table-wrapper {
      padding: 0 10px;
      padding-bottom: 10px;
      overflow-x: auto;
      .sort-wrapper {
        padding: 0;
        margin: 0;
        overflow-x: auto;
        text-wrap: nowrap;
        margin-bottom: 20px;
        color: var(--theme-font-color-1);
        li {
          display: inline-block;
          margin-right: 16px;
          &:last-child {
            margin-right: 0px;
          }
          .icon-wrapper {
            position: relative;
            top: 2px;
            display: inline-block;
            margin-left: 5px;
            :global(.arrow-down) {
              transform: rotate(180deg);
              margin-top: 2px;
            }
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
  :global(.teams-filter-modal) {
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
      .date-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          margin: 0 12px;
          color: var(--theme-font-color-3);
        }
      }
    }
  }
`;
