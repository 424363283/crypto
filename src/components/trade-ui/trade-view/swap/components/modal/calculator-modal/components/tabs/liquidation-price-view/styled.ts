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
    margin-bottom: 14px;
    .balance-input {
      margin-bottom: 0;
    }
    .error {
      margin-top: 4px;
      line-height: 12px;
      font-size: 12px;
      color: var(--color-error);
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
