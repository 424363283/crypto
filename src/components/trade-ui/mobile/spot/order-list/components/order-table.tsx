import { ListView } from '@/components/order-list/swap/media/tablet/components/list-view';
import { closeSpotOrderApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LoadingType, SideType, Spot, SpotOrderType, SpotPositionListItem } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import ClipboardItem from '@/components/clipboard-item';

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
          <div className="revoke" onClick={() => onRevokePositionClicked(item.id)}>
            {LANG('撤单')}
          </div>
        </div>
        <div className="info">
          <div className="row">
            <div className="item">
              <span> {LANG('委托价格')}</span>
              <span>{item.price.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('委托数量')}</span>
              <span>{item.volume.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('委托金额')}</span>
              <span>{item.amount.toFormat()}</span>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <span> {LANG('已成交')}</span>
              <span>{item.dealVolume.toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('未成交')}</span>
              <span>{item.volume.sub(item.dealVolume).toFormat()}</span>
            </div>
            <div className="item">
              <span> {LANG('状态')}</span>
              <span>{LANG('委托中')}</span>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <span> {LANG('委托时间')}</span>
              <span>{dayjs(item.orderTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <div className="item" />
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
      <div className="container">
        <ListView data={filterOrderList} loading={!filterOrderList.length && loading}>
          {index => {
            const item = filterOrderList[index];

            return <Item key={index} data={item} />;
          }}
        </ListView>
      </div>
    </>
  );
};

export default OrderTable;
