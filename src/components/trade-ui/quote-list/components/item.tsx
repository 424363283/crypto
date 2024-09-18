import Star from '@/components/star';
import { useRouter } from '@/core/hooks';
import { TradeLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES } from '@/core/network';
import { DetailMap, FAVORITE_TYPE } from '@/core/shared';
import {
  formatDefaultText,
  getActive,
  isLite,
  isSpot,
  isSpotCoin,
  isSpotEtf,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
} from '@/core/utils';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const _ListItem = ({
  item,
  isNew = false,
  isHot = false,
  onClick,
  renderStar,
}: {
  item: any;
  isNew?: boolean;
  isHot?: boolean;
  onClick?: Function;
  renderStar?: Function;
}) => {
  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isLite(id)) return FAVORITE_TYPE.LITE;
    if (isSpotCoin(id)) return FAVORITE_TYPE.SPOT;
    if (isSpotEtf(id)) return FAVORITE_TYPE.ETF;
    if (isSwapUsdt(id)) return FAVORITE_TYPE.SWAP_USDT;
    if (isSwapSLCoin(id)) return FAVORITE_TYPE.SWAP_COIN_TESTNET;
    if (isSwapSLUsdt(id)) return FAVORITE_TYPE.SWAP_USDT_TESTNET;
    return FAVORITE_TYPE.SPOT;
  }, []);
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<DetailMap | null>(null);

  const wsHandler = useCallback((data: any) => {
    setData(data.detail);
  }, []);

  useEffect(() => {
    if (id === item.id) {
      window.addEventListener(SUBSCRIBE_TYPES.ws4001, wsHandler);
    } else {
      window.removeEventListener(SUBSCRIBE_TYPES.ws4001, wsHandler);
      setData(null);
    }
  }, [id]);

  const calcItem = useMemo(() => {
    return data && data.id === item.id ? data : item;
  }, [data, item]);

  return (
    <TradeLink id={item.id}>
      <div className={`item ${getActive(item.id === id)}`} onClick={() => onClick?.(item)}>
        <div className='name'>
          {renderStar ? renderStar?.() : <Star code={item.id} type={getStarType(item.id)} inQuoteList />}
          {isSpot(item.id) ? (
            <>
              <span>{item.coin}</span>
              <span className='quoteCoin'>&nbsp;/{item.quoteCoin}</span>
            </>
          ) : (
            item.name
          )}
          {isHot && <Image src='/static/images/common/hot.svg' width='16' height='16' alt='hot' className='hot' />}
          {isNew && <span className='new'>NEW</span>}
        </div>
        <div className='price' style={{ color: `var(${item.isUp ? '--color-green' : '--color-red'})` }}>
          {formatDefaultText(calcItem.price.toFormat(item.digit))}
        </div>
        <div>
          <span
            className='rate'
            style={{
              color: `var(${calcItem.isUp ? '--color-green' : '--color-red'})`,
            }}
          >
            {calcItem.rate}%
          </span>
        </div>
      </div>
      <style jsx>
        {`
          .item {
            display: flex;
            align-items: center;
            height: 30px;
            cursor: pointer;
            flex-shrink: 0;
            content-visibility: auto;
            font-weight: 500;
            margin-bottom: 9px;
            &:hover {
              background-color: var(--theme-background-color-3);
            }

            &.active {
              background: var(--theme-background-color-3);
            }
            > div {
              font-size: 12px;
              display: flex;
              align-items: center;
            }
            > div:nth-child(1) {
              padding-left: 10px;
            }
            > div:nth-child(2) {
              flex-flow: row-reverse;
              padding-right: 20px;
            }
            > div:nth-child(3) {
              flex-flow: row-reverse;
              padding-right: 10px;
              flex-shrink: 0;
              flex: 1;
            }
            .name {
              color: var(--theme-trade-text-color-1);
              display: flex;
              align-items: center;
              width: 140px;
              .quoteCoin {
                color: var(--theme-trade-text-color-2);
              }
              :global(.star_icon) {
                margin-right: 4px;
              }
            }
            .price {
              color: var(--theme-trade-text-color-1);
            }
            .rate {
              color: var(--theme-trade-text-color-1);
            }
            .new {
              color: #f04e3f;
              background: rgba(240, 78, 63, 0.2);
              border-radius: 2px;
              height: 16px !important;
              line-height: 16px;
              width: 30px !important;
              margin: 0px 0 0 4px;
              font-size: 12px;
              text-align: center;
              transform: scale(0.83333);
            }
          }
        `}
      </style>
    </TradeLink>
  );
};

export const ListItem = memo(_ListItem, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
});
