import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .result-layout {
    padding: 18px 0 32px;
    width: 325px;
    flex: none;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    > *:first-child {
      width: 315px;
      flex: 1;
      margin-right: 20px;
    }
    > *:nth-child(2) {
      flex: 1;
    }
    .content {
      display: flex;
      flex-direction: column;
      > *:first-child {
        flex: 1;
        width: 100%;
      }
      .submit {
        cursor: not-allowed;
        width: 100%;
        height: 40px;
        border-radius: 6px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        /* color: var(--theme-trade-text-color-2); */
        background: var(--theme-primary-color);
        color: var(--theme-trade-light-text-1);
        opacity: 0.5;
        &.active {
          cursor: pointer;
          opacity: 1;
        }
      }
    }
  }
  .result {
    padding: 20px;
    background: var(--theme-trade-bg-color-8);
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    .result-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .title {
        line-height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: var(--theme-trade-text-color-1);
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
          color: var(--theme-trade-text-color-2);
          &:nth-child(2) {
            color: var(--theme-trade-text-color-1);
          }
        }
      }
    }
    .tips {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-3);
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
