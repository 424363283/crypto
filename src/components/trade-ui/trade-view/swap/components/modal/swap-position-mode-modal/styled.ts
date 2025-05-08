import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .modal {
    padding: 0 18px;
  }
  .content {
    @media ${MediaInfo.mobile} {
      padding: 0 0.5rem;
    }
    .info {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: var(--text_2);
      margin-bottom: 40px;
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
        margin-bottom: 24px;
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
      &:hover {
        border: 1px solid var(--brand);
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
