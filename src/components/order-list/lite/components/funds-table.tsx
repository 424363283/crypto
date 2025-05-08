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

const tradeMap: any = {
  TYPE_IN_REFUND_TRADE_MARGIN: '退还保证金',
  TYPE_IN_REFUND_TRADE_FEE: '退还交易综合费',
  TYPE_IN_TRADE_INCOME: '平仓盈亏',
  TYPE_IN_REFUND_TRADE_DEFER: '返还递延费',
  TYPE_OUT_PAY_TRADE_DEFER: '递延费',
  TYPE_OUT_PAY_TRADE_MARGIN: '冻结保证金',
  TYPE_OUT_PAY_TRADE_FEE: '手续费',
  TYPE_OUT_PAY_TRADE_MARGIN_ADD: '追加保证金'
};

const FundsTable = () => {
  const { historyList, loading } = Position.state;
  const { accountType } = Trade.state;
  const { theme } = useTheme();
  const isLogin = Account.isLogin;

  /* 
    合约      类型   金额	   资产种类	   时间 
 BTCUSDT  type   amount   currency  time
  */
  const columns = [
    {
      title: LANG('合约'),
      dataIndex: 'commodityName',
      minWidth: 100,
      render: (commodityName: string) => {
        return (
          <div className={`first-td flex`}>
            <span className="liteName">{commodityName}</span>
          </div>
        );
      }
    },
    {
      title: LANG('类型'),
      dataIndex: 'type',
      minWidth: 100,
      render: (type: string) => {
        return <span className="liteName">{LANG(tradeMap[type])}</span>;
      }
    },
    {
      title: LANG('金额'),
      dataIndex: 'amount',
      minWidth: 100,
      render: (amount: number) => {
        return <span className="liteName">{amount}</span>;
      }
    },
    {
      title: LANG('资产种类'),
      dataIndex: 'currency',
      minWidth: 100,
      render: (currency: string) => {
        return <span className="liteName">{currency}</span>;
      }
    },
    {
      title: LANG('订单号'),
      dataIndex: 'bizId',
      minWidth: 100,
      render: (id: string) => {
        return (
          <div className="liteOrderid">
            <span style={{ marginRight: '8px' }}>
              <span style={{}}>
                {id.slice(0, 5)}...
                {id.slice(id.length - 5)}
              </span>
            </span>
            <Clipboard text={id} />
          </div>
        );
      }
    },
    {
      title: LANG('时间'),
      dataIndex: 'time',
      minWidth: 100,
      render: (time: number) => {
        return <span className="liteName">{dayjs(time).format('MM/DD HH:mm:ss')}</span>;
      }
    }
    // {
    //   title: LANG('抵扣金抵扣'),
    //   dataIndex: 'chargeLucky',
    //   width: 147,
    //   render: (chargeLucky: number) => {
    //     return <span className="liteName">{`-${chargeLucky}`}</span>;
    //   }
    // },
    // {
    //   title: LANG('体验金抵扣'),
    //   dataIndex: 'margin',
    //   width: 147,
    //   render: (_: any, { bonusId, margin }: LiteListItem) => {
    //     return <span className="liteName">{ (bonusId === '0' ? `-0` : `-${margin}`)}</span>;
    //   }
    // },
    // {
    //   title: LANG('资金费用'),
    //   dataIndex: 'fundingFee',
    //   width: 184,
    //   render: (fundingFee: number) => {
    //     return <span className="liteName">{(fundingFee || 0).toFixed(4)}</span>;
    //   }
    // },
    // {
    //   title: LANG('盈亏'),
    //   dataIndex: 'fundingFee',
    //   width: 184,
    //   render: (income: number) => {
    //     return <span className="liteName">{(income || 0).toFixed(4)}</span>;
    //   }
    // },
    // {
    //   title: LANG('递延费用'),
    //   dataIndex: 'fundingFee',
    //   width: 184,
    //   render: (_: any, { deferFee, deferDays }: LiteListItem) => {
    //     return <span className="liteName">{(deferFee || 0).mul(deferDays || 0).toFixed(4)}</span>;
    //   }
    // },
    // {
    //   title: LANG('开仓时间'),
    //   dataIndex: 'createTime',
    //   width: 231,
    //   render: (createTime: number) => {
    //     return <span className="liteName">{dayjs(createTime).format('MM/DD HH:mm:ss')}</span>;
    //   }
    // },
    // {
    //   title: LANG('平仓时间'),
    //   dataIndex: 'tradeTime',
    //   width: 296,
    //   render: (tradeTime: number) => {
    //     return <span className="liteName">{dayjs(tradeTime).format('MM/DD HH:mm:ss')}</span>;
    //   }
    // },

  ];

  const isSimulated = useMemo(() => {
    return accountType === AccountType.SIMULATED;
  }, [accountType]);

  return (
    <>
      <div className="container">
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
  :global(.liteName) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: var(--text_1);
  }
  :global(.liteOrderid) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: var(--text_1);
    display: flex;
    align-items: end;
  }

  :global(.lite-funds-table) {
    :global(.ant-table-fixed-header) {
      background: transparent !important;
    }
    :global(.ant-table-cell) {
      color: var(--text_3) !important;
      border-bottom: 1px solid var(--fill_line_1) !important;
    }
    :global(.ant-table-tbody) {
    }

    :global(.ant-table-cell) {
      &:last-child {
        text-align: right;
      }
    }

    :global(.ant-table-row) {
      :global(td) {
        padding: 2px 5px !important;
        padding-left: 0 !important;
        font-size: 14px;
        color: #666 !important;
        font-weight: 500;
        height: 52px;
        &:first-child {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          padding-left: 24px !important;
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
