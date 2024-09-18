import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .controller {
    width: auto !important;
  }
  .btn-control {
    cursor: pointer;
    border: 0 !important;
    flex: 1;
    width: 43px;
    height: 100%;
    border-radius: 2px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .svg {
      width: inherit;
      height: inherit;
      font-size: 0;
      display: flex;
      justify-content: center;
      flex-direction: column;
      fill: var(--theme-trade-text-color-3);
      > div {
        align-self: center;
        display: flex;
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
