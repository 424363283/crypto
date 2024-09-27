import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { HistoryRange, SideType, Spot } from '@/core/shared';
import { SpotPositionListItem } from '@/core/shared/src/spot/position/types';

import { useAppContext } from '@/core/store';
import { getActive } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

const { Position } = Spot;

const Item = ({ data: item }: { data: SpotPositionListItem }) => {
  return (
    <>
      <div className='container'>
        <ul>
          <li>
            <div>
              <span className='pair'>
                {item.side === SideType.BUY ? (
                  <span className='buy'>{LANG('买入____2')}</span>
                ) : (
                  <span className='sell'>{LANG('卖出____2')}</span>
                )}
                {item.symbol.replace('_', '/')}
              </span>
            </div>
            <div>
              <div className='sub-font'>{dayjs(item?.dealTime).format('MM-DD HH:mm:ss')}</div>
            </div>
          </li>
          <li>
            <div className='sub-font'>
              {LANG('成交均价')}({item?.sourceCoin})
            </div>
            <div>{item.price?.toFormat()}</div>
          </li>
          <li>
            <div className='sub-font'>
              {LANG('成交数量')}({item?.targetCoin})
            </div>
            <div>{item.volume?.toFormat()}</div>
          </li>
          <li>
            <div className='sub-font'>
              {LANG('手续费')}({item?.openType === 2 ? 'USDT' : item?.targetCoin})
            </div>
            <div>{item?.fee.toFormat()}</div>
          </li>
          <li>
            <div className='sub-font'>
              {LANG('成交金额')}({item.side === SideType.BUY ? item.sourceCoin : item.targetCoin})
            </div>
            <div>{item.volume?.toFormat()}</div>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .container {
          margin: 16px;
          border-bottom: 1px solid var(--theme-border-color-2);
          &:first-child {
            margin-top: 0;
          }
          ul {
            padding: 0;
            margin: 0;
            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              color: var(--theme-font-color-1);
              font-size: 12px;
            }
          }
          .pair {
            font-size: 16px;
            font-weight: 500;
            span {
              display: inline-block;
              height: 20px;
              border-radius: 6px;
              font-size: 12px;
              margin-right: 8px;
              padding: 2px 4px;
              color: #fff;
              &.buy {
                background: var(--color-green);
              }
              &.sell {
                background: var(--color-red);
              }
            }
          }
          .sub-font {
            font-size: 12px;
            color: var(--theme-font-color-3);
            span {
              margin-left: 8px;
              color: var(--theme-font-color-1);
            }
          }
        }
      `}</style>
    </>
  );
};

const TradeHistoryTable = () => {
  const id = useRouter().query.id as string;
  const { tradeHistoryList, loading, hideOther, historyRange, orderList } = Position.state;

  const { isLogin } = useAppContext();

  const filterTradeHistoryList = useMemo(() => {
    let resultList = tradeHistoryList;
    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (!isLogin) {
      return [];
    }

    return resultList;
  }, [hideOther, tradeHistoryList, id, isLogin]);

  useEffect(() => {
    Position.resetHistoryRange();
    Position.fetchTradeHistoryList();
  }, []);

  const optionsList = [
    {
      value: HistoryRange.DAY,
      label: LANG('本日'),
    },
    {
      value: HistoryRange.WEEK,
      label: LANG('本周'),
    },
    {
      value: HistoryRange.MONTH,
      label: LANG('本月'),
    },
    {
      value: HistoryRange.THREE_MONTH,
      label: LANG('近三月'),
    },
  ];

  return (
    <>
      <div className='container'>
        {isLogin && (
          <div className='btn-group'>
            {optionsList.map((item) => (
              <button
                key={item.label}
                className={getActive(historyRange === item.value)}
                onClick={() => Position.changeHistoryRange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <ListView data={filterTradeHistoryList} loading={!filterTradeHistoryList.length && loading}>
          {(index) => {
            const item = filterTradeHistoryList[index];

            return <Item key={index} data={item} />;
          }}
        </ListView>
      </div>
      <style jsx>{`
        .btn-group {
          margin-left: 10px;
          margin-bottom: 20px;
          button {
            border: none;
            outline: none;
            padding: 4px 8px;
            margin-bottom: 6px;
            background: var(--theme-background-color-2-4);
            color: var(--theme-font-color-1);
            margin-right: 10px;
            border-radius: 6px;
            &.active {
              color: var(--skin-primary-color);
            }
          }
        }
      `}</style>
    </>
  );
};

export default TradeHistoryTable;
