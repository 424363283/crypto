import { getDepositRecordsApi, getWithdrawRecordsApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { StatusIndication } from './status-indication';

export const RecentRecordCard = () => {
  const [state, setState] = useImmer({
    widthDrawData: [] as any[],
    rechargeData: [] as any[],
  });
  const { rechargeData, widthDrawData } = state;
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
      setState((draft) => {
        draft.widthDrawData = res.data.list || [];
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
    setState((draft) => {
      draft.rechargeData = res.data.list || [];
    });
  };
  useEffect(() => {
    getRechargeWithdrawHistory();
    getWithdrawHistoryData();
  }, []);
  const latestRechargeData = rechargeData[0];
  const latestRechargeCreateTime = latestRechargeData?.createTime || '';
  const latestWithdrawData = widthDrawData[0];
  const latestWithdrawCreateTime = latestWithdrawData?.createTime || '';
  const isRechargeLatest = latestRechargeCreateTime > latestWithdrawCreateTime;
  const bothRechargeAndWithdrawEmpty = !latestRechargeData && !latestWithdrawData; // 两者数据均为空
  const recentRecord = isRechargeLatest
    ? {
        type: 'recharge',
        label: LANG('充值'),
        indicator: '+',
        icon: '/static/images/account/dashboard/recharge-icon.svg',
        ...rechargeData[0],
      }
    : {
        type: 'withdraw',
        label: LANG('提币'),
        indicator: '-',
        icon: '/static/images/account/dashboard/recent-withdraw-icon.svg',
        ...widthDrawData[0],
      };
  const recordAmount = recentRecord?.amount?.toFormat();
  return (
    <div className='recent-record-card'>
      <div className='title'>{LANG('近期充提交易')}</div>
      <div className='recent-content'>
        <div className='left'>
          {bothRechargeAndWithdrawEmpty ? (
            '--'
          ) : (
            <Image src={recentRecord.icon} alt='icon' width={16} height={16} className='icon' />
          )}
        </div>
        {recentRecord && (
          <div className='right'>
            <div className='top'>
              <span className='label'>{bothRechargeAndWithdrawEmpty ? '--' : recentRecord.label}</span>
              <span className='label'>
                {recordAmount ? recentRecord.indicator + recordAmount + recentRecord?.currency : '--'}
              </span>
            </div>
            <div className='bottom'>
              <span className='txt'>
                {bothRechargeAndWithdrawEmpty ? '--' : dayjs(recentRecord?.createTime).format('YYYY/MM/DD')}
              </span>
              <StatusIndication status={recentRecord?.status} />
            </div>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .recent-record-card {
    height: 100px;
    .title {
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-6);
    }
    .recent-content {
      display: flex;
      margin-top: 25px;
      border-bottom: 1px solid var(--skin-border-color-1);
      padding-bottom: 20px;
      .left {
        color: var(--theme-font-color-1);
        background-color: var(--theme-background-color-3-5);
        display: flex;
        align-items: center;
        border-radius: 8px;
        justify-content: center;
        width: 36px;
        height: 36px;
        margin-right: 6px;
      }
      .right {
        flex: 1;
        .top {
          display: flex;
          justify-content: space-between;
          .label {
            font-size: 14px;
            font-weight: 600;
            color: var(--theme-font-color-1);
          }
        }
        .bottom {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          .txt {
            font-size: 12px;
            color: var(--const-color-grey);
            font-weight: 400;
          }
        }
      }
    }
  }
`;
