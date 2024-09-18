import AffiliateFilterButton from '@/components/affiliate/filter-button';
import { List } from '@/components/affiliate/list';
import AffiliateSearchInput from '@/components/affiliate/search-input';
import AffiliateSelect from '@/components/affiliate/select';
import AffiliateTableUserInfo from '@/components/affiliate/table-userinfo';
import { DateRangePicker } from '@/components/date-range-picker';
import Image from '@/components/image';
import { AffiliateTabletLayout } from '@/components/layouts/media/affiliate/tablet';
import { ModalClose } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import { useCurrencyScale, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Teams, TeamsListItem, TradeTab, currencyAll } from '@/core/shared';
import { getActive } from '@/core/utils';
import { Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

const Item = ({ data: item }: { data: TeamsListItem }) => {
  const { scale } = useCurrencyScale('USDT');
  return (
    <>
      <div className='container'>
        <div className='item'>
          <div className='label'>
            <AffiliateTableUserInfo avatar={item.avatar} username={item.username} uid={item.uid} />
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
          <div className='value'>{item.subTradeAmount?.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('团队总交易量')}</div>
          <div className='value'>{item.tradeAmount?.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('团队总人数')}</div>
          <div className='value'>{item.invites?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('充值总人数')}</div>
          <div className='value'>{item.deposit?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('交易总人数')}</div>
          <div className='value'>{item.trading?.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('总返佣')}</div>
          <div className='value commission'>{item.commission?.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('注册时间')}</div>
          <div className='value'>{dayjs(item.registerTime).format('YYYY/MM/DD hh:mm:ss')}</div>
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

export const TabletTeamsManage = () => {
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

  const { theme } = useTheme();

  useEffect(() => {
    Teams.fetchStepsList();
    Teams.fetchList();
  }, []);

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
      value: '',
      label: LANG('全部筛选'),
    },
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
    <AffiliateTabletLayout>
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
          <div className='divider' />
          <AffiliateSelect
            value={orderBy}
            onSelect={(val) => Teams.onOrderBySelect(val)}
            list={OrderByList}
            placeholder={LANG('排序')}
            suffixIcon={<></>}
            popupClassName='teams-sort-popup'
            renderItem={(item) => (
              <div className='item'>
                <span>{item.label}</span>
                <Svg
                  src={`/static/images/affiliate/${
                    item.value === orderBy && item.value !== '' && order !== ''
                      ? 'select-item-sort-down'
                      : 'select-sort'
                  }.svg`}
                  className={order === 'asc' ? 'rotate' : ''}
                  width={14}
                  height={10}
                />
              </div>
            )}
          />
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
            <DateRangePicker
              onChange={Teams.onChangeTradeDateRangePicker}
              value={[dayjs(dateRangeStart), dayjs(dateRangeEnd)]}
            />
            <AffiliateFilterButton onClick={Teams.handleOpenFilterModal} />
          </div>
        </div>
        <div className='user-table-wrapper'>
          <List
            list={userList}
            page={page}
            total={total}
            onChange={(page) => {
              Teams.onPageChange(page);
              Teams.fetchList();
            }}
            showDescription
          >
            {(index) => {
              const item = userList[index];
              return <Item key={index} data={item} />;
            }}
          </List>
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
        onOk={() => Teams.onFilterModalConfirmClicked()}
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
        onOk={Teams.onUpgradeModalConfirmClicked}
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
    </AffiliateTabletLayout>
  );
};

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    flex: 1;
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
      .divider {
        width: 1px;
        height: 26px;
        background-color: #f2f2f0;
        margin: 0 20px;
      }
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
      :global(.ant-select) {
        background-color: var(--theme-background-color-8);
        border-radius: 5px;
      }
      :global(.ant-select-selector) {
        height: 32px;
      }
      :global(.item) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        :global(> span) {
          margin-right: 10px;
        }
        :global(.rotate) {
          transform: rotate(180deg);
        }
      }
    }
    .filter-wrapper {
      display: flex;
      align-items: center;
      padding: 20px;
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
      margin-top: 10px;
      padding: 0 20px;
      padding-bottom: 20px;
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
  :global(.teams-sort-popup .item) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: 100px;
    :global(> span) {
      margin-right: 10px;
    }
    :global(.rotate) {
      transform: rotate(180deg);
    }
  }
`;
