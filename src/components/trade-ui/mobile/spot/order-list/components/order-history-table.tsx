import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SideType, Spot, SpotOrderType, SpotPositionListItem, SpotTradeItem, TradeMap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import ClipboardItem from '@/components/clipboard-item';

const { Position } = Spot;

const getStatus = (state: number) => {
  switch (state) {
    case 1:
      return LANG('等待委托');
    case 2:
      return LANG('委托失败');

    case 3:
      return LANG('已委托');
    case 4:
      return LANG('等待撤单');
    case 5:
      return LANG('正在撤单');
    case 6:
      return LANG('全部撤单');
    case 7:
      return LANG('部分成交');

    case 8:
      return LANG('全部成交');
  }
};

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
              <span>{LANG(item.type === SpotOrderType.LIMIT ? '限价' : '市价')}</span>
            </div>
          </div>
        </div>
        <div className="info">
          <div className="row">
            <div className="item">
              <span> {LANG('委托价格')}</span>
              <span>{item.type === SpotOrderType.LIMIT ? item.price.toFormat() : '--'}</span>
            </div>
            <div className="item">
              <span> {LANG('委托数量')}</span>
              <span>{item.volume.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('成交数量')}</span>
              <span>{item.dealVolume.toFormat()}</span>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <span> {LANG('平均价格')}</span>
              <span>{item.dealPrice.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('成交额')}</span>
              <span>{item.dealAmount.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('状态')}</span>
              <span className={item.state === 6 ? 'red' : item.state === 8 ? 'green' : ''}>
                {item.dealVolume > 0 && item.dealVolume < item.volume ? LANG('部分成交') : getStatus(item.state)}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <span> {LANG('金额')}</span>
              <span>{item.amount.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('委托时间')}</span>
              <span>{dayjs(item.orderTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <div className="item">
              <span> {LANG('订单编号')}</span>
              <span>
                <ClipboardItem text={item.id} />
              </span>
            </div>
          </div>
        </div>
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
            .green {
              color: #07828b;
            }
            .red {
              color: #ef454a;
            }
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

const OrderHistoryTable = () => {
  const id = useRouter().query.id as string;
  const { orderHistoryList, loading, hideOther, hideRevoke } = Position.state;
  // console.log(orderHistoryList);
  const { isLogin } = useAppContext();

  const [spotMap, setSpotMap] = useState<Map<string, SpotTradeItem> | null>(null);

  const filterOrderHistoryList = useMemo(() => {
    let resultList = orderHistoryList;

    if (spotMap) {
      resultList = resultList.map(item => {
        item.dealAmount = item.dealAmount.toFormat(4);
        return item;
      });
    }

    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (hideRevoke) {
      resultList = resultList.filter(({ state }) => (hideRevoke ? state !== 6 : true));
    }
    if (!isLogin) {
      return [];
    }

    return resultList;
  }, [hideOther, hideRevoke, orderHistoryList, id, isLogin, spotMap]);

  useEffect(() => {
    Position.fetchOrderHistoryList();
    initSpotList();
    setTimeout(async() => await Position.pollingOrderHistory.start(), 1000);
    return () => {
      Position.pollingOrderHistory.stop();
    };
  }, []);

  const initSpotList = async () => {
    const map = await TradeMap.getSpotTradeMap();
    setSpotMap(map);
  };

  return (
    <>
      <div className="container">
        <ListView data={filterOrderHistoryList} loading={!filterOrderHistoryList.length && loading}>
          {index => {
            const item = filterOrderHistoryList[index];

            return <Item key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default OrderHistoryTable;
