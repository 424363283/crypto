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
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    background: var(--fill-3);
    border-radius: 16px;
    flex: 1 0 0;
    .result-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;
      flex: 1 0 0;
      gap: 24px;
      .title {
        color: var(--text-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        align-self: stretch;
        > div {
          font-size: 14px;
          line-height: 14px;
          font-weight: 400;
          color: var(--text-secondary);
          &:nth-child(2) {
            color: var(--text-primary);
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
