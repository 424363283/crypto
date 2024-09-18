import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .input-section {
    margin-bottom: 20px;
    &.no-tips {
      margin-bottom: 0px;
    }
    .wrapper {
      display: flex;
      flex-direction: row;
      &.disabled-input {
        .input {
          background-color: var(--theme-trade-market-color);
          :global(input::placeholder) {
            color: var(--theme-trade-text-color-3) !important;
          }
          :global(input::-webkit-input-placeholder) {
            color: var(--theme-trade-text-color-3) !important;
          }
        }
      }
      &.disabled {
        .type-select {
          opacity: 0.5;
        }
        .input,
        :global(input) {
          cursor: not-allowed;
        }
        .input {
          opacity: 0.5;
        }
      }

      .type-select {
        background: var(--theme-trade-modal-input-bg);
        height: 40px;
        border-radius: 3px;
      }

      .label {
        width: 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-1);

        :global(> div) {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          padding-bottom: 8px;
          align-items: center;
        }
        > :global(*):first-child {
          margin-right: 5px;
        }
        :global(.checkbox) {
          margin-top: -1px;
          margin-right: 10px;
          &.active {
            border: none;
          }
        }
        .arrow {
          padding-left: 5px;
        }
        .icon {
          width: 20px;
          display: flex;
          justify-content: flex-end;
        }
      }
      .cancel {
        color: var(--theme-trade-text-color-2);
        font-size: 12px;
        font-weight: 400;
        padding-bottom: 8px;
        &.active {
          color: var(--skin-main-font-color);
          cursor: pointer;
        }
      }
      .input-row {
        width: 100%;
        display: flex;

        :global(> *:first-child) {
          flex: 1;
        }
        :global(> *:last-child) {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 124px;
        }
        :global(.input) {
          margin-top: 0;
          height: 40px;
          background: var(--theme-trade-modal-input-bg);
          border-radius: 5px;
          margin-bottom: 15px;
          flex: none;

          :global(input) {
            text-indent: 0;
          }
          :global(.suffix) {
            font-size: 14px;
            font-weight: 500;
            color: var(--theme-trade-text-color-3);
          }
        }
      }
      .select-wrapper {
        margin-left: 9px;
      }

      .select-labels {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        :global(> *) {
          white-space: nowrap;
          padding-bottom: 8px;
        }
      }
      .type-select {
        display: block;
        cursor: pointer;
        position: relative;
        white-space: nowrap;
        width: auto;
        min-width: 124px;
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-trade-text-color-1);
        line-height: 38px;
        padding-left: 16px;
        padding-right: 34px;
        &.disabled {
          cursor: not-allowed;
        }
        .arrow {
          position: absolute;
          top: 13px;
          right: 10px;
        }
      }
    }
    .tips {
      width: 100%;
      border-radius: 3px;
      font-size: 12px;
      line-height: 18px;
      color: var(--theme-trade-text-color-3);
      :global(.text) {
        color: var(--theme-trade-text-color-1);
      }
    }
  }
  .type-select-menus {
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    top: 100%;
    right: 0;
    padding: 3px 0;
    min-width: 69px;
    .menu {
      cursor: pointer;
      padding: 2px 16px;
      font-size: 12px;
      font-weight: 500;
      color: var(--theme-trade-text-color-1);
      &.active {
        color: var(--skin-primary-color);
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
