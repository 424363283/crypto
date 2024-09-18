import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .funds-list {
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
