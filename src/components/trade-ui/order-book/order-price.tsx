import { useRouter } from '@/core/hooks';
import { Svg } from '@/components/svg';
import { DetailMap, Rate, TradeMap } from '@/core/shared';
import { formatDefaultText, isSpot, isSpotEtf, isSwap } from '@/core/utils';
import { useEffect, useState } from 'react';
import { EtfNetVal } from './etf-netval';
import { MarkPrice } from './mark-price';
import YIcon from '@/components/YIcons';

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
      <div className="order-price">
        <div className={`price ${formatDefaultText(marketDetail?.price).length > 11 ? 'small' : ''}`}>
          <span>
            {formatDefaultText(marketDetail?.price)}
            {/* <div className={`${marketDetail?.isUp ? 'up' : 'down'}`}> */}
            {marketDetail?.isUp ? (
              <div className={`up`}>
                {/* <Svg
                    src='/static/images/new_common/up.svg'
                    width={16}
                    height={16}
                    className="svg-icon"
                    currentColor={'var(--color-green)'}
                  /> */}
                <YIcon.orderBookUp className="svg-icon" />
              </div>
            ) : (
              <div className={`down`}>
                <YIcon.orderBookdown className="svg-downicon"  />
              </div>
            )}
          </span>
          {isSwap(id) ? (
            <MarkPrice />
          ) : (
            <span className="price-rate"> ≈ {(formatDefaultText(ratePrice))}</span>
          )}
        </div>
        {isSpotEtf(id) && <EtfNetVal />}
      </div>
      <style jsx>
        {`

         .svg-icon {
               path {
                fill: var(--color-green) !important;
              }
                }

           .svg-downicon{
               path {
               fill: var(--color-red)  !important; 
              }
                }
          .order-price {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: space-between;
            padding: 16px 16px 0;
            .price {
              font-size: 16px;
              display: flex;
              color: var(--text_2);
              font-weight: 400;
               font-family: "Lexend";
              span {
                font-weight: 700;
                font-size: 24px;
                color: ${marketDetail?.isUp ? 'var(--color-green)' : 'var(--color-red)'};
                display: flex;
                align-items: center;
                justify-content: center;
               line-height:24px;
              }
              .price-rate {
                color: var(--text_2);
                font-size: 16px;
font-style: normal;
font-weight: 400;
margin-left:8px;
              }
              .down {
                // transform: rotate(180deg);
                svg {
                  fill: var(--color-red);
                }
              }
                
              .up {
                transform: rotate(0);
               
                svg {
                  fill: var(--color-green);
                }
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
