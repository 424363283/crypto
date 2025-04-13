import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { TradeMap } from '@/core/shared';
import { clsx, isLite, isSpot, isSwap } from '@/core/utils';
import { useEffect, useMemo, useState } from 'react';
import { ListDataType } from '.';
import Tooltip from '../common/tooltip';

export const OrderBookRates = ({ data, id = '' }: { data: ListDataType; id?: string }) => {
  const [name, setName] = useState('');
  const { isSmallDesktop, isTablet, isMobile } = useResponsive();
  useEffect(() => {
    (async () => {
      if (id) {
        const func = [
          (id: string) => TradeMap.getSpotById(id),
          (id: string) => TradeMap.getLiteById(id),
          (id: string) => TradeMap.getSwapById(id)
        ];
        const funcIndex = [isSpot(id), isLite(id), isSwap(id)].findIndex(v => v);
        const item = await func[funcIndex](id);
        setName(item?.name || '');
      }
    })();
  }, [id]);

  const amounts = useMemo(() => {
    const len = 20;
    let buyAmount = '0';
    let sellAmount = '0';
    data.asks.slice(0, len).forEach(v => {
      sellAmount = sellAmount.add(v.amount);
    });
    data.bids.slice(0, len).forEach(v => {
      buyAmount = buyAmount.add(v.amount);
    });
    const total = buyAmount.add(sellAmount);
    return { buy: buyAmount.div(total).mul(100).toFixed(2), sell: sellAmount.div(total).mul(100).toFixed(2) };
  }, [data]);

  return (
    <Tooltip title={`${name} ${LANG('订单薄前20档买卖比例')}`} overlayClassName="order-book-rates_tooltip">
      <>
        <div
          className={clsx(
            'order-book-rates',
            isSwap(id) && 'swap',
            isSmallDesktop && 'small',
            isTablet && 'table',
            isMobile && 'mobile'
          )}
        >
          <div className="bar">
            <div className="sell-bar" style={{ width: `${amounts.sell}%` }}>
              <div className="content"></div>
            </div>

            <div className="buy-bar" style={{ width: `${amounts.buy}%` }}>
              <div className="content"></div>
            </div>
          </div>
          <div className="percent-bar">
            <div className="percent sell">
              <span>{isMobile ? `${LANG('卖')} - ` : 'S'}</span>
              {`${amounts.sell}%`}
            </div>
            <div className="percent buy">
              <span>{isMobile ? `${LANG('买')} - ` : 'B'}</span>
              {`${amounts.buy}%`}
            </div>
          </div>
        </div>
        <style jsx>{`
          .order-book-rates {
            cursor: pointer;
            padding: 19px;
            &.swap {
              .small {
                margin-top: 7px;
              }
              &.table {
                margin-top: 7px;
              }
              &.mobile {
                padding: 0 1rem;
                margin-top: 8px;
                padding-bottom: 10px;
              }
            }
            .bar {
              width: 100%;
              height: inherit;
              top: 0;
              display: flex;
              overflow: hidden;
              height: 4px;
              .buy-bar {
                transition: width 0.3s;

                height: inherit;
                overflow: hidden;
                .content {
                  position: relative;
                  /* left: -4px; */
                  height: inherit;
                  transform-origin: left center;
                  /* transform: skew(155deg); */
                  background-color: var(--color-green);
                  border-radius: 4px;
                }
              }
              .sell-bar {
                transition: width 0.3s;

                height: inherit;
                overflow: hidden;
                &:first-child {
                  margin: 0 4px 0 0;
                }
                .content {
                  position: relative;
                  /* right: -4px; */
                  height: inherit;
                  transform-origin: left center;
                  background-color: var(--color-red);
                  border-radius: 4px;
                }
              }
            }

            .percent-bar {
              display: flex;
              justify-content: space-between;
              flex-wrap: nowrap;
              align-items: center;
              width: 100%;
              padding: 8px 0 0;
              .percent {
                font-family: 'HarmonyOS Sans SC';
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                &.buy {
                  color: var(--color-green);
                }
                &.sell {
                  color: var(--color-red);
                }
                span {
                  padding: 0 4px 0 0;
                }
              }
            }
          }
          :global(.order-book-rates_tooltip) {
            :global(.ant-tooltip-inner) {
              font-size: 12px;
              padding: 16px;
              font-weight: 400;
              background-color: var(--fill-pop);
              color: var(--theme-font-color-1);
            }
            :global(.ant-tooltip-arrow::before) {
              background: var(--fill-pop);
            }
          }
        `}</style>
      </>
    </Tooltip>
  );
};
