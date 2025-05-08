import RecordList from '@/components/order-list/components/record-list';
import { LANG, TradeLink } from '@/core/i18n';
import { Swap } from '@/core/shared';

import { ImageHover } from '@/components/image';
import { FilterBar } from '@/components/order-list/components/filter-bar';
import { store, useData } from '@/components/order-list/swap/stores/position-history';
import { formatNumber2Ceil } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PositionHistoryShare } from '../../../../components/position-history-share';
import { CodeSelectTitle } from '../code-select-title';
import { LeverItem } from '../lever-item';
import { WalletName } from '../wallet-name';
import { clsx, styles } from './styled';
import CommonIcon from '@/components/common-icon';
import YIcon from '@/components/YIcons';

export const PositionHistory = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const [shareVisibleData, setShareModalData] = useState({ visible: false, data: {} });
  const scrollRef = useRef();
  const scrollToTop = useCallback(() => {
    if (scrollRef?.current) {
      (scrollRef?.current as any).scrollTop = 0;
    }
  }, [scrollRef]);
  const { data, loading, onSubmit, onLoadMore } = useData({ isUsdtType, scrollToTop });

  useEffect(() => {
    if (active) {
      onSubmit();
    }
  }, [active, onSubmit]);
  const onShare = (data: any) => {
    setShareModalData((v) => ({ ...v, visible: true, data }));
  };

  return (
    <>
      <div className={clsx('history-list')}>
        <FilterBar onSubmit={onSubmit} defaultWallet={Swap.Info.getWalletId(isUsdtType)} />
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={loading}
          columns={useColumns({ isUsdtType, data: data, onShare })}
          onLoadMore={onLoadMore}
          rowClassName={(item: any) => (item.status !== '4' ? '' : clsx('cancel-row'))}
          getScrollElement={useCallback((v: any) => (scrollRef.current = v), [])}
        />
        <PositionHistoryShare
          {...shareVisibleData}
          onClose={() => setShareModalData((v) => ({ ...v, visible: false }))}
        />
      </div>
      {styles}
    </>
  );
};

const useColumns = ({ isUsdtType, data, onShare }: any) => {
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
  const storeCode = store.code;
  const storeStatus = store.status;
  const storeType = store.type;

  const columns: any = [
    {
      title: () => (
        <CodeSelectTitle value={storeCode} onChange={(code: any) => (store.code = code)}>
          {LANG('合约')}
        </CodeSelectTitle>
      ),
      dataIndex: 'code',
      render: (v: any, item: any) => {
        const leverageLevel = item?.leverageLevel;
        return (
          <TradeLink id={item.symbol.toUpperCase()}>
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
          </TradeLink>
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
      title: LANG('方向'),
      dataIndex: 'side',
      render: (side: string) => {
        const isBuy = side !== '1';
        return <span className={isBuy ? 'main-green' : 'main-red'}>{isBuy ? LANG('平多') : LANG('平空')}</span>;
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
      width: 180,
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: LANG('平仓时间'),
      dataIndex: 'mtime',
      width: 180,
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
  return columns;
};
export default PositionHistory;

