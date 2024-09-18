import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .input-view {
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
      .newest {
        user-select: none;
        cursor: pointer;
        font-size: 12px;
        font-weight: 400;
        color: var(--skin-hover-font-color);
        margin-right: 5px;
      }
      .unit {
        user-select: none;
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-font-color-1);
      }
    }
    .swap-input {
      height: 35px;
      > :global(input) {
        text-align: right;
        padding-right: 10px;
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
