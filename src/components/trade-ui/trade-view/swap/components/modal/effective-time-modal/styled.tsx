import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .effective-time-modal {
    @media ${MediaInfo.mobile} {
      padding: 0 0.5rem;
    }
    .item {
      cursor: pointer;
      margin-bottom: 12px;
      width: 100%;
      display: flex;
      padding: 16px;
      align-items: center;
      gap: 40px;
      border-radius: 16px;
      border: 1px solid var(--line-3);
      @media ${MediaInfo.mobile} {
        width: auto;
      }
      .title-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
        flex: 1 0 0;
        .title {
          flex: 1;
          margin-right: 10px;
          font-size: 16px;
          color: var(--text-primary);
        }
      }
      .tips {
        font-size: 12px;
        color: var(--text-secondary);
      }
      &.active,
      &:hover {
        border: 1px solid var(--brand);
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
