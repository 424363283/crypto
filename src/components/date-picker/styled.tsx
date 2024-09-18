import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .my-date-picker {
    :global(.ant-picker-panel-container) {
      background: var(--theme-trade-modal-color);
      color: var(--theme-font-color-1);
    }

    :global(.ant-picker-header button),
    :global(.ant-picker-cell) {
      color: var(--theme-font-color-2);
    }
    :global(.ant-picker-content th),
    :global(.ant-picker-cell-in-view),
    :global(.ant-picker-header),
    :global(.ant-picker-time-panel-column > li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner),
    :global(.ant-picker-header),
    :global(.ant-picker-header-view button) {
      color: var(--theme-font-color-1);
    }

    :global(.ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner) {
      background: var(--theme-trade-bg-color-3);
    }
    :global(.ant-btn-primary),
    :global(.ant-btn-primary:hover) {
      color: var(--skin-font-color);
    }
    :global(.ant-picker-now-btn) {
      color: var(--skin-hover-font-color);
    }
    :global(.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner),
    :global(.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner),
    :global(.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner) {
      color: var(--skin-font-color);
    }
    :global(.ant-picker-cell-disabled::before) {
      background: var(--theme-trade-bg-color-3);
    }
    :global(.ant-btn-primary:disabled),
    :global(.ant-btn-primary.ant-btn-disabled) {
      color: var(--theme-font-color-2);
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
