import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { Size } from '@/components/constants';
import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const TAB_LIMIT = 4;

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
  const getTabItemLang = useCallback((item: string) => {
    return /^[a-zA-Z0-9]+$/.test(item) ? item : LANG(item);
  }, [tabs]);
  useEffect(() => {
    if (tabs.length > 0) {
      setDropdownTab(tabs.slice(TAB_LIMIT, TAB_LIMIT + 1)?.[0]);
    }
  }, [tabs]);

  const items: MenuProps['items'] = tabs2.map((item) => {
    return {
      key: item,
      label: <span className={tabs[activeIndex] === item ? 'active' : ''}>{getTabItemLang(item)}</span>,
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
      <div className='secondary-title list-wrap'>
        <div className='list'>
          {tabs1.map((item: string, index: number) => {
            return (
              <Button
                key={item}
                size={Size.XS}
                className={clsx('item', index == activeIndex ? 'active' : '', item === 'LVTs' && 'etf')}
                onClick={onTabsChange.bind(this, index)}
              >
                {getTabItemLang(item)}
                {item === 'LVTs' && (
                  <>
                    <span className='icon'>{LeverIconMemo}</span>
                    <span className='text'>3x</span>
                  </>
                )}
              </Button>
            );
          })}
          <Dropdown
            menu={{ items, onClick }}
            overlayClassName='spot-list-menu-wrapper'
            placement='bottomRight'
            trigger={['hover']}
          >
            <div>
              <Button
                key={dropdownTab}
                size={Size.XS}
                className={clsx('item', activeIndex >= TAB_LIMIT ? 'active' : '')}
              >
                {activeIndex < TAB_LIMIT ? LANG('更多') : getTabItemLang(tabs[activeIndex])}
                <CommonIcon className='icon' name='common-tiny-triangle-down-2' size={12} />
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>
      <style jsx>{`
        .list-wrap {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0 16px;
          :global(.drop-down-icon) {
            cursor: pointer;
          }
        }
        .list {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          :global(.item) {
            display: flex;
            padding: 4px 8px;
            font-size: 14px;
            background: transparent;
            color: var(--text-secondary);
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            gap: 8px;
            .icon {
              position: absolute;
              right: -1px;
              top: -1.5px;
            }
            .text {
              font-size: 12px;
              color: var(--text-white);
              position: absolute;
              right: 0px;
              top: -4px;
              transform: scale(0.7);
              line-height: 16px;
            }
          }
          :global(.item.active) {
            background: var(--label);
            color: var(--text-brand);
          }
          :global(.item.etf) {
            position: relative;
            :global(img) {
              position: absolute;
              top: -1px;
              right: -1px;
            }
          }
        }
        :global(.spot-list-menu-wrapper) {
          z-index: 1031;
          :global(ul) {
            height: 270px;
            overflow-y: scroll;
            background: var(--dropdown-select-bg-color);
            :global(li) {
              color: var(--text-secondary) !important;
            }
            :global(.ant-dropdown-menu-item) {
              &:hover {
                color: var(--text-brand) !important;
              }
              :global(.active) {
                color: var(--text-brand) !important;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(SecondaryTitle);
