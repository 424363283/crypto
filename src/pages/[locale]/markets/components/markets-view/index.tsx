/*  除了上方四个图表以外的整个图表组件 */
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import css from 'styled-jsx/css';
import { CURRENT_VIEW, store } from './../../store';
import BottomOption from './components/bottom-option';
import MiddleOption from './components/middle-option';
import MarketTable from './table';
import { useCascadeOptions } from '../hooks';

const Feeds = dynamic(() => import('./link-feeds'), { ssr: false });
const ItbWidget = dynamic(() => import('./itb-widget'), { ssr: false });

const MainContent = () => {
  const { currentView } = store;

  if (currentView === CURRENT_VIEW.FEEDS) {
    return <Feeds />;
  }
  if (currentView === CURRENT_VIEW.ITB) {
    return <ItbWidget />;
  }
  return <MarketTable />;
};

const MarketsView = () => {
  const config = useCascadeOptions();
  return (
    <div className='market-container'>
      <div className='markets-view'>
        <div className='multi-options'>
          <MiddleOption />
          {config.thirdOptions?.length > 0 && (<>
            <div className='line'></div>
            <BottomOption />
          </>)}
        </div>
        <MainContent />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
export default memo(MarketsView);

const styles = css`
  .market-container {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    min-height: 100vh;
    @media ${MediaInfo.mobile} {
      margin-top: 0;
    }
    .multi-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      gap: 16px;
    }
    .line {
      width: 2px;
      height: 32px;
      background: var(--line-2);
    }
    .markets-view {
      height: 100%;
      max-width: var(--const-max-page-width);
      margin: 0 auto;
      .main-content {
        overflow-y: hidden;
      }
      @media ${MediaInfo.mobileOrTablet} {
        padding: 25px 20px;
        position: relative;
      }
    }
  }
`;
