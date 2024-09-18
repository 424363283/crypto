import { getActive } from '@/core/utils';
import { StarFilled } from '@ant-design/icons';
import { memo } from 'react';

const TitleComponent = ({
  activeIndex,
  onTabsChange,
  tabs = [],
}: {
  activeIndex: number;
  tabs: string[];
  onTabsChange: (index: number) => void;
}) => {
  return (
    <>
      <div className='title'>
        {tabs.map((tab, index) => {
          return (
            <div key={tab}>
              {index === 0 && (
                <span className='star-wrapper'>
                  <StarFilled style={{ marginRight: '6px' }} />
                </span>
              )}
              <span className={`${getActive(activeIndex == index)} tab-item`} onClick={() => onTabsChange(index)}>
                {tab}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>
        {`
          .title {
            display: flex;
            height: 38px;
            color: var(--theme-font-color-2);
            padding: 0 10px;
            align-items: center;
            font-size: 14px;
            border-bottom: 1px solid var(--skin-border-color-1);
            > div {
              display: flex;
              cursor: pointer;
              margin-right: 25px;
              .star-wrapper {
                display: flex;
                align-items: center;
              }
              .tab-item {
                display: inline-block;
                line-height: 36px;
                border-bottom: 2px solid transparent;
                &.active {
                  border-bottom: 2px solid var(--skin-primary-color);
                  color: var(--theme-font-color-1);
                  font-weight: 500;
                }
              }
            }
          }
        `}
      </style>
    </>
  );
};

export const Title = memo(TitleComponent);
