import { Svg } from '@/components/svg';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { clsx } from '../styled';

export const Info = ({ label, value, className, info }: { label: any; value: any; className?: any; info?: any }) => {
  return (
    <>
      <div className={clsx('info')}>
        <div className={clsx('label')}>
          {label}
          {info && (
            <Tooltip title={info} placement='topLeft'>
              <div>
                <Svg className={clsx('icon')} src='/static/images/swap/tips_info.svg' height={12} width={12} />
              </div>
            </Tooltip>
          )}
        </div>
        <div className={clsx('value', className)}>{value}</div>
      </div>
      <style jsx>{`
        .info {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          &:first-child {
            margin-top: 15px;
          }
          .label {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 12px;
            font-weight: 500;
            color: var(--theme-trade-text-color-3);
            .icon {
              margin-left: 4px;
            }
          }
          .value {
            font-size: 12px;
            font-weight: 400;
            color: var(--theme-trade-text-color-1);
            &.green {
              color: var(--color-green);
            }
            &.red {
              color: var(--color-red);
            }
          }
        }
      `}</style>
    </>
  );
};
