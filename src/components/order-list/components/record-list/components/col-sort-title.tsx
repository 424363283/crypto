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
      <div className={'title'} onClick={() => onChange(value === 0 ? 1 : value === 1 ? undefined : 0)}>
        {children}
        <div className={'sort'}>
          <Svg
            src={
              [
                '/static/icons/primary/common/sort-icon.svg',
                '/static/icons/primary/common/sort-down-active-icon.svg',
                '/static/icons/primary/common/sort-up-active-icon.svg',
              ][(value ?? -1) + 1 ]
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
            cursor: pointer;
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
