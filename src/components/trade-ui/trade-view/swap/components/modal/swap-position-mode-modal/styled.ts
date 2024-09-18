import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .modal {
    padding: 0 18px;
  }
  .content {
    padding: 20px 0;
    .info {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: var(--theme-trade-text-color-3);
      margin-bottom: 20px;
    }
    .item {
      border: 1px solid var(--theme-trade-border-color-1);
      border-radius: 4px;
      padding: 18px 13px 16px 17px;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      &:first-child {
        margin-bottom: 15px;
      }
      .point {
        flex: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        border: 1px solid rgba(121, 130, 150, 0.5);
        border-radius: 50%;
        margin-right: 7px;
        &::before {
          content: '';
          display: none;
          width: 8px;
          height: 8px;
          background: var(--color-active);
          border-radius: 50%;
        }
      }
      .caption > div {
        &:first-child {
          font-size: 14px;
          line-height: 14px;
          font-weight: 400;
          color: var(--theme-trade-dark-text-1);
          margin-bottom: 10px;
        }
        &:last-child {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: var(--theme-trade-text-color-3);
        }
      }
      &.active {
        border: 1px solid var(--color-active);
        .point {
          border-color: var(--color-active-3);
          &::before {
            display: block;
          }
        }
      }
    }
  }

  .content.light {
    .item {
      .caption > div {
        &:first-child {
          color: var(--theme-trade-light-text-1);
        }
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
