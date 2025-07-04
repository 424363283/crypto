import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .picker-content {
    display: flex;
    background: var(--fill_3);
    border-radius: 5px;
    align-items: center;
    >.icon {
      margin-left: 8px;
    }
  }
  .picker {
    padding: 4px 16px;
    height: 40px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: unset;
    :global(.ant-picker-active-bar) {
      display: none;
    }
    :global(.ant-picker-input) {
      /* width: 104px; */
      width: 83px;
      height: 30px;
      line-height: 30px;
      font-weight: 500;
      border-radius: 5px;
      background: transparent;
      :global(input) {
        height: 30px;
        line-height: 25px;
        text-align: center;
        font-size: 12px;
        color: var(--theme-font-color-1) !important;
      }
    }
    :global(.ant-picker-range-separator) {
      width: 11px;
      padding: 0;
      height: 1px;
      background: var(--theme-font-color-3);
    }
    :global(.ant-picker-suffix) {
      display: none;
    }
  }

  .picker {
    :global(.ant-picker-range-separator) {
      color: var(--theme-font-color-3);
    }
  }
  .dropdown {
    :global(.ant-picker-date-panel)
      :global(.ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start)
      :global(.ant-picker-cell-inner::after) {
      display: none;
    }
    :global(.ant-picker-cell-range-hover-start),
    :global(.ant-picker-cell-range-hover-end) {
      background: transparent;
    }
    :global(.ant-picker-cell-range-hover-end .ant-picker-cell-inner::after),
    :global(.ant-picker-cell-range-hover-start .ant-picker-cell-inner::after) {
      display: none;
    }
  }

  .dropdown {
    :global(.ant-picker-range-wrapper) {
      border: 1px solid rgba(121, 130, 150, 0.1);
    }
    :gloabl(.ant-picker-range-arrow::before) {
      background: rgba(121, 130, 150, 0.1);
    }
    :global(.ant-picker-panel-container) {
      background: var(--fill_3);
    }
    :global(.ant-picker-cell) :global(.ant-picker-cell-inner),
    :global(.ant-picker-cell-in-view) :global(.ant-picker-cell-inner),
    :global(.ant-picker-content) :global(th),
    :global(.ant-picker-header-view) :global(button),
    :global(.ant-picker-header button) {
      color: var(--text_1);
    }
    :global(.ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single)::before),
    :global(.ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single)::before),
    :global(.ant-picker-cell-in-view.ant-picker-cell-in-range::before) {
      background: var(--brand_20);
    }
    :global(.ant-picker-cell-in-vie.ant-picker-cell-selected::before) {
      background: var(--theme-primary-color);
    }
    :global(.ant-picker-cell-disabled::before) {
      background: rgba(121, 130, 150, 0.1);
    }
    :global(.ant-picker-header-view) {
      color: var(--theme-font-color-1);
    }
    :global(.ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-disabled) .ant-picker-cell-inner) {
      background: var(--text_brand);
    }
    :global(.ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-disabled) .ant-picker-cell-inner) {
      color: var(--text_white);
      background: var(--text_brand);
    }
    :global(.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before) {
      border: 1px solid var(--brand);
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
