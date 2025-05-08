import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_FINISHED_ORDER_TYPES } from '@/core/shared/src/constants/order';
import { formatNumber2Ceil } from '@/core/utils';
import dayjs from 'dayjs';
// import { ItemHeader } from '../../../item-header';

export const FinishedItem = ({ data: item }: { data: any }) => {
  const { isUsdtType, priceUnitText } = Swap.Trade.base;
  const buy = item.side === '1';
  const leverageLevel = item?.leverageLevel;
  const name = Swap.Info.getCryptoData(item.symbol).name;
  const type = (type => {
    const keys = [];
    if (type === '1' || type === '4') {
      keys.push(SWAP_FINISHED_ORDER_TYPES()[1]);
    } else {
      keys.push(SWAP_FINISHED_ORDER_TYPES()[2]);
    }
    if (type === '3') {
      keys.push(SWAP_FINISHED_ORDER_TYPES()[3]);
    }
    return keys.map(v => v).join('/');
  })(item.type);
  const scale = isUsdtType ? 2 : Number(item.basePrecision);

  const formatItemVolume = (v: any, item: any) => {
    const digit = Swap.Info.getVolumeDigit(item.symbol, { withHooks: false });
    return Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: item.symbol,
      value: v || 0,
      fixed: digit,
      flagPrice: Number(item.dealPrice)
    });
  };

  return (
    <>
      <div className="finished-item">
        <div className="item-header">
          <div className="code">
            {name} {LANG('永续')}
          </div>
          <div className={buy ? 'buy' : 'sell'}>{LANG(buy ? '买入' : '卖出')}</div>
        </div>
        <div className="item-info">
          <div className="row">
            <div className="item">
              <div>{LANG('类型')}</div>
              <div>{type}</div>
            </div>
            <div className="item">
              <div>{LANG('成交均价')}</div>
              <div>
                {item.dealPrice ? Number(item.dealPrice).toFixed(Number(item.baseShowPrecision)) : '--'} {priceUnitText}
              </div>
            </div>
            <div className="item">
              <div>{LANG('成交数量')}</div>
              <div>
                {' '}
                {formatItemVolume(item?.dealVolume, item)} {Swap.Info.getUnitText({ symbol: item.symbol })}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="item">
              <div>{LANG('已实现盈亏')}</div>
              <div className={item.tradePnl < 0 ? 'loss' : item.tradePnl > 0 ? 'profit' : ''}>{`${formatNumber2Ceil(
                item.tradePnl,
                scale,
                false
              ).toFixed(scale)} ${Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin}`}</div>
            </div>
            <div className="item">
              <div>{LANG('手续费')}</div>
              <div>{`${formatNumber2Ceil(item.fee, scale).toFixed(scale)} ${
                Swap.Info.getCryptoData(item.symbol, { withHooks: false }).settleCoin
              }`}</div>
            </div>
            <div className="item">
              <div>{LANG('委托时间')}</div>
              <div>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm')}</div>
            </div>
          </div>
        </div>
        {/* <ItemHeader data={item} time={item.ctime} type={`${type}/${buy ? LANG('买入') : LANG('卖出')}`} /> */}
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
        {/* <div className="info">
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
        </div> */}
      </div>
      <style jsx>{`
        .finished-item {
          font-size: 12px;
          border-bottom: 1px solid var(--fill_line_1);
          &:last-child {
            border-bottom: 0;
          }
          // margin: 0 var(--trade-spacing);
          // background: var(--theme-trade-bg-color-3);
          // border-radius: 8px;
          // margin-bottom: 8px;
          // padding: 0 var(--trade-spacing) var(--trade-spacing);

          .item-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            color: var(--text_1);
            .code {
              font-size: 1rem;
              font-weight: 500;
            }
            .buy,
            .sell {
              width: 3rem;
              height: 1.25rem;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 10px;
              border-radius: 4px;
              color: var(--text_white);
              &.buy {
                background: var(--color-green);
              }
              &.sell {
                background: var(--color-red);
              }
            }
          }
          .item-info {
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
                    &.profit {
                      color: var(--text_green);
                    }
                    &.loss {
                      color: var(--text_red);
                    }
                  }
                }
              }
            }
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
