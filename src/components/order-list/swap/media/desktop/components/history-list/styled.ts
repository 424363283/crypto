import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .code {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .cancel-row {
    opacity: 0.6;
  }

  .code {
    display: flex;
    align-items: center;
    .code-text {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  td {
    div {
      white-space: nowrap;
    }
  }
  .history-list {
    :global(th),
    :global(td) {
      &:nth-last-child(1) {
        text-align: right !important;
      }
    }
    .order-type-select-wrapper {
      padding: 16px 24px;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
