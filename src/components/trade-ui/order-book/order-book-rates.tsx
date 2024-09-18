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
          (id: string) => TradeMap.getSwapById(id),
        ];
        const funcIndex = [isSpot(id), isLite(id), isSwap(id)].findIndex((v) => v);
        const item = await func[funcIndex](id);
        setName(item?.name || '');
      }
    })();
  }, [id]);

  const amounts = useMemo(() => {
    const len = 20;
    let buyAmount = '0';
    let sellAmount = '0';
    data.asks.slice(0, len).forEach((v) => {
      sellAmount = sellAmount.add(v.amount);
    });
    data.bids.slice(0, len).forEach((v) => {
      buyAmount = buyAmount.add(v.amount);
    });
    const total = buyAmount.add(sellAmount);
    return { buy: buyAmount.div(total).mul(100).toFixed(2), sell: sellAmount.div(total).mul(100).toFixed(2) };
  }, [data]);

  return (
    <Tooltip title={`${name} ${LANG('订单薄前20档买卖比例')}`}>
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
          <div className='bar'>
            <div className='buy-bar' style={{ width: `${amounts.buy}%` }}>
              <div className='content'></div>
            </div>
            <div className='sell-bar' style={{ width: `${amounts.sell}%` }}>
              <div className='content'></div>
            </div>
          </div>
          <div className='buy'>
            <div className='block'>B</div>
            <div className='percent'>{`${amounts.buy}%`}</div>
          </div>
          <div className='sell'>
            <div className='percent'>{`${amounts.sell}%`}</div>
            <div className='block'>S</div>
          </div>
        </div>
        <style jsx>{`
          .order-book-rates {
            cursor: pointer;
            height: 22px;
            margin: 0 10px 10px;
            display: flex;
            position: relative;
            &.swap {
              .small {
                margin-top: 7px;
              }
              &.table {
                margin-top: 7px;
              }
              &.mobile {
                margin-top: 7px;
              }
            }
            .bar {
              width: 100%;
              height: inherit;
              top: 0;
              position: absolute;
              display: flex;
              overflow: hidden;
              .buy-bar {
                transition: width 0.3s;
                border-radius: 2px;
                height: inherit;
                overflow: hidden;
                .content {
                  position: relative;
                  left: -4px;
                  height: inherit;
                  transform-origin: left center;
                  transform: skew(155deg);
                  background-color: rgba(var(--color-green-rgb), 0.12);
                }
              }
              .sell-bar {
                transition: width 0.3s;
                border-radius: 2px;
                height: inherit;
                overflow: hidden;
                .content {
                  position: relative;
                  right: -4px;
                  height: inherit;
                  transform-origin: left center;
                  transform: skew(155deg);
                  background-color: rgba(var(--color-red-rgb), 0.12);
                }
              }
            }
            .buy {
              position: relative;
              z-index: 2;
              flex: 1;
              padding: 2px;
              display: flex;
              align-items: center;

              .percent {
                color: var(--color-green);
              }
            }
            .sell {
              position: relative;
              z-index: 2;
              flex: 1;
              padding: 2px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .percent {
                color: var(--color-red);
              }
            }
            .block {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 18px;
              width: 18px;
              border-radius: 3px;
              background-color: var(--theme-background-color-1);
              color: var(--theme-font-color-1);
            }
            .percent {
              margin: 0 5px;
              font-size: 12px;
            }
          }
        `}</style>
      </>
    </Tooltip>
  );
};
