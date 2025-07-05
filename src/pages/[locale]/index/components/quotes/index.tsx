import Chart from '@/components/chart/mini-chart';
import CoinLogo from '@/components/coin-logo';
import { RateText } from '@/components/rate-text';
import { useIndexedDB } from '@/core/hooks/src/use-indexeddb';
import { useMiniChartData } from '@/core/hooks/src/use-mini-chart-data';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { TradeLink } from '@/core/i18n/src/components/trade-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketItem, Markets } from '@/core/shared';
import { IDB_STORE_KEYS } from '@/core/store/src/idb';
import { clsx } from '@/core/utils/src/clsx';
import { formatVolume } from '@/core/utils/src/format';
import { memo, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const arr: Array<string[]> = [
  ['MANA_USDT', 'SAND_USDT', 'FTM_USDT', 'SHIB_USDT'],
  ['MATIC_USDT', 'SOL_USDT', 'DOT_USDT', 'ATOM_USDT'],
  ['BTC_USDT', 'ETH_USDT', 'AVAX_USDT', 'NEAR_USDT'],
];

function BottomQuotes() {
  const [list, setList] = useState<MarketItem[][]>([[]]);
  const { setResponsiveClsx } = useResponsiveClsx();
  const { miniChartData, setSymbols } = useMiniChartData();
  const [localSwiperList, setLocalSwiperList] = useIndexedDB(IDB_STORE_KEYS.HOME_MARKETS_SWIPER_LIST, list);
  useEffect(() => {
    setSymbols([...arr[0], ...arr[1], ...arr[2]]);
  }, []);
  useWs(SUBSCRIBE_TYPES.ws3001, (detail) => {
    const data = arr.map((item: string[]) => Markets.getMarketList(detail, item));
    setList(data);
  });
  useEffect(() => {
    setLocalSwiperList(list);
  }, [list]);

  return (
    <>
      <div className={clsx('bottom-coin-card', setResponsiveClsx('c-pc', 'c-pad', 'c-phone'))}>
        <Swiper direction={'vertical'} className='mySwiper' autoplay={{ delay: 5000 }} loop={true}>
          {localSwiperList?.map((item: any, key: any) => {
            return (
              <SwiperSlide key={key}>
                {item?.map((item: any, key: any) => {
                  const chartData = (miniChartData as any)[item.id] || [];
                  return (
                    <TradeLink className='chart-link-container' key={item.id} id={item.id} native>
                      <div className='chart-content'>
                        <div className='top-area'>
                          <CoinLogo coin={item.coin} alt='YMEX' width='24' height='24' className='coin-logo' />
                          {`${item.coin}/${item.quoteCoin} ` || '--/--'}
                        </div>
                        <div className='center-area'>
                          <span className='price'>
                            <RateText money={item.price} prefix useFormat scale={item?.digit || 4} />
                          </span>
                        </div>
                        <div className='bottom-area'>
                          <span className='volume'>
                            {LANG('成交量')} {formatVolume(item?.total) || '- -'}
                          </span>
                          <span
                            style={{ color: item?.isUp ? 'var(--color-green)' : 'var(--color-red)' }}
                            className='rate'
                          >
                            {item?.rate || '- -'}%
                          </span>
                        </div>
                      </div>
                      <div className='mini-chart'>
                        {item.price ? (
                          <Chart
                            id={'index_quotes'}
                            showLine={false}
                            style={{ width: 100, height: 60 }}
                            data={chartData}
                            symbol={item.coin}
                            lineWidth={1.5}
                            areaColor={item?.isUp ? 'var(--color-green)' : 'var(--color-red)'}
                            lineColor={item?.isUp ? 'var(--color-green)' : 'var(--color-red)'}
                            areaColorOpacity={50}
                          />
                        ) : null}
                      </div>
                    </TradeLink>
                  );
                })}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <style jsx>
        {`
          .bottom-coin-card {
            max-width: var(--const-max-page-width);
            margin: 0 auto;
            padding: 28px 32px 24px;
            box-sizing: content-box !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 316px;
            :global(.swiper-slide) {
              display: grid;
              grid-gap: 16px;
              grid-template-columns: 1fr 1fr;
            }
            :global(.mySwiper) {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            :global(.chart-link-container) {
              border-radius: 10px;
              padding: 20px 15px 0;
              justify-content: space-between;
              position: relative;
              cursor: pointer;
              background-color: var(--fill_2);
              transition: all 0.3s;
              .chart-content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                .top-area {
                  font-size: 16px;
                  font-weight: 500;
                  color: var(--theme-font-color-1);
                  line-height: 19px;
                  display: flex;
                  align-items: center;
                  :global(.coin-logo) {
                    width: 24px;
                    height: auto;
                    margin-right: 6px;
                  }
                }
                .center-area {
                  display: flex;
                  align-items: center;
                  padding-top: 10px;
                  border-bottom: 1px solid var(--theme-border-color-2);
                  padding-bottom: 12px;
                  .price {
                    font-size: 20px;
                    font-weight: 500;
                    color: var(--theme-font-color-1);
                    line-height: 25px;
                    white-space: nowrap;
                  }
                  .rate {
                    font-size: 14px;
                    font-weight: 500;
                    color: #00c86f;
                    margin-left: 5px;
                  }
                }
                .bottom-area {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 42px;
                  .volume {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--theme-font-color-3);
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              }
              :global(.mini-chart) {
                height: 60px;
                width: 100px;
                position: absolute;
                right: 16px;
                top: 15px;
              }
            }
            &.c-pc {
              padding: 38px 0 30px;
              height: 150px;
              margin-top: 32px;
              :global(.swiper-slide) {
                display: grid;
                grid-gap: 16px;
                grid-template-columns: 1fr 1fr 1fr 1fr;
              }
            }
            &.c-pad {
              padding: 38px 32px 30px;
            }
            &.c-phone {
              padding: 38px 16px 30px;
              .name {
                font-size: 14px;
                margin-right: 12px;
              }
              :global(.item) {
                padding: 18px 8px;
              }
            }
          }
        `}
      </style>
    </>
  );
}
export default memo(BottomQuotes);
