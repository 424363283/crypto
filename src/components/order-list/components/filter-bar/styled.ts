import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .date-range-picker {
    background: var(--theme-trade-bg-color-9);
  }
  .filter-bar {
    padding: 0 20px 0;
    height: 62px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .my-row {
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .section {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 10px;
      &:last-child {
        margin-right: 0px;
      }
      .label {
        font-size: 12px;
        font-weight: 400;
        color: var(--theme-trade-text-color-3);
        margin-right: 1px;
      }
      .date-icon {
        margin-left: 12px;
        width: 18px;
        height: 18px;
      }
    }
    .submit {
      padding: 0 10px;
      cursor: pointer;
      text-align: center;
      height: var(--theme-trade-filter-bar-height);
      line-height: var(--theme-trade-filter-bar-height);
      background: var(--theme-trade-bg-color-9);
      border-radius: 5px;
      color: var(--skin-main-font-color);
      font-weight: 500;
      font-size: 12px;
    }

    .dropdown-content {
      display: flex;
      align-items: center;
      padding: 0;
      width: unset;
      border: 0;
      min-width: 72px;
      height: var(--theme-trade-filter-bar-height);
      line-height: var(--theme-trade-filter-bar-height);
      background: var(--theme-trade-bg-color-9);
      border-radius: 5px;
      padding-left: 10px;
      padding-right: 21px;
      min-width: 72px;
      color: var(--theme-trade-text-color-1);
      font-weight: 500;
      position: relative;
      font-size: 12px;
      .wallet-avatar {
        margin-right: 5px;
        margin-bottom: 2px;
      }
      > div {
        font-size: 12px;
      }
      .arrow {
        position: absolute;
        top: 9px;
        right: 5px;
      }
    }
    @media ${MediaInfo.mobile} {
      display: block;
      height: auto;
      .my-row {
        margin-right: 0;
        margin-top: 10px;
      }
      .submit {
        flex: 1;
      }
      .time-dropwown {
        flex: 1;
        :global(> *) {
          width: 100%;
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
