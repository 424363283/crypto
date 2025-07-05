import { useMemo } from 'react';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { useResponsive } from '@/core/hooks';

export type ResultItem = [string, string];

interface Props {
  results: ResultItem[];
  tips?: string;
}

const CalculatorResult = ({ results, tips }: Props) => {
  const { isMobile } = useResponsive();
  const data = useMemo(
    () =>
      results.map(([label, value], index) => {
        return (
          <div className="row" key={index}>
            <div>{label}</div>
            <div>{value}</div>
          </div>
        );
      }),
    [results]
  );
  return (
    <>
      <div className="result">
        <div className="result-content">
          <div className="title">{LANG('计算结果')}</div>
          {isMobile ? <div className="content">{data}</div> : data}
        </div>
        {tips && <div className="tips">{tips}</div>}
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
    background: var(--fill_1);
    border-radius: 16px;
    flex: 1 0 0;
    @media ${MediaInfo.mobile} {
      margin-top: 1rem;
      padding: 0;
      padding-top: 1rem;
      border-top: 1px solid var(--fill_line_1);
      border-radius: 0;
      background: none;
    }
    .result-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;
      flex: 1 0 0;
      gap: 24px;
      @media ${MediaInfo.mobile} {
        gap: 1rem;
        :global(.content) {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: -webkit-fill-available;
          border-radius: 8px;
          padding: 12px;
          background: var(--fill_1);
          gap: 1rem;
        }
        :global(.row) {
          display: flex;
          justify-content: space-between;
          width: -webkit-fill-available;
          :global(div) {
            color: var(--text_2);
          }
          :global(div:last-child) {
            color: var(--text_1);
          }
        }
      }
      .title {
        color: var(--text_1);
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
          color: var(--text_2);
          &:nth-child(2) {
            color: var(--text_1);
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
