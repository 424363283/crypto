import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .calculator-modal {
    width: 720px !important;
    padding: 0 !important;
    .title {
      border-bottom: 1px solid var(--theme-trade-border-color-1);
      padding-top: 0;
      padding-left: 0;
      margin-right: 0;
      .calculator-close {
        right: 8px;
        top: 2px;
      }
      .menus {
        padding-left: 20px;

        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        > div {
          cursor: pointer;
          height: 52px;
          line-height: 54px;
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-trade-text-color-3);
          border-bottom: 1px solid transparent;
          margin-right: 37px;
          &.active {
            color: var(--theme-trade-text-color-1);
            border-bottom-color: var(--skin-primary-color);
          }
          &:last-child {
            margin-right: 0px;
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      min-height: 402px;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
