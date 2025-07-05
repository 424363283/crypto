import CommonIcon from '@/components/common-icon';
import { EmptyComponent } from '@/components/empty';
import { getDepositRecordsApi, getWithdrawRecordsApi } from '@/core/api';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { StatusIndication } from '../../../../../dashboard/components/status-indication';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { TAB_KEY } from '../../../../asset-account/index.page';

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
            type: TAB_KEY.WITHDRAW,
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
            type: TAB_KEY.RECHARGE,
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
      const AMOUNT_COLOR_MAP: { [key: string]: string } = {
        '+': 'var(--green)',
        '-': 'var(--red)',
      };
      return firstFiveData.map((item) => {
        return (
          <li key={item?.id} >
            {
              // <div className={clsx('indicator-icon', item?.type)}>
              //   <CommonIcon name={item?.icon} size={16} />
              // </div>
            }
            <div className='title'>
              <div className='label '>{item.title} {item?.currency}
                {(item.type === TAB_KEY.RECHARGE && item.sourceCurrency !== item.currency) && <Tooltip
                  placement='topRight'
                  arrow={false}
                  title={LANG('由于充值源头币种与实际到账币种不一致，实际到账时会转换为USDT。')}
                >
                  <CommonIcon name='common-info-0' size={16} />
                </Tooltip>}
              </div>
              <div className='txt time'>{dayjs(item?.createTime).format('YYYY/MM/DD HH:mm')}</div>
            </div>
            <span className='label coin amount' style={{ color: AMOUNT_COLOR_MAP[item?.indicator] || 'unset' }}>
              {item?.indicator} {item?.amount?.toFormat()}
            </span>
            <StatusIndication status={item.status} />
            {
              // <div className='right-area'>
              //   <div className='top-info'>
              //     <span className='label'>{item.title} {item?.currency}</span>
              //     <span className='label'>
              //       {item?.indicator} {item?.amount?.toFormat()} {item?.currency}
              //     </span>
              //   </div>
              //   <div className='bottom-info'>
              //     <span className='txt'>{dayjs(item?.createTime).format('YYYY/MM/DD')}</span>
              //     <StatusIndication status={item.status} />
              //   </div>
              // </div>
            }
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
    <div className='recent-transaction rounded-1'>
      <div className='header'>
        <p className='title'>{LANG('近期充提交易')}</p>
        <TrLink
          className='view-all'
          href='/account/fund-management/assets-overview'
          query={{ type: 'fund-history', tab: 2 }}
        >
          <span className='content'>{LANG('查看全部')}</span>
          <CommonIcon name='common-arrow-right-0' size={24} enableSkin />
        </TrLink>
      </div>
      <div className='transaction-wrapper'>{renderTransaction()}</div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .recent-transaction {
    display: flex;
    flex-direction: column;
    width: 396px;
    border-radius: 15px;
    height: 100%;
    background-color: var(--fill_bg_1);
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .header {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media ${MediaInfo.mobile} {
        padding: 12px 0 12px 12px;
      }
      .title {
        font-weight: 500;
        font-size: 16px;
        color: var(--text_1);
      }
      :global(.view-all) {
        display: flex;
        align-items: center;
        :global(.content) {
          color: var(--text_2);
          padding-right: 4px;
        }
      }
    }
    :global(.empty-transaction) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 396px;
      height: 82%;
    }
    .transaction-wrapper {
      margin-bottom: 8px;
      overflow-y: scroll;
    }
    .transaction-list {
      padding: 0px 24px;
      width: 396px;
      margin: 0;
      @media ${MediaInfo.mobile} {
        padding: 0 12px;
        width: auto;
      }
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;
        &:not(:last-child) {
          margin-bottom: 0px;
          border-bottom: 1px solid var(--common-line-color);
        }
        .title {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: var(--text_1);
          font-size: 14px;
          font-weight: 500;
          .label {
            display: flex ;
            align-items: center;
            color: var(--text_1);
            font-size: 14px;
            font-weight: 500;
            line-height: 14px; /* 100% */
            gap: 4px;
          }
          .time {
            font-size: 12px;
            font-weight: 400;
            color: var(--text_3);
            line-height: 12px; /* 100% */
          }
        }
        .amount {
          font-weight: 500;
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
            color: var(--text_2);
            margin-top: 5px;
          }
        }
      }
    }
  }
`;
