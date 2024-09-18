import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .modal-content {
    color: var(--theme-trade-text-color-1);

    .top {
      padding-top: 16px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .colors {
        padding: 20px 0;
        display: flex;
        align-items: center;
        > div {
          border: 2px solid transparent;
          height: 26px;
          width: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          > div {
            border-radius: 50%;
          }
        }
      }
    }
    .emoji-title {
      color: var(--theme-trade-text-color-3);
    }
    .emojis {
      padding: 10px 0 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      > div {
        cursor: pointer;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        &.active {
          background-color: var(--theme-trade-bg-color-8);
        }
      }
    }
    @media ${MediaInfo.mobile} {
      .emojis > div {
        width: 40px;
        height: 40px;
      }
      .emojis {
        padding-bottom: 0;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
