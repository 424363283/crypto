import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve` 
  .open-contract-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    .open-contract-title {
      color: var(--text-primary);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 24px */
    }
    :global(.agreement) {
      padding: 0;
      :global(.submit) {
        height: 48px;
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
