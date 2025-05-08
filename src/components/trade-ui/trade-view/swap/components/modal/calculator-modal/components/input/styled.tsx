import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .input {
    width: 100%;
    height: 40px;
    background: var(--fill_3);
    border-radius: 8px;
    border: none;
    padding: 0 10px;
    margin: 0 0 24px 0;
    .label {
      font-size: 12px;
      font-weight: 400;
      color: var(--text_2);
    }
    :global(input) {
      font-size: 12px;
      text-indent: 0;
      color: var(--text_1) !important;
      text-align: right;
      padding-right: 10px;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
