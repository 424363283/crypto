import { useRouter } from '@/core/hooks';
import { DetailMap, Rate, TradeMap } from '@/core/shared';
import { formatDefaultText, isSpot, isSpotEtf, isSwap } from '@/core/utils';
import { useEffect, useState } from 'react';
import { EtfNetVal } from './etf-netval';
import { MarkPrice } from './mark-price';

const formatPrice = (text: string) => {
  // 判断是否以 .[0-9]+结尾，如 1.07000，需要显示为 1.07
  const hasTail = /\.[0-9]+$/.test(text);
  return hasTail ? text.replace(/(0+)$/g, '') : text;
};

export const OrderPrice = ({ marketDetail }: { marketDetail?: DetailMap }) => {
  const [ratePrice, setRatePrice] = useState<string>('');
  const id = useRouter().query.id as string;
  const { currency } = Rate.store;
  const [currentSpotScale, setCurrentSpotScale] = useState(2);

  useEffect(() => {
    (async () => {
      const rate = await Rate.getInstance();
      const price = marketDetail?.price;
      if (price) {
        const ratePrice = rate.toRateUnit({ money: price, scale: currentSpotScale });
        setRatePrice(ratePrice);
      }
    })();
  }, [marketDetail?.price, currency, currentSpotScale]);

  useEffect(() => {
    (async () => {
      if (isSpot(id)) {
        const spotTradeItem = await TradeMap.getSpotById(id);
        setCurrentSpotScale(spotTradeItem?.digit || 2);
      }
    })();
  }, [id]);

  return (
    <>
      <div className='order-price'>
        <div className={`price ${formatDefaultText(marketDetail?.price).length > 11 ? 'small' : ''}`}>
          <span>
            <span>{marketDetail?.isUp ? '↑' : '↓'}</span>
            {formatDefaultText(marketDetail?.price)}
          </span>
          {isSwap(id) ? (
            <MarkPrice />
          ) : (
            <span className='price-rate'> ≈ {formatPrice(formatDefaultText(ratePrice))}</span>
          )}
        </div>
        {isSpotEtf(id) && <EtfNetVal />}
      </div>
      <style jsx>
        {`
          .order-price {
            height: 45px;
            padding-left: 12px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: space-between;
            .price {
              font-size: 14px;
              display: flex;
              color: ${marketDetail?.isUp ? 'var(--color-green)' : 'var(--color-red)'};
              font-weight: 500;
              span span {
                font-size: 12px;
              }
              .price-rate {
                color: var(--theme-trade-text-color-1);
              }
              &.small {
                font-size: 12px;
              }
            }
          }
        `}
      </style>
    </>
  );
};
