import { useData } from '@/components/order-list/swap/stores/funds-list';
import { Swap } from '@/core/shared';
import { useEffect } from 'react';
import { ListView } from '../list-view';
import { FundsItem } from './components/funds-item';

export const FundsList = ({ active }: { active: boolean }) => {
  const { isUsdtType } = Swap.Trade.base;
  const { data, loading, onSubmit, resetParams } = useData({ isUsdtType });

  useEffect(() => {
    if (active) {
      resetParams();
      onSubmit({ size: 100 });
    }
  }, [active]);

  return (
    <>
      <div className='funds-wrapper'>
        <ListView data={data} loading={!data.length && loading}>
          {(index) => {
            const item = data[index];

            return <FundsItem key={index} data={item} />;
          }}
        </ListView>
        <style jsx>{`
          .funds-wrapper {
            padding: 8px 0;
          }
        `}</style>
      </div>
    </>
  );
};

export default FundsList;
