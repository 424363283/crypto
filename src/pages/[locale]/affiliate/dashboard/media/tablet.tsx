import AssetsView from '@/components/affiliate/assets-view';
import Income, { INCOME_TYPE } from '@/components/affiliate/income';
import ShareCard from '@/components/affiliate/share-card';
// import TableDetail from '@/components/affiliate/table-detail';
import { AffiliateTabletLayout } from '@/components/layouts/media/affiliate/tablet';
import { Summary } from '@/core/shared';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
const BarGraph = dynamic(() => import('@/components/affiliate/bar-graph'), { ssr: false });
const TableDetail = dynamic(() => import('@/components/affiliate/table-detail'), { ssr: false });

export const TabletDashboard = () => {
  const { todayIncome, yesterdayIncome, totalIncome } = Summary.state;

  useEffect(() => {
    Summary.init();
  }, []);

  return (
    <AffiliateTabletLayout>
      <div className='container'>
        <AssetsView />
        <ShareCard />
        <div className='income-wrapper'>
          <Income type={INCOME_TYPE.TODAY} value={todayIncome} />
          <Income type={INCOME_TYPE.TOTAL} value={totalIncome} />
          <Income type={INCOME_TYPE.YESTERDAY} value={yesterdayIncome} />
        </div>
        <BarGraph />
        <TableDetail />
      </div>
      <style jsx>{styles}</style>
    </AffiliateTabletLayout>
  );
};

const styles = css`
  .container {
    display: flex;
    flex-direction: column;
    .income-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      :global(> div) {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
`;
