import CommonIcon from '@/components/common-icon';
import { ReactNode, useMemo } from 'react';

export const ColSortTitle = ({
  children,
  value,
  onChange,
}: {
  children: ReactNode;
  value?: number;
  onChange: (v?: number) => any;
}) => {
  const sortIcons = useMemo(() => {
    return [
      <CommonIcon name="common-sort-icon" size={16} />,
      <CommonIcon name="common-sort-down-active-icon" size={16} enableSkin />,
      <CommonIcon name="common-sort-up-active-icon" size={16} enableSkin />
    ];
  }, []);
  return (
    <>
      <div className={'title'} onClick={() => onChange(value === 0 ? 1 : value === 1 ? undefined : 0)}>
        {children}
        <div className={'sort'}>
          {sortIcons[(value ?? -1) + 1 ]}
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
