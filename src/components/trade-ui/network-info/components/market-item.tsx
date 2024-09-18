import { TradeLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { memo, useContext } from 'react';
import { MarketItemContext } from './marquee/utils';

const MaeketItem = ({ id, last }: { id?: string; last?: boolean }) => {
  // const [marketsDetailState] = useState<MarketsMap>(Markets.markets);
  // const marketsDetail = !_marketsDetail ? marketsDetailState : _marketsDetail;
  // // 行情数据
  // useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
  //   setMarketDetail(detail);
  // });
  const { data: marketsDetail } = useContext(MarketItemContext);
  const item = marketsDetail?.[id ?? ''];
  return (
    <>
      <TradeLink key={id} id={id}>
        <div className={clsx(last && 'last', 'my-div')}>
          <span>{item?.name}</span>
          <span className={clsx('price', item?.isUp ? 'green' : 'red')}>
            {item?.rate !== undefined ? `${item?.rate}%` : ''}
          </span>
          <span className={clsx('price')}> {item?.price !== undefined ? `${item?.price}` : ''}</span>
        </div>
        <style jsx>
          {`
            .my-div {
              position: relative;
              display: flex;
              align-items: center;

              margin-right: 6px;
              padding-right: 6px;
              &.last {
                &::after {
                  display: none;
                }
              }
              &::after {
                height: 10px;
                width: 1px;
                background: var(--theme-border-color-3);
                display: block;
                content: '';
                position: absolute;
                z-index: 2;
                pointer-events: none;
                touch-action: none;
                right: 0;
              }
              > span:first-child {
                margin-right: 6px;
                color: var(--theme-trade-text-color-1);
              }
              &:last-child {
              }
            }
            .price {
              white-space: nowrap;
              margin-left: 5px;
              color: var(--theme-trade-text-color-3);
            }
            .green {
              color: var(--color-green);
            }
            .red {
              color: var(--color-red);
            }
          `}
        </style>
      </TradeLink>
    </>
  );
};
export default memo(MaeketItem);
