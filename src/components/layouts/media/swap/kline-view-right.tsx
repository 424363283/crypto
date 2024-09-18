import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import css from 'styled-jsx/css';

const KlineViewRight = ({
  Chart,
  OrderBook,
  RecentTrades,
  className,
}: {
  Chart?: React.ReactNode;
  OrderBook: React.ReactNode;
  RecentTrades: React.ReactNode;
  className?: string;
}) => {
  const { query } = useRouter();
  const [tab, setTab] = useState(Chart ? 0 : 1);
  return (
    <div className='kline-view-right'>
      <div className={clsx('right-title', query.locale)}>
        {Chart && (
          <span className={tab === 0 ? 'active' : ''} onClick={() => setTab(0)}>
            {LANG('Chart')}
          </span>
        )}
        <span className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}>
          {LANG('盘口')}
        </span>
        <span className={tab === 2 ? 'active' : ''} onClick={() => setTab(2)}>
          {LANG('最近成交')}
        </span>
      </div>
      {Chart && (
        <div className={clsx('right-box', tab === 0 && 'show')}>
          <>{Chart}</>
        </div>
      )}
      <div className={clsx('right-box', tab === 1 && 'show')}>
        <>{OrderBook}</>
      </div>
      <div className={clsx('right-box', tab === 2 && 'show')}>
        <>{RecentTrades}</>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .kline-view-right {
    border-radius: var(--theme-trade-layout-radius);
    display: flex;
    background-color: var(--theme-trade-bg-color-2);
    flex-direction: column;
    overflow: hidden;
  }
  .right-title {
    height: 44px;
    padding: 0 12px 4px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    color: var(--theme-trade-text-color-3);
    &.ru,
    &.pt,
    &.es,
    &.fr,
    &.tl {
      font-size: 12px;
    }
    @media ${MediaInfo.mobile} {
      border-bottom: 1px solid rgba(var(--theme-trade-border-color-1-rgb), 0.5);
    }
    span {
      cursor: pointer;
      margin-right: 20px;
      line-height: 42px;
      border-bottom: 2px solid transparent;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &.active {
        color: var(--theme-trade-text-color-1);
        border-bottom: 2px solid var(--skin-primary-color);
      }
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  .right-box {
    flex: 1;
    display: none;
    flex-direction: column;
    overflow: hidden;
    &.show {
      display: flex;
    }
  }
`;

export default KlineViewRight;
