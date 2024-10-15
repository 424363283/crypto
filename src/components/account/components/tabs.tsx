import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../store';

export type Tab = {
  key: string;
  label: string;
  children: React.ReactNode;
  tips?: string;
};

export const Tabs = ({ items, children }: { items: Tab[], children?: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    store.curTab = items[activeIndex].key;
  }, [activeIndex]);
  return (
    <div className='tabs-wrapper'>
      <div className='tabs'>
        <ul className='tabs-title'>
          {items.map((tab, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={clsx('tabs-item', activeIndex === index ? 'active-tab' : '')}
            >
              {tab.label}
            </li>
          ))}
        </ul>
        {children}
      </div>
      <div className='tabs-content'>
        {items[activeIndex]?.tips ? <p className='tips'>{items[activeIndex].tips ?? ''}</p> : null}
        {items[activeIndex].children}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
.tabs-wrapper {
  .tabs {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 16px 0;
    .tabs-title {
      display: flex;
      align-items: center;
      padding: 0;
      margin-top: 0;
      margin-bottom: 0;
      @media ${MediaInfo.mobile} {
        border-bottom: none;
      }
      :global(.tabs-item) {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 52px;
        min-height: 26px;
        color: var(--theme-font-color-1);
        font-weight: 500;
        cursor: pointer;
        margin-right: 20px;
        font-size: 14px;
        padding: 3px 6px;
      }
      :global(.active-tab) {
        background: #782CE8;
        color: #FFFFFF;
        padding: 3px 6px;
        border-radius: 23px;
        /* border-bottom: 2px solid var(--skin-color-active); */
      }
    }
  }
  .tabs-content {
    padding: 30px 0px 0px;
    .tips {
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      margin: 0 0 35px;
    }
    :global(.qrcode-login) {
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
`;
