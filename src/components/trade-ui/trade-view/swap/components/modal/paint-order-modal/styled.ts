import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .content-className {
    width: 459px !important;
  }
  .paint-order-modal {
    padding-top: 21.5px;
    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
