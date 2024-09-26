import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';

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
  2: LANG('委托识别'),
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
    render: (type: number, { oco }: any) => {
      if (oco && type === 0) {
        return LANG('被动限价');
      }
      return [LANG('限价'), LANG('市价'), LANG('限价止盈止损'), LANG('市价止盈止损')][type];
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
    title: LANG('触发价'),
    dataIndex: 'triggerPrice',
    render: (triggerPrice: number, { triggerType }: any) =>
      triggerPrice ? `${triggerType === 1 ? '≥' : '≤'}${triggerPrice?.toFormat()}` : '--',
  },
  {
    title: LANG('委托价'),
    dataIndex: 'price',
    render: (value: number, { type }: SpotHistoryCommissionItem) => {
      return type === 1 || type === 3 ? LANG('市价') : value?.toFormat();
    },
  },
  {
    title: LANG('成交均价'),
    dataIndex: 'dealPrice',
  },
  {
    title: `${LANG('委托量')}/${LANG('完成')}`,
    dataIndex: 'volume',
    render: (_: any, { volume, dealVolume, targetCoin, sourceCoin, side, type }: any) => {
      const isBuy = side === 1;
      const isMarket = type === 1 || type === 3;
      const value = isMarket && isBuy ? '--' : volume?.toFormat();
      return `${value} / ${dealVolume ? dealVolume?.toFormat() : 0} ${isBuy ? targetCoin : sourceCoin}`;
    },
  },
  {
    title: `${LANG('委托金额')}/${LANG('完成')}`,
    dataIndex: 'amount',
    render: (_: any, { amount, dealAmount, targetCoin, sourceCoin, side, type }: any) => {
      const isSell = side === 2;
      const isMarket = type === 1 || type === 3;
      const value = isMarket && isSell ? '--' : Number(amount?.toFixed(4));
      return `${value} / ${dealAmount ? Number(dealAmount?.toFixed(4)) : 0} ${side === 1 ? sourceCoin : targetCoin}`;
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
      return <div className={'fw-300'}>{SPOT_STATUS_MAP[spotStatus[value]]}</div>;
    },
  },
];
