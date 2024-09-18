import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .trade-view-input {
    width: 100%;
    height: 35px;
    padding-left: 15px;
    padding-right: 8px;
    border-color: transparent;
    border-radius: 3px;
    background: var(--theme-trade-input-bg);
    .label {
      user-select: none;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-2);
    }
    :global(> input) {
      font-size: 12px;
      font-weight: 500;
      color: var(--theme-font-color-1) !important;
    }
    &.with-label {
      padding-left: 9px;
      padding-right: 9px;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
