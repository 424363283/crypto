import { Switch } from '@/components/switch';
import { clsx } from '@/core/utils';

export const SettingItem = ({
  title,
  titleClassName,
  right,
  value,
  onChange,
  border,
  onClick,
  info,
  children,
  className,
}: {
  title: any;
  titleClassName?: any;
  right?: any;
  value?: any;
  onChange?: any;
  border?: any;
  onClick?: any;
  info?: any;
  children?: any;
  className?: any;
}) => {
  return (
    <>
      <div className={clsx('setting-item', border && 'border', className)} onClick={onClick}>
        <div className='header'>
          <div className={clsx('title', titleClassName)}>{title}</div>
          <div className={clsx('right')}>
            {right ? right : <Switch bgType={3} checked={value} onChange={onChange} size='small' />}
          </div>
        </div>
        <div className='desc'>{info}</div>
        {children}
      </div>
      <style jsx>{`
        .setting-item {
          cursor: pointer;
          margin: 10px 20px 0;
          padding-bottom: 10px;
          &.border {
            border-bottom: 1px solid var(--theme-trade-border-color-1);
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title {
              font-size: 14px;
              color: var(--theme-trade-text-color-1);
            }
          }
          .desc {
            margin-top: 15px;
            font-size: 12px;
            color: var(--theme-trade-text-color-3);
          }
        }
      `}</style>
    </>
  );
};
