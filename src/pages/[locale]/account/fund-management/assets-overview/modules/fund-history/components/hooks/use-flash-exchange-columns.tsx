import CoinLogo from '@/components/coin-logo';
import { LANG } from '@/core/i18n';
import { truncateToTwoDecimals } from '@/core/utils';
import dayjs from 'dayjs';
interface FLASH_EXCHANGE_COLUMNS {
  createTime: number;
  fee: number;
  id: string;
  price: number;
  sourceAmount: number;
  sourceCurrency: string;
  state: number;
  targetAmount: number;
  targetCurrency: string;
}

export const useFlashExchangeColumns = () => {
  const columns = [
    {
      title: LANG('闪兑日期'),
      dataIndex: 'createTime',
      render: (value: number) => {
        return <div className={'fw-300'}>{dayjs(value).format('YYYY/MM/DD HH:mm:ss')}</div>;
      },
      className: 'first-col',
      width: 200,
    },
    {
      title: LANG('兑出币种'),
      dataIndex: 'sourceCurrency',
      render: (value: string) => {
        return (
          <div className={'fw-300'}>
            <CoinLogo coin={value || ''} width={25} key={value} height={25} />
          </div>
        );
      },
      width: 120,
    },
    {
      title: LANG('兑出数量'),
      render: (val: FLASH_EXCHANGE_COLUMNS, item: FLASH_EXCHANGE_COLUMNS) => {
        return (
          <div className={'fw-300'}>
            {item?.sourceAmount?.toFormat()} {item?.sourceCurrency}
          </div>
        );
      },
      width: 200,
    },
    {
      title: LANG('兑入币种'),
      dataIndex: 'targetCurrency',
      render: (value: string) => {
        return (
          <div className={'fw-300'}>
            <CoinLogo coin={value} width={25} key={value} height={25} />
          </div>
        );
      },
      width: 140,
    },
    {
      title: LANG('兑入数量'),
      render: (val: FLASH_EXCHANGE_COLUMNS, item: FLASH_EXCHANGE_COLUMNS) => {
        return (
          <div className={'fw-300'}>
            {item?.targetAmount?.toFormat(2)} {item?.targetCurrency}
          </div>
        );
      },
      width: 200,
    },
    {
      title: LANG('闪兑报价'),
      dataIndex: 'price',
      render: (value: number) => {
        return <div className={'fw-300'}>{value?.toFormat()}</div>;
      },
      width: 100,
    },
    {
      title: LANG('手续费'),
      dataIndex: 'fee',
      render: (value: number) => {
        return <div className={'fw-300 fee'}>{truncateToTwoDecimals(value)}</div>;
      },
      width: 100,
    },
  ];
  return columns;
};
