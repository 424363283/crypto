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
  }
  .share {
    cursor: pointer;
  }

  .multi-line-item {
    display: flex;
    align-items: center;
    & > div {
      margin-right: 6px;
      div {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
