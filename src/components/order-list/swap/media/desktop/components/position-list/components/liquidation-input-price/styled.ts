import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .custom-popover {
    .ant-popover-inner {
      background: #f00;
    }
    :global(.ant-popover-arrow) {
      display: none;
    }
    :global(.ant-popover-inner) {
      display: flex;
      padding: 4px 8px;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      background: var(--dropdown-select-bg-color);
    }
  }
  .select-list {
    color: var(--text-secondary);
    :global(.select-item) {
      font-size: 10px;
      font-weight: 500;
      padding: 4px 0;
      min-width: 70px;
      cursor: pointer;
      &:hover {
        color: var(--brand);
      }
    }
  }
  .expected-return {
    text-align: left;
    padding: 8px 0 0;
    width: 100%;
    &-label {
      color: var(--text-secondary);
      border-bottom: 1px dashed var(--line-3, #34343b);
      padding: 0 4px 0 0;
    }
    span {
      font-size: 10px;
      font-weight: 500;
    }
  }
  .button-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    &.flex-end {
      justify-content: flex-end;
    }
    :global(.sub-button) {
      cursor: pointer;
      display: flex;
      height: 24px;
      justify-content: center;
      align-items: center;
      border-radius: 22px;
      background: var(--brand);
      color: var(--text-white);
      font-size: 12px;
      font-weight: 400;
      &:hover {
        color: var(--text-white);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .ipt-action {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    flex-shrink: 0;
    &.limit-input {
      font-size: 200px;
      .ipt-form:first-child {
        width: 60px;
        :global(input) {
          background: var(--fill-projection);
        }
      }
    }
    .ipt-form {
      flex: 1;
      :global(.liquidation-ipt) {
        :global(input) {
          border-radius: 8px;
          background: var(--fill-3) !important;
          color: var(--text-primary);
          font-size: 10px;
          font-weight: 500;
          border: 1px solid var(--fill-3) !important;
          height: 26px;
          &:focus {
            border: 1px solid var(--fill-3) !important;
            box-shadow: none;
          }
        }
        :global(.ant-popover-open) {
          background: var(--fill-1) !important;
          border: 1px solid var(--brand) !important;
        }
        :global(.ant-input-group-wrapper-outlined) {
          border-radius: 8px;
          border: 1px solid transparent;
          :global(.ant-popover-open) {
            background: var(--fill-1) !important;
            border: 1px solid var(--brand) !important;
          }
        }
      }
      :global(.ant-input-wrapper),
      :global(.suffix) {
        height: 26px !important;
      }
    }
  }

  .button-group {
    display: flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 4px;
    margin: 8px 0 0;
  }
  .quantityCustom-popover {
    width: 216px;
    justify-content: center;
    align-items: center;
    align-content: center;
    :global(.ant-popover-inner) {
      background: var(--bg-1) !important;
    }
    :global(.ant-popover-inner) {
      height: 68px !important;
    }
    :global(.ant-slider .ant-slider-handle::after) {
      width: 6px !important;
      height: 6px !important;
      top: 3px;
    }

    :global(
        .ant-slider .ant-slider-handle:hover::after,
        .ant-slider .ant-slider-handle:active::after,
        .ant-slider .ant-slider-handle:focus::after
      ) {
      width: 6px !important;
      height: 6px !important;
      top: 3px;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
