import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_HISTORY_ORDER_STATUS, SWAP_HISTORY_ORDER_TYPES } from '@/core/shared/src/constants/order';
import { clsx } from '@/core/utils';
import { ItemHeader } from '../../../item-header';

export const HistoryItem = ({ data: item }: { data: any }) => {
  const { isUsdtType, priceUnitText } = Swap.Trade.base;
  const buy = item.side === '1';
  const leverageLevel = item?.leverageLevel;
  const name = Swap.Info.getCryptoData(item.symbol).name;
  const type = ((v) => {
    v = v === '5' ? 2 : v;
    const key =
      item.orderType === 2
        ? ({ 1: LANG('市价止盈'), 2: LANG('市价止损') } as any)[item.strategyType]
        : (SWAP_HISTORY_ORDER_TYPES() as any)[v];
    if (item.orderType === 3) {
      return LANG('追踪委托');
    }
    return key;
  })(item.type);

  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: isUsdtType ? digit : Number(item.basePrecision),
      flagPrice: Number(item.avgPrice) || Number(item.price),
    });
  };

  return (
    <>
      <div className='history-item'>
        <ItemHeader
          data={item}
          time={item.ctime}
          codePrefix={
            <div className={clsx('status', item.status == 2 && 'done')}>
              {(SWAP_HISTORY_ORDER_STATUS() as any)[item.status]}
            </div>
          }
          type={`${type}/${buy ? LANG('买入') : LANG('卖出')}`}
        />
        {/* <div className='title'>
          <div className='code'>{name}</div>
          <div className='time'>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className='section'>
          <div className='types'>
            <span className={buy ? 'green' : 'red'}>
              {type}/{buy ? LANG('买入') : LANG('卖出')}
            </span>
            <span className='main'>
              {item.marginType === 1 ? LANG('全仓') : LANG('逐仓')} {leverageLevel}X
            </span>
          </div>
          <div className='status'>{(SWAP_HISTORY_ORDER_STATUS() as any)[item.status]}</div>
        </div> */}
        <div className='info'>
          <div>
            <div>{LANG('数量')}</div>
            <div>
              <span>{formatItemVolume(item?.dealVolume, item)}</span>/
              <span className='gray'>
                {formatItemVolume(item?.volume, item)} {Swap.Info.getUnitText({ symbol: item.symbol })}
              </span>
            </div>
          </div>
          <div>
            <div>{LANG('价格')}</div>
            <div>
              {item.price ? Number(item.price).toFixed(Number(item.baseShowPrecision)) : '--'} {priceUnitText}
            </div>
          </div>
          {[2, 3].includes(item.orderType) && (
            <div>
              <div>{LANG('触发条件')}</div>
              <div>{`${item.priceType === '1' ? LANG('市场价格') : LANG('标记价格')} ${
                item.direction === '1' ? '≥' : '≤'
              } ${Number(item.triggerPrice).toFixed(Number(item.baseShowPrecision))}`}</div>
            </div>
          )}
          <div>
            <div>{LANG('订单编号')}</div>
            <div>{item.orderId}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .history-item {
          font-size: 12px;
          padding: var(--trade-spacing) 0;
          margin: 0 var(--trade-spacing);
          background: var(--theme-trade-bg-color-3);
          border-radius: 8px;
          margin-bottom: 8px;
          padding: 0 var(--trade-spacing) var(--trade-spacing);
          &:last-child {
            border-bottom: 0;
          }
          .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            .code {
              font-size: 16px;
              color: var(--theme-trade-text-color-1);
            }
            .time {
              font-size: 14px;
              color: var(--theme-trade-text-color-3);
            }
          }
          .section {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .types {
              display: flex;
              align-items: center;
              span {
                margin-right: 4px;
              }
            }
          }
          .info {
            > div {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;
              &:last-child {
                margin-bottom: 0;
              }
              > div {
                display: flex;
                align-items: center;
                &:first-child {
                  color: var(--theme-trade-text-color-3);
                }
                &:last-child {
                  color: var(--theme-trade-text-color-1);
                }
              }
            }
          }
          .status {
            background: var(--theme-trade-bg-color-6);
            border-radius: 6px;
            padding: 0 6px;
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-right: 6px;
            height: 23px;
            color: var(--theme-trade-text-color-4);
            &.done {
              background: rgba(var(--color-green-rgb), 0.1);
              color: var(--color-green);
            }
          }
          .green {
            color: var(--color-green);
          }
          .red {
            color: var(--color-red);
          }
          .main {
            color: var(--skin-hover-font-color);
          }
          .gray {
            color: var(--theme-trade-text-color-3);
          }
        }
      `}</style>
    </>
  );
};
