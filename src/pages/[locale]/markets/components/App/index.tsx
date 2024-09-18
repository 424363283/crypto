/* 上方四个图表和下方表格组件的入口 */
import { SUBSCRIBE_TYPES } from '@/core/network';
import { useCallback, useEffect } from 'react';
import { store } from '../../store';
import { MarketsCard } from '../markets-card';
import MarketsView from '../markets-view';

const App = () => {
  const callback = useCallback(({ detail }: any) => {
    store.marketDetailList = detail;
  }, []);
  useEffect(() => {
    window.addEventListener(SUBSCRIBE_TYPES.ws3001, callback);
    return () => window.removeEventListener(SUBSCRIBE_TYPES.ws3001, callback);
  }, []);
  return (
    <div className='market-wrapper'>
      <MarketsCard />
      <MarketsView />
      <style jsx>
        {`
          .market-wrapper {
            background-color: var(--theme-secondary-bg-color);
            margin: 0 auto;
            width: 100%;
            color: #1e2329;
            flex: 1 1;
          }
        `}
      </style>
    </div>
  );
};
export default App;
