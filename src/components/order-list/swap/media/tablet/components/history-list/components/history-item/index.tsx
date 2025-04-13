import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_HISTORY_ORDER_STATUS, SWAP_HISTORY_ORDER_TYPES } from '@/core/shared/src/constants/order';
import { clsx, MediaInfo } from '@/core/utils';
import { ItemHeader } from '../../../item-header';
import dayjs from 'dayjs';
import ClipboardItem from '@/components/clipboard-item';

const limitMarketInfo = item => (
  <div className="info">
    <div className="row">
      <div className="item">
        <div>{LANG('类型')}</div>
        <div>{item.type}</div>
      </div>
      <div className="item">
        <div>{LANG('成交数量')}</div>
        <div>{item.dealVolume}</div>
      </div>
      <div className="item">
        <div>{LANG('委托数量')}</div>
        <div>{item.volume}</div>
      </div>
    </div>
    <div className="row">
      <div className="item">
        <div>{LANG('成交均价')}</div>
        <div>{item.avgPrice}</div>
      </div>
      <div className="item">
        <div>{LANG('委托价格')}</div>
        <div>{item.price}</div>
      </div>
      <div className="item">
        <div>{LANG('止盈/止损')}</div>
        <div>
          <span className="profit">{item.stopProfit}</span>/<span className="loss">{item.stopLoss}</span>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="item">
        <div>{LANG('只减仓')}</div>
        <div>{item.orgFlag}</div>
      </div>
      <div className="item">
        <div>{LANG('订单编号')}</div>
        <div>
          <ClipboardItem text={item.orderId} />
        </div>
      </div>
      <div className="item">
        <div>{LANG('委托时间')}</div>
        <div>{item.ctime}</div>
      </div>
    </div>
    <div className="row">
      <div className="item">
        <div>{LANG('更新时间')}</div>
        <div>{item.mtime}</div>
      </div>
      <div className="item">
        <div></div>
        <div></div>
      </div>
      <div className="item">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
);

const stopProfitLossInfo = (item, formatItemVolume) => (
  <div className="info">
    <div className="row">
      <div className="item">
        <div>{LANG('触发价格')}</div>
        <div>{item.triggerPrice}</div>
      </div>
      <div className="item">
        <div>{LANG('触发类型')}</div>
        <div>{item.priceType}</div>
      </div>
      <div className="item">
        <div>{LANG('委托价格')}</div>
        <div>{item.price}</div>
      </div>
    </div>
    <div className="row">
      <div className="item">
        <div>{LANG('只减仓')}</div>
        <div>{item.orgFlag}</div>
      </div>
      <div className="item">
        <div>{LANG('订单编号')}</div>
        <div>
          <ClipboardItem text={item.orderId} />
        </div>
      </div>
      <div className="item">
        <div>{LANG('委托时间')}</div>
        <div>{item.ctime}</div>
      </div>
    </div>
  </div>
);

export const HistoryItem = ({ data: item }: { data: any }) => {
  const { isUsdtType, priceUnitText } = Swap.Trade.base;
  const buy = item.side === '1';
  const leverageLevel = item?.leverageLevel;
  const name = Swap.Info.getCryptoData(item.symbol).name;
  const unit = Swap.Info.getUnitText({
    symbol: item.symbol
  });
  const type = (v => {
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
      flagPrice: Number(item.avgPrice) || Number(item.price)
    });
  };

  return (
    <>
      <div className="history-item">
        <div className="item-header">
          <div className="item">
            <div className="code">
              {name} {LANG('永续')}
            </div>
            <div className="type">
              <div className={buy ? 'buy' : 'sell'}>{LANG(buy ? '买入' : '卖出')}</div>
              <div className="margin-type">{LANG(item.marginType === 1 ? '全仓' : '逐仓')}</div>
              <span> {leverageLevel}X</span>
            </div>
          </div>
          <div className="item">
            <span className="label">{LANG('状态')}</span>
            <span>{(SWAP_HISTORY_ORDER_STATUS() as any)[item.status]}</span>
          </div>
        </div>
        {item.orderType === 1
          ? limitMarketInfo({
              type: (SWAP_HISTORY_ORDER_TYPES() as any)[item.type],
              dealVolume: `${formatItemVolume(item.dealVolume, item)} ${unit}`,
              volume: `${formatItemVolume(item.volume, item)} ${unit}`,
              avgPrice: item.avgPrice ? Number(item.avgPrice).toFixed(Number(item.baseShowPrecision)) : '--',
              price: item.price ? Number(item.price).toFixed(Number(item.baseShowPrecision)) : '--',
              stopProfit: !item.otocoOrder
                ? '--'
                : Number(item.otocoOrder.triggerOrders.find(o => o.strategyType === '1').triggerPrice).toFixed(
                    item.baseShowPrecision
                  ),
              stopLoss: !item.otocoOrder
                ? '--'
                : Number(item.otocoOrder.triggerOrders.find(o => o.strategyType === '2').triggerPrice).toFixed(
                    item.baseShowPrecision
                  ),
              orgFlag: LANG(item.ordFlag ? '是' : '否'),
              orderId: item.orderId,
              ctime: dayjs(item.ctime).format('YYYY-MM-DD HH:mm'),
              mtime: dayjs(item.mtime).format('YYYY-MM-DD HH:mm')
            })
          : stopProfitLossInfo({
              triggerPrice: !item.triggerPrice
                ? '--'
                : item.orderType === 3 && item.activationPrice
                ? Number(item.activationPrice).toFixed(Number(item.baseShowPrecision))
                : Number(item.triggerPrice).toFixed(Number(item.baseShowPrecision)),
              priceType: LANG(item.priceType === '1' ? '最新价格' : '标记价格'),
              price: item.price ? Number(item.price).toFixed(Number(item.baseShowPrecision)) : '--',
              orgFlag: LANG(item.ordFlag ? '是' : '否'),
              orderId: item.orderId,
              ctime: dayjs(item.ctime).format('YYYY-MM-DD HH:mm')
            })}
      </div>
      <style jsx>{`
        .history-item {
          font-size: 12px;
          border-bottom: 1px solid var(--line-1);
          &:last-child {
            border-bottom: 0;
          }
          :global(.info) {
            padding: 12px 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            :global(.row) {
              width: 100%;
              display: flex;
              :global(.item) {
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
                :global(> div) {
                  width: 100%;
                  &,
                  div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                  &:first-child {
                    color: var(--text-tertiary);
                  }
                  &:last-child {
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;

                    color: var(--text-primary);
                    :global(.icon) {
                      margin-left: 3px;
                    }
                  }
                  :global(.copy-content) {
                    // justify-content: flex-end;
                    gap: 4px;
                  }
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
          :global(.profit) {
            color: var(--text-true) !important;
          }
          :global(.loss) {
            color: var(--text-error) !important;
          }
          .main {
            color: var(--skin-hover-font-color);
          }
          .gray {
            color: var(--theme-trade-text-color-3);
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 400;
            color: var(--text-primary);
            .item {
              display: flex;
              flex-direction: column;
              gap: 4px;
              &:last-child {
                align-items: flex-end;
              }
              .code {
                font-size: 1rem;
                font-weight: 500;
              }
              .type {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 4px;
              }
              .buy,
              .sell,
              .margin-type {
                width: 3rem;
                height: 1.25rem;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                border-radius: 4px;
                color: var(--text-white);
                &.buy {
                  background: var(--color-green);
                }
                &.sell {
                  background: var(--color-red);
                }
              }
              .margin-type {
                background: var(--fill-3);
                color: var(--text-secondary);
              }
              span {
                font-size: 12px;
                color: var(--text-primary);
                white-space: nowrap;
              }
              .label {
                color: var(--text-tertiary);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
