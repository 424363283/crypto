import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .margin-type-modal {
    padding-top: 22px;
    .buttons {
      display: flex;
      flex-direction: row;
      > div {
        user-select: none;
        cursor: pointer;
        position: relative;
        flex: 1;
        height: 38px;
        background: var(--theme-trade-sub-button-bg);
        border-radius: 6px;
        font-size: 14px;
        font-weight: 400;
        color: var(--theme-trade-text-color-1);
        line-height: 35px;
        text-align: center;
        border: 1px solid transparent;

        &:first-child {
          margin-right: 18px;
        }
        &.active {
          border-radius: 6px;
          background: rgba(255, 211, 15, 0.1);
          border-color: var(--theme-primary-color);
          position: relative;
          .tag {
            position: absolute;
            top: -1px;
            right: -2px;
          }
        }
      }
    }
    .tips {
      padding-top: 25px;
      padding-bottom: 16px;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-1);
    }
    .info-content-expand {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
      cursor: pointer;
      div {
        font-size: 12px;
        color: var(--theme-trade-text-color-3);
        margin-right: 10px;
      }
      .arrow {
        &.expand {
          transform: rotateX(180deg);
        }
      }
    }
    .info-content {
      /* padding-bottom: 25px; */
    }
    .infos {
      margin-bottom: 15px;
      padding: 16px 12px;
      background: var(--theme-trade-sub-button-bg);
      border-radius: 6px;
    }
    .info1,
    .info2 {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-1);
      line-height: 18px;
    }
    .info1 {
      padding-bottom: 20px;
    }
    .info2 {
    }
  }
  .level-content {
    .line {
      height: 1px;
      width: 100%;
      background-color: var(--theme-border-color-1);
    }
    .label {
      padding: 12.5px 0 10px;

      font-size: 12px;
      color: var(--theme-trade-text-color-3);
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
