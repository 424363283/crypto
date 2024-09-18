import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';
import { StatusButton } from '../status-button';

type FiatItem = {
  address: string;
  addressTag: string | null;
  addressUrl: string | null;
  amount: number;
  chain: string;
  channel: string | null;
  charge: number;

  confirm: number;
  confirmMin: number | null;
  createTime: number;
  currency: string;
  exrate: number;
  finishTime: number;
  id: string;
  network: string;
  price: number;
  sourceAmount: number;
  sourceCurrency: string;
  status: number;
  txUrl: string | null;
  txid: string | null;
};

// 法币记录
export const useFiatColumns = () => {
  return [
    {
      title: LANG('购买时间'),
      dataIndex: 'createTime',
      render: (value: string) => {
        return <div className={'fw-300'}>{dayjs(value).format('YYYY/MM/DD HH:mm:ss')}</div>;
      },
      className: 'first-col',
      width: 200,
    },
    {
      title: LANG('支付金额'),
      render: (val: any, item: FiatItem) => {
        return (
          <div className={'fw-300'}>
            {item?.sourceAmount?.toFormat()} {item?.sourceCurrency}
          </div>
        );
      },
      width: 200,
    },
    {
      title: LANG('购买数量'),
      render: (val: any, item: FiatItem) => {
        return (
          <div className={'fw-300'}>
            {item?.amount?.toFormat()} {item?.currency}
          </div>
        );
      },
      width: 200,
    },
    {
      title: LANG('购买汇率'),
      dataIndex: 'exrate',
      width: 200,
      render: (v: any, item: FiatItem) => {
        return <span>{item.exrate || 0}</span>;
      },
    },
    {
      title: LANG('交易ID'),
      dataIndex: 'id',
      render: (value: string) => {
        return <div className={'fw-300'}>{value}</div>;
      },
    },
    {
      title: LANG('状态'),
      dataIndex: 'status',
      render: (value: number) => {
        const status = value ? value : 0;
        return <StatusButton status={status} />;
      },
      width: 100,
    },
  ];
};
