import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .position-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 25px 0 11px;
    > * {
      line-height: 13px;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-3);
      flex: 1;
      &:nth-child(3) {
        text-align: right;
      }
    }
  }
  .list-view {
    min-height: 182px;
  }
  .position {
    position: relative;
    display: flex;
    flex-direction: row;
    margin-bottom: 11px;

    .border {
      z-index: 0 !important;
      position: absolute;
      top: 0px;
      bottom: 0;
      width: 100%;
      height: 37px;
      border-radius: 6px !important;
    }
    > * {
      position: relative;
      z-index: 1;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
      margin-bottom: 0;
      flex: none;
      &:nth-child(1) {
        width: 113px;
      }
      &:nth-child(2) {
        width: 154px;
      }
    }
    .delete {
      flex: 1;
      border-radius: 6px;
      background: var(--theme-trade-bg-color-8);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left-width: 0;
      padding: 0 9px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      img {
        cursor: pointer;
      }
    }
    .input {
      &:hover {
        border-left-width: 1px !important;
        border-right-width: 1px !important;
        border-radius: 6px !important;
      }
      :global(input) {
        text-align: left;
        color: #fff;
      }
    }
    :global {
      .focus {
        border-width: 1px !important;
        border-radius: 6px !important;
        box-shadow: unset !important;
      }
    }
  }
  .add-button {
    padding: 20px 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      cursor: pointer;
      line-height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-primary-color);
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
