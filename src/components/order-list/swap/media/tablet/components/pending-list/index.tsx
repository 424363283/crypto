import { useListByStore } from '@/components/order-list/swap/store';
import { PendingDetailModal } from '@/components/trade-ui/order-list/swap/components/modal';
import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { useEffect, useMemo, useState } from 'react';
import { ListBar } from '../list-bar';
import { ListView } from '../list-view';
import { PendingItem } from './components/pending-item';
import { LANG } from '@/core/i18n';
const PENDING_TYPES = {
  LIMIT: 'limit',
  SP_OR_SL: 'sp or sl'
};

const PendingTypeTab = ({
  changePengType,
  pendingType,
  limit,
  spsl
}: {
  pendingType: string;
  limit: number;
  spsl: number;
}) => {
  return (
    <>
      <div className="pending-tab">
        <div
          className={`tab ${pendingType === PENDING_TYPES.LIMIT ? 'active' : ''}`}
          onClick={() => changePengType(PENDING_TYPES.LIMIT)}
        >
          {LANG('限价丨市价')}({limit})
        </div>
        <div
          className={`tab ${pendingType === PENDING_TYPES.SP_OR_SL ? 'active' : ''}`}
          onClick={() => changePengType(PENDING_TYPES.SP_OR_SL)}
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

export const PendingList = () => {
  const [pendingDetailModalProps, setPendingDetailModalProps] = useState({ visible: false, data: {} });
  const [pendingType, setPendingType] = useState(PENDING_TYPES.LIMIT);
  const { isUsdtType } = Swap.Trade.base;
  const pending = Swap.Order.getPending(isUsdtType);

  let list = useListByStore(pending);

  if (!useAppContext().isLogin) {
    list = [];
  }
  const limitList = useMemo(() => {
    return list.filter(item => item.orderType === 1);
  }, [list]);
  const spslList = useMemo(() => {
    return list.filter(item => item.orderType === 2);
  }, [list]);
  const onPendingDetailModalOpen = (data: any) => {
    setPendingDetailModalProps(prev => ({ ...prev, visible: true, data }));
  };
  const onPendingDetailModalClose = () => {
    setPendingDetailModalProps(prev => ({ ...prev, visible: false }));
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
      flagPrice: isSpslType && !isLimit ? item.triggerPrice : item.price
    });
  };
  const loading = Swap.Order.getPendingLoading(isUsdtType);

  return (
    <>
      <div>
        <ListBar pendingMode pending={list} />
        <PendingTypeTab
          pendingType={pendingType}
          changePengType={setPendingType}
          limit={limitList.length}
          spsl={spslList.length}
        />
        <ListView data={pendingType === PENDING_TYPES.LIMIT ? limitList : spslList} loading={!list.length && loading}>
          {index => {
            const item = pendingType === PENDING_TYPES.LIMIT ? limitList[index] : spslList[index];

            return (
              <PendingItem
                key={index}
                data={item}
                formatItemVolume={formatItemVolume}
                onPendingDetailModalOpen={onPendingDetailModalOpen}
              />
            );
          }}
        </ListView>
      </div>
      <PendingDetailModal
        {...pendingDetailModalProps}
        onClose={onPendingDetailModalClose}
        formatItemVolume={formatItemVolume}
      />
    </>
  );
};

export default PendingList;
