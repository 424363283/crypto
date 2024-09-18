import Nav from '@/components/nav';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

export const TopCommonCard = ({ children, title }: { children: JSX.Element[]; title: string }) => {
  return (
    <div className='top-common-card'>
      <div className='main-content'>
        <Nav title={title} />
        {children}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .top-common-card {
    background-color: var(--theme-secondary-bg-color);
    width: 100%;
    padding: 24px 0;
    .main-content {
      max-width: 1224px;
      margin: 0 auto;
      @media ${MediaInfo.tablet} {
        padding: 0 20px;
      }
      @media ${MediaInfo.mobile} {
        padding: 0 10px;
      }
      :global(.bottom-card) {
        display: flex;
        align-items: center;
        :global(.select-coin-wrapper) {
          flex: 1;
          width: 100%;
        }
        :global(.top-info-card) {
          flex: 1;
          @media ${MediaInfo.mobileOrTablet} {
            margin-left: 0;
            max-width: 100%;
            :global(.card) {
              :global(.name) {
                font-size: 12px;
              }
              :global(.num) {
                font-size: 14px;
              }
              &:last-child {
                text-align: right;
              }
            }
          }
        }
        @media ${MediaInfo.mobileOrTablet} {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }
  }
`;
