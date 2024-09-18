import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_FINISHED_ORDER_TYPES } from '@/core/shared/src/constants/order';
import { formatNumber2Ceil } from '@/core/utils';
import { ItemHeader } from '../../../item-header';

export const FinishedItem = ({ data: item }: { data: any }) => {
  const { isUsdtType, priceUnitText } = Swap.Trade.base;
  const buy = item.side === '1';
  const leverageLevel = item?.leverageLevel;
  const name = Swap.Info.getCryptoData(item.symbol).name;
  const type = ((type) => {
    const keys = [];
    if (type === '1' || type === '4') {
      keys.push(SWAP_FINISHED_ORDER_TYPES()[1]);
    } else {
      keys.push(SWAP_FINISHED_ORDER_TYPES()[2]);
    }
    if (type === '3') {
      keys.push(SWAP_FINISHED_ORDER_TYPES()[3]);
    }
    return keys.map((v) => v).join('/');
  })(item.type);
  const scale = isUsdtType ? 2 : Number(item.basePrecision);

  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: digit,
      flagPrice: Number(item.dealPrice),
    });
  };

  return (
    <>
      <div className='finished-item'>
        <ItemHeader data={item} time={item.ctime} type={`${type}/${buy ? LANG('买入') : LANG('卖出')}`} />
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
        </div> */}
        <div className='info'>
          <div>
            <div>{LANG('成交数量')}</div>
            <div>
              {formatItemVolume(item?.dealVolume, item)} {Swap.Info.getUnitText({ symbol: item.symbol })}
            </div>
          </div>
          <div>
            <div>{LANG('成交均价')}</div>
            <div>
              {item.dealPrice ? Number(item.dealPrice).toFixed(Number(item.baseShowPrecision)) : '--'} {priceUnitText}
            </div>
          </div>
          <div>
            <div>{LANG('手续费')}</div>
            <div>{`${formatNumber2Ceil(item.fee, scale).toFixed(scale)} ${
              Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
            }`}</div>
          </div>
          <div>
            <div>{LANG('已实现盈亏')}</div>
            <div>{`${formatNumber2Ceil(item.tradePnl, scale, false).toFixed(scale)} ${
              Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
            }`}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .finished-item {
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
