import RecordList, { formatListData } from '@/components/order-list/components/record-list';
import { ColSelectTitle } from '@/components/order-list/components/record-list/components/col-select-title';
import { LANG, TradeLink } from '@/core/i18n';
import { MarketsMap, Swap } from '@/core/shared';

import { kHeaderStore } from '@/components/chart/k-chart/components/k-header/store';
import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { useListByStore } from '@/components/order-list/swap/store';
import { PendingDetailModal } from '@/components/trade-ui/order-list/swap/components/modal';
import { kChartEmitter } from '@/core/events';
import { SwapOrderEmitter } from '@/core/events/src/swap-order';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { resso, useAppContext } from '@/core/store';
import { getUrlQueryParams, hiddenTxt, message } from '@/core/utils';
import { frameRun } from '@/core/utils/src/frame-run';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { CodeSelectTitle } from '../code-select-title';
import { LeverItem } from '../lever-item';
import { WalletName } from '../wallet-name';
import EditOrderItem from './components/edit-order-item';
import { ORDER_TYPES, OrderTypeSelect } from './components/order-type-select';
import { clsx, styles } from './styled';
import OrderHeaderItem from './components/order-header-item';
import {
  SWAP_HISTORY_ORDER_STATUS,
  SWAP_HISTORY_ORDER_TYPES,
  SWAP_HISTORY_TRIGGER_ORDER_STATUS,
  SWAP_PENDING_ORDER_STATUS,
} from '@/core/shared/src/constants/order';
import OrderSPSLItem from './components/order-spsl-item';
import CopyToClipboard from 'react-copy-to-clipboard';
import ClipboardItem from '@/components/clipboard-item';
import { Button } from '@/components/button';
import { Intent, Size } from '@/components/constants';

const ORDER_TYPE_COLUMNS: { [key: string]: string[] } = {
  [ORDER_TYPES.LIMIT]: ['symbol', 'side', 'dealVolume', 'volume', 'avgPrice', 'price', 'spsl', 'reduceOnly', 'status', 'orderId', 'ctime', 'mtime', 'actions'],
  // [ORDER_TYPES.LIMIT]: ['symbol', 'side', 'dealVolume', 'volume', 'avgPrice', 'dealVolume', 'volume', 'avgPrice', 'price', 'spsl', 'reduceOnly', 'price', 'spsl', 'reduceOnly', 'status', 'orderId', 'ctime', 'mtime', 'actions'],
  [ORDER_TYPES.SPSL]: ['symbol', 'side', 'volume', 'triggerPrice', 'priceType', 'price', 'spsl', 'reduceOnly', 'statusTrigger', 'orderId', 'ctime', 'actions'],
  [ORDER_TYPES.SP_OR_SL]: ['symbol', 'orderType', 'side', 'volume', 'triggerPrice', 'priceType', 'price', 'reduceOnly', 'statusTrigger', 'orderId', 'ctime', 'actions']
};

const store: any = resso({
  code: undefined,
  type: undefined,
  orderType: ORDER_TYPES.LIMIT,
  status: undefined,
});

export const PendingList = () => {
  let qty = Number(getUrlQueryParams('qty'));
  const { setting } = kHeaderStore(qty);
  const modal = Swap.Trade.store.modal;
  const [pendingDetailModalProps, setPendingDetailModalProps] = useState({ visible: false, data: {} });
  const { isUsdtType } = Swap.Trade.base;
  const pending = Swap.Order.getPending(isUsdtType);
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const { orderType } = store;
  const firstFilterList = useListByStore(pending);
  const [isDragging, setIsDragging] = useState(false);
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
  data = !orderType ? data : data.filter((v) => {
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

    // /* 
    //   当前委托-止盈止损这里委托数据显示0；如果接口返回closePostion=true，
    //   委托数量取positionVolume的值，如果closePostion=false，委托数量取volume的值。 
    // */
    // if (item.closePosition) {
    //   return item.positionVolume
    // }
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: isSpslType && !isLimit ? item.triggerPrice : item.price,
    });
  };

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

  useEffect(() => {
    const action = () => {
      if (setting?.pendingOrder) {
        kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_VISIBLE, true);
        if (isDragging) {
          return;
        }
        const msgList: any[] = [];
        data
          .filter((e: { subWallet: string }) => e?.subWallet === walletId)
          ?.forEach((e) => {
            let price =
              e?.price?.toFixed(Number(e.baseShowPrecision)) ||
              Number(e.triggerPrice).toFixed(Number(e.baseShowPrecision));
            const info = Swap.Order.formatPendingType(e);
            const tip = [info['type'], info['strategyType'], info['side']].filter((e) => !!e).join('/');
            let text = `${tip} ${price}`;

            if (e.orderType === 2) {
              if (!e.triggerPrice) {
                text = `${tip} -`;
              } else {
                const type = e.priceType === '1' ? LANG('市场价格') : LANG('标记价格');
                const syb = e.direction === '1' ? '≥' : '≤';
                text = `${tip} ${type} ${syb} ${Number(e.triggerPrice).toFixed(Number(e.baseShowPrecision))}`;
              }
            }
            if (e.orderType === 3) {
              // 暂时隐藏
              // const tip = LANG('追踪委托');
              // const type = e.priceType === '1' ? LANG('市场价格') : LANG('标记价格');
              // const syb = e.direction === '1' ? '≥' : '≤';
              // price = e?.price?.toFixed(1) || e?.activationPrice?.toFixed(1);
              // text = `${tip} ${type} ${syb} ${price}`;

              return;
            }
            msgList.push({
              id: e.orderId,
              side: e.side,
              type: e.type,
              text,
              volume: e?.closePosition === true ? LANG('全部平仓') : formatItemVolume(e.volume, e),
              price: Number(price),
            });
          });
        kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_UPDATE, msgList);
      } else {
        kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_VISIBLE, false);
      }
    };
    action();
  }, [setting?.pendingOrder, data, isDragging]);

  useEffect(() => {
    const _data = cloneDeep(data);
    const clickCallback = (id: string) => {
      const idx = _data?.findIndex((item) => item.orderId === String(id));
      if (idx < 0) return;
      onCancelOrder(_data[idx]);
    };

    const moveCallback = (id: string) => {
      setIsDragging(true);
      // console.log('拖动开始');
    };

    const moveEndCallback = (id: string, price: number) => {
      // console.log('停止拖动，拖动id为：', id, '当前价格为：', price);
      const idx = _data?.findIndex((item) => item.orderId === String(id));

      if (idx < 0) return;

      if (_data[idx].price) {
        const swap = Swap.Info.getCryptoData(_data[idx].symbol, { withHooks: false });
        Swap.Trade.setModal({
          modifyPositionMriceModalVisible: true,
          modifyPositionMriceModalData: {
            orderId: id,
            price: Swap.Utils.minChangeFormat(swap.minChangePrice, price),
            // triggerPrice: 50003,
          },
        });
      } else {
        data[idx].triggerPriceDragging = price;
        SwapOrderEmitter.emit(`${SwapOrderEmitter.SwapOrder}-${_data[idx].orderId}`, price);
      }

      setIsDragging(false);
    };

    frameRun(() => {
      kChartEmitter.removeAllListeners(kChartEmitter.K_CHART_COMMISSION_CLOSE_CLICK);
      kChartEmitter.removeAllListeners(kChartEmitter.K_CHART_COMMISSION_MOVE_START);
      kChartEmitter.removeAllListeners(kChartEmitter.K_CHART_COMMISSION_MOVE_END);

      kChartEmitter.on(kChartEmitter.K_CHART_COMMISSION_CLOSE_CLICK, clickCallback);
      kChartEmitter.on(kChartEmitter.K_CHART_COMMISSION_MOVE_START, moveCallback);
      kChartEmitter.on(kChartEmitter.K_CHART_COMMISSION_MOVE_END, moveEndCallback);
    });

    return () => {
      kChartEmitter.off(kChartEmitter.K_CHART_COMMISSION_CLOSE_CLICK, clickCallback);
      kChartEmitter.off(kChartEmitter.K_CHART_COMMISSION_MOVE_START, moveCallback);
      kChartEmitter.off(kChartEmitter.K_CHART_COMMISSION_MOVE_END, moveEndCallback);
    };
  }, [data]);



  return (
    <>
      <div className={clsx('pending-list')}>
        <OrderTypeSelect listLength={typeListLength} value={orderType} onChange={(v) => (store.orderType = v)} />
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={Swap.Order.getPendingLoading(isUsdtType)}
          columns={useColumns({ isUsdtType, data: data, onPendingDetailModalOpen, formatItemVolume })}
          scroll={{ x: 'max-content', y: 500 }}
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
  const storeStatus = store.status;
  const columns = ORDER_TYPE_COLUMNS[store.orderType]?.map(colKey => {
    let colItem: any = null;
    switch (colKey) {
      case "symbol": {
        colItem = {
          minWidth: 160,
          title: () => (
            <CodeSelectTitle value={storeCode} onChange={(code: any) => (store.code = code)}>
              {LANG('合约丨杠杆')}
            </CodeSelectTitle>
          ),
          dataIndex: 'symbol',
          fixed: 'left',
          render: (v: any, item: any) => {
            const leverage = item?.leverageLevel;
            return (
              <OrderHeaderItem
                symbol={item.symbol}
                leverage={item?.leverageLevel}
                marginType={item.marginType}
                subWallet={item.subWallet}
                isUsdtType={isUsdtType}
              />
            );
          },
        };
        break;

      }
      case "side": {
        colItem = {
          minWidth: 100,
          title: LANG('方向'),
          dataIndex: 'side',
          render: (side: any) => {
            const isBuy = side === '1';
            return <span className={isBuy ? 'positive-text' : 'negative-text'}>{isBuy ? LANG('买入') : LANG('卖出')}</span>;
          }
        };
        break;

      }
      case "dealVolume": {
        colItem = {
          // -${LANG('数量')}/${LANG('完成度')}
          minWidth: 100,
          title: `${LANG('成交数量')}`,
          dataIndex: 'dealVolume',
          render: (v: any, item: any) => {
            return (
              <div>
                {formatItemVolume(v, item)} {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
              </div>
            );
            // const content = (
            //   <div className={clsx('row-wrap')}>
            //     <div>{formatItemVolume(v, item)}</div>
            //     <div className={clsx('inline-block')} style={{ color: 'var(--skin-main-font-color)' }}>
            //       ({formatItemVolume(item.dealVolume, item)})
            //     </div>
            //     &nbsp;
            //     <div className={clsx('inline-block')}>
            //       {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
            //     </div>
            //   </div>
            // );
            // if (item['closePosition'] === true) {
            //   return LANG('全部平仓');
            // }
            // return (
            //   <EditOrderItem data={item} editVolume>
            //     {content}
            //   </EditOrderItem>
            // );
          }
        };
        break;
      }
      case "volume": {
        colItem = {
          // -${LANG('数量')}/${LANG('完成度')}
          minWidth: 100,
          title: `${LANG('委托数量')}`,
          dataIndex: 'volume',
          render: (v: any, item: any) => {
            return (
              <div>{formatItemVolume(v, item)} {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}</div>
            );
          }
        };
        break;
      }
      case "avgPrice": {
        colItem = {
          // LANG('价格')
          minWidth: 100,
          title: LANG('成交均价'),
          dataIndex: 'avgPrice',
          render: (price: any, item: any) => {
            return !Number(price) ? '--' : Number(price).toFixed(Number(item.baseShowPrecision));
          }
        };
        break;
      }
      case "price": {
        colItem = {
          //  LANG('价格')
          minWidth: 100,
          title: LANG('委托价格'),
          dataIndex: 'price',
          render: (price: any, item: any) => {
            return !Number(price) ? '--' : Number(price).toFixed(Number(item.baseShowPrecision));
            // !item['closePosition'] ? (
            //   <EditOrderItem data={item} editPrice>
            //     {price ? Number(price).toFixed(Number(item.baseShowPrecision)) : '--'}
            //   </EditOrderItem>
            // ) : (
            //   '--'
            // )
          }
        };
        break;
      }
      case "spsl": {
        colItem = {
          minWidth: 100,
          title: LANG('止盈/止损'),
          dataIndex: 'otocoOrder',
          render: (otocoOrder: any, item: any) => {
            return <OrderSPSLItem item={item} />
            //   const isShow = otocoOrder?.['triggerOrders'].length > 0;
            //   const content = (
            //     <>
            //       {isShow ? (
            //         <div className={clsx('view-spsl')} onClick={() => onPendingDetailModalOpen(item)}>
            //           {LANG('查看')}
            //         </div>
            //       ) : (
            //         <div>--</div>
            //       )}
            //     </>
            //   );
            //   if (item['reduceOnly']) {
            //     return content;
            //   }
            //   return (
            //     <EditOrderItem data={item} editSpsl>
            //       {content}
            //     </EditOrderItem>
            //   );
          }
        };
        break;
      }
      case "reduceOnly": {
        colItem = {
          minWidth: 100,
          title: LANG('只减仓'),
          dataIndex: 'ordFlag',
          render: (v: any, item: any) => (v ? LANG('是') : LANG('否'))
        };
        break;

      }
      case "status": {
        colItem = {
          minWidth: 100,
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
          }
        };
        break;

      }
      case "statusTrigger": {
        colItem = {
          minWidth: 100,
          title: LANG('状态'),
          dataIndex: 'status',
          render: (status: any) => {
            return (SWAP_HISTORY_TRIGGER_ORDER_STATUS() as any)[status];
          }
        };
        break;

      }
      case "orderId": {
        colItem = {
          minWidth: 100,
          title: LANG('订单编号'),
          dataIndex: 'orderId',
          render: (orderId: any, item: any) => {
            return <ClipboardItem text={orderId} />
          }
        };
        break;
      }
      case "ctime": {
        colItem = {
          minWidth: 150,
          title: LANG('委托时间'),
          dataIndex: 'ctime',
          render: (time: any) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '--'
        };
        break;

      }
      case "mtime": {
        colItem = {
          minWidth: 150,
          title: LANG('最近成交时间'),
          dataIndex: 'mtime',
          render: (time: any) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '--'
        };
        break;
      }
      case "triggerPrice": {
        colItem = {
          minWidth: 100,
          title: LANG('触发价格'),
          dataIndex: 'triggerPrice',
          render: (triggerPrice: any, item: any) => {
            if (item.orderType === 3 && !triggerPrice && item.activationPrice) {
              triggerPrice = item.activationPrice;
            }
            if (!triggerPrice) {
              return '--';
            }
            return <div>{Number(triggerPrice).toFixed(Number(item.baseShowPrecision))}</div>;
            {
              // return (
              //   <EditOrderItem data={item} editTriggerPrice>
              //     <div className={clsx('row-wrap')}>
              //       <div>{item.priceType === '1' ? LANG('市场价格') : LANG('标记价格')}</div>
              //       <div>{item.direction === '1' ? '≥' : '≤'}</div>
              //       <div>{Number(triggerPrice).toFixed(Number(item.baseShowPrecision))}</div>
              //     </div>
              //   </EditOrderItem>
              // );
            }
          }
        };
        break;
      }
      case "priceType": {
        colItem = {
          minWidth: 100,
          title: LANG('触发类型'),
          dataIndex: 'priceType',
          render: (priceType: any, item: any) => {
            return priceType === '1' ? LANG('最新价格') : LANG('标记价格');
          }
        }
        break;
      }
      case "orderType": {
        colItem = {
          minWidth: 100,
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
          dataIndex: 'orderType',
          render: (v: any, item: any) => {
            const data = Swap.Order.formatPendingType(item);
            if (item.orderType === 3) {
              return LANG('追踪委托');
            }
            return [data['type'], data['strategyType'], data['side']].filter((e) => !!e).join('/');
          }
        };
        break;
      }
      case "actions": {
        colItem = {
          align: 'right',
          minWidth: 150,
          title: LANG('批量撤单'),
          dataIndex: 'actions',
          fixed: 'right',
          render: (v: any, item: any) => (
            <div className={clsx('cancel')} onClick={() => onCancelOrder(item)}>
              <Button size={Size.XS} width={80} type={Intent.PRIMARY} rounded>
                {LANG('撤单')}
              </Button>
            </div>
          )
        };
        break;
      }
      case "closePosition": {
        colItem = {
          minWidth: 100,
          title: LANG('平仓'),
          dataIndex: 'closePosition',
          render: (v: any, item: any) => (v ? LANG('是') : LANG('否'))
        };
        break;
      }
      case "stopPrice": {
        if (data?.some((item: any) => item.orderType === 3)) {
          colItem = {
            minWidth: 100,
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
          };
        }
        break;
      }
      case "marginType": {
        colItem = {
          minWidth: 100,
          title: LANG('仓位模式'),
          dataIndex: 'marginType',
          render: (v: any, item: any) => (v === 1 ? LANG('全仓') : LANG('逐仓'))
        }
        break;
      }
      default: break;
    }
    return colItem;

  })

  return columns || [];
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
export { store };
