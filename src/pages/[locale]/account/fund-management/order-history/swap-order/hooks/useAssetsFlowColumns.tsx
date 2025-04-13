import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_FUNDS_RECORD_TYPE } from '@/core/shared/src/constants/order';
import dayjs from 'dayjs';
import { checkIsUsdtType } from '../../../assets-overview/helper';
import { SWAP_FUNDS_TYPES } from '../constants';

import { isSwapDemo } from '@/core/utils/src/is';
type SwapAssetsFlowItem = {
  amount: string;
  currency: string;
  fundsType: number;
  id: string;
  basePrecision: string;
  symbol: string;
  time: number;
  type: string;
};

export const useAssetsFlowColumns = () => {
  const isUsdtType = checkIsUsdtType();
  Swap.Assets.getWallet({ usdt: isUsdtType });
  const perpetualText = isUsdtType ? LANG('U本位合约') : LANG('币本位合约');
  return [
    {
      title: LANG('时间'),
      dataIndex: 'time',
      render: (time: number) => (
        <div className='ctime'>
          <div className='date'>{dayjs(time).format('YYYY-MM-DD')}</div>
          <div className='time'>{dayjs(time).format('HH:mm:ss')}</div>
        </div>
      ),
    },
    {
      title: LANG('合约'),
      dataIndex: 'symbol',
      render: (code: string) => (
        <div>
          {Swap.Info.getCryptoData(code, { withHooks: false }).name}
          <div className='usdt-type'>{perpetualText}</div>
        </div>
      ),
    },
    // {
    //   title: LANG('子钱包账户'),
    //   dataIndex: 'subWallet',
    //   render: (v: string, item: any) => {
    //     return (
    //       <span>
    //         {_isSwapDemo
    //           ? LANG('模拟交易账户')
    //           : item?.alias || Swap.Assets.getWallet({ walletId: v, usdt: isUsdtType, withHooks: false })?.alias}
    //       </span>
    //     );
    //   },
    // },
    {
      title: LANG('类型'),
      dataIndex: 'type',
      render: (type: string) => {
        return SWAP_FUNDS_RECORD_TYPE()[type];
      },
    },
    {
      title: LANG('资金类型'),
      dataIndex: 'fundsType',
      render: (type: string) => {
        return SWAP_FUNDS_TYPES[type] || '--';
      },
    },
    {
      title: LANG('总额'),
      dataIndex: 'amount',
      render: (amount: number, item: SwapAssetsFlowItem) => {
        const formatNum = isUsdtType ? amount : amount.toFixed(Number(item.basePrecision));
        if(item.type === 'taker_fee' || item.type === 'maker_fee') {
          return formatNum;
        }
        return <span style={{ color: Number(formatNum) >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
          {formatNum}
        </span>
      },
    },
    {
      title: LANG('资产种类'),
      dataIndex: 'currency',
      align: 'right',
      render: (currency: string) => {
        return currency;
      },
    },
  ];
};
