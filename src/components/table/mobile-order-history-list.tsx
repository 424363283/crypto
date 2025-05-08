import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import {
  SWAP_FINISHED_ORDER_TYPES,
  SWAP_FUNDS_TYPES,
  SWAP_HISTORY_ORDER_STATUS,
  SWAP_HISTORY_ORDER_TYPES
} from '@/pages/[locale]/account/fund-management/order-history/swap-order/constants';
import { SWAP_HISTORY_ORDER_TYPE } from '@/pages/[locale]/account/fund-management/order-history/swap-order/types';
import css from 'styled-jsx/css';
import { Swap } from '@/core/shared';
import { checkIsUsdtType } from '@/pages/[locale]/account/fund-management/assets-overview/helper';
import ClipboardItem from '@/components/clipboard-item';
import dayjs from 'dayjs';
import { ORDER_HISTORY_TYPE } from '@/pages/[locale]/account/fund-management/order-history/types';
import { formatNumber2Ceil } from '@/core/utils';
import { SWAP_FUNDS_RECORD_TYPE } from '@/core/shared/src/constants/order';
import { clsx, message } from '@/core/utils';
import { Loading } from '../loading';
import { ImageHover } from '@/components/image';
import { closeSpotOrderApi } from '@/core/api';
import { getStatus } from '../order-list/spot/components/order-history-table';
import {
  SPOT_HISTORY_TAB_KEY,
  SPOT_STATUS_MAP
} from '@/pages/[locale]/account/fund-management/order-history/spot-order/types';
import { EmptyComponent } from '../empty';

const cloumns = ({ direction, title, subTitle }: { direction?: string; title?: string; subTitle?: any }) => {
  return (
    <>
      <div className={`history-list-cloumns ${direction ?? ''}`}>
        <div className="columns-title">{title}</div>
        <div>{subTitle}</div>
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

//当前委托
const currentCommission = (data: any) => {
  const isUsdtType = checkIsUsdtType();
  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: item.price
    });
  };

  const { orderType, closePosition, symbol, dealVolume, volume, ordFlag, orderId, time, price } = data;
  //类型
  const tempData = Swap.Order.formatPendingType(data);
  let tempType =
    orderType === 3
      ? LANG('追踪委托')
      : [tempData['type'], tempData['strategyType'], tempData['side']].filter(e => !!e).join('/');

  //数量
  let tempVolume =
    closePosition === true ? (
      LANG('全部平仓')
    ) : (
      <span>
        <span>{formatItemVolume(volume, data)}</span>
        <span className={clsx('inline-block')} style={{ color: 'var(--skin-primary-color)' }}>
          ({formatItemVolume(dealVolume, data)})
        </span>
        &nbsp;
        {Swap.Info.getUnitText({ symbol: symbol, withHooks: false })}
      </span>
    );
  //触发条件
  const tempTrigger = (data: any) => {
    if (![2, 3].includes(orderType)) {
      return '--';
    }
    let triggerPrice = data.triggerPrice;
    if (data.orderType === 3 && !triggerPrice && data.activationPrice) {
      triggerPrice = data.activationPrice;
    }
    if (!triggerPrice) {
      return '--';
    }
    return `${data.priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${
      data.direction === '1' ? '≥' : '≤'
    } ${Number(triggerPrice).toFixed(Number(data.baseShowPrecision))}`;
  };
  return (
    <>
      <div className="order-history-list">
        {cloumns({ title: LANG('类型'), subTitle: tempType })}
        {cloumns({
          title: LANG('价格'),
          subTitle: price ? Number(price).toFixed(Number(data.baseShowPrecision)) : '--'
        })}
        {cloumns({ title: `${LANG('数量')}/${LANG('完成度')}`, subTitle: tempVolume })}
      </div>
      <div className="order-history-list">
        {cloumns({ title: LANG('触发条件'), subTitle: tempTrigger(data) })}
        {cloumns({ title: LANG('平仓'), subTitle: closePosition ? LANG('是') : LANG('否') })}
        {cloumns({ title: LANG('只减仓'), subTitle: ordFlag ? LANG('是') : LANG('否') })}
      </div>
      <div className="order-history-list">
        {cloumns({ title: LANG('订单编号'), subTitle: <ClipboardItem text={orderId} /> })}
        {cloumns({
          title: LANG('时间'),
          subTitle: (
            <div>
              <div className="date">{dayjs(time).format('YYYY-MM-DD')}</div>
              <div className="time">{dayjs(time).format('HH:mm:ss')}</div>
            </div>
          )
        })}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

//历史委托
const historyCommission = (data: any) => {
  const {
    type,
    avgPrice,
    price,
    baseShowPrecision,
    orderType,
    strategyType,
    symbol,
    dealVolume,
    volume,
    priceType,
    direction,
    triggerPrice,
    orderId,
    time
  } = data;
  // orderType
  // 1：委托单 2：条件单
  // strategyType
  // 策略类型：1=止盈 2=止损
  let tempType = type == '5' ? '2' : type;
  const map: any = { 1: LANG('市价止盈'), 2: LANG('市价止损') };
  const key = orderType === 2 ? map[strategyType] : SWAP_HISTORY_ORDER_TYPES[tempType];
  const digit = Swap.Info.getVolumeDigit(symbol, { withHooks: false });
  let tempOrderType =
    orderType !== 2
      ? '--'
      : `${priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${direction === '1' ? '≥' : '≤'} ${Number(
          triggerPrice
        ).toFixed(4)}`;
  return (
    <>
      <div className="order-history-list">
        {cloumns({ title: LANG('类型'), subTitle: key })}
        {cloumns({
          title: LANG('平均价格'),
          subTitle: avgPrice ? Number(avgPrice).toFormat(Number(baseShowPrecision)) : '--'
        })}
        {cloumns({ title: LANG('价格'), subTitle: price ? Number(price).toFormat(Number(baseShowPrecision)) : '--' })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('成交数量'),
          subTitle: (
            <div>
              {Swap.Calculate.formatPositionNumber({
                usdt: checkIsUsdtType(),
                code: symbol,
                value: dealVolume || 0,
                fixed: digit,
                flagPrice: Number(avgPrice) || Number(price)
              })}
            </div>
          )
        })}
        {cloumns({
          title: LANG('数量'),
          subTitle: (
            <div>
              {Swap.Calculate.formatPositionNumber({
                usdt: checkIsUsdtType(),
                code: symbol,
                value: volume || 0,
                fixed: digit,
                flagPrice: Number(avgPrice) || Number(price)
              })}
            </div>
          )
        })}
        {cloumns({ title: LANG('触发价格'), subTitle: tempOrderType })}
      </div>
      <div className="order-history-list">
        {cloumns({ title: LANG('订单编号'), subTitle: <ClipboardItem text={orderId} /> })}
        {cloumns({
          title: LANG('时间'),
          subTitle: (
            <div>
              <div className="date">{dayjs(time).format('YYYY-MM-DD')}</div>
              <div className="time">{dayjs(time).format('HH:mm:ss')}</div>
            </div>
          )
        })}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};
//历史成交
const historyTransaction = (data: any) => {
  const isUsdtType = checkIsUsdtType();
  Swap.Assets.getWallet({ usdt: isUsdtType });

  const { type, dealPrice, baseShowPrecision, symbol, dealVolume, basePrecision, fee, tradePnl, time } = data;

  const keys = [];
  if (type === '1' || type === '4') {
    keys.push(SWAP_FINISHED_ORDER_TYPES[1]);
  } else {
    keys.push(SWAP_FINISHED_ORDER_TYPES[2]);
  }
  if (type === '3') {
    keys.push(SWAP_FINISHED_ORDER_TYPES[3]);
  }

  const { contractFactor } = Swap.Info.getCryptoData(symbol, { withHooks: false });
  const value = isUsdtType ? `${dealPrice}`.mul(contractFactor).mul(dealVolume) : `${contractFactor}`.mul(dealVolume);

  const scale = isUsdtType ? 2 : Number(basePrecision);
  const formatNum = formatNumber2Ceil(tradePnl, scale, false).toFormat(scale);
  return (
    <>
      <div className="order-history-list">
        {cloumns({ title: LANG('类型'), subTitle: keys.map(v => v).join('/') })}
        {cloumns({ title: LANG('成交均价'), subTitle: Number(dealPrice).toFixed(+baseShowPrecision) })}
        {cloumns({
          title: LANG('成交数量'),
          subTitle: (
            <div>
              {Swap.Calculate.formatPositionNumber({
                usdt: isUsdtType,
                code: symbol,
                value: dealVolume,
                flagPrice: Number(dealPrice),
                fixed: Swap.Info.getVolumeDigit(symbol, { withHooks: false })
              })}
            </div>
          )
        })}
      </div>
      <div className="order-history-list">
        {cloumns({ title: LANG('交易量'), subTitle: `${value.toFormat(2)} ${Swap.Info.getPriceUnitText(isUsdtType)}` })}
        {cloumns({
          title: LANG('手续费'),
          subTitle: `${formatNumber2Ceil(fee, scale).toFormat(scale)} ${
            Swap.Info.getCryptoData(symbol, { withHooks: false }).settleCoin
          }`
        })}
        {cloumns({
          title: LANG('已实现盈亏'),
          subTitle: (
            <div className={Number(tradePnl) >= 0 ? 'green' : 'red'}>{`${formatNum} ${
              Swap.Info.getCryptoData(symbol, { withHooks: false }).settleCoin
            }`}</div>
          )
        })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('时间'),
          subTitle: <div className="date">{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</div>
        })}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

//历史倉位
const historyPosition = (data: any) => {
  const isUsdtType = checkIsUsdtType();
  Swap.Assets.getWallet({ usdt: isUsdtType });

  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(data.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: data.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(Swap.Info.getCryptoData(item.symbol, { withHooks: false }).basePrecision),
      flagPrice: Number(data.avgPrice || item.price)
    });
  };
  const walletData = Swap.Assets.getWallet({ walletId: data.subWallet, usdt: isUsdtType, withHooks: false });
  const { baseShowPrecision } = Swap.Info.getCryptoData(data.symbol, { withHooks: false });
  const isBuy = data.side !== '1';
  const scale = isUsdtType ? 2 : Number(Swap.Info.getCryptoData(data.symbol, { withHooks: false }).basePrecision);
  const code = data.symbol.toUpperCase();
  const { settleCoin } = Swap.Info.getCryptoData(code, { withHooks: false });
  const value = formatNumber2Ceil(formatNumber2Ceil(data.tradePnl, scale + 1, false), scale, false).toFixed(scale);
  const style = Number(value) >= 0 ? 'main-green' : 'main-red';
  return (
    <>
      <div className="order-history-list">
        {cloumns({ title: LANG('账户'), subTitle: LANG(walletData?.alias) })}
        {cloumns({
          title: LANG('平仓数量'),
          subTitle: `${formatItemVolume(data?.volume, data)} ${Swap.Info.getUnitText({
            symbol: data.symbol,
            withHooks: false
          })}`
        })}
        {cloumns({
          title: LANG('开仓均价'),
          subTitle: data.positionAvgPrice ? Number(data.positionAvgPrice).toFixed(Number(baseShowPrecision)) : '--'
        })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('平仓价格'),
          subTitle: data.price ? Number(data.price).toFixed(Number(baseShowPrecision)) : '--'
        })}
        {cloumns({
          title: LANG('方向'),
          subTitle: (
            <span style={{ color: isBuy ? 'var(--color-green)' : 'var(--color-red)' }}>
              {isBuy ? LANG('平多') : LANG('平空')}
            </span>
          )
        })}
        {cloumns({
          title: LANG('平仓盈亏'),
          subTitle: (
            <div className={clsx('position-settle-item', style)}>
              <div className={clsx()}>
                {value} {settleCoin}
              </div>
              <ImageHover
                src="common-share-round-0"
                className={clsx('share')}
                width={12}
                height={12}
                hoverSrc="common-share-round-active-0"
                onClick={() => {
                  // onShare({ ...item, income: value });
                }}
                enableSkin
              />
            </div>
          )
        })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('开仓时间'),
          subTitle: <div className="date">{dayjs(data.ctime).format('YYYY-MM-DD HH:mm:ss')}</div>
        })}
        {cloumns({
          title: LANG('平仓时间'),
          subTitle: <div className="date">{dayjs(data.mtime).format('YYYY-MM-DD HH:mm:ss')}</div>
        })}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

const assetFlow = (data: any) => {
  const { type, amount, basePrecision, time } = data;
  const isUsdtType = checkIsUsdtType();
  const formatNum = isUsdtType ? amount : amount.toFixed(Number(basePrecision));
  // if(type === 'taker_fee' || type === 'maker_fee') {
  //   return formatNum;
  // }
  return (
    <>
      <div className="order-history-list">
        {cloumns({ title: LANG('类型'), subTitle: SWAP_FUNDS_RECORD_TYPE()[type] })}
        {cloumns({ title: LANG('资金类型'), subTitle: SWAP_FUNDS_TYPES[type] || '--' })}
        {cloumns({ title: LANG('总额'), subTitle: <div> {formatNum} </div> })}
      </div>

      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

// 現貨當前委託
const spotCurrentCommission = (item: any) => {
  const isBuy = item.side === 1;
  const isMarket = item.type === 1 || item.type === 3;
  return (
    <>
      <div className="order-history-list">
        {cloumns({
          title: LANG('委托价格'),
          subTitle: item.type === 1 || item.type === 3 ? LANG('市价') : item?.price?.toFormat()
        })}
        {cloumns({
          title: LANG('委托数量'),
          subTitle: isMarket && isBuy ? '--' : item.volume?.toFormat()
        })}
        {cloumns({
          title: LANG('成交数量'),
          subTitle: item.dealVolume ? item.dealVolume?.toFormat() : 0
        })}
      </div>
      <div className="order-history-list">
        {cloumns({ title: LANG('委托金额'), subTitle: isMarket && !isBuy ? '--' : Number(item.amount?.toFixed(4)) })}
        {cloumns({
          title: LANG('成交额'),
          subTitle: item.dealAmount?.toFormat()
        })}
        {cloumns({ title: LANG('状态'), subTitle: LANG('委托中') })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('委托时间'),
          subTitle: dayjs(item.orderTime).format('YYYY-MM-DD HH:mm:ss')
        })}
        {cloumns({ title: LANG('订单编号'), subTitle: <ClipboardItem text={item.id} /> })}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};
// 現貨歷史委託
const spotHistoryCommission = (item: any) => {
  const isBuy = item.side === 1;
  const isMarket = item.type === 1 || item.type === 3;
  return (
    <>
      <div className="order-history-list">
        {cloumns({
          title: LANG('委托价格'),
          subTitle: item.type === 1 || item.type === 3 ? LANG('市价') : item?.price?.toFormat()
        })}
        {cloumns({
          title: LANG('委托数量'),
          subTitle: isMarket && isBuy ? '--' : item.volume?.toFormat()
        })}
        {cloumns({
          title: LANG('成交数量'),
          subTitle: item.dealVolume ? item.dealVolume?.toFormat() : 0
        })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('成交均价'),
          subTitle: item.dealPrice ? item.dealPrice?.toFormat() : 0
        })}
        {cloumns({
          title: LANG('成交额'),
          subTitle: item.dealAmount ? Number(item.dealAmount?.toFixed(4)) : 0
        })}
        {cloumns({
          title: LANG('状态'),
          subTitle: (
            <span className={clsx('state', item.state === 6 ? 'red' : item.state === 8 ? 'green' : '')}>
              {SPOT_STATUS_MAP[item.dealVolume > 0 && item.dealVolume < item.volume ? 7 : item.state]}
            </span>
          )
        })}
      </div>
      <div className="order-history-list">
        {cloumns({ title: LANG('委托金额'), subTitle: isMarket && !isBuy ? '--' : Number(item.amount?.toFixed(4)) })}
        {cloumns({
          title: LANG('委托时间'),
          subTitle: dayjs(item.orderTime).format('YYYY-MM-DD HH:mm:ss')
        })}
        {cloumns({ title: LANG('订单编号'), subTitle: <ClipboardItem text={item.id} /> })}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};
// 現貨歷史成交
const spotHistoryTransaction = (item: any) => {
  const isBuy = item.side === 1;
  const isMarket = item.type === 1 || item.type === 3;
  let targetCoin = item.targetCoin;
  if (/\d+L|\d+S/.test(item.symbol)) {
    targetCoin = isBuy ? item.sourceCoin : item.targetCoin;
  }
  return (
    <>
      <div className="order-history-list">
        {cloumns({
          title: LANG('成交均价'),
          subTitle: item?.price?.toFormat()
        })}
        {cloumns({
          title: LANG('成交数量'),
          subTitle: item.volume?.toFormat()
        })}
        {cloumns({
          title: LANG('成交金额'),
          subTitle: `${item.amount?.toFormat(4)} ${isBuy ? item.sourceCoin : item.targetCoin}`
        })}
      </div>
      <div className="order-history-list">
        {cloumns({
          title: LANG('手续费'),
          subTitle: `${item.fee?.toFormat()} ${targetCoin}`
        })}
        {cloumns({
          title: LANG('成交时间'),
          subTitle: dayjs(item.dealTime).format('YYYY-MM-DD HH:mm:ss')
        })}
        {cloumns({ title: LANG('订单编号'), subTitle: <ClipboardItem text={item.id} /> })}
      </div>

      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

const MobileOrderHistoryList = ({
  dataSource,
  type,
  orderType
}: {
  dataSource: any;
  type: number;
  orderType: ORDER_HISTORY_TYPE;
}) => {
  const isUsdtType = checkIsUsdtType();
  Swap.Assets.getWallet({ usdt: isUsdtType });
  const perpetualText = isUsdtType ? LANG('U本位合约') : LANG('币本位合约');
  const isSpot = orderType === ORDER_HISTORY_TYPE.SPOT_ORDER;

  // 撤單
  const onCancelOrder = async (item: any) => {
    console.log(item);
    Loading.start();
    try {
      const result = isSpot
        ? await closeSpotOrderApi([item.id])
        : await Swap.Order.cancelPending(item, { refreshData: false });
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
      <div className="mobile-order-history-list">
        {dataSource?.length > 0 ? (
          dataSource.map((item: any, index: number) => (
            <div className="order-history-box" key={index}>
              <div className="order-history-list">
                <div className="order-history-symbol">
                  <div className="symbol">
                    {isSpot ? (
                      <>
                        <span>{item.symbol.split('_')[0].toUpperCase()}</span>
                        <span className="usdt">/{item.symbol.split('_')[1].toUpperCase()}</span>
                      </>
                    ) : (
                      item.symbol.replaceAll('-', '').toUpperCase()
                    )}
                  </div>
                  <div className="symbol-info">
                    {!!item.side && (
                      <div className={`side ${item.side == '1' ? 'green' : 'red'}`}>
                        {item.side == '1' ? LANG('买入') : LANG('卖出')}
                      </div>
                    )}
                    {!!item.marginType && (
                      <div className={'margin-type'}>{item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}</div>
                    )}
                    {!!item.leverageLevel && <div>{item.leverageLevel}X</div>}
                    {`${type}` === SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW && <div>{perpetualText}</div>}
                    {isSpot && type !== SPOT_HISTORY_TAB_KEY.HISTORY_TRANSACTION && (
                      <span className="type">{LANG(item.type === 1 ? '市价' : '限价')}</span>
                    )}
                  </div>
                </div>
                {`${type}` === SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS && (
                  <div className="cancel" onClick={() => onCancelOrder(item)}>
                    {LANG('撤单')}
                  </div>
                )}
                {!!item.status &&
                  `${type}` !== SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS &&
                  cloumns({ title: LANG('状态'), subTitle: SWAP_HISTORY_ORDER_STATUS[item.status] })}
                {`${type}` === SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW && (
                  <div className="order-history-list">
                    {cloumns({
                      title: LANG('时间'),
                      subTitle: <div className="date">{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                    })}
                  </div>
                )}
              </div>
              {orderType === ORDER_HISTORY_TYPE.SWAP_U_ORDER && (
                <>
                  {' '}
                  {`${type}` === SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS && currentCommission(item)}
                  {`${type}` === SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS && historyCommission(item)}
                  {`${type}` === SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION && historyTransaction(item)}
                  {`${type}` === SWAP_HISTORY_ORDER_TYPE.HISTORY_POSITION && historyPosition(item)}
                  {`${type}` === SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW && assetFlow(item)}
                </>
              )}
              {orderType === ORDER_HISTORY_TYPE.SPOT_ORDER && (
                <>
                  {' '}
                  {`${type}` === SPOT_HISTORY_TAB_KEY.CURRENT_COMMISSION && spotCurrentCommission(item)}
                  {`${type}` === SPOT_HISTORY_TAB_KEY.HISTORY_COMMISSION && spotHistoryCommission(item)}
                  {`${type}` === SPOT_HISTORY_TAB_KEY.HISTORY_TRANSACTION && spotHistoryTransaction(item)}
                </>
              )}
            </div>
          ))
        ) : (
          <div className="empty">
            <EmptyComponent />
          </div>
        )}
      </div>
      <style jsx>{mobileOrderListStyles}</style>
    </>
  );
};

export default MobileOrderHistoryList;

const mobileOrderListStyles = css`
  .mobile-order-history-list {
    z-index: 1;
    .order-history-box {
      display: flex;
      flex-direction: column;
      padding: 12px 0;
      gap: 12px;
      border-bottom: 1px solid var(--fill_line_1);
    }
  }
  .order-history-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .order-history-symbol {
      .symbol {
        font-weight: 500;
        font-size: 16px;
        color: var(--text_1);
        margin-bottom: 4px;
        .usdt {
          font-size: 14px;
          color: var(--text_2);
        }
      }
      .symbol-info {
        display: flex;
        gap: 4px;
        font-size: 12px;
        font-weight: 400;
        align-items: center;
        .side {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 20px;
        }
        .side,
        .margin-type {
          color: var(--text-white);
          border-radius: 4px;
          &.green {
            background: var(--green);
          }
          &.red {
            background: var(--red);
          }
        }
        .margin-type {
          padding: 2px 6px;
          background: var(--fill_3);
          color: var(--text_2);
        }
        .type {
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
    }
    .cancel {
      width: 88px;
      height: 32px;
      background-color: var(--brand);
      text-align: center;
      line-height: 32px;
      border-radius: 16px;
      color: var(--text-white);
      font-size: 12px;
      font-weight: 400;
    }
  }
  .history-list-cloumns {
    display: flex;
    flex-direction: column;
    color: var(--text_1);
    font-size: 12px;
    font-weight: 400;
    flex: 1;
    :last-child {
      text-align: right;
      align-items: flex-end;
    }
    .green {
      color: var(--green);
    }
    .red {
      color: var(--red);
    }
    .state {
      &.green {
        color: #07828b;
      }
      &.red {
        color: #ef454a;
      }
    }

    .columns-title {
      font-size: 12px;
      font-weight: normal;
      color: var(--text_3);
      margin-bottom: 4px;
    }
    .position-settle-item {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
    }
  }
`;
