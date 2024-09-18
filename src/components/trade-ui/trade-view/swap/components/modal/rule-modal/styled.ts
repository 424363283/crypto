import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .content {
    padding: 20px 0;
    .item {
      margin-bottom: 19px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      > * {
        &:first-child {
          line-height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-trade-text-color-3);
        }
        &:last-child {
          line-height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-trade-text-color-1);
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
      .info {
        cursor: pointer;
        border-bottom: 1px dashed var(--theme-trade-border-color-1);
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
