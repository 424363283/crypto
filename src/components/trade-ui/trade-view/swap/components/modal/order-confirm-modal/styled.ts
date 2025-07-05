import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .modal-content {
  }
  .content {
    @media ${MediaInfo.mobile} {
      padding: 0 0.5rem;
    }
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      &:first-child {
        margin-bottom: 24px;
      }
      &:last-child {
        margin-bottom: 0;
      }

      > :global(*):first-child {
        font-size: 14px;
        font-weight: 400;
        color: var(--text_2);
        &.code {
          font-size: 16px;
          color: var(--text_1);
        }
      }
      > :global(*):last-child {
        font-size: 14px;
        font-weight: 400;
        color: var(--text_1);
        &.side {
          font-size: 16px;
        }
      }
    }
    .danger {
      color: var(--text_red);
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      padding: 9px 0;
    }
    .remind {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 24px;
      .checkbox {
        cursor: pointer;
        width: 14px;
        height: 14px;
        overflow: hidden;
        line-height: 0;
        &.active {
          border: 0;
        }
      }
      .text {
        margin-left: 5px;
        font-size: 14px;
        line-height: 12px;
        font-weight: 400;
        color: var(--text_2);
      }
    }
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    padding-bottom: 25px;
    .cancel,
    .confirm {
      cursor: pointer;
      user-select: none;
      flex: 1;
      height: 40px;
      background: var(--theme-trade-sub-button-bg);
      border-radius: 5px;
      line-height: 40px;
      font-size: 12px;
      font-weight: 500;
      color: #737c90;
      text-align: center;
    }
    .confirm {
      color: #fff;
      &.raise {
        background: var(--color-green);
      }
      &.fall {
        background: var(--color-red);
      }
      &:nth-child(2) {
        margin-left: 10px;
      }
      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: var(--fill_line_3);
    margin: 23px 0;
  }
  @media ${MediaInfo.mobile} {
    :global(.tooltip) {
      padding-left: 1.5rem;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
