import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .record-view {
    min-height: 380px;
    :global(.code-text) {
      font-size: 12px;
      margin-bottom: 0px;
      color: var(--text_1);
    }
    .tab-bar {
      display: flex;
      padding: 0px 24px;
      justify-content: space-between;
      align-items: center;
      background: var(--fill_bg_1);
      border-bottom:1px solid var(--fill_line_1);
      .left-part {
        display: flex;
        height: 48px;
        align-items: center;
        gap: 24px;
        .tab {
          user-select: none;
          cursor: pointer;
          position: relative;
          color: var(--text_2);
          font-family: "Lexend";
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          &:hover{
            color: var(--text_brand);
          }
        }
        .tab[data-active='true'] {
          color: var(--text_brand);
          
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
