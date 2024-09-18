import { CircularProgress } from '@/components/circular-progress';
import CommonIcon from '@/components/common-icon';
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

export const PendingItem = ({
  data: item,
  formatItemVolume,
  onPendingDetailModalOpen,
}: {
  data: any;
  formatItemVolume: any;
  onPendingDetailModalOpen: any;
}) => {
  const [openSpslModal, setOpenSpslModal] = useState(false);
  const [marketMaps, setMarketMaps] = useState<MarketsMap | undefined>();
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
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
    symbol: item.symbol,
  });
  const isUsdtType = Swap.Info.getIsUsdtType(item.symbol);
  const wallet = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType });
  // const wayText = buy ? LANG('买入') : LANG('卖出');
  const type = (() => {
    const data = Swap.Order.formatPendingType(item);
    if (item.orderType === 3) {
      return LANG('追踪委托');
    }
    return [data['type'], data['strategyType'], data['side']].filter((e) => !!e).join('/');
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
        (e) =>
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

  return (
    <>
      <div className='pending-item'>
        <div className='title'>
          <div className='left'>
            <div className='wallet'>
              <ItemWallet wallet={wallet} />
            </div>
            <div className='code'>{name}</div>
          </div>
          <div className='time'>{time}</div>
        </div>
        <div className='middle'>
          <div className={buy ? 'green' : 'red'}>{type}</div>
          <div className='lever'>{leverage}X</div>
        </div>
        <div className='content'>
          <CircularProgress buy={buy} rate={rate} size={36} />
          <div className='right'>
            <div className='info'>
              {isCloseOrder && (
                <div className='row'>
                  <div className='label'>{LANG('平仓')}</div>
                  <div>{LANG('是')}</div>
                </div>
              )}
              <div className='row' onClick={() => setOpenSpslModal(true)}>
                <div className='label'>
                  {LANG('数量')}({unit})
                </div>
                {isCloseOrder ? (
                  <div>{LANG('全部平仓')}</div>
                ) : (
                  <div>
                    <span>{formatItemVolume(item.volume, item)}</span>/
                    <span className='gray'>{formatItemVolume(item.dealVolume, item)}</span>
                  </div>
                )}
                <CommonIcon className='edit-icon' name='common-edit-gray-0' size={12} />
              </div>
              {!isFollowOrder && (
                <div className='row' onClick={() => setOpenSpslModal(true)}>
                  <div className='label'>
                    {LANG('价格')}({priceUnitText})
                  </div>
                  <div>{!!item.price ? Number(item.price).toFixed(Number(item.baseShowPrecision)) : '--'}</div>
                  <CommonIcon className='edit-icon' name='common-edit-gray-0' size={12} />
                </div>
              )}
              {isTriggerType && (
                <div className='row'>
                  <div className='label'>
                    {LANG('触发价')}({priceUnitText})
                  </div>
                  <div>{`${item.priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${
                    item.direction === '1' ? '≥' : '≤'
                  } ${Number(item.triggerPrice).toFixed(Number(item.baseShowPrecision))}`}</div>
                </div>
              )}
              {isFollowOrder && (
                <div className='row'>
                  <div className='label'>
                    {LANG('市价')}({LANG('距离')})
                  </div>
                  <div>
                    <span>{Number(marketPrice || 0).toFixed(item.baseShowPrecision)}</span>
                    <span>({(item.triggerPrice || 0).sub(marketPrice).toFixed(item.baseShowPrecision)})</span>
                  </div>
                </div>
              )}
              {item['otocoOrder']?.['triggerOrders'].length > 0 && (
                <div className='row'>
                  <div className='label'>{LANG('止盈/止损')}</div>
                  <div className='main' onClick={() => onPendingDetailModalOpen(item)}>
                    {LANG('查看')}
                  </div>
                </div>
              )}
              {!isFollowOrder && (
                <div className='row'>
                  <div className='label'>{LANG('只减仓')}</div>
                  <div>{item.reduceOnly ? LANG('是') : LANG('否')}</div>
                </div>
              )}
            </div>
            <div className='cancel' onClick={onCancel}>
              {LANG('撤销')}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .pending-item {
          padding: 0 0 14px;
          margin: 0 var(--trade-spacing) 20px;
          border-bottom: 1px solid var(--theme-trade-border-color-2);
          &:last-child {
            border-bottom: 0;
          }
          .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left {
              display: flex;
              align-items: center;
              font-size: 12px;
              > div {
                margin-right: 8px;
              }
              .code {
                font-size: 14px;
                font-weight: 500;
                color: var(--theme-trade-text-color-1);
              }
              .wallet {
                border-radius: 6px;
                display: flex;
                align-items: center;
                padding: 4px 8px;
                color: var(--theme-trade-text-color-1);
                background-color: var(--theme-trade-bg-color-3);
                > div:last-child {
                  margin-left: 4px;
                }
              }
            }
            .time {
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
            }
          }
          .middle {
            margin-top: 4px;
            font-size: 12px;
            display: flex;
            align-items: center;
          }
          .content {
            display: flex;
            margin-top: 16px;

            .right {
              flex: 1;
              display: flex;
              justify-content: space-between;
              align-items: end;
            }
          }
          .info {
            padding-left: 20px;
            padding-top: 4px;
            flex: 1;
            .row {
              display: flex;
              font-size: 12px;
              margin-bottom: 8px;
              color: var(--theme-trade-text-color-1);
              .label {
                margin-right: 8px;
                color: var(--theme-trade-text-color-3);
              }
              .gray {
                color: var(--theme-trade-text-color-3);
              }
              .main {
                cursor: pointer;
                color: var(--skin-hover-font-color);
              }
              :global(.edit-icon) {
                margin-left: 5px;
                margin-top: 2px;
              }
            }
          }
          .cancel {
            margin-bottom: 10px;
            border-radius: 6px;
            height: 25px;
            padding: 0 5px;
            min-width: 61px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--theme-trade-text-color-1);
            background-color: var(--theme-trade-bg-color-3);
            font-size: 12px;
          }
          .green {
            color: var(--color-green);
          }
          .red {
            color: var(--color-red);
          }

          .lever {
            color: var(--theme-trade-text-color-3);
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
              availPosition: Number(`${item.volume}`.sub(item.dealVolume || 0)),
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
              orders: spsls,
            }}
            visible={openSpslModal}
            onClose={() => setOpenSpslModal(false)}
          />
        ))}
    </>
  );
};
