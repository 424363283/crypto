import GradienScrollRow from '@/components/gradien-scroll-row';
import { linkClassName, linkStyles } from '@/components/link';
import Star from '@/components/star';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { getZendeskLink } from '@/components/zendesk';
import { FORMULAS } from '@/core/formulas';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs, useWs1050 } from '@/core/network';
import { DetailMap, FAVORITE_TYPE, SwapTradeItem, TradeMap } from '@/core/shared';
import { formatNumber2Ceil, isSwapCoin, isSwapSLCoin, isSwapSLUsdt, isSwapUsdt } from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import { FundingRateCountdown, FundingRateType } from '../funding-rate-countdown';
import { CoinName } from './coin-name';
import { GuideMenu } from './guide-menu';

export const Swap = () => {
  const {
    query: { id },
  } = useRouter();
  const [data, setData] = useState<DetailMap>();
  const [indexPrice, setIndexPrice] = useState(0);
  const [swapTradeItem, setSwapTradeItem] = useState<SwapTradeItem>({} as SwapTradeItem);
  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));

  useWs1050(
    (data) => {
      try {
        if (swapTradeItem.id) {
          setIndexPrice(Number(data[swapTradeItem.id].currentPrice));
        }
      } catch {}
    },
    undefined,
    [swapTradeItem?.id]
  );
  useEffect(() => {
    (async () => {
      const swapItem = await TradeMap.getSwapById(id as string);
      setSwapTradeItem(swapItem as SwapTradeItem);
    })();
  }, [id]);

  // 计算成交额
  const calcVol = useCallback(
    (data?: DetailMap, swapTradeItem?: SwapTradeItem, price?: number): string => {
      let vol = '';
      if (data && swapTradeItem) {
        if (isSwapCoin(id as string) || isSwapSLCoin(id as string)) {
          vol = price
            ? `${formatNumber2Ceil(
                FORMULAS.SWAP.coin.coinVol(data.volume, swapTradeItem.contractFactor, price || 0),
                2
              )}`
            : '0';
        }
        if (isSwapUsdt(id as string) || isSwapSLUsdt(id as string)) {
          vol = FORMULAS.SWAP.usdt.coinVol(data.volume, swapTradeItem.contractFactor);
        }
      }
      return vol.toFixed(2);
    },
    [id]
  );
  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isSwapCoin(id)) return FAVORITE_TYPE.SWAP_COIN;
    if (isSwapUsdt(id)) return FAVORITE_TYPE.SWAP_USDT;
    if (isSwapSLCoin(id)) return FAVORITE_TYPE.SWAP_COIN_TESTNET;
    if (isSwapSLUsdt(id)) return FAVORITE_TYPE.SWAP_USDT_TESTNET;
    return FAVORITE_TYPE.SPOT;
  }, []);
  return (
    <>
      <div className='k-header'>
        <div className='k-header-left'>
          <CoinName />
          <div className='price' style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>
            {data !== undefined ? data?.price : '--'}
          </div>
        </div>
        <div className='k-header-center'>
          <GradienScrollRow>
            <div className='k-header-scroll'>
              <div className='k-header-left-item'>
                <span>{LANG('涨跌额')}</span>
                <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>
                  {data?.ratePrice != undefined ? data?.ratePrice : '--'}
                </span>
              </div>
              <div className='k-header-left-item'>
                <span>{LANG('涨跌幅')}</span>
                <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>
                  {data?.rate != undefined ? `${data?.rate}%` : '--'}
                </span>
              </div>
              <div className='k-header-left-item'>
                <span>{LANG('24H 最高')}</span>
                <span>{data?.maxPrice != undefined ? data?.maxPrice : '--'}</span>
              </div>
              <div className='k-header-left-item'>
                <span>{LANG('24H 最低')}</span>
                <span>{data?.minPrice != undefined ? data?.minPrice : '--'}</span>
              </div>
              <div className='k-header-left-item'>
                <span>
                  {LANG('24H 成交额')}({data?.coin})
                </span>
                <span>{data !== undefined ? calcVol(data, swapTradeItem, indexPrice) : '--'}</span>
              </div>
              <div className='k-header-left-item'>
                <Tooltip
                  placement='top'
                  title={
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: LANG(
                            '买方及卖方在下个资金时段要交换的资金费率。资金费率周期内(每 8 小时)每分钟计算一次溢价指数，并将溢价指数以时间加权平均的方式应用于计算资金费率。 {more}',
                            {
                              more: `<a target={'_blank'} class="${linkClassName} link" href="${getZendeskLink(
                                '/articles/5699104130831'
                              )}">${LANG('了解更多')}</a>`,
                            }
                          ),
                        }}
                      />
                      {linkStyles}
                    </>
                  }
                >
                  <InfoHover componnet='span' className='info-label'>
                    {LANG('资金费率/倒计时')}
                  </InfoHover>
                </Tooltip>
                <span>{data?.isOpen ? <FundingRateCountdown type={FundingRateType.SWAP} /> : '--'}</span>
              </div>
            </div>
          </GradienScrollRow>
        </div>
        <div className='k-header-right'>
          <div className='favorite-wrapper'>
            <Star code={id} type={getStarType(id)} width={16} height={16} inQuoteList />
          </div>
          <GuideMenu />
          {/* <ThemeBtn /> */}
        </div>
      </div>
      <style jsx>
        {`
          .k-header {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            color: var(--theme-trade-text-color-1);
            width: 100%;

            .k-header-left {
              padding-left: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .price {
                font-size: 18px;
                margin-left: 20px;
                font-weight: 500;
              }
            }

            .k-header-center {
              display: flex;
              flex: 1;
              overflow: hidden;
              margin: 0 30px 0 20px;
              .k-header-scroll {
                display: flex;
                align-items: center;
              }

              .k-header-left-item {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                font-size: 12px;
                justify-content: space-between;
                margin-right: 25px;

                > :global(span:nth-child(1)) {
                  white-space: nowrap;
                  color: var(--theme-trade-text-color-3);
                  margin-bottom: 4px;
                }
                > span:nth-child(2) {
                  font-weight: 500;
                  white-space: nowrap;
                }
                :global(.info-label) {
                  position: relative;
                }
                :global(.info-label:before) {
                  content: '';
                  display: block;
                  position: absolute;
                  bottom: -1px;
                  width: 100%;
                  border-bottom: 1px dashed #798296;
                }
              }
            }

            .k-header-right {
              display: flex;
              align-items: center;
              padding-right: 10px;
              flex-shrink: 0;
              .favorite-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 13px;
                cursor: pointer;
              }
            }
          }
        `}
      </style>
    </>
  );
};
export default Swap;
