import { MediaInfo, clsx } from '@/core/utils';
import React, { useCallback } from 'react';
import Tab from './tab';
import { Size } from '../constants';

export enum TAB_TYPE {
  LINE = 'line',
  CARD = 'card',
  TEXT = 'text'
}
/**
 * @prop {any} value
 * @prop {function} onChange
 * @prop {string[] | {label:string, value:string}[]} options
 * @prop {function} renderTab
 */
type TabBarProps = {
  children?: React.ReactNode;
  className?: string;
  options: Array<string | { label: string; value: string }>;
  renderTab?: (option: string | { label: string; value: string }, index: number) => JSX.Element;
  value: string;
  onChange: (value: string) => void;
  tabClassName?: string;
  type?: TAB_TYPE;
  size?: Size;
};

const TabBar: React.FC<TabBarProps> = ({
  children,
  className,
  options,
  renderTab,
  value: propValue,
  onChange,
  tabClassName,
  type = TAB_TYPE.LINE,
  size = Size.DEFAULT
}) => {
  const _renderTab = useCallback(
    (opt: string | { label: string; value: string }, index: number) => {
      let label = '';
      let tabValue = '';

      if (typeof opt === 'string') {
        label = opt;
        tabValue = `${index}`;
      } else {
        label = opt.label;
        tabValue = opt.value;
      }

      const active = tabValue === propValue;

      return (
        <Tab key={index} active={active} value={tabValue} onClick={onChange} className={clsx(tabClassName, type, size)}>
          {label}
        </Tab>
      );
    },
    [propValue, onChange, tabClassName]
  );

  return (
    <div className={clsx('tab-bar border-none', className)}>
      <div className='tabs'>{options.map(renderTab ? renderTab : _renderTab)}</div>
      {children}
      <style jsx>{`
      .tab-bar {
        position: relative;
        z-index: 99;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        @media ${MediaInfo.mobile} {
          padding: 0 10px;
          z-index:1;
        }
        &::-webkit-scrollbar {
          height: 0;
        }
        .tabs {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          flex-direction: row;
          @media ${MediaInfo.mobile} {
            padding: 0;
          }
          gap: ${type === TAB_TYPE.CARD ? 16 : 32}px;
        }
      }
    `}</style>
    </div>
  );
};

export default TabBar;
