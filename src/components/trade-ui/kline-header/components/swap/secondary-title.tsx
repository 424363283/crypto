import { Svg } from '@/components/svg';
import { clsx } from '@/core/utils';
import { Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

const TAB_LIMIT = 3;

const SecondaryTitle = ({
  className,
  activeIndex,
  onTabsChange,
  tabs = [],
}: {
  className?: string;
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
      <div className={clsx('list-wrap', className)}>
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
          padding-bottom: 8px;
          border-bottom: 1px solid var(--fill-3);
          :global(.drop-down-icon) {
            cursor: pointer;
          }
        }
        .list {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 5px;
          > .item {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-secondary);
            cursor: pointer;
            border-radius: 5px;
            border: none;
            white-space: nowrap;
            background: transparent;
            padding: 0;
            min-width: 56px;
            text-align: left;
            &.active {
              color: var(--text-brand);
              background-color: transparent;
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
                background: var(--label) !important;
                color: var(--brand) !important;
              }
              :global(.active) {
                color: var(--brand) !important;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(SecondaryTitle);
