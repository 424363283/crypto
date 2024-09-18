import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .content-className {
    width: auto !important;
    min-width: 150px;
    padding: 7.5px 6px;
  }
  .paint-order-options-modal {
    font-size: 12px;
    color: var(--theme-font-color-1);
    cursor: pointer;
    > :global(*) {
      padding: 7.5px 6px;
      white-space: nowrap;
    }
  }
  .content-root-className {
    :global(> .ant-modal-wrap) {
      position: absolute;
    }
    :global(> .ant-modal-mask) {
      position: absolute;
    }
    :global(.swap-common-modal) {
      position: absolute;
      top: 35%;
      left: unset;
      right: 10%;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
