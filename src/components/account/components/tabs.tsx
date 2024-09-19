import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../store';

type Tab = {
  label: string;
  children: React.ReactNode;
  tips?: string;
};

export const Tabs = ({ items }: { items: Tab[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    store.curTab = activeIndex;
  }, [activeIndex]);
  return (
    <div className='tabs-wrapper'>
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
    .tabs-title {
      margin-left: -30px;
      margin-right: -30px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(121, 130, 150, 0.15);
      padding: 0;
      margin-bottom: 0;
      @media ${MediaInfo.mobile} {
        border-bottom: none;
      }
      :global(.tabs-item) {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 42px;
        color: var(--theme-font-color-1);
        font-weight: 500;
        cursor: pointer;
        margin-right: 20px;
        font-size: 14px;
        margin-left: 30px;
      }
      :global(.active-tab) {
        background: #782CE8;
        color: #FFFFFF;
        padding: 3px 6px;
        border-radius: 11.5px;
        /* border-bottom: 2px solid var(--skin-color-active); */
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
