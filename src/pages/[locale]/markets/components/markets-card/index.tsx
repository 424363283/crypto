// 顶部四个行情小卡片
import { DesktopOrTablet } from '@/components/responsive';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import TopOptions from '../markets-view/components/top-option';
import ChartCard from './chart-card';

const MarketsCard = () => {
  return (
    <div className='charts-container'>
      <DesktopOrTablet>
        <div className='chart-view'>
          <ChartCard />
        </div>
      </DesktopOrTablet>
      <TopOptions />
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
    .chart-view {
      max-width: var(--const-max-page-width);
      margin: 0 auto;
      display: grid;
      @media ${MediaInfo.desktop} {
        height: 134px;
      }
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 20px;
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
  }
`;
