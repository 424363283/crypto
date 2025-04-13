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
      <div className='top-title title'>
        {tabs.map((tab, index) => {
          return (
            <div key={tab}>
              {/* index === 0 && (
                <span className='star-wrapper'>
                  <StarFilled style={{ marginRight: '6px' }} />
                </span>
              ) */}
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
            gap: 24px;
            position: relative;
            align-items: center;
            align-self: stretch;
            padding: 0 16px 8px 16px;
            &:after {
              content: "";
              display: block;
              position: absolute;
              bottom: -1px;
              width: calc(100% - 32px);
              border-bottom: 1px solid var(--common-line-color);
            }
            > div {
              display: flex;
              cursor: pointer;
              .star-wrapper {
                display: flex;
                align-items: center;
              }
              .tab-item {
                color: var(--text-secondary);
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                &.active {
                  color: var(--text-brand);
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 500;
                  line-height: normal;
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
