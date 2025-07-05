import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .liquidation-ipt {
    width: 100%;

    :global(input) {
      display: flex;
      background: transparent;
      border: none !important;
      color: var(--text_1);
      font-size: 14px;
      font-weight: 400;
      height: 40px;
      padding: 0 16px;
      &:not(:last-child) {
        padding: 0 0 0 16px
      }
      &:focus {
        box-shadow: none !important;
        border: none;
      }
      &::placeholder {
        color: var(--text_3);
        line-height: normal;
      }
    }
    :global(.ant-input-wrapper, .ant-input) {
      height: 40px;
      display: flex;
      align-item: center;
      border-radius: 8px;
    }
    &.layer1 {
      :global(.ant-input-wrapper) {
        background: var(--fill_input_1) !important;
      }
      :global(.ant-input) {
        background: var(--fill_input_1) !important;
      }
    }
    &.layer2 {
      :global(.ant-input-wrapper) {
        background: var(--fill_input_2) !important;
      }
      :global(.ant-input) {
        background: var(--fill_input_2) !important;
      }
    }
    :global(.ant-input-outlined) {
      box-shadow: none !important;
      :global(.ant-input-disabled) {
        color: var(--text_3);
        background: var(--fill_3);
      }
    }
    :global(.ant-input-outlined.ant-input-disabled) {
      background: var(--fill_3) !important;
    }
    :global(.ant-input-outlined.ant-input-disabled) {
      background: var(--fill_3) !important;
    }
    :global(.ant-input-outlined.ant-input-disabled) {
      background: var(--fill_3) !important;
    }
    :global(.ant-input-outlined.ant-input-disabled) {
      background: var(--fill_3) !important;
    }
    :global(.ant-input-group-addon) {
      border: none !important;
      width: auto;
      background: transparent !important;
    }

    :global(.ant-select-selector) {
      width: 100%;
      padding: 0 !important;
    }
    :global(.ant-select-arrow) {
      right: 0;
    }
    :global(.ant-select) {
      height: 40px;
      margin: 0;
    }
    :global(.ant-select-selection-item) {
      color: var(--text_2) !important;
      font-size: 14px;
      font-weight: 400;
      line-height: normal;
    }
    :global(.ant-input-affix-wrapper) {
      display: flex;
      height: 40px;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: var(--fill_3);
      color: var(--text_1);
      font-size: 14px;
      font-weight: 500;
      border: none !important;
    }
  }
  .suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--text_2);
    font-size: 12px;
    font-weight: 400;
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
