import AffiliateFilterButton from '@/components/affiliate/filter-button';
import { List } from '@/components/affiliate/list';
import AffiliateSearchInput from '@/components/affiliate/search-input';
import AffiliateTableUserInfo from '@/components/affiliate/table-userinfo';
import { DateRangePicker } from '@/components/date-range-picker';
import Image from '@/components/image';
import { AffiliateTabletLayout } from '@/components/layouts/media/affiliate/tablet';
import { ModalClose } from '@/components/mobile-modal';
import { useCurrencyScale, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { UserDetail, UserListItem, currencyAll } from '@/core/shared';
import { formatDefaultText, getActive } from '@/core/utils';
import { Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

const Item = ({ data: item, currency }: { data: UserListItem; currency: string }) => {
  const { scale } = useCurrencyScale('USDT');
  return (
    <>
      <div className='container'>
        <AffiliateTableUserInfo avatar={item.avatar} username={item.username} uid={item.uid} distance={item.distance} />
        <div className='item marginTop'>
          <div className='label'>{LANG('注册时间')}</div>
          <div className='value'>{dayjs(item.registerTime).format('YYYY/MM/DD')}</div>
        </div>
        <div className='item'>
          <div className='label'>{LANG('来源')}</div>
          <div className='value'>{formatDefaultText(item.source)}</div>
        </div>
        <div className='item'>
          <div className='label'>
            {LANG('总充值')}
            <Tooltip color='#fff' placement='top' title={LANG('数据每1个小时更新一次')}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} alt='' />
            </Tooltip>
          </div>
          <div className='value'>{item.recharge.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>
            {LANG('总提币')}
            <Tooltip color='#fff' placement='top' title={LANG('数据每1个小时更新一次')}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} alt='' />
            </Tooltip>
          </div>
          <div className='value'>{item.withdraw.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>
            {LANG('累计交易量')}
            <Tooltip color='#fff' placement='top' title={LANG('数据每1个小时更新一次')}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} alt='' />
            </Tooltip>
          </div>
          <div className='value'>{item.tradeAmount.toFormat(scale)}</div>
        </div>
        <div className='item'>
          <div className='label'>
            {LANG('累计交易次数')}
            <Tooltip color='#fff' placement='top' title={LANG('数据每1个小时更新一次')}>
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} alt='' />
            </Tooltip>
          </div>
          <div className='value'>{item.tradeCount.toFormat()}</div>
        </div>
        <div className='item'>
          <div className='label'>
            {LANG('贡献佣金')}
            <Tooltip
              color='#fff'
              placement='top'
              title={LANG('此数据为对应UID仅贡献给你的佣金收入，数据每1小时更新一次')}
            >
              <Image src='/static/images/affiliate/affiliate-tips.svg' className='tips' width={14} height={14} />
            </Tooltip>
          </div>
          <div className='value'>{formatDefaultText(item.commissions[currency]?.toFixed(scale))}</div>
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
              display: flex;
              align-items: center;
            }
            .value {
              color: var(--theme-font-color-1);
            }
          }
          .marginTop {
            margin-top: 16px;
          }
        }
        :global(.ant-tooltip-inner),
        :global(.ant-tooltip-arrow:before) {
          background: var(--theme-background-color-2-3) !important;
          color: var(--theme-font-color-1) !important;
        }
      `}</style>
    </>
  );
};

export const TabletSearch = () => {
  const {
    uid,
    dateRangeStart,
    dateRangeEnd,
    userList,
    page,
    total,
    filterModalOpen,
    username,
    source,
    currency,
    dateRangeValue,
  } = UserDetail.state;
  const { theme } = useTheme();

  useEffect(() => {
    UserDetail.fetchList();
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

  return (
    <AffiliateTabletLayout>
      <div className='container'>
        <div className='header'>{LANG('用户明细')}</div>
        <div className='filter-wrapper'>
          <AffiliateSearchInput
            value={uid}
            onChange={(val) => UserDetail.onUidChange(val)}
            onSearch={UserDetail.onSearchBtnClicked}
            placeholder={LANG('请输入用户ID')}
          />
          <div className='date-wrapper'>
            <DateRangePicker
              onChange={UserDetail.onChangeTradeDateRangePicker}
              value={[dayjs(dateRangeStart), dayjs(dateRangeEnd)]}
            />
            <AffiliateFilterButton onClick={UserDetail.handleOpenFilterModal} />
          </div>
        </div>
        <div className='user-table-wrapper'>
          <List
            list={userList}
            page={page}
            total={total}
            onChange={(page) => UserDetail.onPageChange(page)}
            showDescription
          >
            {(index) => {
              const item = userList[index];
              return <Item key={index} data={item} currency={currency} />;
            }}
          </List>
        </div>
      </div>
      <Modal
        title={LANG('筛选')}
        open={filterModalOpen}
        onCancel={UserDetail.handleCloseFilterModal}
        className='user-detail-filter-modal'
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        destroyOnClose
        onOk={() => UserDetail.onFilterModalConfirmClicked()}
        closeIcon={null}
        closable={false}
      >
        <ModalClose onClose={UserDetail.handleCloseFilterModal} className='close-icon' />
        <div className='content'>
          <div className='item'>
            <div className='label'>{LANG('用户名')}</div>
            <input
              type='text'
              value={username}
              onChange={(e) => UserDetail.onUsernameChange(e.currentTarget.value)}
              placeholder={LANG('请输入用户名')}
            />
          </div>
          <div className='item'>
            <div className='label'>{LANG('来源')}</div>
            <input
              type='text'
              value={source}
              onChange={(e) => UserDetail.onSourceChange(e.currentTarget.value)}
              placeholder={LANG('请输入来源')}
            />
          </div>
          <div className='item'>
            <div className='label'>{LANG('币种')}</div>
            <ul>
              {currencyAll.map((item, index) => (
                <li
                  key={item}
                  className={getActive(item === currency)}
                  onClick={() => UserDetail.onCurrencyChange(item)}
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
                  onClick={() => UserDetail.onDateRangeValueChange(item.value)}
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
      padding: 25px;
      padding-top: 0;
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
        color: #141717;
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
            &:nth-child(4) {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
`;
