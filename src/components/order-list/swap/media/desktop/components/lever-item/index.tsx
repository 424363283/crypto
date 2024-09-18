import { clsx } from '@/core/utils';

export const LeverItem = ({
  lever = 0,
  onClick,
  className,
  children,
}: {
  onClick?: any;
  className?: string;
  lever: any;
  children?: any;
}) => {
  return (
    <>
      <div className={clsx('lever', className)} onClick={onClick}>
        {lever}X
      </div>
      <style jsx>
        {`
          .lever {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 4px;
            width: 26px;
            height: 14px;
            background: var(--skin-primary-bg-color-opacity-1);
            border-radius: 2px;
            font-size: 12px;
            font-weight: 400;
            color: var(--skin-primary-color);
          }
        `}
      </style>
    </>
  );
};
