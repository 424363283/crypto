import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .close-tips{
    color: var(--text-secondary);
    text-align: justify;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 18px */
    :global(.text){
      color: var(--text-primary);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
