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
      background: var(--theme-trade-modal-input-bg);
      > :global(input) {
        text-align: right;
        padding-right: 10px;
      }
    }
  }
  .lever-list {
    margin-top: 18px;
    display: flex;
    flex-direction: row;
    > div {
      cursor: pointer;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 7.93px;

      &:last-child {
        padding-right: 0;
      }
      &.active {
        > div {
          background-color: var(--skin-primary-color);
        }
      }
      > div {
        width: 100%;
        background-color: var(--theme-trade-sub-button-bg);
        height: 12px;
        border-radius: 4px;
      }
      > span {
        margin-top: 4px;
        font-size: 12px;
        color: var(--theme-trade-text-color-3);
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
