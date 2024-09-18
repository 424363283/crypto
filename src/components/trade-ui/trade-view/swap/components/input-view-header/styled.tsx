import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .tool-bar {
  }
  .section-1 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .left {
      flex: 1;
      display: flex;
      flex-direction: row;
      .option {
        cursor: pointer;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: var(--theme-trade-text-color-2);
        margin-right: 10px;
        &.active {
          font-weight: 500;
          color: var(--skin-hover-font-color);
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .info {
      cursor: pointer;
      flex: none;
      display: flex;
      justify-content: center;
      align-items: center;
      > * {
        width: 16px;
        height: 16px;
      }
    }
  }
  .section-2 {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .calculator {
      cursor: pointer;
    }
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .label {
        line-height: 15px;
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-2);
      }
      .text {
        margin: 0 3px;
        line-height: 15px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        color: var(--theme-trade-text-color-1);
      }
      .transfer {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
