import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';

export type ResultItem = [string, string];

interface Props {
  results: ResultItem[];
  tips?: string;
}

const CalculatorResult = ({ results, tips }: Props) => {
  return (
    <>
      <div className='result'>
        <div className='result-content'>
          <div className='title'>{LANG('计算结果')}</div>
          {results.map(([label, value], index) => {
            return (
              <div className='row' key={index}>
                <div>{label}</div>
                <div>{value}</div>
              </div>
            );
          })}
        </div>
        {tips && <div className='tips'>{tips}</div>}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default CalculatorResult;
const styles = css`
  .result {
    flex: 1;
    padding: 20px;
    background: var(--theme-trade-tips-color);
    display: flex;
    flex-direction: column;
    .result-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .title {
        line-height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        margin-bottom: 34px;
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 17px;
        > div {
          font-size: 14px;
          line-height: 14px;
          font-weight: 400;
          color: var(--theme-font-color-2);
          &:nth-child(2) {
            color: var(--theme-font-color-1);
          }
        }
      }
    }
    .tips {
      font-size: 12px;
      font-weight: 400;
      color: #656e80;
    }
  }
`;
