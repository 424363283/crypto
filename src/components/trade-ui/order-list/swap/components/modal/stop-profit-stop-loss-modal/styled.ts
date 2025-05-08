import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .stop-profit-stop-loss {
  }
  .stop-profit-stop-loss-content {
    width: auto !important;
    overflow-y: hidden;
    padding: 16px 24px !important;
  }
  .stop-profit-stop-loss-modal-content {
    overflow-y: hidden !important;
    display: flex;
    flex-direction: column;
  }
  .stop-profit-stop-loss-mobile-content {
    margin-top: 0;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow-y: hidden;
    @media ${MediaInfo.mobile} {
      max-height: 70dvh;
      .price-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        &:last-child {
          .price-value {
            text-align: right;
          }
        }
      }
      .liquidation-tab {
        display: flex;
        width: 100%;
        height: 2rem;
        gap: 2px;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        background: var(--fill_3);
        border-radius: 8px;
        margin-bottom: 1.5rem;
        :global(> div) {
          display: flex;
          flex: 1 auto;
          height: 30px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 8px;
          color: var(--text_2);
        }
        :global([data-active='true']) {
          color: var(--text_white);
          border-radius: 8px;
          background: var(--brand);
        }
        :global(span) {
          font-size: 12px;
          font-weight: 400;
          color: inherit;
        }
      }
    }
    .symbol-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;
      border-bottom: 1px solid var(--fill_line_1);
      padding: 0 0 24px;
      @media ${MediaInfo.mobile} {
        gap: 1rem;
        margin: 0 0.5rem;
        padding-bottom: 1.5rem;
      }
      .symbol-name {
        display: flex;
        align-items: center;
        flex-direction: row;
        color: var(--text_1);
        font-size: 16px;
        font-weight: 500;
        flex-direction: row;
        align-items: center;
        gap: 4px;
      }
      .side {
        display: flex;
        height: 20px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        color: var(--text_green);
        font-size: 12px;
        font-weight: 400;
        margin: 0 0 0 4px;
        min-width: 48px;
        position: relative;
      }
      .green {
        color: var(--color-green);
      }
      .side-bg.green::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-green);
        opacity: 0.1;
        border-radius: 4px;
      }
      .red {
        color: var(--color-red);
      }
      .side-bg.red::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-red);
        opacity: 0.1;
      }
      .leverage {
        display: flex;
        height: 20px;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: var(--fill_3);
        color: var(--text_2);
        font-size: 12px;
        font-weight: 400;
        min-width: 48px;
        :global(span) {
          font-size: 10px;
          margin: 2px 0 0;
        }
      }
      .price-group {
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: var(--text_1);
        font-size: 14px;
        font-weight: 400;
      }
    }
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
        margin-top: 1.5rem;
        padding-bottom: 0;
      }
      .liquidation-action {
        display: flex;
        align-items: flex-start;
        gap: 40px;
        overflow: hidden;
        padding: 24px 0;
        &:last-child {
          padding: 24px 0 0;
        }
        @media ${MediaInfo.mobile} {
          flex-direction: column;
          gap: 1.5rem;
          &:last-child {
            padding: 0 0.5rem;
          }
          :global(.close-tips) {
            margin-top: 0;
          }
          :global(.slider) {
            margin-bottom: 0;
          }
        }
      }
      .liquidation-pannel {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        flex: 1 0 0;
        :global(.slider) {
          :global(.ant-slider-horizontal.ant-slider-with-marks) {
            margin-top: 0px;
            :global(.ant-slider-mark) {
              :global(.ant-slider-mark-text) {
                &:first-child {
                  left: 0% !important;
                  transform: translateX(0%) !important;
                }
                &:last-child {
                  left: 100% !important;
                  transform: translateX(-100%) !important;
                }
              }
            }
          }
        }
      }
      .liquidation-label {
        color: var(--text_3);
        font-size: 14px;
        font-weight: 500;
      }
      .liquidation-form {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 8px;
        :global(.liquidation-ipt) {
          min-width: 185px;
          max-width: 200px;
        }
        :global(.input-roe, .liquidation-switch) {
          flex-shrink: 0;
        }
        @media ${MediaInfo.mobile} {
          &.disabled {
            :global(.ant-input) {
              background: var(--fill_shadow) !important;
            }
            :global(.liquidation-switch) {
              background: var(--fill_shadow);
            }
          }
        }
      }
      .market-price-input {
        :global(.ant-input-wrapper) {
          background: var(--fill_3) !important;
        }
      }

      .tips {
        color: var(--text_2);
        text-align: justify;
        font-size: 12px;
        font-weight: 400;
        line-height: 150%;
        :global(span) {
          padding: 0 6px 0 0;
        }
        @media ${MediaInfo.mobile} {
          :global(.close-tips) {
            margin-top: 4px;
          }
          .warning {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--fill_line_1);
            color: var(--yellow);
          }
        }
        :global(.title) {
          color: var(--text_1);
        }
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
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 24px 0 0;
      @media ${MediaInfo.mobile} {
        margin-top: 1.5rem;
        padding: 0 0.5rem;
      }
      > :global(div) {
        cursor: pointer;
        margin-right: 24px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        color: var(--text_2);
        @media ${MediaInfo.mobile} {
          margin-right: 1.5rem;
        }
      }
      :global(div.active) {
        color: var(--text_brand);
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
  :global(.custom-dropdown) {
    min-width: 50px;
    background: var(--fill_3);

    :global(.ant-select-item) {
      color: var(--text_2) !important;
      text-align: center;
      padding: 4 !important;
      height: 24px !important;
      line-height: 24px !important;
      font-size: 12px !important;
    }
    :global(.ant-select-item-option-selected) {
      background: transparent !important;
      color: var(--text_brand) !important;
    }
  }
  @media ${MediaInfo.mobile} {
    :global(.custom-dropdown) {
      background: var(--fill_pop);
      padding: 4px 0;
      min-width: 5rem;
      border-radius: 8px;
      box-shadow: 0px 0px 8px 0px var(--fill_shadow);
      :global(.rc-virtual-list-holder-inner) {
        gap: 4px;
        padding: 4px 0px;
      }
      :global(.ant-select-item) {
        line-height: normal !important;
        display: flex;
        align-items: center;
        height: 1.5rem !important;
        min-height: 1.5rem;
        min-width: 5rem;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
