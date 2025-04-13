import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .wrapper {
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 8px;
    @media ${MediaInfo.mobile} {
      height: 1.5rem;
      margin-top: 1rem;
      margin-bottom: 0;
      gap: 4px;
      :global(.percent) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        :global(span) {
          font-size: 10px;
          color: var(--text-secondary);
        }
      }
    }
    :global(.slider) {
      :global(.ant-slider-horizontal.ant-slider-with-marks) {
        margin: 11px 5px;
        @media ${MediaInfo.mobile} {
          margin: 0 4px;
          :global(.ant-slider-handle) {
            width: 8px;
            height: 8px;
            &::after {
              box-shadow: 0 0 0 2px var(--text-brand) !important;
            }
            &::before {
              width: 8px;
              height: 8px;
            }
            &::after {
              width: 8px;
              height: 8px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }
    }
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
