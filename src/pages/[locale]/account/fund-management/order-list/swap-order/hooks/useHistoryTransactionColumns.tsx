import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil } from '@/core/utils';
import dayjs from 'dayjs';
import { ORDER_HISTORY_TYPE } from '../../types';
import { SWAP_FINISHED_ORDER_TYPES } from '../constants';

import { isSwapDemo } from '@/core/utils/src/is';
const _isSwapDemo = isSwapDemo();
type SwapHistoryOrderItems = {
  id: number;
  symbol: string;
  entrustId: string;
  time: number;
  dealPrice: string;
  dealVolume: number;
  fee: string;
  execType: string;
  side: string;
  type: string;
  liqPrice: null;
  basePrecision: string;
  baseShowPrecision: string;
  tradePnl: string;
  marginType: number;
  leverageLevel: number;
};

export const useHistoryTransactionColumns = () => {
  const router = useRouter();
  const isUsdtType = router?.query?.id?.toLowerCase() === ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  Swap.Assets.getWallet({ usdt: isUsdtType });
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
      title: LANG('方向'),
      dataIndex: 'side',
      render: (side: string) => {
        const isBuy = side === '1';
        return <span className={isBuy ? 'raise' : 'fall'}>{isBuy ? LANG('买入') : LANG('卖出')}</span>;
      },
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
        const keys = [];
        if (type === '1' || type === '4') {
          keys.push(SWAP_FINISHED_ORDER_TYPES[1]);
        } else {
          keys.push(SWAP_FINISHED_ORDER_TYPES[2]);
        }
        if (type === '3') {
          keys.push(SWAP_FINISHED_ORDER_TYPES[3]);
        }
        return keys.map((v) => v).join('/');
      },
    },

    {
      title: LANG('成交均价'),
      dataIndex: 'dealPrice',
      render: (dealPrice: string, item: SwapHistoryOrderItems) => {
        return Number(dealPrice).toFixed(+item.baseShowPrecision);
      },
    },
    {
      title: LANG('成交数量'),
      dataIndex: 'dealVolume',
      render: (v: any, item: SwapHistoryOrderItems) => {
        return `${Swap.Calculate.formatPositionNumber({
          usdt: isUsdtType,
          code: item.symbol,
          value: item.dealVolume,
          flagPrice: Number(item.dealPrice),
          fixed: Swap.Info.getVolumeDigit(item.symbol, { withHooks: false }),
        })} ${Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}`;
      },
    },
    {
      title: LANG('手续费'),
      dataIndex: 'fee',
      render: (fee: string, item: SwapHistoryOrderItems) => {
        const scale = isUsdtType ? 2 : Number(item.basePrecision);
        return `${formatNumber2Ceil(fee, scale).toFormat(scale)} ${
          Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
        }`;
      },
    },
    {
      title: LANG('已实现盈亏'),
      dataIndex: 'tradePnl',
      align: 'right',
      render: (tradePnl: string, item: SwapHistoryOrderItems) => {
        const scale = isUsdtType ? 2 : Number(item.basePrecision);
        return `${formatNumber2Ceil(tradePnl, scale, false).toFormat(scale)} ${
          Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
        }`;
      },
    },
    {
      title: LANG('交易量'),
      dataIndex: 'allVol',
      align: 'right',
      render: (_: string, item: SwapHistoryOrderItems) => {
        // U本位总交易量=成交均价*成交币数量=成交均价*面值*张数
        // 币本位总成交量=面值*张树
        const { contractFactor } = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
        const value = isUsdtType
          ? `${item.dealPrice}`.mul(contractFactor).mul(item.dealVolume)
          : `${contractFactor}`.mul(item.dealVolume);
        return `${value.toFormat(2)} ${Swap.Info.getPriceUnitText(isUsdtType)}`;
      },
    },
  ];
};
