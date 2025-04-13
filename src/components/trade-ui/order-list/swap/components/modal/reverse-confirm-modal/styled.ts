import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .content {
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 400;
    .title {
      display: flex;
      align-items: center;
      align-self: stretch;
      justify-content: space-between;
    }
    .order-info {
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 400;
    }
    .buy-sell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sell {
      color: var(--color-red);
    }
    .buy {
      color: var(--color-green);
    }
    .title-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;

      font-size: 14px;
      font-weight: 400;
      &-label {
        color: var(--text-secondary);
      }
      &-value {
        color: var(--text-primary);
      }
    }
    .card {
      border-radius: 16px;
      background: var(--fill-2);
      display: flex;
      padding: 16px;
      margin: 24px 0 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;

      border-left: 3px solid transparent;

      .header {
        display: flex;
        align-items: center;
        width: 100%;
        // :global(> div:first-child) {
        //   font-size: 14px;
        //   margin-right: 7px;
        // }
        // :global(> div:last-child) {
        //   border-radius: 5px;
        //   padding: 0 4px;
        //   height: 20px;
        //   line-height: 20px;
        //   text-align: center;
        // }
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 13px;
        width: 100%;
        flex-direction: column;
        &-item {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          &-label {
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 400;
          }

          &-value {
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 400;
          }
          &-position {
            color: var(--text-primary);
            font-size: 16px;
            font-weight: 400;
          }
          &-sell {
            color: var(--color-red);
            padding: 0 0 0 8px;
          }
          &-buy {
            color: var(--color-green);
            padding: 0 0 0 8px;
          }
        }

        .under-line {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      &.buy {
        position: relative;
        &:before {
          content: '';
          display: block;
          width: 4px;
          height: 76px;
          background: var(--green);
          position: absolute;
          left: -3px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      &.sell {
        position: relative;
        &:before {
          content: '';
          display: block;
          width: 4px;
          height: 76px;
          background: var(--red);
          position: absolute;
          left: -3px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .middle-item {
      margin: 5px 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 0 0;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: var(--line-3);
      }
      :global(> div) {
        padding: 0 15px;
        font-size: 14px;
        background: var(--common-modal-bg);
        height: 32px;
        border-radius: 5px;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        :global(> div:last-child) {
          margin-left: 5px;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
    .remind {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 24px 0 0;

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
      display: flex;
      align-items: center;
      color: var(--yellow);
      font-size: 12px;
      font-weight: 400;
      line-height: 150%;
      padding: 24px 0;
      border-bottom: 1px solid var(--line-3);

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
        color: var(--yellow);
        font-size: 12px;
        font-weight: 400;
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
  }
  .reverse-modal {
  }
  @media ${MediaInfo.mobile} {
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 1rem;
      max-height: 75dvh;
      overflow-y: auto;
      .info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .sell,
      .row-item-sell {
        color: var(--text-error);
      }
      .buy,
      .row-item-buy {
        color: var(--text-true);
      }
      .card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        align-self: stretch;
        margin: 0;
        padding: 1rem;
        border-radius: 1rem;
        background: var(--fill-3);
        &.buy,
        &.sell {
          &::before {
            display: none;
          }
        }
      }
      .middle-item {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .hint-expand {
        padding: 0;
        padding-bottom: 1rem;
        // border: 0;
      }
      .remind {
        padding: 0;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
