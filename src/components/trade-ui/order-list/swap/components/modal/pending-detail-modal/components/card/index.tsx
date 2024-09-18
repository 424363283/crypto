import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';

export const Card = ({
  className,
  title,
  cardTitle,
  data,
}: {
  className?: string;
  title?: string;
  cardTitle?: string;
  data: any[];
}) => {
  const { isDark } = useTheme();
  return (
    <>
      <div className={clsx('card', !isDark && 'light', className)}>
        {title && <div className={'header'}>{title}</div>}
        <div className={'content'}>
          <div className={'title'}>{cardTitle}</div>
          <div className={'info'}>
            {data.map(([label, value, params = {}], index) => {
              const { buy } = params;
              return (
                <div key={index}>
                  <span>{label}</span>
                  <span
                    className={clsx(buy === true && 'raise', buy === false && 'fall', buy == undefined && 'normal')}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .card {
          width: 100%;
          .header {
            font-size: 12px;
            color: var(--theme-trade-text-color-1);
            width: 100%;
            margin: 0 0 5px;
          }
          .content {
            width: 100%;
            border-radius: 6px;
            padding: 0 10px 10px;
            background: var(--theme-trade-sub-button-bg);
            .title {
              width: 100%;
              font-size: 12px;
              background-color: var(--theme-trade-sub-button-bg);
              color: var(--skin-primary-color);
              padding: 11px 0 12px;
            }
            .info {
              padding: 14px 10px;
              border-radius: 6px;
              background: var(--theme-trade-modal-color);
              > div {
                margin-bottom: 7px;
                &:last-child {
                  margin-bottom: 0px;
                }
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                > span:first-child {
                  font-size: 12px;
                  color: var(--theme-trade-text-color-3);
                }
                > span:last-child {
                  font-size: 12px;
                  &.normal {
                    color: var(--theme-trade-text-color-1);
                  }
                }
                &:first-child {
                  > span:last-child {
                    color: var(--theme-trade-text-color-3) !important;
                  }
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
