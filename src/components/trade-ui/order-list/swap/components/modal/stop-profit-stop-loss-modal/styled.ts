import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .stop-profit-stop-loss {
  }
  .stop-profit-stop-loss-content {
    width: 459px !important;
    overflow-y: hidden;
  }
  .stop-profit-stop-loss-modal-content {
    overflow-y: hidden !important;
    display: flex;
    flex-direction: column;
  }
  .stop-profit-stop-loss-mobile-content {
    margin-top: -10px;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow-y: hidden;
    .scroll {
      padding: 0 var(--modal-horizontal-padding);
      flex: 1;
      padding-bottom: 10px;
      scrollbar-width: none;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      @media ${MediaInfo.mobile} {
        max-height: 67vh;
      }
    }
    .active-info {
      padding-bottom: 10px;
      font-size: 12px;
      color: var(--skin-main-font-color);
    }
    .tabbar {
      position: relative;
      height: 45px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 var(--modal-horizontal-padding);
      &::before {
        content: '';
        display: block;
        background-color: var(--theme-trade-border-color-1);
        height: 1px;
        left: 0;
        width: 100%;
        position: absolute;
        bottom: -1px;
      }
      > :global(div) {
        cursor: pointer;
        margin-right: 35px;
        line-height: 47px;
        border-bottom: 2px solid transparent;
        height: inherit;
        font-size: 14px;
        color: var(--theme-trade-text-color-3);
      }
      :global(div.active) {
        color: var(--theme-trade-text-color-1);
        border-bottom: 2px solid var(--skin-primary-color);
      }
    }
  }
  .description {
    margin: -7px 0 36px;
    font-size: 12px;
    font-weight: 400;
    color: var(--theme-trade-text-color-3);
    line-height: 16px;
  }
  .error-text {
    margin: 10px 0;
    font-size: 12px;
    color: var(--const-color-error);
  }
  .rates {
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;

    .item {
      cursor: pointer;
      flex: 1;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-3);
      &::before {
        margin-bottom: 5px;
        content: '';
        width: 100%;
        height: 10px;
        border-radius: 4px;
        display: block;
        background-color: var(--theme-trade-sub-button-bg);
      }
      &.active {
        &::before {
          background-color: var(--skin-primary-color);
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
