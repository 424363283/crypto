import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .result-layout {
    padding: 0;
    width: 325px;
    flex: none;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    > *:first-child {
      flex: 1;
      margin-right: 24px;
    }
    > *:nth-child(2) {
      width: 316px;
    }
    .content {
      display: flex;
      flex-direction: column;
      > *:first-child {
        flex: 1;
        width: 100%;
      }
      .confirm {
        font-size: 16px;
        font-weight: 500;
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
    padding: 24px;
    background: var(--fill-3);
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    .result-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 24px;
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-primary);
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > div {
          font-size: 14px;
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
      color: var(--text-tertiary);
    }
  }
  @media ${MediaInfo.mobile} {
    .result-layout {
      flex-direction: column;
      padding: 0 0.5rem;
      padding-bottom: 0.5rem;
      width: auto;
      max-height: 75dvh;
      overflow-y: auto;
      > *:first-child {
        flex: none;
        margin: 0;
      }
      > *:nth-child(2) {
        width: auto;
      }
      :global(.quote-select) {
        margin-bottom: 1rem;
        width: auto;
      }
      :global(.wrapper) {
        margin: 1rem 0;
        padding: 0;
        gap: 0;
        height: auto;
      }
      :global(.input-item) {
        margin-bottom: 1rem;
      }
      :global(.input-item > .label) {
        margin-bottom: 8px !important;
      }
      :global(.input) {
        width: auto;
        margin: 0;
        :global(input) {
          text-align: left;
        }
      }
      :global(.suffix) {
        &::before {
          display: none;
        }
      }
    }
    .result {
      margin-top: 0.5rem;
      padding: 1rem;
      .tips {
        margin-top: 1rem;
      }
    }
    .confirm {
      margin-top: 1.5rem;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
