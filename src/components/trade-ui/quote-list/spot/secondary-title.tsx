import { Svg } from '@/components/svg';
import { clsx } from '@/core/utils';
import { Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

const TAB_LIMIT = 3;

const SecondaryTitle = ({
  activeIndex,
  onTabsChange,
  tabs = [],
}: {
  tabs: string[];
  activeIndex: number;
  onTabsChange: (index: number) => void;
}) => {
  const tabs1 = tabs.slice(0, TAB_LIMIT);
  const tabs2 = tabs.slice(TAB_LIMIT);
  const [dropdownTab, setDropdownTab] = useState('');

  useEffect(() => {
    if (tabs.length > 0) {
      setDropdownTab(tabs.slice(TAB_LIMIT, TAB_LIMIT + 1)?.[0]);
    }
  }, [tabs]);

  const items: MenuProps['items'] = tabs2.map((item) => {
    return {
      key: item,
      label: <span className={tabs[activeIndex] === item ? 'active' : ''}>{item}</span>,
    };
  });

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const indexInTab2 = tabs2.findIndex((i) => i == key);
    onTabsChange(indexInTab2 + TAB_LIMIT);
    setDropdownTab(key);
  };

  const LeverIconMemo = useMemo(() => {
    return <Svg src={'/static/images/common/spot-3x.svg'} width={15} height={11} />;
  }, []);

  return (
    <>
      <div className='list-wrap'>
        <div className='list'>
          {tabs1.slice(0, 4).map((item: string, index: number) => {
            return (
              <button
                className={clsx('item', index == activeIndex ? 'active' : '', item === 'LVTs' && 'etf')}
                key={item}
                onClick={onTabsChange.bind(this, index)}
              >
                {item}
                {item === 'LVTs' && (
                  <>
                    <span className='icon'>{LeverIconMemo}</span>
                    <span className='text'>3x</span>
                  </>
                )}
              </button>
            );
          })}
          <button
            className={clsx('item', activeIndex >= TAB_LIMIT ? 'active' : '')}
            key={dropdownTab}
            onClick={onTabsChange.bind(this, TAB_LIMIT)}
          >
            {dropdownTab}
          </button>
        </div>
        <Dropdown
          menu={{ items, onClick }}
          overlayClassName='spot-list-menu-wrapper'
          placement='bottomRight'
          trigger={['hover']}
        >
          <Image
            src='/static/images/trade/quote/arrow-down.svg'
            alt=''
            width='12'
            height='12'
            className='drop-down-icon'
          />
        </Dropdown>
      </div>
      <style jsx>{`
        .list-wrap {
          display: flex;
          align-items: center;
          width: 100%;
          margin-top: 16px;
          padding-right: 10px;
          :global(.drop-down-icon) {
            cursor: pointer;
          }
        }
        .list {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          padding-right: 5px;
          > .item {
            font-size: 12px;
            color: var(--theme-font-color-3);
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid transparent;
            white-space: nowrap;
            background: var(--theme-background-color-3);
            padding: 2px 10px;
            min-width: 56px;
            &.active {
              color: var(--skin-font-color);
              background-color: var(--skin-primary-color);
            }
            &.etf {
              position: relative;
              :global(img) {
                position: absolute;
                top: -1px;
                right: -1px;
              }
            }
            .icon {
              position: absolute;
              right: -1px;
              top: -1.5px;
            }
            .text {
              font-size: 12px;
              color: #fff;
              position: absolute;
              right: 0px;
              top: -4px;
              transform: scale(0.7);
              line-height: 16px;
            }
          }
        }
        :global(.spot-list-menu-wrapper) {
          z-index: 1031;
          :global(ul) {
            background: var(--theme-trade-input-bg) !important;
            :global(li) {
              color: var(--theme-trade-text-color-1) !important;
            }
            :global(.ant-dropdown-menu-item) {
              &:hover {
                background: var(--skin-primary-bg-color-opacity-3) !important;
                color: var(--skin-primary-color) !important;
              }
              :global(.active) {
                color: var(--skin-primary-color) !important;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(SecondaryTitle);
