import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .view {
    flex: 1;
    overflow: hidden;
    position: relative;
    height: 100%;
    .scroll {
      height: 100%;
      width: 100%;
      overflow: scroll;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .left,
    .right {
      top: 0;
      position: absolute;
      height: 100%;
      > * {
        height: 12px;
      }
    }
    .left {
      left: -1px;
      padding-left: 9px;
      cursor: pointer;

      width: 58px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      z-index: 1;
      background: linear-gradient(to right, var(--theme-trade-bg-color-2) 42.24%, transparent 95.69%);
      :global(> *) {
        transform: rotate(180deg);
      }
    }
    .right {
      right: -1px;
      padding-right: 9px;
      cursor: pointer;
      width: 58px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: end;
      justify-content: flex-end;
      z-index: 1;
      background: linear-gradient(to left, var(--theme-trade-bg-color-2) 42.24%, transparent 95.69%);
      :global(> *) {
        transform: rotate(0deg);
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
