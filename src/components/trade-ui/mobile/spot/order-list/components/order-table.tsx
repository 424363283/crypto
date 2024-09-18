import { CircularProgress } from '@/components/circular-progress';
import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';
import { closeSpotOrderApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LoadingType, SideType, Spot, SpotOrderType, SpotPositionListItem } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

const { Position } = Spot;

const Item = ({ data: item }: { data: SpotPositionListItem }) => {
  const onRevokePositionClicked = useCallback(async (id: string) => {
    const res = await closeSpotOrderApi([id]);
    if (res.code === 200) {
      message.success(LANG('撤单成功'));
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message);
    }
  }, []);

  return (
    <>
      <div className='container'>
        <div className='left'>
          <div>
            <span className='pair'>{item.symbol.replace('_', '/')}</span>
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
          <div className='count-wrapper'>
            <div className='percent-wrapper'>
              <CircularProgress
                buy={item.side === SideType.BUY}
                rate={Number(item.dealVolume.div(item.volume))}
                size={36}
              />
            </div>
            <div>
              <div className='sub-font'>
                {LANG('委托量')} <span>{item.dealVolume.toFormat()}</span> / {item.volume.toFormat()}
              </div>
              <div className='sub-font'>
                {LANG('委托价')} <span>{item.price.toFormat()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className='sub-font'>{dayjs(item.orderTime).format('MM-DD HH:mm:ss')}</div>
          <button onClick={() => onRevokePositionClicked(item.id)}>{LANG('撤单')}</button>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          padding: 16px;
          border-bottom: 1px solid var(--theme-border-color-2);
          &:first-child {
            padding-top: 0;
          }
          .left {
            flex: 2;
            .pair {
              font-size: 16px;
              font-weight: 500;
              color: var(--theme-font-color-1);
            }
            .name {
              font-size: 12px;
              margin-left: 8px;
            }
            .count-wrapper {
              width: 100%;
              margin-top: 16px;
              display: flex;
              align-items: center;
              height: 42px;
              .percent-wrapper {
                margin-right: 20px;
              }
            }
          }
          .right {
            flex: 1;
            text-align: right;
            button {
              margin-top: 30px;
              outline: none;
              border: none;
              border-radius: 6px;
              height: 25px;
              color: var(--theme-font-color-1);
              font-size: 12px;
              padding: 0 12px;
              background: var(--theme-background-color-3-2);
              margin-right: 10px;
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

const OrderTable = () => {
  const id = useRouter().query.id as string;
  const { orderList, loading, hideOther } = Position.state;

  const { isLogin } = useAppContext();

  const filterOrderList = useMemo(() => {
    let resultList = orderList;
    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (!isLogin) {
      return [];
    }

    // 隐藏网格委托单
    resultList = resultList.filter(({ openType }) => openType !== 1 && openType !== 4);

    return resultList;
  }, [hideOther, orderList, id, isLogin]);

  return (
    <>
      <div className='container'>
        <ListView data={filterOrderList} loading={!filterOrderList.length && loading}>
          {(index) => {
            const item = filterOrderList[index];

            return <Item key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default OrderTable;
