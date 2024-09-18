import { isLimitType } from '@/components/order-list/spot';
import { closeSpotOrderApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message, roundToNDigits } from '@/core/utils';
import dayjs from 'dayjs';

const SPOT_LIMIT = 0;

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
    title: LANG('价格'),
    dataIndex: 'price',
    render: (value: any, o: any) => {
      return <div className={'fw-300'}>{o.type === SPOT_LIMIT ? value?.toFormat() : '-'}</div>;
    },
  },
  {
    title: LANG('数量'),
    dataIndex: 'volume',
  },
  {
    title: LANG('完成度'),
    render: (value: any, o: any) => {
      return <div className={'fw-300'}>{roundToNDigits(o.dealVolume / o.volume, 4).mul(100)}%</div>;
    },
  },
  {
    title: LANG('成交额'),
    dataIndex: 'amount',
    render: (value: number) => {
      return value?.toFormat();
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
