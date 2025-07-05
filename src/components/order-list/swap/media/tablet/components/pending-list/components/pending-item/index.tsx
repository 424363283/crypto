import { CircularProgress } from '@/components/circular-progress';
import CommonIcon from '@/components/common-icon';
import { SWAP_WALLET_ALIAS } from '@/core/shared/src/swap/modules/assets/constants';
import { Loading } from '@/components/loading';
import { EditOrderSpslModal, StopProfitStopLossModal } from '@/components/trade-ui/order-list/swap/components/modal';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketsMap, Swap } from '@/core/shared';
import { message } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-use';
import { ItemWallet } from '../../../item-wallet';
import {
  SWAP_HISTORY_ORDER_STATUS,
  SWAP_HISTORY_ORDER_TYPES,
  SWAP_HISTORY_TRIGGER_ORDER_STATUS,
  SWAP_PENDING_ORDER_STATUS
} from '@/core/shared/src/constants/order';
import ClipboardItem from '@/components/clipboard-item';

export const PendingItem = ({
  data: item,
  formatItemVolume,
  onPendingDetailModalOpen
}: {
  data: any;
  formatItemVolume: any;
  onPendingDetailModalOpen: any;
}) => {
  const [openSpslModal, setOpenSpslModal] = useState(false);
  const [marketMaps, setMarketMaps] = useState<MarketsMap | undefined>();
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
    setMarketMaps(detail);
  });
  const marketPrice = marketMaps?.[item.symbol.toUpperCase()].price;

  const time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss');
  const { priceUnitText } = Swap.Trade.base;
  const name = Swap.Info.getCryptoData(item.symbol).name;
  const leverage = item.leverageLevel;
  const buy = item.side === '1';
  const isLimit = item.type === '1' || item.type === '4';
  const unit = Swap.Info.getUnitText({
    symbol: item.symbol
  });
  const isUsdtType = Swap.Info.getIsUsdtType(item.symbol);
  const wallet = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType });
  // const wayText = buy ? LANG('买入') : LANG('卖出');
  const type = (() => {
    const data = Swap.Order.formatPendingType(item);
    if (item.orderType === 3) {
      return LANG('追踪委托');
    }
    return [data['type'], data['strategyType'], data['side']].filter(e => !!e).join('/');
  })();
  let rate = item.dealVolume / item.volume || 0;
  const isDemo = isSwapDemo(useLocation().pathname);
  const isTriggerType = !!item.triggerPrice;
  const isFollowOrder = item['orderType'] == 3; // 追踪委托
  const isCloseOrder = item.closePosition == true;
  const pendings = Swap.Order.getPending(isUsdtType);

  const spsls = useMemo(
    () =>
      pendings.filter(
        e =>
          e['positionSide'] == item['positionSide'] &&
          e['symbol'] == item['symbol'] &&
          e['subWallet'] == item['subWallet'] &&
          e['closePosition'] == true
      ),
    [pendings, item]
  );

  const onCancel = async () => {
    Loading.start();
    try {
      const result = await Swap.Order.cancelPending(item);
      if (result.code == 200) {
        message.success(LANG('撤销成功'));
      } else {
        message.error(result);
      }
    } catch (error: any) {
      message.error(error);
    } finally {
      Loading.end();
    }
  };

  const showWallet = SWAP_WALLET_ALIAS[item.subWallet]
  return (
    <>
      <div className="pending-item">
        <div className="header">
          <div className="left">
            <div className="code">
              {name} {LANG('永续')}
            </div>
            <div className="info">
              <div className={`position-type ${buy ? 'buy' : 'sell'}`}>{LANG(buy ? '买入' : '卖出')}</div>
              <div className="margin-type">{LANG(item.marginType === 1 ? '全仓' : '逐仓')}</div>
              <div className="wallet margin-type margin-type1">{LANG(showWallet)}</div>
              <span> {leverage}x</span>
            </div>
          </div>
          <div className="right">
            <div className="cancel" onClick={onCancel}>
              {LANG('撤单')}
            </div>
          </div>
        </div>
        <div className="statistics">
          <div className="row">
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '成交数量' : '类型')}</div>
              <div>{item.orderType === 1 ? `${formatItemVolume(item.dealVolume, item)} ${unit}` : type}</div>
            </div>
            <div className="item">
              <div>{LANG('委托数量')}</div>
              <div>
                { item['closePosition'] === true && <>{LANG('全部平仓')}</>
                }
                {
                 item['closePosition'] !== true && <>{formatItemVolume(item.volume, item)} {unit}</>
                } 
              </div>
            </div>
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '成交均价' : '委托价格')}</div>
              <div>
                {!Number(item[item.orderType === 1 ? 'avgPrice' : 'price'])
                  ? '--'
                  : Number(item[item.orderType === 1 ? 'avgPrice' : 'price']).toFixed(Number(item.baseShowPrecision))}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '委托价格' : '触发价格')}</div>
              {item.orderType === 1 ? (
                <div>{!Number(item.price) ? '--' : Number(item.price).toFixed(Number(item.baseShowPrecision))}</div>
              ) : (
                <div>
                  {!item.triggerPrice
                    ? '--'
                    : item.orderType === 3 && item.activationPrice
                    ? Number(item.activationPrice).toFixed(Number(item.baseShowPrecision))
                    : Number(item.triggerPrice).toFixed(Number(item.baseShowPrecision))}
                </div>
              )}
            </div>
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '止盈' : '触发类型')}</div>
              {item.orderType === 1 ? (
                <div className="profit">
                  {!item.otocoOrder
                    ? '--'
                    : Number(item.otocoOrder.triggerOrders.find(o => o.strategyType === '1').triggerPrice).toFixed(
                        item.baseShowPrecision
                      )}
                </div>
              ) : (
                <div>{LANG(item.priceType === '1' ? '最新价格' : '标记价格')}</div>
              )}
            </div>
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '止损' : '只减仓')}</div>
              {item.orderType === 1 ? (
                <div className="loss">
                  {!item.otocoOrder
                    ? '--'
                    : Number(item.otocoOrder.triggerOrders.find(o => o.strategyType === '2').triggerPrice).toFixed(
                        item.baseShowPrecision
                      )}
                </div>
              ) : (
                <div>{LANG(item.ordFlag ? '是' : '否')}</div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '只减仓' : '状态')}</div>
              <div>
                {item.orderType === 1
                  ? LANG(item.ordFlag ? '是' : '否')
                  : (SWAP_HISTORY_TRIGGER_ORDER_STATUS() as any)[item.status]}
              </div>
            </div>
            <div className="item">
              <div>{LANG(item.orderType === 1 ? '类型' : '委托时间')}</div>
              <div>
                {item.orderType === 1
                  ? (SWAP_HISTORY_ORDER_STATUS() as any)[item.status]
                  : item.ctime
                  ? dayjs(item.ctime).format('YYYY-MM-DD HH:mm')
                  : '--'}
              </div>
            </div>
            <div className="item">
              <div>{LANG('订单编号')}</div>
              <div>
                <ClipboardItem text={item.orderId} />
              </div>
            </div>
          </div>
          {item.orderType === 1 ? (
            <div className="row">
              <div className="item">
                <div>{LANG('委托时间')}</div>
                <div>{item.ctime ? dayjs(item.ctime).format('YYYY-MM-DD HH:mm') : '--'}</div>
              </div>
              <div className="item"></div>
              <div className="item">
                <div>{LANG('最近成交时间')}</div>
                <div>{item.mtime ? dayjs(item.mtime).format('YYYY-MM-DD HH:mm') : '--'}</div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <style jsx>{`
        .pending-item {
          border-bottom: 1px solid var(--fill_line_1);
          &:last-child {
            border-bottom: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
            .code {
              font-size: 16px;
              font-weight: 500;
              color: var(--text_1);
            }
            .info {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 4px;
              .position-type,
              .margin-type {
                width: 3rem;
                height: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 400;
              }
              .margin-type1 {
                width: auto;
                padding: 0 8px;
              }
              .position-type {
                color: var(--text_white);
                &.buy {
                  background: var(--color-green);
                }
                &.sell {
                  background: var(--color-red);
                }
              }
              .margin-type {
                background: var(--fill_3);
                color: var(--text_2);
              }
              span {
                font-size: 12px;
                color: var(--text_1);
                white-space: nowrap;
              }
            }
            .cancel {
              width: 5.5rem;
              height: 2rem;
              border-radius: 1.375rem;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-shrink: 0;
              background: var(--brand);
              font-size: 12px;
              font-weight: 400;
              color: var(--text_white);
            }
          }

          .green {
            color: var(--color-green);
          }
          .red {
            color: var(--color-red);
          }
          .profit {
            color: var(--text_green) !important;
          }
          .loss {
            color: var(--text_red) !important;
          }
          .statistics {
            font-size: 12px;
            padding: 12px 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            .row {
              width: 100%;
              display: flex;
              .item {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                gap: 4px;
                &:nth-child(1) {
                  align-items: start;
                }
                &:nth-child(2) {
                  align-items: start;
                }
                &:nth-child(3) {
                  align-items: end;
                  text-align: right;
                }
                .margin {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
                > div {
                  width: 100%;
                  &,
                  div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                  &:first-child {
                    color: var(--text_3);
                  }
                  &:last-child {
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;

                    color: var(--text_1);
                    :global(.icon) {
                      margin-left: 3px;
                    }
                  }
                  :global(.copy-content) {
                    justify-content: flex-end;
                    gap: 4px;
                  }
                }
              }
            }
          }
        }
      `}</style>
      {openSpslModal &&
        (!item.closePosition ? (
          <EditOrderSpslModal
            data={{
              ...item,
              avgCostPrice: isLimit ? item['price'] : item['triggerPrice'],
              currentPosition: Number(`${item.volume}`.sub(item.dealVolume || 0)),
              availPosition: Number(`${item.volume}`.sub(item.dealVolume || 0))
            }}
            visible={openSpslModal}
            onClose={() => setOpenSpslModal(false)}
          />
        ) : (
          <StopProfitStopLossModal
            data={{
              ...item,
              side: item['side'] == '1' ? '2' : '1',
              leverage: item['leverageLevel'],
              currentPosition: item['positionVolume'],
              availPosition: item['positionVolume'],
              avgCostPrice: item['positionAvgPrice'],
              margin: 0,
              orders: spsls
            }}
            visible={openSpslModal}
            onClose={() => setOpenSpslModal(false)}
          />
        ))}
    </>
  );
};
