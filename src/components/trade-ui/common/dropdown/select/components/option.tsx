import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

export const Option: <T>(props: { component?: any; className?: string } & T) => any = ({
  component: Comp = 'div',
  className,
  ...props
}) => {
  return (
    <>
      <Comp className={clsx('trade-view-component-option', className)} {...props} />
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .trade-view-component-option:hover {
    border-radius: 5px;
    &:hover,
    &.active {
      border-radius: 5px;
      color: var(--text_brand);
      font-weight: 500;
    }
  }
`;
const clsx = clsxWithScope(className);

export default Option;
