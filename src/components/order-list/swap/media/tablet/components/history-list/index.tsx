import { useData } from '@/components/order-list/swap/stores/history-list';
import { Swap } from '@/core/shared';
import { useEffect } from 'react';
import { ListView } from '../list-view';
import { HistoryItem } from './components/history-item';

export const HistoryList = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const { data, loading, onSubmit, resetParams } = useData({ isUsdtType });

  useEffect(() => {
    if (active) {
      resetParams();
      // const range = getDayjsDateRange(new Date(), 90, true);
      onSubmit({ size: 100 });
    }
  }, [active]);
  return (
    <>
      <div>
        <ListView data={data} loading={!data.length && loading}>
          {(index) => {
            const item = data[index];

            return <HistoryItem key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default HistoryList;
