import { ResolutionType, configFiatCrypto } from '@/components/chart/k-chart/components/k-header/resolution/config';
import { KlineChart } from '@/components/chart/k-chart/lib/kline-chart';
import CoinLogo from '@/components/coin-logo';
import { SUBSCRIBE_TYPES, WS, useWs } from '@/core/network';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
type Item = {
  c: number;
  rate: string;
  isUp: boolean;
};
const Kline = ({ coin = 'BTC', price = '' }: { coin: string; price: string }) => {
  const [resolution, setResolution] = useState<ResolutionType>(configFiatCrypto[0]); // 切换K线周期
  const [data, setData] = useState<Item>({ c: 0, rate: '', isUp: false });
  useEffect(() => {
    if (coin) {
      WS.subscribe4001([`${coin}_USDT`.toUpperCase() as string]);
    }
    return () => {
      WS.unsubscribe4001();
    };
  }, [coin]);

  useWs(SUBSCRIBE_TYPES.ws4001, (item: Item) => setData(item));

  return (
    <>
      <div className='my-kline-box'>
        <div className='header1'>
          <CoinLogo coin={coin} width={30} height={30} />
          <CoinLogo coin='USDT' width={34} height={34} className='logo' />
          <span className='name'>{coin}/USDT</span>
          {/* <span className='rate'>
            1&nbsp;{coin}&nbsp;≈&nbsp;{price}&nbsp;USDT
          </span> */}
        </div>
        <div className='header2'>
          <div className='l'>
            <span className='price'>{data.c}</span>
            <span className={'rate'} style={{ color: `var(${data.isUp ? '--color-green' : '--color-red'})` }}>
              {data.rate}%
            </span>
            {/* <span className='date'>{LANG('Past 24Hours')}</span> */}
          </div>
          <div className='r'>
            {configFiatCrypto.map((item: ResolutionType) => {
              return (
                <span
                  className={clsx(item.value == resolution.value && 'active')}
                  key={item.value}
                  onClick={() => setResolution(item)}
                >
                  {item.value}
                </span>
              );
            })}
          </div>
        </div>
        <div className='box'>
          <KlineChart id={coin + '_USDT'} theme={'light'} resolution={resolution} />
        </div>
      </div>
      <style jsx>{`
        .my-kline-box {
          display: flex;
          flex-direction: column;
          flex: 1;
          background: var(--theme-background-color-2);
          min-height: 366px;
          padding-right: 50px;
          .header1 {
            display: flex;
            align-items: center;
            padding-bottom: 10px;
            :global(.logo) {
              border: 2px solid #fff;
              margin-left: -4px;
              border-radius: 50%;
            }
            .name {
              color: var(--theme-font-color-1);
              font-size: 26px;
              margin-left: 14px;
              font-weight: 500;
            }
            .rate {
              margin-left: 14px;
              font-size: 16px;
              color: var(--theme-font-color-2);
            }
          }
          .header2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            .l {
              display: flex;
              align-items: center;
              .price {
                font-size: 36px;
                color: var(--theme-font-color-1);
                font-weight: 500;
              }
              .rate {
                font-size: 16px;
                margin-left: 10px;
              }
              .date {
                font-size: 16px;
                color: var(--theme-font-color-2);
                margin-left: 10px;
              }
            }
            .r {
              display: flex;
              justify-content: space-between;
              span {
                height: 20px;
                padding: 0 5px;
                display: flex;
                justify-content: center;
                font-size: 14px;
                font-weight: 400;
                color: var(--theme-font-color-2);
                align-items: center;
                cursor: pointer;
                &.active {
                  color: var(--theme-font-color-1);
                  font-weight: 500;
                }
              }
            }
          }
          .box {
            flex: 1;
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default Kline;
