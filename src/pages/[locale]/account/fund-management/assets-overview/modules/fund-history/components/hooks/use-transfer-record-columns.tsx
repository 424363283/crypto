import CoinLogo from '@/components/coin-logo';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils';
import dayjs from 'dayjs';
import { StatusButton } from '../status-button';

type TransferRecord = {
  address: string;
  addressTag: string;
  amount: number;
  addressUrl: string;
  createTime: number;
  currency: string;
  finishTime: number;
  id: string;
  network: string;
  status: number;
  targetCurrency: string;
  txUrl: string;
  txid: string;
  type: number;
  cancelableTime: number | null;
  charge: number;
  confirm: number;
  confirmMin: number | null;
  explain: string;
  sell: boolean;
  transfer: boolean;
  chain: string;
};

// 没有数据，columns待优化
export const useTransferRecordColumns = () => {
  const { locale } = useAppContext();
  return [
    {
      title: LANG('转账时间'),
      dataIndex: 'createTime',
      render: (value: number) => {
        return <div style={{ fontSize: '14px' }}>{dayjs(value).format('YYYY/MM/DD HH:mm:ss')}</div>;
      },
      className: 'first-col',
      width: 200,
    },
    {
      title: LANG('交易ID'),
      dataIndex: 'id',
      render: (value: string) => {
        return <div className={'fw-300'}>{value}</div>;
      },
      width: 200,
    },
    {
      title: LANG('类型'),
      dataIndex: 'type',
      render: (value: number) => {
        return <div className={locale === 'zh' ? '' : 'fw-300'}>{value == 100 ? LANG('转入') : LANG('转出') }</div>;
      },
    },
    {
      title: LANG('币种'),
      dataIndex: 'currency',
      render: (value: string) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CoinLogo coin={value} width={18} key={value} height={18} />
            <span>{value}</span>
          </div>
        );
      },
      width: 130,
    },
    {
      title: LANG('输入/出金额'),
      render: (val: any, item: TransferRecord) => {
        const isOut = item.type === 100;
        return (
          <div className={ clsx('fw-300', isOut ? 'main-red' : 'main-green') }>
            {isOut ? '-' : '+'}{item.amount?.toFormat()} {item.currency}
          </div>
        );
      },
    },
    {
      title: LANG('输入/出方'),
      render: (val: any, item: TransferRecord) => {
        return (
          <div className='addressBox'>
            <div className={clsx('address', 'fw-300')}>{item.address}</div>
          </div>
        );
      },
    },
    {
      title: LANG('状态'),
      dataIndex: 'state',
      align: 'right',
      render: (value: number) => {
        return <StatusButton status={value} isTransfer />;
      },
      width: 100,
    },
  ];
};
