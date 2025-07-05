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
              <span className='label'>{tab.label}</span>
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
  padding: 40px 0 0;
  @media ${MediaInfo.mobile} {
    padding: 36px 0 0;
  }
  .tabs {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
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
        min-height: 26px;
        color: var(--text_2);
        font-weight: 500;
        cursor: pointer;
        margin-right: 40px;
        font-size: 16px;
        @media ${MediaInfo.mobile} {
          font-size: 14px;
          margin-right: 24px;
          .label {
            padding: 6px 16px;
          }
        }
      }
      :global(.active-tab) {
        color: var(--text_brand);
        border-radius: 23px;
        /* border-bottom: 2px solid var(--skin-color-active); */
        @media ${MediaInfo.mobile} {
          background: var(--brand);
          color: var(--text_white);
        }
      }
    }
  }
  .tabs-content {
    padding: 24px 0px 0px;
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
