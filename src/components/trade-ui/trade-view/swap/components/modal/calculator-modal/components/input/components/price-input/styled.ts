import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .suffix {
    display: flex;
    flex-direction: row;
    > * {
      white-space: nowrap;
      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
    }
    .new {
      user-select: none;
      cursor: pointer;
      color: var(--theme-font-color-small-yellow);
      margin-right: 3px;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
