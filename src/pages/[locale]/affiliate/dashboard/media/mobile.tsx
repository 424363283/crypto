import AssetsView from '@/components/affiliate/assets-view';
import Income, { INCOME_TYPE } from '@/components/affiliate/income';
import ShareCard from '@/components/affiliate/share-card';
import { AffiliateMobileLayout } from '@/components/layouts/media/affiliate/mobile';
import { Summary } from '@/core/shared';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
const BarGraph = dynamic(() => import('@/components/affiliate/bar-graph'), { ssr: false });
const TableDetail = dynamic(() => import('@/components/affiliate/table-detail'), { ssr: false });

export const MobileDashboard = () => {
  const { todayIncome, yesterdayIncome, totalIncome } = Summary.state;

  useEffect(() => {
    Summary.init();
  }, []);

  return (
    <AffiliateMobileLayout>
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
    </AffiliateMobileLayout>
  );
};

const styles = css`
  .container {
    display: flex;
    flex-direction: column;
    .income-wrapper {
      margin-top: 10px;
      overflow-x: auto;
      text-wrap: nowrap;
      &::-webkit-scrollbar {
        display: none;
      }
      :global(> div) {
        display: inline-block;
        width: 50%;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
`;
