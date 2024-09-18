import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .components-numeric-input {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid transparent;
    border-radius: 6px;
    height: 40px;
    margin: 10px 0;
    &.text-center {
      :global(input) {
        text-align: center;
      }
    }

    label {
      position: absolute !important;
      left: 6px;
      align-self: center;
      font-size: 13px;
      //color: #5E6469;
      color: #a7a8ac;
      //font-family: "Myriad Pro"!important;
      pointer-events: none;
    }
    &.full-width {
      input {
        width: 100%;
      }
    }
    input {
      border: 0;
      border-radius: 6px;
      flex: 1;
      text-indent: 6px;
      font-size: 13px;
      color: #232e34;
      background: transparent;
      outline: none;

      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      &[type='password'] {
        ime-mode: disabled;
      }
      &::placeholder {
        color: var(--theme-font-color-placeholder) !important;
      }
      &::-webkit-input-placeholder {
        color: var(--theme-font-color-placeholder) !important;
      }
    }
    .controller {
      display: flex;
      justify-content: space-evenly;
      position: absolute;
      align-self: center;
      align-items: center;
      height: 100%;
      right: 0;
      overflow: hidden;
      &.v2 {
        width: 100%;
        overflow: visible;
        height: 0;
        justify-content: space-between;
        :global(> *) {
          flex: none;
          margin-right: 0;
        }
      }
      .add {
        width: 18px;
        height: 18px;
        .btn {
          width: 12.14px;
          height: 12px;
        }
      }
      .minus {
        width: 18px;
        height: 18px;
        .btn {
          width: 13px;
          height: 12px;
        }
      }
      .btn {
        user-select: none;
        cursor: default;
        fill: var(--skin-primary-color);
      }
    }
    &.focus-active {
      &:hover,
      &.focus {
        border-radius: 6px;
        border: 1px solid var(--skin-primary-color) !important;
      }
      /* &.focus {
        box-shadow: 0px 0px 0px 2px var(--skin-primary-color);
      } */
    }
  }

  .clear {
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    > * {
      width: 18px;
      height: 18px;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
