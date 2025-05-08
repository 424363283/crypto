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
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      align-self: stretch;
      .wallet {
        display: flex;
        padding: 16px;
        align-items: center;
        gap: 40px;
        align-self: stretch;
        cursor: pointer;
        border-radius: 16px;
        border: 1px solid var(--line-3);
        &:hover {
          border: 1px solid var(--brand);
        }
        .left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          flex: 1 0 0;
          .texts {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 8px;
            flex: 1 0 0;
            color: var(--text_2);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            &.active {
              color: var(--text_1);
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
            :global(> div:last-child) {
              color: var(--text_2);
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 150%; /* 21px */
            }
          }
        }
        &.active {
          border: 1px solid var(--brand);
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
