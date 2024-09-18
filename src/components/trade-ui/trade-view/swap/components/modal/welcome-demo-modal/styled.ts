import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .welcome-demo-content,
  .welcome-demo-mobile-content {
    background: var(--skin-primary-color) !important;
    overflow-y: hidden;
  }
  .welcome-demo-mobile-modal {
    background: var(--skin-primary-color) !important;
    padding-bottom: 0;
  }
  .welcome-demo-modal-content {
    overflow-y: hidden !important;
    display: flex;
    flex-direction: column;
  }
  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .tips {
      font-size: 20px;
      font-weight: 500px;
      margin: -35px 0 15px;
    }
    .button {
      height: 40px;
      width: 340px;
      font-size: 16px;
      border-radius: 6px;
      background: #141717;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-bottom: 27px;
      cursor: pointer;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
