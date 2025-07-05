import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { HistoryRange, SideType, SpotOrderType, Spot } from '@/core/shared';
import { SpotPositionListItem } from '@/core/shared/src/spot/position/types';

import { useAppContext } from '@/core/store';
import { getActive } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import ClipboardItem from '@/components/clipboard-item';

const { Position } = Spot;

const Item = ({ data: item }: { data: SpotPositionListItem }) => {
  return (
    <>
      <div className="container">
        <div className="header">
          <div className="item">
            <div className="code">
              <span>{item.symbol.split('_')[0]}</span>/{item.symbol.split('_')[1]}
            </div>
            <div className="type">
              <div className={item.side === SideType.BUY ? 'buy' : 'sell'}>
                {LANG(item.side === SideType.BUY ? '买入' : '卖出')}
              </div>
              {/* <span>{LANG(item.type === SpotOrderType.LIMIT ? '限价' : '市价')}</span> */}
            </div>
          </div>
        </div>
        <div className="info">
          <div className="row">
            <div className="item">
              <span> {LANG('成交均价')}</span>
              <span>{item.price.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('成交数量')}</span>
              <span>{item.volume.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('成交金额')}</span>
              <span>
                {item.amount.toFormat(4)} {item.side === SideType.BUY ? item.sourceCoin : item.targetCoin}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <span>
                {' '}
                {LANG('手续费')} {item.openType === 2 ? 'USDT' : item.targetCoin}
              </span>
              <span>{item.fee.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('成交时间')}</span>
              <span>{dayjs(item.dealTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <div className="item">
              <span> {LANG('订单编号')}</span>
              <span>
                <ClipboardItem text={item.id} />
              </span>
            </div>
          </div>
        </div>
        {/* <ul>
          <li>
            <div>
              <span className="pair">
                {item.side === SideType.BUY ? (
                  <span className="buy">{LANG('买入____2')}</span>
                ) : (
                  <span className="sell">{LANG('卖出____2')}</span>
                )}
                {item.symbol.replace('_', '/')}
              </span>
            </div>
            <div>
              <div className="sub-font">{dayjs(item?.dealTime).format('MM-DD HH:mm:ss')}</div>
            </div>
          </li>
          <li>
            <div className="sub-font">
              {LANG('成交均价')}({item?.sourceCoin})
            </div>
            <div>{item.price?.toFormat()}</div>
          </li>
          <li>
            <div className="sub-font">
              {LANG('成交数量')}({item?.targetCoin})
            </div>
            <div>{item.volume?.toFormat()}</div>
          </li>
          <li>
            <div className="sub-font">
              {LANG('手续费')}({item?.openType === 2 ? 'USDT' : item?.targetCoin})
            </div>
            <div>{item?.fee.toFormat()}</div>
          </li>
          <li>
            <div className="sub-font">
              {LANG('成交金额')}({item.side === SideType.BUY ? item.sourceCoin : item.targetCoin})
            </div>
            <div>{item.volume?.toFormat()}</div>
          </li>
        </ul> */}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--fill_line_1);
          font-size: 14px;
          color: var(--text_1);
          font-weight: 500;
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .code {
              color: var(--text_2);
              span {
                font-size: 16px;
                color: var(--text_1);
              }
            }
            .type {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 4px;
              span {
                width: 48px;
                height: 20px;
                font-size: 12px;
                line-height: 20px;
                text-align: center;
                color: var(--text_2);
                border-radius: 4px;
                background: var(--fill_3);
              }
            }
            .buy,
            .sell {
              width: 3rem;
              height: 1.25rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              border-radius: 4px;
              color: var(--text_white);
              font-size: 12px;
              font-weight: 400;
            }
            .buy {
              background: var(--color-green);
            }
            .sell {
              background: var(--color-red);
            }
            .revoke {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 5.5rem;
              height: 2rem;
              border-radius: 1.5rem;
              background: var(--text_brand);
              color: var(--text_white);
              font-size: 12px;
              font-weight: 400;
            }
          }
          .item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .info {
            padding-bottom: 12px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            .row {
              width: 100%;
              display: flex;
              .item {
                flex: 1;
                &:nth-child(1),
                &:nth-child(2) {
                  align-items: start;
                }
                &:nth-child(3) {
                  align-items: end;
                  text-align: right;
                }
                span {
                  width: 100%;
                  font-size: 12px;
                  font-weight: 400;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  &:first-child {
                    color: var(--text_3);
                  }
                  :global(.copy-content) {
                    justify-content: flex-end;
                  }
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};

const TradeHistoryTable = ({ showFilter }: { showFilter: boolean }) => {
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
    setTimeout(() => Position.pollingTradeHistory.start(), 1000);
    return () => {
      Position.pollingTradeHistory.stop();
    };
  }, []);

  const optionsList = [
    {
      value: HistoryRange.DAY,
      label: LANG('本日')
    },
    {
      value: HistoryRange.WEEK,
      label: LANG('本周')
    },
    {
      value: HistoryRange.MONTH,
      label: LANG('本月')
    },
    {
      value: HistoryRange.THREE_MONTH,
      label: LANG('近三月')
    }
  ];

  return (
    <>
      <div className="container">
        {isLogin && showFilter && (
          <div className="btn-group">
            {optionsList.map(item => (
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
          {index => {
            const item = filterTradeHistoryList[index];

            return <Item key={index} data={item} />;
          }}
        </ListView>
      </div>
      <style jsx>{`
        .btn-group {
          display: flex;
          gap: 1rem;
          padding: 8px 1rem;
          border-bottom: 1px solid var(--fill_line_1);
          button {
            border: none;
            outline: none;
            padding: 4px 8px;
            margin: 0;
            background: var(--fill_3);
            color: var(--text_1);
            font-size: 12px;
            font-weight: 400;
            border-radius: 4px;
            &.active {
              color: var(--text_brand);
              background: var(--brand_20);
            }
          }
        }
      `}</style>
    </>
  );
};

export default TradeHistoryTable;
