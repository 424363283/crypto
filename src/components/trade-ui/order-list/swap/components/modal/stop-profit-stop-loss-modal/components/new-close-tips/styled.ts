import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .close-tips{
    color: var(--text_2);
    text-align: justify;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 18px */
    :global(.text){
      color: var(--text_1);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
