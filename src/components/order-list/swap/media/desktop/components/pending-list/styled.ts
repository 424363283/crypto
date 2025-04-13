import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .pending-list {
    .code {
      display: flex;
      flex-direction: row;
      align-items: center;
      .nowrap {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .code-text {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    .row-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .cancel {
      cursor: pointer;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 16px;
    }

    .code {
      display: flex;
      align-items: center;
    }

    .view-spsl {
      color: var(--skin-primary-color);
      cursor: pointer;
    }
    .nowrap {
      white-space: nowrap;
    }

    .inline-block {
      display: inline-block;
    }
  }

  .main-color {
    color: var(--skin-primary-color);
  }

  .light {
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
