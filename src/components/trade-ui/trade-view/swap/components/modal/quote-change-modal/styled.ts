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
      border: 1px solid var(--fill_line_3);
      border-radius: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      padding: 16px;
      align-self: stretch;
      gap: 16px;
      &:first-child {
        margin-bottom: 15px;
      }
      .caption {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
        flex: 1 0 0;
        color: var(--text_2);
      }
      .caption > div {
        &:first-child {
          font-size: 14px;
          line-height: 14px;
          font-weight: 400;
        }
        &:last-child {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: var(--text_2);
        }

      }
      &.active {
        border: 1px solid var(--brand);
        .caption {
          color: var(--text_1);
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
