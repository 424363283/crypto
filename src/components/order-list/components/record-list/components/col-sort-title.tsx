import { Svg } from '@/components/svg';
import { clsx } from '@/core/utils';
import { ReactNode } from 'react';

export const ColSortTitle = ({
  children,
  value,
  onChange,
}: {
  children: ReactNode;
  value?: number;
  onChange: (v?: number) => any;
}) => {
  return (
    <>
      <div className={'title'}>
        {children}
        <div className={'sort'} onClick={() => onChange(value === 0 ? 1 : value === 1 ? undefined : 0)}>
          <Svg
            src={
              [
                '/static/images/common/sort_arrow.svg',
                '/static/images/common/sort_arrow2.svg',
                '/static/images/common/sort_arrow1.svg',
              ][value ? 0 : (value || 0) + 1]
            }
            width={10}
            height={10}
            className={clsx('up', value === 1 && 'selected')}
          />
        </div>
      </div>
      <style jsx>
        {`
          .title {
            display: flex;
            align-items: center;
            flex-direction: row;
          }
          .sort {
            height: 20px;
            margin-left: 4px;
            width: 10px;
            display: inline-flex;
            flex-direction: column-reverse;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            height: 100%;
            vertical-align: top;
            position: relative;
          }
        `}
      </style>
    </>
  );
};

export default ColSortTitle;
