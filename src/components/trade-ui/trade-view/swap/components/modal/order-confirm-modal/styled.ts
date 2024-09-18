import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .modal-content {
  }
  .content {
    padding-top: 20px;
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      &:last-child {
        margin-bottom: 0;
      }

      > :global(*):first-child {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-3);
        &.code {
          color: var(--theme-trade-text-color-1);
        }
      }
      > :global(*):last-child {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-1);
      }
    }
    .danger {
      color: var(--color-error);
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      padding: 9px 0;
    }
    .remind {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 22px;
      .checkbox {
        cursor: pointer;
        width: 15px;
        height: 15px;
        overflow: hidden;
        line-height: 0;
        &.active {
          border: 0;
        }
      }
      .text {
        margin-left: 5px;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-3);
      }
    }
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    padding-bottom: 25px;
    .cancel,
    .confirm {
      cursor: pointer;
      user-select: none;
      flex: 1;
      height: 40px;
      background: var(--theme-trade-sub-button-bg);
      border-radius: 5px;
      line-height: 40px;
      font-size: 12px;
      font-weight: 500;
      color: #737c90;
      text-align: center;
    }
    .confirm {
      color: #fff;
      &.raise {
        background: var(--color-green);
      }
      &.fall {
        background: var(--color-red);
      }
      &:nth-child(2) {
        margin-left: 10px;
      }
      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: var(--theme-trade-border-color-1);
    margin: 23px 0;
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
