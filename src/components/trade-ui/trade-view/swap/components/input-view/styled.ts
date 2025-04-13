import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .input-view {
    > .title {
      color: var(--text-tertiary);
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 8px;
    }
    > :global(*) {
      margin: 0;
      margin-bottom: 11px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .price-suffix {
      display: flex;
      flex-direction: row;
      align-items: center;
      line-height: 14px;
      .newest {
        user-select: none;
        cursor: pointer;
        font-size: 12px;
        font-weight: 400;
        color: var(--text-brand);
        margin-right: 0px;
        white-space: nowrap;
        @media ${MediaInfo.mobile} {
          padding: 0 1rem;
        }
      }
      .unit {
        user-select: none;
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-font-color-1);
      }
    }
    .swap-input {
      height: 40px;
      > :global(input) {
        padding-right: 0px;
        padding-left: 1rem;
      }
      @media ${MediaInfo.mobile} {
        height: 2.5rem;
        padding: 0;
        margin-bottom: 1.5rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .input-view.light {
    .price-suffix {
      .unit {
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
