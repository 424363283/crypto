import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .record-view {
    min-height: 380px;
    :global(.code-text) {
      font-size: 14px;
      margin-bottom: 4px;
      color: var(--theme-trade-text-color-1);
    }
    .tab-bar {
      padding: 0 11px 0 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(var(--theme-trade-border-color-1-rgb), 0.5);
      .left-part {
        display: flex;
        flex-direction: row;
        height: 48px;
        .tab {
          user-select: none;
          cursor: pointer;
          position: relative;
          height: 100%;
          line-height: 48px;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          color: var(--theme-trade-text-color-3);
          margin-right: 25px;
        }
        .tab[data-active='true'] {
          color: var(--theme-trade-text-color-1);
          &::before {
            position: absolute;
            bottom: 0;
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            background: var(--skin-primary-color);
          }
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
