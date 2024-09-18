import { useData } from '@/components/order-list/swap/stores/finished-list';
import { Swap } from '@/core/shared';
import { useEffect } from 'react';
import { ListView } from '../list-view';
import { FinishedItem } from './components/finished-item';

export const FinishedList = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const { data, onSubmit, resetParams, loading } = useData({ isUsdtType });

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

            return <FinishedItem key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default FinishedList;
