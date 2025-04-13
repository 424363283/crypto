import { MediaInfo, clsx } from '@/core/utils';
import { memo } from 'react';
import css from 'styled-jsx/css';

/* eslint-disable react/display-name */
const HeaderAssetCard = memo(
  (props: { className?: string; children?: JSX.Element | React.ReactNode; height?: string | number }) => {
    const { children, className } = props;
    return (
      <>
        <div className={clsx('assets-overview-card border-1', className)}>{children}</div>
        <style jsx>{styles}</style>
      </>
    );
  }
);

export default HeaderAssetCard;
const styles = css`
  .assets-overview-card {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    z-index: 11;
    position: relative;
    padding: 16px 24px;
    display: flex ;
    flex-direction: column;
    @media ${MediaInfo.desktop} {
      margin-right: 8px;
      overflow-x: auto;
      overflow-y: hidden;
      background-color: var(--bg-1);
    }
    
    @media ${MediaInfo.mobileOrTablet} {
      // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
      margin:auto;
      background-color: var(--bg-1);
      padding: 12px;
      width: calc( 100% - 24px );
    }
  }
`;
