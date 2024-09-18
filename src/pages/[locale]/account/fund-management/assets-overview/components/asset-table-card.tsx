import css from 'styled-jsx/css';

const AssetTableCard = (props: { children?: JSX.Element | React.ReactNode }) => {
  const { children } = props;
  return (
    <>
      <div className='asset-table-card'>{children}</div>
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
    background-color: var(--theme-background-color-2);
    :global(.bottom-pagination) {
      padding: 15px 10px;
    }
  }
`;
