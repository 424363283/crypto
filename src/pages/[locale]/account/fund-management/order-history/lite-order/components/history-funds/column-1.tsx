import Clipboard from '@/components/order-list/lite/components/clipboard';
import { LANG } from '@/core/i18n';
import { LiteListItem } from '@/core/shared';
import dayjs from 'dayjs';

export const LITE_FUNDS_TYPES: any = {
  TYPE_IN_REFUND_TRADE_MARGIN: '退还保证金',
  TYPE_IN_REFUND_TRADE_FEE: '退还交易综合费',
  TYPE_IN_TRADE_INCOME: '平仓盈亏',
  TYPE_IN_REFUND_TRADE_DEFER: '返还递延费',
  TYPE_OUT_PAY_TRADE_DEFER: '递延费',
  TYPE_OUT_PAY_TRADE_MARGIN: '冻结保证金',
  TYPE_OUT_PAY_TRADE_FEE: '手续费',
  TYPE_OUT_PAY_TRADE_MARGIN_ADD: '追加保证金'
};
export const columns1 = [
  {
    title: LANG('合约'),
    dataIndex: 'commodityName',

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
    render: (type: string) => {
      return <span className="liteName">{LANG(LITE_FUNDS_TYPES[type])}</span>;
    }
  },
  {
    title: LANG('金额'),
    dataIndex: 'amount',

    render: (amount: number) => {
      return <span className="liteName">{amount}</span>;
    }
  },
  {
    title: LANG('资产种类'),
    dataIndex: 'currency',

    render: (currency: string) => {
      return <span className="liteName">{currency}</span>;
    }
  },
  {
    title: LANG('订单号'),
    dataIndex: 'bizId',
    minWidth: 120,
    render: (id: string) => {
      return (
        <div className="liteOrderid">
          <span style={{}}>
            {id.slice(0, 5)}...
            {id.slice(id.length - 5)}
          </span>
          <Clipboard text={id} />
        </div>
      );
    }
  },
  {
    title: LANG('时间'),
    dataIndex: 'time',
    render: (time: number) => {
      return <span className="liteName">{dayjs(time).format('MM/DD HH:mm:ss')}</span>;
    }
  }
];
