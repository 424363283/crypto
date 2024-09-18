import RecordList from '@/components/order-list/components/record-list';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

import { FilterBar } from '@/components/order-list/components/filter-bar';
import { ColSelectTitle } from '@/components/order-list/components/record-list/components/col-select-title';
import { store, useData } from '@/components/order-list/swap/stores/finished-list';
import { SWAP_FINISHED_ORDER_TYPES } from '@/core/shared/src/constants/order';
import { formatNumber2Ceil } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef } from 'react';
import { CodeSelectTitle } from '../code-select-title';
import { LeverItem } from '../lever-item';
import { WalletName } from '../wallet-name';
import { clsx, styles } from './styled';

export const FinishedList = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
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

  return (
    <>
      <div className={clsx('finished-list')}>
        <FilterBar onSubmit={onSubmit} defaultWallet={Swap.Info.getWalletId(isUsdtType)} />
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={loading}
          columns={useColumns({ isUsdtType })}
          onLoadMore={onLoadMore}
          rowClassName={(item: any) => (item.status !== '4' ? '' : clsx('cancel-row'))}
          getScrollElement={useCallback((v: any) => (scrollRef.current = v), [])}
        />
      </div>
      {styles}
    </>
  );
};

const useColumns = ({ isUsdtType }: any) => {
  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: digit,
      flagPrice: Number(item.dealPrice),
    });
  };
  const storeCode = store.code;
  const storeType = store.type;

  const columns: any = [
    {
      title: LANG('时间'),
      dataIndex: 'time',
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      width: 190,
    },
    {
      title: () => (
        <CodeSelectTitle value={storeCode} onChange={(code: any) => (store.code = code)}>
          {LANG('合约')}
        </CodeSelectTitle>
      ),
      dataIndex: 'code',
      width: isUsdtType ? 160 : undefined,
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
                <WalletName>
                  {item?.alias ||
                    Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false })?.alias}
                </WalletName>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <ColSelectTitle
            options={Object.keys(SWAP_FINISHED_ORDER_TYPES()).reduce(
              (acc, cur) =>
                ['1', '2', '3'].includes(cur) ? { ...acc, [cur]: (SWAP_FINISHED_ORDER_TYPES() as any)[cur] } : acc,
              {}
            )}
            value={storeType}
            onChange={(type) => (store.type = type)}
          >
            {LANG('类型')}
          </ColSelectTitle>
        );
      },
      dataIndex: 'type',
      width: 150,
      render: (type: any) => {
        const keys = [];
        if (type === '1' || type === '4') {
          keys.push(SWAP_FINISHED_ORDER_TYPES()[1]);
        } else {
          keys.push(SWAP_FINISHED_ORDER_TYPES()[2]);
        }
        if (type === '3') {
          keys.push(SWAP_FINISHED_ORDER_TYPES()[3]);
        }
        return keys.map((v) => v).join('/');
      },
    },
    {
      title: LANG('方向'),
      dataIndex: 'side',
      render: (side: any) => {
        const isBuy = side === '1';
        return <span className={isBuy ? 'main-green' : 'main-red'}>{isBuy ? LANG('买入') : LANG('卖出')}</span>;
      },
    },
    {
      title: LANG('成交均价'),
      dataIndex: 'dealPrice',
      render: (dealPrice: any, item: any) => {
        return Number(dealPrice).toFixed(1 * item.baseShowPrecision);
      },
    },
    {
      title: LANG('成交数量'),
      dataIndex: 'dealVolume',
      render: (v: any, item: any) => {
        return `${formatItemVolume(v, item)} ${Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}`;
      },
    },
    {
      title: LANG('手续费'),
      dataIndex: 'fee',
      render: (fee: any, item: any) => {
        const scale = isUsdtType ? 2 : Number(item.basePrecision);
        return `${formatNumber2Ceil(fee, scale).toFixed(scale)} ${
          Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
        }`;
      },
    },
    {
      title: LANG('已实现盈亏'),
      dataIndex: 'tradePnl',
      render: (tradePnl: any, item: any) => {
        const scale = isUsdtType ? 2 : Number(item.basePrecision);
        return `${formatNumber2Ceil(tradePnl, scale, false).toFixed(scale)} ${
          Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
        }`;
      },
    },
  ];
  return columns;
};
export default FinishedList;
