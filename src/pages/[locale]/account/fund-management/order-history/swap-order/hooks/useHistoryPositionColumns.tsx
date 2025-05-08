import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil } from '@/core/utils';
import dayjs from 'dayjs';
import { ORDER_HISTORY_TYPE } from '../../types';
import { SWAP_FINISHED_ORDER_TYPES } from '../constants';

import { isSwapDemo } from '@/core/utils/src/is';
import { LeverItem } from '@/components/order-list/swap/media/desktop/components/lever-item';
import { SWAP_ORDER_DIRECTIONS, SWAP_POSITION_MANAGE } from '@/core/shared/src/constants/order';
import clsx from 'clsx';
import { WalletName } from '@/components/order-list/swap/media/desktop/components/wallet-name';
import { ImageHover } from '@/components/image';
import YIcon from '@/components/YIcons';

const _isSwapDemo = isSwapDemo();
type SwapHistoryPositionItems = {
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

export const useHistoryPositionColumns = ({ onShare }: { onShare: any }) => {
  const router = useRouter();
  const isUsdtType = router?.query?.id?.toLowerCase() === ORDER_HISTORY_TYPE.SWAP_U_ORDER;
  Swap.Assets.getWallet({ usdt: isUsdtType });
  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(Swap.Info.getCryptoData(item.symbol, { withHooks: false }).basePrecision),
      flagPrice: Number(item.avgPrice) || Number(item.price),
    });
  };
  return [
    {
      title: () => `${LANG('合约')} | ${LANG('杠杆')}`,
      dataIndex: 'code',
      render: (v: any, item: any) => {
        const leverageLevel = item?.leverageLevel;
        return (
            <div className={clsx('code')}>
              <div className='multi-line-item'>
                <div className={clsx('code-text')}>
                  {Swap.Info.getCryptoData(item.symbol, { withHooks: false }).name}
                  {!!Number(leverageLevel) && <LeverItem lever={leverageLevel} />}
                </div>
                <div>
                  {item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}{' '}
                </div>
              </div>
            </div>
        );
      },
    },
    {
      title: LANG('账户'),
      dataIndex: 'subWallet',
      render: (v: any, item: any) => {
        const walletData = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false });
        return (
          <WalletName> {LANG(walletData?.alias)} </WalletName>
        );
      },
    },
    {
      title: LANG('方向'),
      dataIndex: 'side',
      render: (side: string) => {
        const isBuy = side !== '1';
        return <span className={isBuy ? 'main-green' : 'main-red'}>{isBuy ? LANG('平多') : LANG('平空')}</span>;
      },
    },
    {
      title: LANG('平仓数量'),
      dataIndex: 'volume',
      render: (v: any, item: any) => {
        return `${formatItemVolume(item?.volume, item)} ${Swap.Info.getUnitText({
          symbol: item.symbol,
          withHooks: false,
        })}`;
      },
    },
    {
      title: LANG('开仓均价'),
      dataIndex: 'positionAvgPrice',
      render: (avgPrice: any, item: any) => {
        const { baseShowPrecision } = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
        return avgPrice ? Number(avgPrice).toFixed(Number(baseShowPrecision)) : '--';
      },
    },
    {
      title: LANG('平仓价格'),
      dataIndex: 'price',
      render: (price: any, item: any) => {
        const { baseShowPrecision } = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
        return price ? Number(price).toFixed(Number(baseShowPrecision)) : '--';
      },
    },

    {
      title: LANG('平仓盈亏'),
      dataIndex: 'tradePnl',
      render: (v: any, item: any) => {
        const scale = isUsdtType ? 2 : Number(Swap.Info.getCryptoData(item.symbol, { withHooks: false }).basePrecision);
        const code = item.symbol.toUpperCase();
        const { settleCoin } = Swap.Info.getCryptoData(code, { withHooks: false });
        const value = formatNumber2Ceil(formatNumber2Ceil(v, scale + 1, false), scale, false).toFixed(scale);
        const style = Number(value) >= 0 ? 'main-green' : 'main-red';

        return (
          <div className={clsx('multi-line-item', style)}>
            <div className={clsx()}>
              {value} {settleCoin}
            </div>
            <YIcon.share
              className={clsx('editIcon')}
              onClick={() => {
                onShare({ ...item, income: value });
              }}
            />
          </div>
        );
      },
    },
    {
      title: LANG('开仓时间'),
      dataIndex: 'ctime',
      // width: 110,
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: LANG('平仓时间'),
      dataIndex: 'mtime',
      // width: 110,
      align: 'right',
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
};
