import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .record-view {
    min-height: 380px;
    :global(.code-text) {
      font-size: 12px;
      margin-bottom: 0px;
      color: var(--text-primary);
    }
    .tab-bar {
      display: flex;
      padding: 0px 24px;
      justify-content: space-between;
      align-items: center;
      background: var(--fill-1, #121212);
      border-bottom:1px solid var(--line-1);
      .left-part {
        display: flex;
        height: 48px;
        align-items: center;
        gap: 24px;
        .tab {
          user-select: none;
          cursor: pointer;
          position: relative;
          color: var(--text-secondary, #A5A8AC);
          font-family: "HarmonyOS Sans SC";
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          &:hover{
            color: var(--text-brand);
          }
        }
        .tab[data-active='true'] {
          color: var(--text-brand);
          
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
