import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .modify-margin-modal {
    .input-label {
      margin: 22px 0 12px;
      font-size: 12px;
      color: var(--theme-trade-text-color-1);
    }
    .input {
      margin-bottom: 22px;
      height: 46px;
      border-radius: 5px;
      padding: 0 15px;
      background-color: var(--theme-trade-modal-input-bg);
      :global(input) {
        text-indent: 0;
        padding: 0;
        font-size: 12px;
        color: var(--theme-trade-text-color-1);
      }
      .suffix {
        font-size: 12px;

        color: var(--theme-trade-text-color-1);
        .max {
          cursor: pointer;
          color: var(--skin-primary-color);
        }
      }
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        font-size: 12px;
        color: var(--theme-trade-text-color-3);
      }
      .value {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-1);
      }
    }
    .auto-margin {
      margin-top: 24px;
      padding-top: 17px;
      color: var(--theme-trade-text-color-1);
      font-size: 12px;
      border-top: 1px solid var(--theme-trade-border-color-2);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .bottom-span {
      height: 37px;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
