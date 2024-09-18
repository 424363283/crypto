import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .choose-rate {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    width: 100%;
    .range-wrapper {
      position: relative;
      flex: 7;
      width: 100%;
      input {
        padding-left: 0;
      }
      .raise {
        pointer-events: none;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        height: 2px;
        background: var(--skin-primary-color);
      }
      .track {
        position: absolute;
        top: 0;
        left: 0;
        height: 2px;
        width: 98%;
        height: 2px;
        cursor: pointer;
        animation: 0.2s;
        background: var(--theme-trade-bg-color-7);
        border-radius: 2px;
      }
      .tag {
        z-index: 1;
        position: absolute;
        display: none;
        justify-content: center;
        align-items: center;
        transform: translateX(-50%);
        top: -33px;
        width: 32px;
        height: 18px;
        background: var(--theme-trade-tips-color);
        box-shadow: var(--theme-trade-select-shadow);
        border-radius: 2px;
        > * {
          font-size: 12px;
          color: var(--theme-trade-text-color-1);
        }
        &::before {
          content: '';
          display: block;
          position: absolute;
          bottom: -5px;
          width: 0;
          height: 0;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-top: 5px solid var(--theme-trade-tips-color);
        }
        &.show {
          display: flex;
        }
      }
    }
    .range-input {
      position: relative;
      z-index: 2;
      height: 2px;
      width: 100%;
      align-self: center;
      display: block;
      -webkit-appearance: none;
      background: transparent;
      &.float {
        position: absolute;
        top: 0;
        z-index: 3;
        height: 100%;
        opacity: 0;
      }
      &:focus {
        outline: none;
      }
      &::-webkit-slider-thumb {
        position: relative;
        z-index: 2;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--skin-primary-color);
        border: 2.5px solid var(--theme-background-color-1);
        cursor: pointer;
        -webkit-appearance: none;
      }
      &::-moz-range-thumb {
        position: relative;
        z-index: 2;
        width: 17.5px;
        height: 17.5px;
        border-radius: 50%;
        background: var(--skin-primary-color);
        border: 2.5px solid var(--theme-background-color-1);
        cursor: pointer;
        -webkit-appearance: none;
      }
    }
    .items {
      width: 100%;
      display: flex;
      flex-direction: row;
      position: absolute;
      z-index: 2;
      top: -5px;
      .item {
        position: absolute;
        top: 0px;
        left: 0;
        width: 12px;
        height: 12px;
        background: var(--theme-trade-bg-color-7);
        border: 2.5px solid var(--theme-background-color-1);
        border-radius: 50%;
        &.active {
          background: var(--skin-primary-color);
          border: 2.5px solid var(--theme-background-color-1);
        }
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
// light 9E9E9D
// dark 4C5252
