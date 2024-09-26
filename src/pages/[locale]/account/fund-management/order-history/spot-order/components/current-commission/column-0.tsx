import { closeSpotOrderApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import dayjs from 'dayjs';

const handleCloseOrder = async (value: string) => {
  const res = await closeSpotOrderApi([value]);
  if (res.code === 200) {
    message.success(LANG('撤单成功'));
    window.location.reload();
  } else {
    message.error(res.message);
  }
};

const columns0 = [
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
    render: (value: any, o: any) => {
      return o.side === 1 ? `${o.targetCoin}/${o.sourceCoin}` : `${o.sourceCoin}/${o.targetCoin}`;
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
    render: (price: number, { type }: any) => (
      <div className={'fw-300'}>{type === 1 || type === 3 ? LANG('市价') : price?.toFormat()}</div>
    ),
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
    title: LANG('操作'),
    align: 'right',
    dataIndex: 'id',
    render: (value: string) => {
      return (
        <div className={'control fw-300'} style={{ cursor: 'pointer' }} onClick={() => handleCloseOrder(value)}>
          {LANG('撤单')}
        </div>
      );
    },
  },
];
export { columns0 };
