import css from 'styled-jsx/css';

interface DescriptionProps {
  title: string;
  contents: string[];
}

export const Description: React.FC<DescriptionProps> = ({ title, contents }) => {
  return (
    <>
      <div className='description'>
        <div className='title'>{title}</div>
        <div className='recharge-content'>
          {contents?.map((row, index) => (
            <div key={index} className='row'>
              {row}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .description {
    .title {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    :global(.recharge-content) {
      width: 100%;
      border-radius: 6px;
      padding: 15px 0px;
      flex-direction: column;
      align-items: flex-start;
      :global(.row) {
        position: relative;
        padding-left: 18px;
        margin-bottom: 16px;
        font-size: 14px;
        color: var(--theme-font-color-3);
        line-height: 18px;
        &:last-child {
          margin-bottom: 0;
        }
        &::before {
          left: 0;
          top: 6px;
          position: absolute;
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          background: var(--theme-font-color-3);
          border-radius: 50%;
        }
      }
    }
  }
`;
export default Description;
