import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .effective-time-modal {
    padding-top: 16.5px;
    padding-bottom: 28px;
    .item {
      cursor: pointer;
      margin-bottom: 12px;
      border-radius: 6px;
      width: 100%;
      padding: 16px;
      background-color: var(--theme-trade-sub-button-bg);
      .title-wrapper {
        display: flex;

        .title {
          flex: 1;
          margin-right: 10px;
          font-size: 14px;
          color: var(--theme-trade-text-color-1);
        }
      }
      .tips {
        margin-top: 8px;
        font-size: 12px;
        color: var(--theme-trade-text-color-3);
      }
      &.active {
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
