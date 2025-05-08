import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .wallet-form-content,
  .wallet-form-mobile-content {
    overflow-y: hidden;
  }
  .wallet-form-mobile-modal {
    padding-bottom: 0;
  }
  .wallet-form-modal-content {
    overflow-y: hidden !important;
    display: flex;
    flex-direction: column;
  }
  .modal-content {
    overflow: hidden;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: var(--text_2);
    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      overflow-y: hidden;
      .scroll {
        flex: 1;
        scrollbar-width: none;
        overflow-y: scroll;
        &.usdt {
        }
      }
    }
    .header {
      margin-top: 10px;
      height: 52px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--theme-border-color-1);
      .tabs {
        display: flex;
        align-items: center;
        height: inherit;
        .tab {
          height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          margin-right: 20px;
          cursor: pointer;
          &.active {
            border-bottom: 2px solid var(--theme-primary-color);
          }
        }
      }
    }
    .type-warn {
      padding-bottom: 21.5px;
      color: var(--theme-trade-text-color-3);
      :global(span) {
        color: var(--theme-trade-text-color-1);
      }
    }
    .avatar-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
      .modify {
        cursor: pointer;
        display: flex;
        align-items: center;
        border-radius: 6px;
        height: 30px;
        padding: 0 16px;
        background: var(--theme-trade-bg-color-8);
      }
    }
    .repeat-tips {
      color: var(--text_3);
      font-size: 12px;
      margin: 10px 0 11px;
    }
    .submit {
      height: 40px;
      width: 100%;
    }
    @media ${MediaInfo.mobileOrTablet} {
      .header {
        margin-top: 0;
      }
      .content {
        max-height: 75vh;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
