import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .wrapper {
    height: 51px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
