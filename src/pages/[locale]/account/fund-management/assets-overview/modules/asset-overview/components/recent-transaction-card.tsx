import CommonIcon from '@/components/common-icon';
import { EmptyComponent } from '@/components/empty';
import { getDepositRecordsApi, getWithdrawRecordsApi } from '@/core/api';
import { LANG, TrLink } from '@/core/i18n';
import { clsx, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { StatusIndication } from '../../../../../dashboard/components/status-indication';

export const RecentTransactionCard = () => {
  const [state, setState] = useImmer({
    widthDrawData: [] as any[],
    rechargeData: [] as any[],
  });
  const { rechargeData, widthDrawData } = state;
  const allData = rechargeData.concat(widthDrawData);
  allData.sort((a, b) => {
    return a.createTime - b.createTime > 0 ? -1 : 1;
  });

  const firstFiveData = allData.slice(0, 5);
  const getWithdrawHistoryData = async () => {
    const startDate = dayjs().subtract(90, 'day').startOf('day').format('YYYY-MM-DD H:m:s');
    const endDate = dayjs().endOf('day').format('YYYY-MM-DD H:m:s');
    const res = await getWithdrawRecordsApi({
      page: 1,
      rows: 10,
      createTimeGe: startDate,
      createTimeLe: endDate,
      transfer: false,
    });
    if (res.code === 200) {
      const list = res.data.list || [];
      setState((draft) => {
        draft.widthDrawData = list.map((item: {}) => {
          return {
            ...item,
            type: 'withDraw',
            title: LANG('提现'),
            indicator: '-',
            icon: 'common-withdraw-green-icon-0',
          };
        });
      });
    } else {
      message.error(res.message);
    }
  };
  const getRechargeWithdrawHistory = async () => {
    const startDate = dayjs().subtract(90, 'day').startOf('day').format('YYYY-MM-DD H:m:s');
    const endDate = dayjs().endOf('day').format('YYYY-MM-DD H:m:s');
    const res = await getDepositRecordsApi({
      page: 1,
      rows: 10,
      createTimeGe: startDate,
      createTimeLe: endDate,
      coin: true,
    });
    if (res.code === 200) {
      const list = res.data.list || [];
      setState((draft) => {
        draft.rechargeData = list.map((item: {}) => {
          return {
            ...item,
            type: 'recharge',
            icon: 'common-recharge-icon-0',
            indicator: '+',
            title: LANG('充值'),
          };
        });
      });
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    getRechargeWithdrawHistory();
    getWithdrawHistoryData();
  }, []);
  const renderTransaction = () => {
    if (!firstFiveData.length) {
      return (
        <div className='empty-transaction'>
          <EmptyComponent />
        </div>
      );
    }
    const renderItem = () => {
      return firstFiveData.map((item) => {
        return (
          <li key={item?.id}>
            <div className={clsx('indicator-icon', item?.type)}>
              <CommonIcon name={item?.icon} size={16} />
            </div>
            <div className='right-area'>
              <div className='top-info'>
                <span className='label'>{item.title}</span>
                <span className='label'>
                  {item?.indicator} {item?.amount?.toFormat()} {item?.currency}
                </span>
              </div>
              <div className='bottom-info'>
                <span className='txt'>{dayjs(item?.createTime).format('YYYY/MM/DD')}</span>
                <StatusIndication status={item.status} />
              </div>
            </div>
            <style jsx>{styles}</style>
          </li>
        );
      });
    };
    return (
      <ul className='transaction-list'>
        {renderItem()}
        <style jsx>{styles}</style>
      </ul>
    );
  };
  return (
    <div className='recent-transaction'>
      <div className='header'>
        <p className='title'>{LANG('近期充提交易')}</p>
        <TrLink
          className='view-all'
          href='/account/fund-management/assets-overview'
          query={{ type: 'fund-history', tab: 2 }}
        >
          <span className='content'>{LANG('查看全部')}</span>
          <CommonIcon name='common-arrow-right-active-0' size={12} enableSkin />
        </TrLink>
      </div>
      {renderTransaction()}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .recent-transaction {
    width: 360px;
    border-radius: 15px;
    height: 380px;
    background-color: var(--theme-background-color-2);
    .header {
      padding: 18px 15px;
      border-bottom: 1px solid var(--theme-border-color-2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-weight: 500;
        font-size: 16px;
        color: var(--theme-font-color-6);
      }
      :global(.view-all) {
        :global(.content) {
          color: var(--skin-main-font-color);
          padding-right: 4px;
        }
      }
    }
    :global(.empty-transaction) {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 82%;
    }
    .transaction-list {
      padding: 10px 16px;
      width: 360px;
      margin: 0;
      li {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        .indicator-icon {
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 6px;
        }
        .indicator-icon.recharge {
          background-color: rgba(67, 188, 156, 0.15);
        }
        .indicator-icon.withDraw {
          background-color: rgba(44, 102, 209, 0.15);
        }
        .right-area {
          width: 100%;
          .top-info {
            color: var(--theme-font-color-1);
            font-size: 14px;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
          }
          .bottom-info {
            justify-content: space-between;
            display: flex;
            align-items: center;
            font-size: 12px;
            color: var(--theme-font-color-3);
            margin-top: 5px;
          }
        }
      }
    }
  }
`;
