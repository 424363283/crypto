import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, AccountType, Lite, LiteListItem } from '@/core/shared';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import RecordList from '../../components/record-list';
import Clipboard from './clipboard';

const Trade = Lite.Trade;
const Position = Lite.Position;

const FundsTable = () => {
  const { historyList, loading } = Position.state;
  const { accountType } = Trade.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;

  const columns = [
    {
      title: LANG('手续费'),
      dataIndex: 'chargeMoney',
      render: (chargeMoney: number) => chargeMoney.toFixed(3),
    },
    {
      title: LANG('抵扣金抵扣'),
      dataIndex: 'chargeLucky',
      render: (chargeLucky: number) => `-${chargeLucky}`,
    },
    {
      title: LANG('体验金抵扣'),
      dataIndex: 'margin',
      render: (_: any, { bonusId, margin }: LiteListItem) => (bonusId === '0' ? `-0` : `-${margin}`),
    },
    {
      title: LANG('资金费用'),
      dataIndex: 'fundingFee',
      render: (fundingFee: number) => (fundingFee || 0).toFixed(4),
    },
    {
      title: LANG('开仓时间'),
      dataIndex: 'createTime',
      render: (createTime: number) => dayjs(createTime).format('MM/DD HH:mm:ss'),
    },
    {
      title: LANG('平仓时间'),
      dataIndex: 'tradeTime',
      render: (tradeTime: number) => dayjs(tradeTime).format('MM/DD HH:mm:ss'),
    },
    {
      title: LANG('订单号'),
      dataIndex: 'id',
      render: (id: string) => {
        return (
          <div>
            <span style={{ marginRight: '10px' }}>{id}</span>
            <Clipboard text={id} />
          </div>
        );
      },
    },
  ];

  const isSimulated = useMemo(() => {
    return accountType === AccountType.SIMULATED;
  }, [accountType]);

  return (
    <>
      <div className='container'>
        <RecordList
          loading={loading}
          columns={isSimulated ? columns.slice(0, 1).concat(columns.slice(4)) : columns}
          data={isLogin ? historyList : []}
          className={`${theme} lite-funds-table`}
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default FundsTable;
const styles = css`
  :global(.lite-funds-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
    }
    :global(.ant-table-row) {
      :global(td) {
        padding: 2px 5px !important;
        padding-left: 0 !important;
        font-size: 14px;
        color: #666 !important;
        font-weight: 500;
        height: 48px;
        &:first-child {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          padding-left: 20px !important;
        }
      }
    }
  }
  :global(.dark .ant-table-row) {
    :global(td) {
      color: #c7c7c7 !important;
    }
  }
`;
