import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { AssetsCard } from './assets-card';
import BottomLoginLog from './login-record-card';

export const OverviewCard = () => {
  return (
    <div className='overview-card'>
      <AssetsCard />
      <BottomLoginLog />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .overview-card {
    display: flex;
    flex-direction: column;
    padding: 25px 20px;
    min-height: calc(100vh - 256px);
    @media ${MediaInfo.mobile} {
      padding: 18px 10px;
      border-radius: 15px;
    }
    @media ${MediaInfo.tablet} {
      border-radius: 15px;
    }
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: var(--theme-background-color-2);
  }
`;
