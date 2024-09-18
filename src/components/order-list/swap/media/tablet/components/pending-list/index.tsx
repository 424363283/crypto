import { useListByStore } from '@/components/order-list/swap/store';
import { PendingDetailModal } from '@/components/trade-ui/order-list/swap/components/modal';
import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { useState } from 'react';
import { ListBar } from '../list-bar';
import { ListView } from '../list-view';
import { PendingItem } from './components/pending-item';

export const PendingList = () => {
  const [pendingDetailModalProps, setPendingDetailModalProps] = useState({ visible: false, data: {} });
  const { isUsdtType } = Swap.Trade.base;
  const pending = Swap.Order.getPending(isUsdtType);
  let list = useListByStore(pending);

  if (!useAppContext().isLogin) {
    list = [];
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
  const loading = Swap.Order.getPendingLoading(isUsdtType);

  return (
    <>
      <div>
        <ListBar pendingMode pending={list} />
        <ListView data={list} loading={!list.length && loading}>
          {(index) => {
            const item = list[index];

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
