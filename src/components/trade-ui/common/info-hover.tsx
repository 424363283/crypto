import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

export const InfoHover = ({ className, componnet: Comp = 'div', hoverColor = false, ...props }: any) => {
  return (
    <>
      <Comp className={clsx('info-hover', hoverColor && 'hover-color', className)} {...props}></Comp>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .info-hover {
    cursor: pointer;
    border-bottom: 1px dashed rgba(115, 116, 115, 0.5);
    line-height: normal;

    &.hover-color {
      &.ant-tooltip-open:hover {
        color: var(--theme-font-color-1) !important;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
