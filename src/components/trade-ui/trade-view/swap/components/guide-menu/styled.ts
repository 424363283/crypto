import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .menus {
    min-width: 130px;
    max-height: unset;
    .menu {
      user-select: none;
      height: 35px;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      text-align: left;
      line-height: 14px;
      font-size: 14px;
      font-weight: 500;
      padding: 7px 15px 7px 18px;
      color: var(--theme-trade-text-color-1);
      margin-bottom: 5px;
      white-space: nowrap;
      img {
        width: 12px;
        height: 12px;
        margin-right: 8px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &.active {
        color: var(--skin-primary-color) !important;
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
