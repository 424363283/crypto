import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .margin-type-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
    align-self: stretch;
    .margin-type-title {
      color: var(--text-secondary);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
    .margin-type-modal {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      align-self: stretch;
      .item {
        display: flex;
        padding: 16px;
        align-items: center;
        gap: 16px;
        align-self: stretch;
        border-radius: 16px;
        border: 1px solid var(--line-3);
        cursor: pointer;
        &:hover {
          border: 1px solid var(--brand);
        }
        .left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          flex: 1 0 0;
          .header {
            color: var(--text-secondary);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
          }
          .info {
            color: var(--text-secondary);
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
          }
        }
        &.active {
          border: 1px solid var(--brand);
        }
        &.active .left .header {
          color: var(--text-primary);
        }
      }
    }
  }
  @media ${MediaInfo.mobile} {
    .margin-type-content {
      gap: 2.5rem;
    }
       .margin-type-title {}
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
