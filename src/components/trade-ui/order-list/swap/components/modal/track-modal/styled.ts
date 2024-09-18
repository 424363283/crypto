import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .content {
    padding-top: 20px;
  }
  .track-modal {
    .input-label {
      margin: 14px 0;

      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-3);
    }
    .trigger-price-info {
      border-radius: 6px;
      background: var(--theme-trade-sub-button-bg);
      padding: 8px;
      color: var(--theme-trade-text-color-3);
      margin-bottom: 10px;
      font-size: 12px;
    }
    .input {
      background-color: var(--theme-trade-modal-input-bg);
      height: 40px;
      padding-left: 12px;
      padding-right: 4px;
      margin-top: 10px;
      margin-bottom: 16px;
      border-radius: 6px;
      :global(input) {
        text-indent: 0;
        font-size: 16px;
      }
    }

    .info {
      border-radius: 6px;
      padding: 8px 18px;
      background: var(--theme-trade-sub-button-bg);
      font-size: 14px;
      color: var(--theme-trade-text-color-3);
      margin-bottom: 28px;
    }
    .checkbox {
      cursor: pointer;
      margin-right: 5px;
      width: 14px;
      height: 14px;
      border-radius: 5px;
      border: 1px solid var(--theme-trade-text-color-3);
      line-height: 0;
      * {
        height: inherit;
        width: inherit;
      }
      &.active {
        border: 0;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
