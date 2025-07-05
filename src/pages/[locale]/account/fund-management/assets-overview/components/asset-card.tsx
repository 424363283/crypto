import { MediaInfo, clsx } from '@/core/utils';
import { memo } from 'react';
import css from 'styled-jsx/css';

/* eslint-disable react/display-name */
const HeaderAssetCard = memo(
  (props: { className?: string; children?: JSX.Element | React.ReactNode; height?: string | number }) => {
    const { children, className } = props;
    return (
      <>
        <div className={clsx('assets-overview-card', className)}>{children}</div>
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
    padding: 24px;
    display: flex ;
    flex-direction: column;
    @media ${MediaInfo.desktop} {
      overflow-x: auto;
      overflow-y: hidden;
      background-color: var(--fill_bg_1);
    }
    
    @media ${MediaInfo.mobileOrTablet} {
      // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
      margin:auto;
      background-color: var(--fill_bg_1);
      padding: 16px;
      width: calc( 100% - 24px );
    }
  }
`;
