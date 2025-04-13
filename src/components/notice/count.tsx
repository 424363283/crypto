import css from 'styled-jsx/css';

interface Props {
  count: number;
}

const Count = ({ count }: Props) => {
  const stopPropagation = (e: any) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
  };
  return (
    <div className='container' onClick={stopPropagation}>
      {count}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .container {
    display: inline-block;
    background-color: var(--skin-primary-color);
    border-radius: 6px;
    min-width: 48px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: var(--skin-font-color);
  }
`;
export default Count;
