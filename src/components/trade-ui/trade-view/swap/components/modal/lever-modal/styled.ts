import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .lever-modal {
    width: 100%;

    @media ${MediaInfo.mobile} {
      width: auto;
      padding-bottom: 0;
      padding: 0 0.5rem;
    }
    .input {
      height: 48px;
      padding: 0px 16px;
      margin: 0 !important;
      align-items: center;
      border-radius: 12px;
      background: var(--fill_input_2);
      font-size: 20px;
      font-weight: 700;
      color: var(--text_1);
      &.error {
        border-color: var(--text_red) !important;
      }
      :global(input) {
        font-size: 20px;
        font-weight: 700;
        color: var(--text_1);
      }
    }
    .lever-slider {
      @media ${MediaInfo.mobile} {
        margin-top: 1rem;
      }
      :global(.slider) {
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
    .max-info {
      display: flex;
      flex-direction: row;
      color: var(--text_2);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%;
      padding: 10px 0 0;
      :global(span) {
        color: var(--text_1);
      }
      @media ${MediaInfo.mobile} {
        margin: 1.5rem 0;
      }
    }

    .danger-info2 {
      margin-top: 5px;
      font-size: 12px;
      font-weight: 400;
      color: var(--text_red);
      line-height: 18px;
    }
    .danger-info {
      display: flex;
      color: var(--yellow);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
      display: flex;
      padding: 24px 0 0;
      gap: 4px;
      @media ${MediaInfo.mobile} {
        padding: 1.5rem 0;
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
