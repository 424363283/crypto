import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_HISTORY_ORDER_TYPES } from '@/core/shared/src/constants/order';
import { ItemHeader } from '../../../item-header';

export const HistoryItem = ({ data: item, onShare }: { data: any; onShare: any }) => {
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
  const incomeScale = isUsdtType ? 2 : Number(item.basePrecision);

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
  const income = (Number(`${item.tradePnl}`.toFixed(incomeScale)) + 0).toFixed(incomeScale);
  return (
    <>
      <div className='history-item'>
        {/* <div className='title'>
          <div className='code'>{name}</div>
          <div className='time'>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className='section'>
          <div className='types'>
            <span className={buy ? 'green' : 'red'}>{buy ? LANG('平多') : LANG('平空')}</span>
          </div>
        </div> */}
        <ItemHeader
          time={item.ctime}
          data={item}
          type={buy ? LANG('平多') : LANG('平空')}
          onShare={() => {
            onShare({ ...item, income });
          }}
        />
        <div className='info'>
          <div>
            <div>{LANG('平仓数量')}</div>
            <div>
              <span>
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
          <div>
            <div>{LANG('开仓均价')}</div>
            <div>
              {item.positionAvgPrice ? Number(item.positionAvgPrice).toFixed(Number(item.baseShowPrecision)) : '--'}
            </div>
          </div>
          <div>
            <div>{LANG('平仓价格')}</div>
            <div>{item.price ? Number(item.price).toFixed(Number(item.baseShowPrecision)) : '--'}</div>
          </div>
          <div>
            <div>{LANG('平仓盈亏')}</div>
            <div className={Number(`${item.tradePnl}`.toFixed(incomeScale)) > 0 ? 'main-green' : 'main-red'}>
              {income} {Swap.Info.getCryptoData(item.symbol).settleCoin}
              {/* <ImageHover
                src='/static/images/lite/share.svg'
                className={'share'}
                width={20}
                height={20}
                hoverSrc='/static/images/lite/share_active.svg'
                onClick={() => {
                  onShare(item);
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .history-item {
          font-size: 12px;
          margin: 0 var(--trade-spacing);
          background: var(--theme-trade-bg-color-3);
          border-radius: 8px;
          margin-bottom: 8px;
          padding: 0 var(--trade-spacing) var(--trade-spacing);
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
            .status {
              color: var(--theme-trade-text-color-3);
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
            :global(.share) {
              cursor: pointer;
              margin-left: 5px;
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
