import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .liquidation-modal {
    padding-top: 20px;
    .input-label {
      margin-bottom: 12px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-trade-text-color-3);
    }
    .input {
      background-color: var(--theme-trade-modal-input-bg);
      padding: 0 12px;
      padding-right: 4px;
      border-radius: 6px;
      height: 40px;
      :global(input) {
        font-size: 16px;
        text-indent: 0;
      }

      &.error {
        border-color: var(--const-color-error);
      }
    }
    .rates {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 30px;
      margin: 20px 0 17px;
      > div {
        flex: 1;
        margin-right: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &:last-child {
          margin-right: 0;
        }
        ::before {
          content: '';
          display: block;
          cursor: pointer;
          text-align: center;
          height: 12px;
          border-radius: 4px;
          width: 100%;
          background: var(--theme-trade-modal-input-bg);
          margin-bottom: 4px;
        }
        &.active {
          ::before {
            background: var(--skin-primary-color);
          }
        }
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-3);
      }
    }
    .error-text {
      font-size: 12px;
      color: var(--const-color-error);
    }
    .income {
      border-top: 1px solid var(--theme-trade-border-color-2);
      padding-top: 7px;
      margin: 0 0 23px;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-trade-text-color-1);
    }
    .price-line {
      width: 100%;
      margin: 21px 0 12px;
      border-top: 1px solid var(--theme-trade-border-color-2);
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
