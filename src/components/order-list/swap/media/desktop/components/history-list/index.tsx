import RecordList from '@/components/order-list/components/record-list';
import { ColSelectTitle } from '@/components/order-list/components/record-list/components/col-select-title';
import { LANG, TradeLink } from '@/core/i18n';
import { Swap } from '@/core/shared';

import { FilterBar } from '@/components/order-list/components/filter-bar';
import { store, useData } from '@/components/order-list/swap/stores/history-list';
import {
  SWAP_HISTORY_ORDER_STATUS,
  SWAP_HISTORY_ORDER_TYPES,
  SWAP_PENDING_ORDER_STATUS,
} from '@/core/shared/src/constants/order';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef } from 'react';
import { CodeSelectTitle } from '../code-select-title';
import { LeverItem } from '../lever-item';
import { WalletName } from '../wallet-name';
import { clsx, styles } from './styled';

export const HistoryList = ({ active }: { active: boolean }) => {
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
      <div className={clsx('history-list')}>
        <FilterBar onSubmit={onSubmit} defaultWallet={Swap.Info.getWalletId(isUsdtType)} />
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={loading}
          columns={useColumns({ isUsdtType, data: data })}
          onLoadMore={onLoadMore}
          rowClassName={(item: any) => (item.status !== '4' ? '' : clsx('cancel-row'))}
          getScrollElement={useCallback((v: any) => (scrollRef.current = v), [])}
        />
      </div>
      {styles}
    </>
  );
};

const useColumns = ({ isUsdtType, data }: any) => {
  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: Number(item.avgPrice) || Number(item.price),
    });
  };
  const storeCode = store.code;
  const storeStatus = store.status;
  const storeType = store.type;

  const columns: any = [
    {
      title: LANG('时间'),
      dataIndex: 'ctime',
      width: 110,
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: () => (
        <CodeSelectTitle value={storeCode} onChange={(code: any) => (store.code = code)}>
          {LANG('合约')}
        </CodeSelectTitle>
      ),
      width: isUsdtType ? 160 : undefined,
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
                  <WalletName>
                    {item?.alias ||
                      Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false })?.alias}
                  </WalletName>
                </div>
              </div>
            </div>
          </TradeLink>
        );
      },
    },
    {
      title: () => {
        return (
          <ColSelectTitle
            options={{ ...SWAP_PENDING_ORDER_STATUS(), 3: LANG('强平') }}
            value={storeType}
            onChange={(type) => (store.type = type)}
          >
            {LANG('类型')}
          </ColSelectTitle>
        );
      },
      dataIndex: 'type',
      render: (v: any, item: any) => {
        v = v === '5' ? 2 : v;
        const key =
          item.orderType === 2
            ? ({ 1: LANG('市价止盈'), 2: LANG('市价止损') } as any)[item.strategyType]
            : (SWAP_HISTORY_ORDER_TYPES() as any)[v];
        if (item.orderType === 3) {
          return LANG('追踪委托');
        }
        return key;
      },
    },
    {
      title: LANG('方向'),
      dataIndex: 'side',
      render: (side: string) => {
        const isBuy = side === '1';
        return <span className={isBuy ? 'main-green' : 'main-red'}>{isBuy ? LANG('买入') : LANG('卖出')}</span>;
      },
    },
    {
      title: LANG('平均价格'),
      dataIndex: 'avgPrice',
      render: (avgPrice: any, item: any) => {
        return avgPrice ? Number(avgPrice).toFixed(Number(item.baseShowPrecision)) : '--';
      },
    },
    {
      title: LANG('价格'),
      dataIndex: 'price',
      render: (price: any, item: any) => {
        return price ? Number(price).toFixed(Number(item.baseShowPrecision)) : '--';
      },
    },
    {
      title: LANG('成交数量') + '/' + LANG('数量'),
      dataIndex: 'dealVolume',
      width: 160,
      render: (v: any, item: any) => {
        return (
          <div>
            <span style={{ color: 'var(--skin-primary-color)' }}>{formatItemVolume(v, item)}</span>/
            <span>
              {formatItemVolume(item?.volume, item)} {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
            </span>
          </div>
        );
      },
    },
    {
      title: LANG('触发条件'),
      dataIndex: 'orderType',
      render: (orderType: any, item: any) => {
        if (![2, 3].includes(orderType)) {
          return '--';
        }

        return `${item.priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${
          item.direction === '1' ? '≥' : '≤'
        } ${Number(item.triggerPrice).toFixed(Number(item.baseShowPrecision))}`;
      },
    },
    {
      title: () => {
        return (
          <ColSelectTitle
            options={{
              2: LANG('已完成'),
              3: LANG('部分完成'),
              4: LANG('已取消'),
              6: LANG('已过期'),
              7: LANG('部分完成 部分取消'),
            }}
            value={storeStatus}
            onChange={(status) => (store.status = status)}
          >
            {LANG('状态')}
          </ColSelectTitle>
        );
      },
      dataIndex: 'status',
      render: (status: any) => {
        return (SWAP_HISTORY_ORDER_STATUS() as any)[status];
      },
    },
  ];
  return columns;
};
export default HistoryList;
