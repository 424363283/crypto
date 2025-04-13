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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { CodeSelectTitle } from '../code-select-title';
import { LeverItem } from '../lever-item';
import { WalletName } from '../wallet-name';
import { clsx, styles } from './styled';
import OrderHeaderItem from '../pending-list/components/order-header-item';
import { ORDER_TYPES, OrderTypeSelect } from '../pending-list/components/order-type-select';
import ClipboardItem from '@/components/clipboard-item';
import OrderSPSLItem from '../pending-list/components/order-spsl-item';

const ORDER_TYPE_COLUMNS: { [key: string]: string[] } = {
  // [ORDER_TYPES.LIMIT]: ['symbol', 'side', 'dealVolume', 'volume', 'avgPrice', 'price', 'income', 'rate', 'fee', 'spsl', 'reduceOnly', 'status', 'orderId', 'ctime', 'mtime'],
  [ORDER_TYPES.LIMIT]: ['symbol', 'orderType', 'side', 'dealVolume', 'volume', 'avgPrice', 'price', 'spsl', 'reduceOnly', 'status', 'orderId', 'ctime', 'mtime'],
  [ORDER_TYPES.SPSL]: ['symbol', 'side', 'volume', 'triggerPrice', 'priceType', 'price', 'spsl', 'reduceOnly', 'status', 'orderId', 'ctime'],
  [ORDER_TYPES.SP_OR_SL]: ['symbol', 'orderType', 'side', 'triggerPrice', 'priceType', 'price', 'reduceOnly', 'status', 'orderId', 'ctime']
};

export const HistoryList = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const scrollRef = useRef();
  const scrollToTop = useCallback(() => {
    if (scrollRef?.current) {
      (scrollRef?.current as any).scrollTop = 0;
    }
  }, [scrollRef]);
  const { data: firstFilterList, loading, onSubmit, onLoadMore } = useData({ isUsdtType, scrollToTop });
  const { orderType } = store;
  const typeListLength = useMemo(() => {
    const reuslt: number[] = [];
    firstFilterList.forEach((v: any) => {

      if (v.orderType === 1) {
        reuslt[0] = (reuslt[0] || 0) + 1;
      } else if (v.orderType === 2) {
        reuslt[2] = (reuslt[2] || 0) + 1;
      } else if (v.orderType === 3) {
        reuslt[3] = (reuslt[3] || 0) + 1;
      }
      // if (v.orderType === 1) {
      //   reuslt[0] = (reuslt[0] || 0) + 1;
      // } else if (v.orderType === 2 && !v.reduceOnly) {
      //   reuslt[1] = (reuslt[1] || 0) + 1;
      // } else if (v.orderType === 2 && v.reduceOnly) {
      //   reuslt[2] = (reuslt[2] || 0) + 1;
      // } else if (v.orderType === 3) {
      //   reuslt[3] = (reuslt[3] || 0) + 1;
      // }
    });
    return reuslt;
  }, [firstFilterList])

  let data = !orderType ? firstFilterList : firstFilterList.filter((v) => {
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
      return v.orderType === 2;
    }
  })

  useEffect(() => {
    if (active) {
      onSubmit();
    }
  }, [active, onSubmit]);

  return (
    <>
      <div className={clsx('history-list')}>
        <OrderTypeSelect listLength={typeListLength} value={orderType} onChange={(v) => (store.orderType = v)} />
        <RecordList
          renderRowKey={(v) => v.orderId}
          data={data}
          loading={loading}
          columns={useColumns({ isUsdtType, data: data })}
          onLoadMore={onLoadMore}
          rowClassName={(item: any) => (item.status !== '4' ? '' : clsx('cancel-row'))}
          getScrollElement={useCallback((v: any) => (scrollRef.current = v), [])}
          scroll={{ x: 'max-content', y: 500 }}
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

  const columns = ORDER_TYPE_COLUMNS[store.orderType]?.map(colKey => {
    let colItem: any = null;
    switch (colKey) {
      case "symbol": {
        colItem = {
          title: () => (
            <CodeSelectTitle value={storeCode} onChange={(code: any) => (store.code = code)}>
              {LANG('合约丨杠杆')}
            </CodeSelectTitle>
          ),
          minWidth: isUsdtType ? 160 : undefined,
          fixed: 'left',
          dataIndex: 'code',
          render: (v: any, item: any) => {
            const leverageLevel = item?.leverageLevel;
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
        }
        break;
      }
      case "side": {
        colItem = {
          title: LANG('方向'),
          dataIndex: 'side',
          minWidth: 100,
          render: (side: string) => {
            const isBuy = side === '1';
            return <span className={isBuy ? 'main-green' : 'main-red'}>{isBuy ? LANG('买入') : LANG('卖出')}</span>;
          },
        }
        break;
      }
      case "dealVolume": {
        colItem = {
          title: LANG('成交数量'),
          dataIndex: 'dealVolume',
          minWidth: 100,
          render: (v: any, item: any) => {
            return (
              <div>
                {formatItemVolume(v, item)} {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
              </div>
            );
          }
        }
        break;
      }
      case "volume": {
        colItem = {
          title: LANG('委托数量'),
          dataIndex: 'volume',
          minWidth: 100,
          render: (v: any, item: any) => {
            return (
              <div>
                {formatItemVolume(v, item)} {Swap.Info.getUnitText({ symbol: item.symbol, withHooks: false })}
              </div>
            );
          }
        }
        break;
      }
      case "avgPrice": {
        colItem = {
          title: LANG('成交均价'),
          dataIndex: 'avgPrice',
          minWidth: 100,
          render: (avgPrice: any, item: any) => {
            return avgPrice ? Number(avgPrice).toFixed(Number(item.baseShowPrecision)) : '--';
          },
        }
        break;
      }
      case "price": {
        colItem = {
          title: LANG('委托价格'),
          dataIndex: 'price',
          minWidth: 100,
          render: (price: any, item: any) => {
            return price ? Number(price).toFixed(Number(item.baseShowPrecision)) : '--';
          },
        }
        break;
      }
      case "income": {
        colItem = {
          title: LANG('收益额'),
          dataIndex: 'income',
          minWidth: 100,
          render: (v: any, item: any) => {
            return v || '--';
          }

        }
        break;
      }
      case "rate": {
        colItem = {
          title: LANG('收益率'),
          dataIndex: 'rate',
          minWidth: 100,
          render: (v: any, item: any) => {
            return v || '--';
          }
        }
        break;
      }
      case "fee": {
        colItem = {
          title: LANG('手续费'),
          dataIndex: 'fee',
          minWidth: 100,
          render: (v: any, item: any) => {
            return v || '--';
          }
        }
        break;
      }
      case "spsl": {
        colItem = {
          title: LANG('止盈/止损'),
          dataIndex: 'otocoOrder',
          minWidth: 100,
          render: (v: any, item: any) => {
            return <OrderSPSLItem item={item} />
          }
        };
        break;

      }
      case "reduceOnly": {
        colItem = {
          title: LANG('只减仓'),
          dataIndex: 'ordFlag',
          minWidth: 100,
          render: (v: any, item: any) => (v ? LANG('是') : LANG('否'))
        };
        break;

      }
      case "status": {
        colItem = {
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
          minWidth: 100,
          render: (status: any) => {
            return (SWAP_HISTORY_ORDER_STATUS() as any)[status];
          },
        }
        break;
      }
      case "orderId": {
        colItem = {
          title: LANG('订单编号'),
          dataIndex: 'orderId',
          minWidth: 100,
          render: (orderId: any, item: any) => {
            return <ClipboardItem text={orderId} />
          }
        };
        break;
      }
      case "ctime": {
        colItem = {
          title: LANG('委托时间'),
          dataIndex: 'ctime',
          minWidth: 150,
          render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
        }
        break;
      }
      case "mtime": {
        colItem = {
          title: LANG('更新时间'),
          dataIndex: 'mtime',
          minWidth: 150,
          render: (time: any) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
        }
        break;
      }
      case "triggerPrice": {
        colItem = {
          title: LANG('触发价格'),
          dataIndex: 'triggerPrice',
          minWidth: 100,
          render: (triggerPrice: any, item: any) => {
            if (item.orderType === 3 && !triggerPrice && item.activationPrice) {
              triggerPrice = item.activationPrice;
            }
            if (!triggerPrice) {
              return '--';
            }
            return <div>{Number(triggerPrice).toFixed(Number(item.baseShowPrecision))}</div>;
          }
        };
        break;
      }
      case "priceType": {
        colItem = {
          title: LANG('触发类型'),
          dataIndex: 'priceType',
          minWidth: 100,
          render: (priceType: any, item: any) => {
            return priceType === '1' ? LANG('最新价格') : LANG('标记价格');
          }
        }
        break;
      }
      case "orderType": {
        colItem = {
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
          minWidth: 100,
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
        };
        break;
      }
      default: break;
    }
    return colItem;
  });

  return columns || [];
};
export default HistoryList;
