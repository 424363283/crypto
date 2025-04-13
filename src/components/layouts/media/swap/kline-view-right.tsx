import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import css from 'styled-jsx/css';

const KlineViewRight = ({
  Chart,
  OrderBook,
  RecentTrades,
  className
}: {
  Chart?: React.ReactNode;
  OrderBook: any;
  RecentTrades: React.ReactNode;
  className?: string;
}) => {
  const { query } = useRouter();
  const [tab, setTab] = useState(Chart ? 0 : 1);
  return (
    <div className="kline-view-right">
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
    background-color: var(--fill-1);
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }
  .Transactions {
    height: 100%;
    padding-bottom: 16px !important;
  }
  .right-title {
    height: 40px;
    padding: 16px 4px;
    border-bottom: 1px solid var(--line-1, rgba(31, 33, 36, 1));
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    &.ru,
    &.pt,
    &.es,
    &.fr,
    &.tl {
      font-size: 12px;
    }
    span {
      cursor: pointer;
      padding: 0 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      font-family: HarmonyOS Sans SC;
      font-size: 14px;
      font-weight: 500;

      &.active {
        color: var(--text-brand);
      }
      &:last-child {
        margin-right: 0px;
      }
    }
    @media ${MediaInfo.mobile} {
      height: 2.5rem;
      padding: 0 1rem;
      span {
        padding: 0;
        padding-right: 1.25rem;
        font-size: 12px;
        color: var(--text-secondary);
        &.active {
          color: var(--brand);
        }
      }
    }
  }
  .right-box {
    flex: 1;
    display: none;
    flex-direction: column;
    overflow: hidden;
    padding: 16px 0 0;
    &.show {
      display: flex;
    }
    @media ${MediaInfo.mobile} {
      padding: 0;
    }
  }
`;

export default KlineViewRight;
