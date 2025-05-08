import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`

  :global(.pick-input-range) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  :global(.basic-input-box) {
    &:hover, &:focus {
      background: var(--fill_3)!important;
    }
  }
  :global(.picker-content) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    :global(.pick-input-wrapper) {
      display: flex;
      flex-direction: column;
      gap: 8px;
      :global(.pick-input-title) {
        color: var(--text_2);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
    :global(.adm-picker-view) {
      color: var(--text_1);
      background: var(--fill_1);
      :global(.adm-picker-view-mask) {
        :global(.adm-picker-view-mask-top) {
          background: var(--fill_1);
          mask: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 50%, #000000 100%);
        }
        :global(.adm-picker-view-mask-bottom) {
          background: var(--fill_1);
          mask: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 50%, #000000 100%);
        }
        :global(.adm-picker-view-mask-middle) {
          border-top: solid 1px var(--fill_line_1);
          border-bottom: solid 1px var(--fill_line_1);
        }
      }
    }
  }

`;
const clsx = clsxWithScope(className);

export { clsx, styles };
