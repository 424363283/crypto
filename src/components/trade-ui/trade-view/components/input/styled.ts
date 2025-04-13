import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .trade-view-input {
    width: 100%;
    height: 40px;
    padding-left: 16px;
    padding-right: 16px;
    border-color: transparent;
    border-radius: 8px;
    background: var(--fill-3);
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
      color: var(--text-tertiary);
    }
    :global(> input) {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-primary) !important;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
