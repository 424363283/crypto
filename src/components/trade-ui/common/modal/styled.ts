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
      flex-direction: row;
      align-items: center;
      width: 100%;
      .modal-title-content {
        width: 100%;
        font-size: 16px;
        font-weight: 500;
      }
      .modal-title-info{
        display:flex;
        align-items:center;
        color: var(--text-primary);
        text-align: justify;
        font-size: 16px;
        font-weight: 500;
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
        align-items:center;
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
      overflow: auto;
      padding:24px 0;
    }
    .swap-common-modal-content {
      margin: 0 auto;
      border-radius: 6px;
      padding: 24px 24px;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      border-radius: 24px;
      background: var(--common-modal-bg);
      /* padding: 0 18px; */
      width: 480px;
    }
    .common-modal-content-component {
      max-height: 75vh;
      overflow: auto;
      padding:0;
    }
    .common-modal-content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      margin: 0 auto;
      padding: 24px 24px;
      border-radius: 24px;
      background: var(--common-modal-bg);
      width: 480px;
      gap: 24px;
    }
    .modal-footer {
      display: flex;
      flex-direction: row;
      .cancel,
      .confirm {
        cursor: pointer;
        user-select: none;
        flex: 1;
        display: flex;
        height: 48px;
        justify-content: center;
        align-items: center;
        border-radius: 40px;
        background: var(--text-brand);
        color: var(--text-white);
        font-size: 16px;
        font-weight: 500;
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
    transform:translateY(-50%);
    top: 50%;
    right: 0;
    cursor: pointer;
    height: 24px;
    width: 24px;
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
