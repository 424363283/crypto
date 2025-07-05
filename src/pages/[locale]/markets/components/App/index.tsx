/* 上方四个图表和下方表格组件的入口 */
import { SUBSCRIBE_TYPES } from '@/core/network';
import { useCallback, useEffect } from 'react';
import { store } from '../../store';
import { MarketsCard } from '../markets-card';
import MarketsView from '../markets-view';
import { MediaInfo } from '@/core/utils';
import { useRouter } from 'next/router';
import { CURRENT_TAB } from '@/pages/[locale]/index/components/markets/use-tab-config';

const App = () => {
  const router = useRouter();
  const { top } = router.query;
  const callback = useCallback(({ detail }: any) => {
    store.marketDetailList = detail;
  }, []);
  useEffect(() => {
    window.addEventListener(SUBSCRIBE_TYPES.ws3001, callback);
    return () => window.removeEventListener(SUBSCRIBE_TYPES.ws3001, callback);
  }, []);

  useEffect(() => {
    if (top) {
      store.currentId = top as CURRENT_TAB;
    }
  }, [top]);

  return (
    <div className="market-wrapper">
      <MarketsCard />
      <MarketsView />
      <style jsx>
        {`
          .market-wrapper {
            background-color: var(--fill_bg_1);
            margin: 0 auto;
            width: 100%;
            color: #1e2329;
            flex: 1 1;
            @media ${MediaInfo.mobile} {
              position: relative;
            }
          }
          @media ${MediaInfo.mobile} {
            :global(body) {
              overflow-x: hidden;
            }
          }
        `}
      </style>
    </div>
  );
};
export default App;
