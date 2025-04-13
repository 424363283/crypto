import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .dropdown-select-overlay {
    z-index: 100001;
  }
  .menus {
    min-width: 59px;
    max-height: 300px;
    overflow-y: scroll;
    .menu {
      width: 100%;
      height: 28px;
      cursor: pointer;
      text-align: left;
      line-height: 28px;
      font-size: 14px;
      font-weight: 400;
      color: var(--text-primary);
      margin-bottom: 1px;
      padding: 0 16px;
      &:last-child {
        margin-bottom: 0;
      }
      &.active {
        font-weight: 500;
      }
    }
  }

  .content {
    cursor: pointer;
    width: 100%;
    height: 40px;
    line-height: 28px;
    background: var(--fill-3);
    border-radius: 8px;
    text-align: left;
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span {
      position: relative;
      color: var(--theme-trade-text-color-1);
      font-size: 14px;
      font-weight: 500;
      &.no-arrow {
        &::before {
          display: none;
        }
      }
    }
    .arrow {
      margin-top: 8px;
      content: '';
      display: block;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
