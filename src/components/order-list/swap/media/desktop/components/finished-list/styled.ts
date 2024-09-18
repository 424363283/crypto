import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .code {
    display: flex;
    flex-direction: row;
    align-items: center;
    .code-text {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .cancel-row {
    opacity: 0.6;
  }

  .code {
    display: flex;
    align-items: center;
  }

  td {
    div {
      white-space: nowrap;
    }
  }
  .finished-list {
    th,
    td {
      &:nth-last-child(1),
      &:nth-last-child(2) {
        text-align: right !important;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
