import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const MainContent = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className: string;
  title: string;
}) => {
  return (
    <div className={clsx('main-content-container', className)}>
      <p className='step-title'>- {title} -</p>
      <div className='middle-area'>{children}</div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .main-content-container {
    margin-top: 50px;
    width: 100%;
    @media ${MediaInfo.mobileOrTablet} {
      margin-top: 10px;
    }
    .step-title {
      @media ${MediaInfo.desktop} {
        text-align: center;
      }
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      @media ${MediaInfo.mobileOrTablet} {
        margin-bottom: 40px;
      }
    }
    .middle-area {
      font-size: 15px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
      @media ${MediaInfo.mobileOrTablet} {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 10px;
      }
      @media ${MediaInfo.desktop} {
        margin: 40px 270px;
      }
    }
  }
`;
