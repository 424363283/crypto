import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .modify-margin-modal {
    @media ${MediaInfo.mobile} {
      padding: 0 0.5rem;
      margin-top: 1.5rem;
    }
    :global(.components-numeric-input) {
      &:hover,
      &:focus {
        border: 1px solid transparent !important;
      }
    }
    .input-label {
      font-size: 12px;
      color: var(--theme-trade-text-color-1);
      @media ${MediaInfo.mobile} {
        font-size: 14px;
        color: var(--text_2);
      }
    }
    .input {
      height: 48px;
      padding: 0 15px;
      border-radius: 12px;
      background: var(--fill_3);
      margin: 8px 0 0;
      :global(input) {
        text-indent: 0;
        color: var(--text_2) !important;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
        &::placeholder {
          color: var(--text_2);
        }
      }
      .suffix {
        color: var(--text_2);
        font-size: 14px;
        font-weight: 400;
        .max {
          cursor: pointer;
          color: var(--text_brand);
          font-size: 14px;
          font-weight: 400;
          padding: 0 8px;
        }
      }
    }
    .info-list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;
      padding: 24px 0;
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      .label {
        color: var(--text_2);
        font-size: 14px;
        font-weight: 400;
        line-height: 150%;
      }
      .value {
        color: var(--text_1);
        font-size: 14px;
        font-weight: 400;
        line-height: 150%; /* 21px */
      }
    }
    .auto-margin {
      padding: 24px 0;
      font-size: 12px;
      border-top: 1px solid var(--fill_line_3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text_2);
      font-size: 14px;
      font-weight: 400;
    }
    .custom-switch {
      background: var(--text_2) !important;
      width: 32px;
      height: 20px;
      :global(.ant-switch-handle) {
        width: 14px;
        height: 14px;
        top: 3px !important;
        &:before {
          background-color: var(--text_white) !important;
        }
      }
    }
  }
  .custom-tab {
    &:before {
      display: none !important;
    }
    :global(.tabs-content) {
      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 8px;
      background: var(--fill_3);
      color: var(--text_2);
      font-size: 16px;
      font-weight: 400;
      height: 36px !important;
      align-items: center;
      :global(div) {
        flex: 1;
        height: 36px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text_2);
        font-size: 16px;
        font-weight: 400;
        padding: 0;
        margin: 0 !important;
      }
      :global(.active) {
        border-radius: 8px;
        background: var(--brand);
        border-bottom: none !important;
        color: var(--text_white);
      }
    }
  }
  @media ${MediaInfo.mobile} {
    :global(.modal-title) {
      padding: 0 0.5rem;
      :global(.tabs-content) {
        :global(div) {
          font-size: 14px !important;
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
