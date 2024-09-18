import { Svg } from '@/components/svg';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { ReactNode } from 'react';

export const InputLabel = ({
  prefix,
  suffix,
  label,
  info,
}: {
  prefix?: ReactNode;
  suffix?: ReactNode;
  label: string;
  info: string;
}) => {
  return (
    <>
      <div className='input-label'>
        {' '}
        <Tooltip title={info} placement='topLeft'>
          <div className='left'>
            {prefix}
            <div className='label'>{label}</div>
            <Svg src='/static/images/swap/tips_info.svg' height={12} width={12} />
          </div>
        </Tooltip>
        {suffix}
      </div>
      <style jsx>{`
        .input-label {
          margin-bottom: 9px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .left {
            cursor: pointer;
            display: flex;
            align-items: center;

            .label {
              color: var(--theme-trade-text-color-3);
              font-size: 12px;
              margin-right: 5px;
            }
          }
        }
      `}</style>
    </>
  );
};
