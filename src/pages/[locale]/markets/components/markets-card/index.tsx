// 顶部四个行情小卡片
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import TopOptions from '../markets-view/components/top-option';
import ChartCard from './chart-card';
import HotQuote from './hot-quote';

const MarketsCard = () => {
  return (
    <div className="charts-container">
      <DesktopOrTablet>
        <div className="chart-view">
          <ChartCard />
        </div>
      </DesktopOrTablet>
      <Mobile>
        <HotQuote />
      </Mobile>
      <TopOptions />
      <Mobile>
        <div className="line" />
      </Mobile>
      <style jsx>{styles}</style>
    </div>
  );
};

export { MarketsCard };

const styles = css`
  .charts-container {
    width: 100%;
    @media ${MediaInfo.desktop} {
      padding-top: 41px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      padding: 40px 20px 0;
    }
    @media ${MediaInfo.mobile} {
      padding: 0;
      position: sticky;
      top: 2.75rem;
      z-index: 999;
      background: var(--fill_1);
      :global(.option1-wrapper) {
        height: auto;
        margin: 0;
        margin-top: 8px;
        max-width: 400px;
        // overflow-x: scroll;
        padding: 8px 1.5rem;
      }
      :global(.option-left) {
        margin: 0;
        gap: 1.5rem;
      }
    }
    .chart-view {
      max-width: var(--const-max-page-width);
      margin: 0 auto;
      display: grid;
      @media ${MediaInfo.desktop} {
      }
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 16px;
      margin-bottom: 40px;
      @media ${MediaInfo.mobileOrTablet} {
        grid-template-columns: repeat(2, 1fr);
        margin-bottom: 70px;
      }
      @media ${MediaInfo.tablet} {
        min-height: 288px;
      }
      @media ${MediaInfo.mobile} {
        display: none;
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background: var(--fill_line_1);
    }
  }
`;
