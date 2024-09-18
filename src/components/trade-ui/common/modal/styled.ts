import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .swap-common-modal {
    width: min-content !important;
    padding-bottom: 0;

    :global(.ant-modal-content) {
      box-shadow: unset;
      background: transparent;
    }
    :global(.ant-modal-header) {
      border-color: var(--theme-trade-border-color-1);
      padding: 30px 30px 20px;
      .ant-modal-title {
        font-size: 20px;
        font-weight: 500;
        color: var(--theme-trade-text-color-1);
        line-height: 28px;
      }
    }

    :global(.ant-modal-body) {
      padding: 0;
    }

    .modal-title {
      position: relative;
      padding-left: var(--theme-trade-modal-horizontal-padding);
      padding-right: var(--theme-trade-modal-horizontal-padding);
      padding-top: 21.5px;
      flex-direction: row;
      align-items: center;
      width: 100%;
      .modal-title-content {
        width: 100%;
        white-space: nowrap;
        color: var(--theme-trade-text-color-1);
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      &.pointer {
        cursor: pointer;
      }
      .tooltip {
        padding-left: 5px;
      }
      &.tabs {
        padding-top: 0;
      }
      .tabs-content {
        height: 59px;
        display: flex;
        flex-direction: row;
        :global(> div) {
          padding-top: 2px;
          cursor: pointer;
          height: inherit;
          margin-right: 15px;
          height: 58px;
          line-height: 59px;
          border-bottom: 2px solid transparent;
        }
        .active {
          border-bottom: 2px solid var(--skin-primary-color);
        }
      }
      &.bottom-padding {
        padding-bottom: 21.5px;
      }

      &.border {
        &::before {
          content: '';
          display: block;
          background-color: var(--theme-trade-border-color-1);
          height: 1px;
          left: 0;
          width: 100%;
          position: absolute;
          bottom: 0;
        }
        &.full-border {
          &::before {
            left: 0;
            width: calc(100%);
            /* left: -18px;
            width: calc(100% + 36px); */
          }
        }
      }
    }
    .swap-common-modal-content-component {
      max-height: 75vh;
      padding: 0 var(--theme-trade-modal-horizontal-padding);
      overflow: auto;
    }
    .swap-common-modal-content {
      margin: 0 auto;
      background: var(--theme-trade-modal-color);
      border-radius: 6px;
      /* padding: 0 18px; */
      width: 400px;
    }
    .modal-footer {
      display: flex;
      flex-direction: row;
      padding: 0 var(--theme-trade-modal-horizontal-padding) 20px;
      .cancel,
      .confirm {
        cursor: pointer;
        user-select: none;
        flex: 1;
        height: 40px;
        border-radius: 5px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        background: var(--theme-trade-sub-button-bg);
        text-align: center;
      }
      .confirm {
        background: var(--skin-primary-color);
        color: var(--skin-font-color);
        &:nth-child(2) {
          margin-left: 10px;
        }
        &.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }
    }
  }
  .close-wrapper {
    position: absolute;
    top: 8px;
    right: 7px;
    cursor: pointer;
    height: 47px;
    width: 47px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .close {
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: 24px;
    width: 24px;
    line-height: 24px;
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
