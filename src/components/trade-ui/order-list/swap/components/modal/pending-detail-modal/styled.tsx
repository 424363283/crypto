import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .modal-content {
    width: 376px !important;
  }
  .content {
    padding: 0 0 15px;
    color: var(--theme-trade-text-color-1);

    .row {
      display: flex;
      flex-direction: column;
    }
    .section {
      padding-top: 8px;
      padding-left: 26px;
    }
    .info {
      margin-top: 11px;
      font-size: 12px;
      color: var(--theme-trade-text-color-3);
      display: flex;
      flex-direction: row;
      .icon {
        margin-top: 4px;
        margin-right: 5px;
      }
    }
  }
  .section {
    position: relative;
  }
  .section-line-first {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    > div {
      position: absolute;
      background: var(--theme-trade-sub-button-bg);
      &:nth-child(1) {
        top: 0;
        left: 10px;
        height: 100%;
        width: 5px;
      }
      &:nth-child(2) {
      }
    }
  }
  .section-line-last {
    position: absolute;
    left: 0;
    top: 0;
    > div {
      position: absolute;
      background: var(--theme-trade-sub-button-bg);
      &:nth-child(1) {
        top: 0;
        left: 10px;
        height: 53px;
        width: 5px;
      }
      &:nth-child(2) {
        top: 48px;
        left: 15px;
        height: 5px;
        width: 11px;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
