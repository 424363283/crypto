import AssetsView from '@/components/affiliate/assets-view';
import Income, { INCOME_TYPE } from '@/components/affiliate/income';
import ShareCard from '@/components/affiliate/share-card';
import { AffiliateDesktopLayout } from '@/components/layouts/media/affiliate/desktop';
import { Loading } from '@/components/loading';
import { Summary } from '@/core/shared';
import { useAppContext } from '@/core/store';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
const BarGraph = dynamic(() => import('@/components/affiliate/bar-graph'), {
  ssr: false,
  loading: () => <Loading.wrap isLoading />,
});
const TableDetail = dynamic(() => import('@/components/affiliate/table-detail'), {
  ssr: false,
  loading: () => <Loading.wrap />,
});
export const DesktopDashboard = () => {
  const { todayIncome, yesterdayIncome, totalIncome } = Summary.state;
  const { locale } = useAppContext();

  useEffect(() => {
    Summary.init();
  }, []);

  return (
    <AffiliateDesktopLayout>
      <div className='container'>
        <div className='left'>
          <div className='income-wrapper'>
            <Income type={INCOME_TYPE.TODAY} value={todayIncome} />
            <Income type={INCOME_TYPE.TOTAL} value={totalIncome} />
            <Income type={INCOME_TYPE.YESTERDAY} value={yesterdayIncome} />
          </div>
          <BarGraph />
          <TableDetail />
        </div>
        <div className={`right ${locale === 'ru' ? 'ru' : ''}`}>
          <ShareCard />
          <AssetsView />
        </div>
      </div>
      <style jsx>{styles}</style>
    </AffiliateDesktopLayout>
  );
};

const styles = css`
  .container {
    padding: 0 20px 20px 0;
    display: flex;
    .left {
      flex: 1;
      margin-right: 20px;
      .income-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        :global(.container:nth-child(2)) {
          margin: 0 20px;
        }
      }
    }
    .right {
      width: 285px;
      &.ru {
        width: 320px;
      }
    }
  }
`;
