import { RecentTradeItem } from '@/core/shared';
import { memo } from 'react';
import { RecentItemVol } from './recent-item-vol';

const _recentItem = ({ item }: { item: RecentTradeItem }) => {
  return (
    <>
      <div className='recent-item'>
        <div className='recent-item-left'>{item.time}</div>
        <div className='recent-item-center' style={{ color: `var(${item.isBuy ? '--color-green' : '--color-red'})` }}>
          {item.price}
        </div>
        <RecentItemVol item={item} />
      </div>

      <style jsx>{`
        .recent-item {
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--theme-trade-depth-height);

          > div {
            height: 28px;
            display: flex;
            align-items: center;
          }
          .recent-item-left {
            padding-left: 12px;
            color: var(--theme-trade-text-color-1);
            flex: 1;
            text-align: left;
          }
          .recent-item-center {
            padding-right: 12px;
            color: var(--color-green);
            flex: 1;
            flex-direction: row-reverse;
          }
        }
      `}</style>
    </>
  );
};

export const RecentItem = memo(_recentItem);
