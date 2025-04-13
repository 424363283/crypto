import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .calculator-modal {
    width: 720px !important;
    .title {
      padding-top: 0;
      padding-left: 0;
      margin-right: 0;
      .menus {
        display: flex;
        align-items: center;
        gap: 24px;
        align-self: stretch;
        color: var(--text-secondary);
        > div {
          cursor: pointer;
          color: var(--text-secondary);
          text-align: justify;
          font-family: 'HarmonyOS Sans SC';
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          &.active {
            color: var(--text-brand);
            text-align: justify;
            font-family: 'HarmonyOS Sans SC';
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          &:last-child {
            margin-right: 0px;
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      min-height: 402px;
    }
  }
  @media ${MediaInfo.mobile} {
    :global(.modal) {
      background-color: var(--fill-pop) !important;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
