import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .liquidation-switch{
    display: flex;
    height: 40px;
    padding: 0px 16px;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    background: var(--fill-3);
    justify-content: center;
    width:120px;
    cursor:pointer;
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
