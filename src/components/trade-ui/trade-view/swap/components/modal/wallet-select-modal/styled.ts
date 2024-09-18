import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .wallet-select-content {
    overflow-y: hidden;
  }
  .wallet-select-mobile-content {
    overflow-y: hidden;
  }
  .modal-wrapper {
    padding-left: 0 !important;
    padding-right: 0 !important;
    overflow-y: hidden !important;
    display: flex;
    flex-direction: column;
  }
  .modal-content {
    color: var(--theme-trade-text-color-1);
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
      }
    }
    .header {
      height: 52px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--theme-trade-modal-horizontal-padding);
      .tabs {
        height: inherit;
        .tab {
          height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid var(--theme-primary-color);
        }
      }
      .right {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--theme-font-color-small-yellow);
        :global(> div) {
          margin-left: 4px;
          font-size: 12px;
        }
      }
    }

    .wallets {
      padding: 15.5px var(--theme-trade-modal-horizontal-padding) 21px;
      .wallet {
        margin-bottom: 8px;
        height: 60px;
        border-radius: 5px;
        border: 1px solid var(--theme-border-color-1);
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        .left {
          display: flex;
          align-items: center;
          .texts {
            margin-left: 12px;
            :global(> div:first-child) {
              line-height: 17px;
              font-size: 14px;
              font-weight: 500;
              mix-blend-mode: 4px;
            }
            :global(> div:last-child) {
              color: var(--theme-trade-text-color-3);
              line-height: 15px;
              font-size: 12px;
              font-weight: 400;
            }
          }
        }
      }
    }
    @media ${MediaInfo.mobileOrTablet} {
      .wallets {
        padding-bottom: 0;
      }
      .wallets,
      .header {
        padding-left: 0;
        padding-right: 0;
      }
      .content {
        max-height: 60vh;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
