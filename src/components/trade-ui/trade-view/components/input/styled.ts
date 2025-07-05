import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .trade-view-input {
    width: 100%;
    height: 40px;
    padding-left: 0;
    padding-right: 0;
    border-color: transparent;
    border-radius: 8px;
    &.layer1 {
      background: var(--fill_input_1);
    }
    &.layer2 {
      background: var(--fill_input_2);
    }
    :global(>*:first-child:not(input):not([class~='controller'])) {
      margin-left: 16px;
    }
    :global(>*:last-child:not(input):not([class~='controller'])) {
      margin-right: 16px;
    }
    @media ${MediaInfo.mobile} {
      width: auto;
      height: 2.5rem;
      padding-right: 0;
    }
    .label {
      user-select: none;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      color: var(--text_3);
    }
    :global(> input) {
      font-size: 12px;
      font-weight: 500;
      color: var(--text_1) !important;
      padding-right: 0px;
      padding-left: 1rem;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
