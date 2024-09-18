import { MediaInfo, clsx } from '@/core/utils';
import React, { useCallback } from 'react';
import css from 'styled-jsx/css';
import Tab from './tab';

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
};

const TabBar: React.FC<TabBarProps> = ({
  children,
  className,
  options,
  renderTab,
  value: propValue,
  onChange,
  tabClassName,
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
        <Tab key={index} active={active} value={tabValue} onClick={onChange} className={tabClassName}>
          {label}
        </Tab>
      );
    },
    [propValue, onChange, tabClassName]
  );

  return (
    <div className={clsx('tab-bar', className)}>
      <div className='tabs'>{options.map(renderTab ? renderTab : _renderTab)}</div>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};

export default TabBar;

const styles = css`
  .tab-bar {
    position: relative;
    z-index: 99;
    display: flex;
    height: 60px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--theme-border-color-2);
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 20px;
    @media ${MediaInfo.mobile} {
      padding: 0 10px;
    }
    &::-webkit-scrollbar {
      height: 0;
    }
    .tabs {
      flex-shrink: 0;
      height: 60px;
      display: flex;
      flex-direction: row;
      @media ${MediaInfo.mobile} {
        padding: 0;
      }
    }
  }
`;
