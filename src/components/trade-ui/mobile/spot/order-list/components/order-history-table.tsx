import { getStatus } from '@/components/order-list/spot/components/order-history-table';
import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SideType, Spot, SpotOrderType, SpotPositionListItem, SpotTradeItem, TradeMap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const { Position } = Spot;

const Item = ({ data: item }: { data: SpotPositionListItem }) => {
  return (
    <>
      <div className='container'>
        <ul>
          <li>
            <div>
              <span className='pair'>{item.symbol.replace('_', '/')}</span>
            </div>
            <div>
              <div className='sub-font'>{dayjs(item.orderTime).format('MM-DD HH:mm:ss')}</div>
            </div>
          </li>
          <li>
            <div>
              {item.side === SideType.BUY ? (
                <span className='name main-raise'>
                  {LANG('买入____2')}/{item.type === SpotOrderType.LIMIT ? LANG('限价') : LANG('市价')}
                </span>
              ) : (
                <span className='name main-fall'>
                  {LANG('卖出____2')}/{item.type === SpotOrderType.LIMIT ? LANG('限价') : LANG('市价')}
                </span>
              )}
            </div>
            <div className='sub-font'>{getStatus(item.state)}</div>
          </li>
          <li>
            <div className='sub-font'>{LANG('成交额')}</div>
            <div>{item.dealAmount}</div>
          </li>
          <li>
            <div className='sub-font'>{LANG('委托价')}</div>
            <div>{item.type === SpotOrderType.LIMIT ? item.price?.toFormat() : LANG('市价')}</div>
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

const OrderHistoryTable = () => {
  const id = useRouter().query.id as string;
  const { orderHistoryList, loading, hideOther, hideRevoke, orderList } = Position.state;
  const { isLogin } = useAppContext();

  const [spotMap, setSpotMap] = useState<Map<string, SpotTradeItem> | null>(null);

  const filterOrderHistoryList = useMemo(() => {
    let resultList = orderHistoryList;

    if (spotMap) {
      resultList = resultList.map((item) => {
        const spotItem = spotMap.get(item.symbol);
        item.dealPrice = item.dealPrice.toFormat(spotItem?.digit);
        item.dealAmount = item.dealAmount.toFormat(4);
        return item;
      });
    }

    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (hideRevoke) {
      resultList = resultList.filter(({ state }) => (hideRevoke ? state !== 5 : true));
    }
    if (!isLogin) {
      return [];
    }

    return resultList;
  }, [hideOther, hideRevoke, orderHistoryList, id, isLogin, spotMap]);

  useEffect(() => {
    Position.fetchOrderHistoryList();
    initSpotList();
  }, []);

  const initSpotList = async () => {
    const map = await TradeMap.getSpotTradeMap();
    setSpotMap(map);
  };

  return (
    <>
      <div className='container'>
        <ListView data={filterOrderHistoryList} loading={!filterOrderHistoryList.length && loading}>
          {(index) => {
            const item = filterOrderHistoryList[index];

            return <Item key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default OrderHistoryTable;
