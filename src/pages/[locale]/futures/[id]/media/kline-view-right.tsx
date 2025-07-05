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
      <div className={clsx('right-box  Transactions ', tab === 2 && 'show')}>
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
    background-color: var(--fill_1);
    flex-direction: column;
    overflow: hidden;
    height: 100%;
 
  }
  .Transactions{
    height: 100%;
    padding-bottom: 16px !important;
  }
  .right-title {
    height: 40px;
    padding: 16px 4px;
    border-bottom: 1px solid var(--fill_line_1);
    color: var(--text_2);
    display:flex;
    align-items:center;
    &.ru,
    &.pt,
    &.es,
    &.fr,
    &.tl {
      font-size: 12px;
    }
    span {
      cursor: pointer;
      padding:0 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

       font-family: "Lexend";;
      font-size: 14px;
      font-weight: 500;

      &.active {
        color: var(--text_brand);
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
    padding:16px 0 0;
    &.show {
      display: flex;
    }
  }
`;

export default KlineViewRight;
