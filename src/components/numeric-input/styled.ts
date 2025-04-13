import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .components-numeric-input {
    flex: 1 auto;
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid transparent;
    border-radius: 8px;
    height: 40px;
    margin: 10px 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    cursor: text;
    :global(> *:not(input)) {
      flex-shrink: 0;
    }
    &.text-center {
      :global(input) {
        text-align: center;
      }
    }
    :global(> *:last-child:not([class~='controller'])) {
      &::before {
        content: '';
        width: 1px;
        text-align: center;
        height: 16px;
        margin: 0 16px;
        background: var(--line-3);
        @media ${MediaInfo.mobile} {
          margin-right: 0;
          margin-left: 1rem;
        }
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
      border-radius: 8px;
      text-indent: 0px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      background: transparent;
      outline: none;

      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      &[type='password'] {
        ime-mode: disabled;
      }
      &::placeholder {
        color: var(--text-secondary) !important;
      }
      &::-webkit-input-placeholder {
        color: var(--text-secondary) !important;
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
      &.v3 {
        position: relative;
        flex-direction: column;
        overflow: visible;
        justify-content: space-between;
        height: auto;
        :global(> *) {
          flex: none;
          margin-right: 0;
          width: 12px;
          height: 18px;
        }
        :global(+ *) {
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 14px;
          font-size: 12px;
          color: var(--text-secondary) !important;
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
        border-radius: 8px;
        border: 1px solid transparent !important;
        @media ${MediaInfo.mobile} {
          outline: 1px solid var(--brand);
          outline-offset: -1px;
        }
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
