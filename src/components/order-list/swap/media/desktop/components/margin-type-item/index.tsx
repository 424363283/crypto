import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';

export const MarginTypeItem = ({
  type,
  lever = 0,
  onClick,
  className,
  children,
}: {
  type: number;
  onClick?: any;
  className?: string;
  children?: any;
}) => {
  return (
    <>
      <div className={clsx('margin-type', className)} onClick={onClick}>
       {type === 1 ? LANG('全仓') : LANG('逐仓')}
      </div>
      <style jsx>
        {`
          .margin-type {
            display: flex;
            width: 40px;
            height: 16px;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            background: var(--fill-pop);
            color: var(--text-secondary);
            font-size: 10px;
            font-weight: 400;
          }
        `}
      </style>
    </>
  );
};
