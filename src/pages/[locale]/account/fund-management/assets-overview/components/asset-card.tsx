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
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 15px;
    width: 100%;
    height: 100%;
    z-index: 11;
    position: relative;
    @media ${MediaInfo.desktop} {
      margin-right: 20px;
      overflow-x: auto;
      background-color: var(--theme-background-color-2);
    }
    @media ${MediaInfo.tablet} {
      background-color: var(--theme-background-color-2);
    }
  }
`;
