import { useData, store } from '@/components/order-list/swap/stores/history-list';
import { Swap } from '@/core/shared';
import { useEffect, useState, useMemo } from 'react';
import { ListView } from '../list-view';
import { HistoryItem } from './components/history-item';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { ORDER_TYPES } from '../../../desktop/components/pending-list/components/order-type-select';

const Order_TYPES = {
  LIMIT: 'limit',
  SP_OR_SL: 'sp or sl'
};

const OrderTypeTab = ({
  changeOrderType,
  orderType,
  limit,
  spsl
}: {
  orderType: string;
  limit: number;
  spsl: number;
}) => {
  return (
    <>
      <div className="pending-tab">
        <div
          className={`tab ${orderType === Order_TYPES.LIMIT ? 'active' : ''}`}
          onClick={() => changeOrderType(Order_TYPES.LIMIT)}
        >
          {LANG('限价丨市价')}({limit})
        </div>
        <div
          className={`tab ${orderType === Order_TYPES.SP_OR_SL ? 'active' : ''}`}
          onClick={() => changeOrderType(Order_TYPES.SP_OR_SL)}
        >
          {LANG('止盈止损')}({spsl})
        </div>
      </div>
      <style jsx>{`
        .pending-tab {
          padding: 0 1.5rem;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
          @media ${MediaInfo.mobile}{
            padding: 0 12px; 
          }
          .tab {
            display: flex;
            padding: 8px 16px;
            align-items: center;
            gap: 10px;
            border-radius: 6px;
            border: 1px solid var(--fill_line_3);
            font-size: 12px;
            font-weight: 400;
            color: var(--text_2);
            &.active {
              background: var(--fill_3);
              border: 0;
              color: var(--text_1);
            }
          }
        }
      `}</style>
    </>
  );
};

export const HistoryList = ({ active, wallet }: { active: boolean, wallet?: WalletKey }) => {
  const { isUsdtType } = Swap.Trade.base;
  const { data: originFilterList, loading, onSubmit, resetParams, orderCounts } = useData({ isUsdtType, subWallet: wallet });
  // const [orderType, setOrderType] = useState(Order_TYPES.LIMIT);
  const { orderType } = store;
  const firstFilterList = originFilterList.filter(item => !wallet || item.subWallet === wallet);
  const typeListLength = useMemo(() => {
    const reuslt: number[] = [];
    firstFilterList.filter(item => !wallet || item.subWallet === wallet).forEach((v: any) => {

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
  typeListLength[0] = orderCounts[ORDER_TYPES.LIMIT];
  typeListLength[2] = orderCounts[ORDER_TYPES.SP_OR_SL];

  let tabData = !orderType ? firstFilterList : firstFilterList.filter((v) => {
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
      resetParams();
      // const range = getDayjsDateRange(new Date(), 90, true);
      onSubmit({ size: 100, subWallet: wallet });
    }
  }, [active, onSubmit, orderType]);

  useEffect(() => {
    return () => {
      store.orderType = ORDER_TYPES.LIMIT;
      store.orderCounts = {};
    };

  }, []);

  return (
    <>
      <div>
        <OrderTypeTab
          orderType={orderType}
          changeOrderType={(v) => (store.orderType = v)}
          limit={typeListLength[0]}
          spsl={typeListLength[2]}
        />
        <ListView data={tabData} loading={loading}>
          {index => {
            return <HistoryItem key={index} data={tabData[index]} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default HistoryList;
