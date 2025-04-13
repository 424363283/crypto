import { isLimitType } from '@/components/order-list/spot';
import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';

const SPOT_LIMIT = 0;

type SpotHistoryCommissionItem = {
  id: string;
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
  dealVolume: number;
  dealAmount: number;
  dealPrice: number;
  state: number;
  orderTime: number;
};
const SPOT_STATUS_MAP: { [key: string]: string } = {
  1: LANG('等待委托'),
  2: LANG('委托失败'),
  3: LANG('已委托'),
  4: LANG('等待撤单'),
  5: LANG('正在撤单'),
  6: LANG('全部撤单'),
  7: LANG('部分成交'),
  8: LANG('全部成交'),
};
const spotStatus: { [key: string]: number } = {
  1: 1,
  2: 3,
  3: 8,
  4: 4,
  5: 6,
  6: 2,
  7: 7,
};
export const columns1 = [
  {
    title: LANG('时间'),
    dataIndex: 'orderTime',
    render: (value: number) => {
      return dayjs(value).format('YYYY/MM/DD HH:mm:ss');
    },
    className: 'first-col',
  },
  {
    title: LANG('交易对'),
    render: (value: SpotHistoryCommissionItem, o: SpotHistoryCommissionItem) => {
      return (
        <div className={'fw-300'}>
          {o.side === 1 ? `${o.targetCoin}/${o.sourceCoin}` : `${o.sourceCoin}/${o.targetCoin}`}
        </div>
      );
    },
  },
  {
    title: LANG('委托类型'),
    dataIndex: 'type',
    render: (value: number) => {
      return isLimitType(value) ? LANG('限价') : LANG('市价');
    },
  },
  {
    title: LANG('方向'),
    dataIndex: 'side',
    render: (value: number) => {
      return <div className={`fw-300 ${value === 1 ? 'raise' : 'fall'}`}>{value === 1 ? LANG('买') : LANG('卖')}</div>;
    },
  },
  {
    title: LANG('平均价格'),
    dataIndex: 'dealPrice',
  },
  {
    title: LANG('委托价'),
    dataIndex: 'price',
    render: (value: number, o: SpotHistoryCommissionItem) => {
      return o.type === SPOT_LIMIT ? value?.toFormat() : '-';
    },
  },
  {
    title: LANG('成交数量'),
    dataIndex: 'dealVolume',
    render: (value: number) => {
      return value?.toFormat();
    },
  },
  {
    title: LANG('数量'),
    render: (value: SpotHistoryCommissionItem, o: SpotHistoryCommissionItem) => {
      return o.volume ? o.volume : o.amount;
    },
  },
  {
    title: LANG('成交额'),
    dataIndex: 'dealAmount',
    render: (value: number, o: SpotHistoryCommissionItem) => {
      const coin = o.side === 1 ? o.sourceCoin : o.targetCoin;
      return (
        <div className={'fw-300'}>
          {value}&nbsp;{coin}
        </div>
      );
    },
  },
  {
    title: LANG('状态'),
    align: 'right',
    dataIndex: 'state',
    render: (value: number, o: SpotHistoryCommissionItem) => {
      if (o.dealVolume > 0 && o.dealVolume < o.volume) {
        value = 7;
      }
      return <div className={'fw-300'}>{SPOT_STATUS_MAP[value]}</div>;
    },
  },
];
