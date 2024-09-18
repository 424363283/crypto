import css from 'styled-jsx/css';

const CommonContainer = (props: { children?: JSX.Element | React.ReactNode }) => {
  const { children } = props;
  return (
    <div className='order-history-common-container'>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};
export default CommonContainer;

const styles = css`
  .order-history-common-container {
    position: relative;
    background-color: var(--theme-background-color-2);
    height: calc(100vh - 82px);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }
`;
