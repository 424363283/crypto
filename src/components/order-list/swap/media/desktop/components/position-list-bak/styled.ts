import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .position-list {
    .code-col {
      position: relative;
      .code {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        .lever-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          cursor: pointer;
          > :last-child {
            margin-left: 3px;
          }
        }
        .nowrap,
        .nowrap > div {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .margin-type {
          margin-left: 4px;
          font-size: 12px;
          color: var(--theme-trade-text-color-3);
        }
        .wallet {
          margin-left: 3px;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          white-space: nowrap;
          /* flex-wrap: wrap; */
          &:hover {
            color: var(--skin-main-font-color);
          }
          .text {
            margin-left: 3px;
            &.active {
              color: var(--skin-main-font-color);
            }
          }
          > :last-child {
            margin-left: 3px;
          }
        }
        .code-text {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
        }
        &:before {
          position: absolute;
          display: block;
          content: '';
          width: 4px;
          height: 36px;
          top: 50%;
          left: 1px;
          margin-top: -21px;
          background: transparent;
          border-top: 2.4px solid transparent;
          border-bottom: 2.4px solid transparent;
          border-right: 2.4px solid transparent;
          border-left: 4px solid transparent;
        }
        &.buy:before {
          border-left-color: var(--color-green);
        }
        &.sell:before {
          border-left-color: var(--color-red);
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }

    .liquidation-price {
      color: var(--skin-primary-color);
    }
    .button-actions {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      &.flex-end {
        justify-content: flex-end;
      }
      :global(.sub-button) {
        flex: none;
        cursor: pointer;
        text-align: center;
        margin-right: 13px;
        min-width: 57px;
        height: 26px;
        line-height: 24px;
        padding: 0 8px;
        border: 1px solid var(--theme-trade-border-color-1);
        background: transparent;
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-2);
        margin-bottom: 3px;
        &:hover {
          color: var(--skin-primary-color);
          border-color: var(--skin-primary-color);
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .margin-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      &.pointer {
        cursor: pointer;
      }
    }
    .set-spsl {
      display: flex;
      flex-direction: row;

      align-items: center;
      flex-wrap: nowrap;
      .text {
        margin-right: 5px;
      }
    }
    .multi-line-item {
      display: flex;
      align-items: center;
      & > div {
        margin-right: 6px;
        div {
          font-size: 12px;
          font-weight: 400;
        }
      }
    }
    .follow-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
    }
    .flex-inline {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .share {
      cursor: pointer;
    }
    .current-position,
    .current-position :global(div) {
      white-space: pre-wrap;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
