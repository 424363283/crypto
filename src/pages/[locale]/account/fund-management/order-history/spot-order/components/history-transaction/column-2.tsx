import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';

type SpotHistoryTransactionOrderItem = {
  id: string;
  orderId: string;
  symbol: string;
  sourceCoin: string;
  targetCoin: string;
  type: number;
  side: number;
  openType: number;
  price: number;
  volume: number;
  amount: number;
  fee: number;
  taker: boolean;
  dealTime: number;
};

export const column3 = [
  {
    title: LANG('成交时间'),
    dataIndex: 'dealTime',
    render: (value: string) => {
      return dayjs(value).format('YYYY/MM/DD HH:mm:ss');
    },
    className: 'first-col',
  },
  {
    title: LANG('交易对'),
    render: (value: SpotHistoryTransactionOrderItem, o: SpotHistoryTransactionOrderItem) => {
      return (
        <div className={'fw-300'}>
          {o.side === 1 ? `${o.targetCoin}/${o.sourceCoin}` : `${o.sourceCoin}/${o.targetCoin}`}
        </div>
      );
    },
  },
  {
    title: LANG('方向'),
    dataIndex: 'side',
    render: (value: number, o: SpotHistoryTransactionOrderItem) => {
      return <div className={o.side === 1 ? 'raise' : 'fall'}>{value === 1 ? LANG('买') : LANG('卖')}</div>;
    },
  },
  {
    title: LANG('价格'),
    dataIndex: 'price',
    render: (value: string) => {
      return value?.toFormat();
    },
  },
  {
    title: LANG('成交数量'),
    dataIndex: 'volume',
    render: (value: number) => {
      return value?.toFormat();
    },
  },
  {
    title: LANG('手续费'),
    render: (value: SpotHistoryTransactionOrderItem, o: SpotHistoryTransactionOrderItem) => {
      let targetCoin = o.targetCoin;
      if (/\d+L|\d+S/.test(o.symbol)) {
        targetCoin = o.side === 1 ? o.sourceCoin : o.targetCoin;
      }
      return (
        <div className={'fw-300'}>
          {o.fee?.toFormat()}&nbsp;{targetCoin}
        </div>
      );
    },
  },
  {
    title: LANG('成交额'),
    align: 'right',
    render: (value: SpotHistoryTransactionOrderItem, o: SpotHistoryTransactionOrderItem) => {
      const coin = o.side === 1 ? o.sourceCoin : o.targetCoin;
      return (
        <div className={'fw-300'}>
          {o.amount?.toFormat(4)}&nbsp;
          {coin}
        </div>
      );
    },
  },
];
