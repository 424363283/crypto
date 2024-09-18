import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';

export const Button = ({
  className,
  component: Comp = 'div',
  ...props
}: {
  onClick?: any;
  className?: any;
  children?: any;
  component?: any;
}) => {
  const { isDark } = useTheme();
  return (
    <>
      <Comp className={clsx('trade-base-button', className)} {...props}></Comp>
      <style jsx>
        {`
          .trade-base-button {
            &:hover {
              box-shadow: ${isDark
                  ? '0px 2px 40px 0px rgba(255, 255, 255, 0.1)'
                  : '0px 2px 40px 0px rgba(255, 255, 255, 0.6)'}
                inset;
            }
            &:active {
              box-shadow: ${isDark ? '0px 2px 40px 0px rgba(0, 0, 0, 0.1)' : '0px 2px 40px 0px rgba(0, 0, 0, 0.04)'}
                inset;
              transform: translateY(1px);
            }
          }
        `}
      </style>
    </>
  );
};
