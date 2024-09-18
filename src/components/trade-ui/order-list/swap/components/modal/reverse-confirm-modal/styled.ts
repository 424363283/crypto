import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .content {
    padding-top: 10px;
    font-size: 12px;
    color: var(--theme-trade-text-color-1);
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 9px;
      :global(> div) {
        margin-right: 5px;
      }
      .buy-sell {
        border-radius: 5px;
        padding: 0 4px;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
    }
    .title-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--theme-trade-text-color-3);
      margin-bottom: 17px;
    }
    .card {
      padding: 13px 14px;
      border-radius: 5px;
      background: var(--theme-trade-bg-color-8);
      overflow: hidden;
      border-left: 3px solid transparent;

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 13px;
        :global(> div:first-child) {
          font-size: 14px;
          margin-right: 7px;
        }
        :global(> div:last-child) {
          border-radius: 5px;
          padding: 0 4px;
          height: 20px;
          line-height: 20px;
          text-align: center;
        }
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 13px;
        &:last-child {
          margin-bottom: 0;
        }

        :global(> div) {
          flex: 1;
          :global(> div:first-child) {
            color: var(--theme-trade-text-color-3);
          }
          :global(> div:last-child) {
            font-size: 14px;
            font-weight: 500;
          }
        }
        .under-line {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      &.buy {
        border-left-color: var(--color-green);
      }
      &.sell {
        border-left-color: var(--color-red);
      }
    }
    .middle-item {
      margin: 5px 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: var(--theme-trade-border-color-1);
      }
      :global(> div) {
        padding: 0 15px;
        font-size: 14px;
        background: var(--theme-trade-bg-color-8);
        height: 32px;
        border-radius: 5px;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        :global(> div:last-child) {
          margin-left: 5px;
        }
      }
    }
    .remind {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 22px;

      .checkbox {
        cursor: pointer;
        width: 16px;
        height: 16px;
        border-radius: 5px;
        border: 1px solid var(--theme-trade-text-color-3);

        line-height: 0;
        &.active {
          border: 0;
        }
      }
      .text {
        cursor: pointer;
        margin-left: 5px;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
      }
    }
    .hint-expand {
      margin: 13px 0 20px;
      display: flex;
      align-items: center;
      &.expand {
        display: block;
        :global(> div) {
          display: inline;
        }

        :global(> div:nth-child(2)) {
          flex: none;
          white-space: unset;
          text-overflow: unset;
          overflow: unset;
        }
      }
      :global(> div:nth-child(1)) {
        margin-right: 2px;
      }
      :global(> div:nth-child(2)) {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--theme-trade-text-color-3);
      }
      :global(> div:nth-child(3)) {
        cursor: pointer;
        color: var(--skin-main-font-color);
      }
    }

    .buy-text {
      color: var(--color-green);
    }
    .sell-text {
      color: var(--color-red);
    }
    .buy-bg {
      background: rgba(var(--color-green-rgb), 0.15);
    }
    .sell-bg {
      background: rgba(var(--color-red-rgb), 0.15);
    }
  }
  .reverse-modal {
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
