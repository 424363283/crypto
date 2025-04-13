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
        {lever}<span>X</span>
      </div>
      <style jsx>
        {`
          .lever {
            color: var(--text-primary);
            font-size: 12px;
            font-weight: 400;
            padding:0 4px;
          }
        `}
      </style>
    </>
  );
};
