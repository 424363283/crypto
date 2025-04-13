import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .select-row {
    display: flex;
    flex-direction: row;
    > :global(*) {
      flex: 1;
      &:nth-child(1) {
        margin-right: 4.5px;
      }
      &:nth-child(2) {
        margin-left: 4.5px;
      }
    }
  }

  .balance-input-wrapper {
    margin-bottom: 24px;
    .balance-input {
      margin-bottom: 0;
    }
    .error {
      margin-top: 8px;
      line-height: 12px;
      font-size: 12px;
      color: var(--text-error);
    }
  }
  .input-item {
    >.label {
      color: var(--text-tertiary);
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
