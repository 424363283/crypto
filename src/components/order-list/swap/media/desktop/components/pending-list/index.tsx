import RecordList, { formatListData } from '@/components/order-list/components/record-list';
import { ColSelectTitle } from '@/components/order-list/components/record-list/components/col-select-title';
import { LANG, TradeLink } from '@/core/i18n';
import { MarketsMap, Swap } from '@/core/shared';

import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { useListByStore } from '@/components/order-list/swap/store';
import { PendingDetailModal } from '@/components/trade-ui/order-list/swap/components/modal';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { SWAP_PENDING_ORDER_STATUS } from '@/core/shared/src/constants/order';
import { resso, useAppContext } from '@/core/store';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { CodeSelectTitle } from '../code-select-title';
import { LeverItem } from '../lever-item';
import { WalletName } from '../wallet-name';
import EditOrderItem from './components/edit-order-item';
import { ORDER_TYPES, OrderTypeSelect } from './components/order-type-select';
import { clsx, styles } from './styled';

const store: any = resso({
  code: undefined,
  type: undefined,
  orderType: undefined,
});

export const PendingList = () => {
  const [pendingDetailModalProps, setPendingDetailModalProps] = useState({ visible: false, data: {} });
  const { isUsdtType } = Swap.Trade.base;
  const pending = Swap.Order.getPending(isUsdtType);
  const { orderType } = store;
  const firstFilterList = useListByStore(pending);
  const typeListLength = useMemo(() => {
    const reuslt: number[] = [];
    firstFilterList.forEach((v: any) => {
      if (v.orderType === 1) {
        reuslt[0] = (reuslt[0] || 0) + 1;
      } else if (v.orderType === 2 && !v.reduceOnly) {
        reuslt[1] = (reuslt[1] || 0) + 1;
      } else if (v.orderType === 2 && v.reduceOnly) {
        reuslt[2] = (reuslt[2] || 0) + 1;
      } else if (v.orderType === 3) {
        reuslt[3] = (reuslt[3] || 0) + 1;
      }
    });
    return reuslt;
  }, [firstFilterList]);
  let data = formatListData(formatData(store.type, firstFilterList), store.code);
  data = !orderType
    ? data
    : data.filter((v) => {
        //   限价委托 orderType = 1
        // 追踪出场 orderType = 3
        // 止盈止损委托 orderType = 2 ， 且 reduceOnly = false
        // c 止盈止损 ， orderType = 2 ， 且 reduceOnly = true
        if (orderType === ORDER_TYPES.LIMIT) {
          return v.orderType === 1;
        } else if (orderType === ORDER_TYPES.TRACK) {
          return v.orderType === 3;
        } else if (orderType === ORDER_TYPES.SPSL) {
          return v.orderType === 2 && !v.reduceOnly;
        } else if (orderType === ORDER_TYPES.SP_OR_SL) {
          return v.orderType === 2 && v.reduceOnly;
        }
      });

  if (!useAppContext().isLogin) {
    data = [];
  }
  const onPendingDetailModalOpen = (data: any) => {
    setPendingDetailModalProps((prev) => ({ ...prev, visible: true, data }));
  };
  const onPendingDetailModalClose = () => {
    setPendingDetailModalProps((prev) => ({ ...prev, visible: false }));
  };

  const formatItemVolume = (v: any, item: any) => {
    const isSpslType = ['2', '1'].includes(`${item['strategyType']}`);
    const isLimit = ['1', '4'].includes(item['type']);
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: isSpslType && !isLimit ? item.triggerPrice : item.price,
    });
  };
  return (
    <>
      <div className={clsx('pending-list')}>
        <OrderTypeSelect listLength={typeListLength} value={orderType} onChange={(v) => (store.orderType = v)} />
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={Swap.Order.getPendingLoading(isUsdtType)}
          columns={useColumns({ isUsdtType, data: data, onPendingDetailModalOpen, formatItemVolume })}
        />
        <PendingDetailModal
          {...pendingDetailModalProps}
          onClose={onPendingDetailModalClose}
          formatItemVolume={formatItemVolume}
        />
      </div>
      {styles}
    </>
  );
};

const formatData = (type: any, data: any[]) => {
  const type2 = type + '';
  if (type !== undefined) {
    data = data.filter((v) => {
      const itemType = v.type + '';
      if (type2 === '1' && v.orderType === 1) {
        return ['1', '4'].includes(itemType);
      } else if (type2 === '2' && v.orderType === 1) {
        return ['2', '5'].includes(itemType);
      } else if (type2 === '3') {
        return itemType === '3';
      } else if (type2 === '4' && v.orderType === 2) {
        return v.strategyType === '1';
      } else if (type2 === '5' && v.orderType === 2) {
        return v.strategyType === '2';
      } else if (type2 === '100') {
        return v.orderType === 3;
      }
      return false;
    });
  }

  return data;
};

const useColumns = ({ data, onPendingDetailModalOpen, formatItemVolume }: any) => {
  const [marketMaps, setMarketMaps] = useState<MarketsMap | undefined>();
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    setMarketMaps(detail);
  });

  const { isUsdtType } = Swap.Trade.base;

  const locale = useRouter().query?.locale;
  const isEn = locale === 'en';
  const isZh = locale === 'zh';
  const storeCode = store.code;
  const storeType = store.type;

  const onCancelOrder = async (item: any) => {
    Loading.start();
    try {
      const result = await Swap.Order.cancelPending(item);
      if (result.code == 200) {
        message.success(LANG('撤销成功'));
      } else {
        message.error(result);
      }
    } catch (error: any) {
      message.error(error);
    } finally {
      Loading.end();
    }
  };

  const columns: any = [
    {
      title: LANG('时间'),
      dataIndex: 'ctime',
      render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
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
        const leverage = item?.leverageLevel;
        return (
          <TradeLink id={item.symbol.toUpperCase()}>
            <div className={clsx('code')}>
              <div className='multi-line-item'>
                <div className={clsx('code-text')}>
                  {Swap.Info.getCryptoData(item.symbol, { withHooks: false }).name}
                  {leverage && <LeverItem lever={leverage} />}
                </div>
                <div className={clsx('nowrap')}>
                  <div>
                    {item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}{' '}
                    <WalletName>
                      {Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false })?.alias}
                    </WalletName>
                  </div>
                </div>
              </div>
            </div>
          </TradeLink>
        );
      },
    },
    // {
    //   title: LANG('仓位模式'),
    //   dataIndex: 'marginType',
    //   render: (v: any, item: any) => (v === 1 ? LANG('全仓') : LANG('逐仓')),
    // },
    {
      title: () => {
        return (
          <ColSelectTitle
            options={SWAP_PENDING_ORDER_STATUS()}
            value={storeType}
            onChange={(type) => (store.type = type)}
          >
            {LANG('类型')}
          </ColSelectTitle>
        );
      },
      dataIndex: 'type',
      render: (v: any, item: any) => {
        const data = Swap.Order.formatPendingType(item);
        if (item.orderType === 3) {
          return LANG('追踪委托');
        }
        return [data['type'], data['strategyType'], data['side']].filter((e) => !!e).join('/');
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
  ];
  if (data?.some((item: any) => item.orderType === 3)) {
    columns.push({
      title: (
        <span>
          {LANG('市价')}
          <span className={clsx('main-color')}>({LANG('距离')})</span>
        </span>
      ),
      dataIndex: 'stopPrice',
      render: (_: any, item: any) => {
        if (item.orderType !== 3 || !item.triggerPrice) {
          return '--';
        }
        const swap = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
        const baseShowPrecision = Number(item.baseShowPrecision);
        const price = item.triggerPrice;
        const newPrice = marketMaps?.[item.symbol.toUpperCase()].price;
        let next = Swap.Utils.minChangeFormat(swap.minChangePrice, (price || 0).sub(newPrice));
        if (Number(next) < swap.minChangePrice && Number(next) > -1 * swap.minChangePrice) {
          next = Number(next) > 0 ? swap.minChangePrice : -1 * swap.minChangePrice;
        }

        return (
          <div>
            <div>{Number(newPrice || 0).toFixed(baseShowPrecision)}</div>
            <div className={clsx('main-color')}>({next.toFixed(baseShowPrecision)})</div>
          </div>
        );
      },
    });
  }
  // if (data.some((item: any) => item['otocoOrder']?.['triggerOrders'].length > 0)) {
  columns.push({
    title: LANG('止盈/止损'),
    dataIndex: 'spsl-view',
    render: (v: any, item: any) => {
      const isShow = item['otocoOrder']?.['triggerOrders'].length > 0;
      const content = (
        <>
          {isShow ? (
            <div className={clsx('view-spsl')} onClick={() => onPendingDetailModalOpen(item)}>
              {LANG('查看')}
            </div>
          ) : (
            <div>--</div>
          )}
        </>
      );
      if (item['reduceOnly']) {
        return content;
      }
      return (
        <EditOrderItem data={item} editSpsl>
          {content}
        </EditOrderItem>
      );
    },
  });
  // }
  columns.push(
    {
      title: LANG('价格'),
      dataIndex: 'price',
      render: (price: any, item: any) =>
        !item['closePosition'] ? (
          <EditOrderItem data={item} editPrice>
            {price ? Number(price).toFixed(Number(item.baseShowPrecision)) : '--'}
          </EditOrderItem>
        ) : (
          '--'
        ),
    },
    {
      title: `${LANG('数量')}/${LANG('完成度')}`,
      dataIndex: 'volume',
      render: (v: any, item: any) => {
        const content = (
          <div className={clsx('row-wrap')}>
            <div>{formatItemVolume(v, item)}</div>
            <div className={clsx('inline-block')} style={{ color: 'var(--skin-primary-color)' }}>
              ({formatItemVolume(item.dealVolume, item)})
            </div>
            &nbsp;
            <div className={clsx('inline-block')}>
              {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
            </div>
          </div>
        );
        if (item['closePosition'] === true) {
          return LANG('全部平仓');
        }
        return (
          <EditOrderItem data={item} editVolume>
            {content}
          </EditOrderItem>
        );
      },
    },
    {
      title: LANG('触发价'),
      dataIndex: 'triggerPrice',
      render: (triggerPrice: any, item: any) => {
        if (item.orderType === 3 && !triggerPrice && item.activationPrice) {
          triggerPrice = item.activationPrice;
        }
        if (!triggerPrice) {
          return '--';
        }

        return (
          <EditOrderItem data={item} editTriggerPrice>
            <div className={clsx('row-wrap')}>
              <div>{item.priceType === '1' ? LANG('市场价格') : LANG('标记价格')}</div>
              <div>{item.direction === '1' ? '≥' : '≤'}</div>
              <div>{Number(triggerPrice).toFixed(Number(item.baseShowPrecision))}</div>
            </div>
          </EditOrderItem>
        );
      },
    },
    {
      width: isZh || isEn ? 50 : null,
      title: LANG('平仓'),
      dataIndex: 'closePosition',
      render: (v: any, item: any) => (v ? LANG('是') : LANG('否')),
    },
    {
      width: isZh ? 50 : isEn ? 80 : null,
      title: LANG('只减仓'),
      dataIndex: 'reduceOnly',
      render: (v: any, item: any) => (v ? LANG('是') : LANG('否')),
    },
    {
      title: '',
      dataIndex: 'actions',
      width: 50,
      render: (v: any, item: any) => (
        <div className={clsx('cancel')} onClick={() => onCancelOrder(item)}>
          <CommonIcon name='common-delete-0' size={16} />
        </div>
      ),
    }
  );

  return columns;
};
// const IncomeColTitle = () => {
//   return (
//     <ColSortTitle value={store.getSortValue('income')} onChange={store.sortTypeChangeEvent('income')}>
//       <Tooltip
//         placement='top'
//         title={<IncomeTips value={store.incomeType} onChange={(incomeType: any) => (store.incomeType = incomeType)} />}
//       >
//         <InfoHover>{`${LANG('未实现盈亏____1')}/${LANG('回报率')}`}</InfoHover>
//       </Tooltip>
//     </ColSortTitle>
//   );
// };
export default PendingList;
