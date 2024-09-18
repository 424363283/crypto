import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .wrapper {
    height: 105px;
    padding-top: 20px;
    .slider-dots {
      position: relative;
      justify-content: flex-start;
      .slider-dot {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        :global(.item) {
          border-color: var(--theme-background-color-2);
        }
        .slider-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 24px;
          font-size: 12px;
          color: #656e80;
          width: 0;
          text-align: center;
        }
      }
    }
    .slider-track {
      width: 100% !important;
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
