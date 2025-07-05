import { useData } from '@/components/order-list/swap/stores/position-history';
import { Swap } from '@/core/shared';
import { useEffect, useState } from 'react';
import { PositionHistoryShare } from '../../../../components/position-history-share';
import { ListView } from '../list-view';
import { HistoryItem } from './components/history-item';

export const PositionHistory = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const { data, loading, onSubmit, resetParams } = useData({ isUsdtType });
  const [shareVisibleData, setShareModalData] = useState({ visible: false, data: {} });

  useEffect(() => {
    if (active) {
      resetParams();
      // const range = getDayjsDateRange(new Date(), 90, true);
      onSubmit({ size: 100 });
    }
  }, [active]);
  const onShare = (data: any) => {
    setShareModalData((v) => ({ ...v, visible: true, data }));
  };
  return (
    <>
      <div>
        {/* <FilterBar onSubmit={onSubmit} /> */}
        <ListView data={data} loading={!data.length && loading}>
          {(index) => {
            const item = data[index];
            return <HistoryItem key={index} data={item} onShare={onShare} />;
          }}
        </ListView>
        <PositionHistoryShare
          {...shareVisibleData}
          onClose={() => setShareModalData((v) => ({ ...v, visible: false }))}
        />
      </div>
    </>
  );
};

export default PositionHistory;
