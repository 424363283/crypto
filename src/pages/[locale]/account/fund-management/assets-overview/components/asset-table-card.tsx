import { MediaInfo } from '@/core/utils';
import clsx from 'clsx';
import css from 'styled-jsx/css';

const AssetTableCard = (props: { children?: JSX.Element | React.ReactNode; border?: boolean; rounded?: boolean }) => {
  const { children, border = true, rounded = true } = props;
  return (
    <>
      <div className={clsx('asset-table-card', border && 'border-1', rounded && 'rounded-1')}>{children}</div>
      <style jsx>{styles}</style>
    </>
  );
};

export default AssetTableCard;
const styles = css`
  .asset-table-card {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 100%;
    position: relative;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: var(--fill_bg_1);
    :global(.bottom-pagination) {
      padding: 15px 10px;
    }
    @media ${MediaInfo.mobile} {
      :global(.ant-pagination-item:hover),
      :global(.ant-pagination-item:focus),
      :global(.ant-pagination-item-active) {
        background: var(--brand);
        color: var(--text-white);
        font-weight: 500;
      }
    }
  }
`;
