import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .lever-modal {
    width: 100%;
    padding-bottom: 35px;
    @media ${MediaInfo.mobile} {
      padding-bottom: 0;
    }
    .input {
      background-color: var(--theme-trade-sub-button-bg);
      height: 40px;
      margin: 0 0 0 0;
      &.error {
        border-color: var(--color-error) !important;
      }
      :global(input) {
        font-size: 16px;
        font-weight: 500;
      }
    }

    .max-info {
      display: flex;
      flex-direction: row;
      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-1);
      > *:nth-child(2) {
        margin-left: 3px;
      }
    }

    .danger-info2 {
      margin-top: 5px;
      font-size: 12px;
      font-weight: 400;
      color: var(--color-error);
      line-height: 18px;
    }
    .danger-info {
      margin-top: 20px;
      position: relative;
      padding-left: 20px;
      font-size: 12px;
      font-weight: 400;
      color: var(--color-error);
      line-height: 18px;
      .icon {
        position: absolute;
        top: 4px;
        left: 0;
      }
    }
    .lever-list {
      margin-top: 5px;
      display: flex;
      flex-direction: row;
      > div {
        cursor: pointer;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 7.93px;

        &:last-child {
          padding-right: 0;
        }
        &.active {
          > div {
            background-color: var(--theme-primary-color);
          }
        }
        > div {
          width: 100%;
          background-color: var(--theme-trade-sub-button-bg);
          height: 12px;
          border-radius: 4px;
        }
        > span {
          margin-top: 4px;
          font-size: 12px;
          color: var(--theme-trade-text-color-3);
        }
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
