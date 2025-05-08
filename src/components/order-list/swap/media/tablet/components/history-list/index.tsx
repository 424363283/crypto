import { useData } from '@/components/order-list/swap/stores/history-list';
import { Swap } from '@/core/shared';
import { useEffect, useState, useMemo } from 'react';
import { ListView } from '../list-view';
import { HistoryItem } from './components/history-item';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

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
  const { data: firstFilterList, loading, onSubmit, resetParams } = useData({ isUsdtType });
  const [orderType, setOrderType] = useState(Order_TYPES.LIMIT);

  useEffect(() => {
    if (active) {
      resetParams();
      // const range = getDayjsDateRange(new Date(), 90, true);
      onSubmit({ size: 100 });
    }
  }, [active]);

  const data = firstFilterList.filter(item => !wallet || item.subWallet === wallet);
  const limitList = useMemo(() => {
    return data.filter(item => item.orderType === 1);
  }, [data]);
  const spslList = useMemo(() => {
    return data.filter(item => item.orderType === 2);
  }, [data]);
  return (
    <>
      <div>
        <OrderTypeTab
          orderType={orderType}
          changeOrderType={setOrderType}
          limit={limitList.length}
          spsl={spslList.length}
        />
        <ListView data={orderType === Order_TYPES.LIMIT ? limitList : spslList} loading={!data.length && loading}>
          {index => {
            const item = orderType === Order_TYPES.LIMIT ? limitList[index] : spslList[index];
            return <HistoryItem key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default HistoryList;
