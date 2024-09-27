import Image from '@/components/image';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';
import State from '../state';

const Info = () => {
  const [tab, setTab] = useState('swap');
  const [prevNumber, setPrevNumber] = useState(0);
  const [nextNumber, setNextNumber] = useState(0);
  const [scroll, setScroll] = useState('prev');
  const title: any = {
    spot: LANG('Spot trading volume (30 days)'),
    swap: LANG('Futures trading volume (30 days)'),
  };
  const { state } = State();
  const vip = state.level;
  const list = state.vipLevels[tab];
  return (
    <div className='info'>
      <div className='title'>{LANG('Fees and withdrawal limits')}</div>
      <div className='tabs'>
        {/* <div className={clsx('tab', tab === 'spot' && 'active')} onClick={() => setTab('spot')}>
          {LANG('Spot')}
        </div> */}
        <div className={clsx('tab', tab === 'swap' && 'active')} onClick={() => setTab('swap')}>
          {LANG('Futures')}
        </div>
      </div>
      <ScrollXWrap prevNumber={prevNumber} nextNumber={nextNumber} nextWidth={1200}>
        {list?.map(({ trading, balance, makerRate, takerRate, withdrawal }: any, index: number) => {
          return (
            <div key={index} className={clsx('item', vip === index && 'active')}>
              <div className='i-grade'>
                <Image
                  shouldHideOnError
                  src={`/static/images/vip/vip${index}.svg`}
                  alt={`vip_${index}`}
                  width={28}
                  height={28}
                />
                <span>VIP{index}</span>
              </div>
              <div className='i-title'>{title[tab]}</div>
              <div className='i-trading'>
                {'>'}
                {trading?.toFormat()}USDT
              </div>
              <div className='text'>or</div>
              <div className='balance'>
                <div>{LANG('Asset balance')}</div>
                <div>
                  {'>'}
                  {balance?.toFormat()}USDT
                </div>
              </div>
              <div className='fee'>
                <div className='f-item'>
                  <span>{LANG('Maker fee')}</span>
                  <span>{makerRate}%</span>
                </div>
                <div className='f-item'>
                  <span>{LANG('Taker fee')}</span>
                  <span>{takerRate}%</span>
                </div>
                <div className='f-item'>
                  <span>{LANG('24h withdrawal limit')}</span>
                  <span>{withdrawal}BTC</span>
                </div>
              </div>
              <div className='vip-logo'>
                <Image
                  shouldHideOnError
                  src={`/static/images/vip/vip${index}.svg`}
                  alt={`vip_${index}`}
                  width={280}
                  height={280}
                />
              </div>
            </div>
          );
        })}
      </ScrollXWrap>
      <div className='scroll-box'>
        <div
          className={clsx('scroll', scroll === 'prev' && 'active')}
          onClick={() => {
            setScroll('prev');
            setPrevNumber(prevNumber + 1);
          }}
        />
        <div
          className={clsx('scroll', scroll === 'next' && 'active')}
          onClick={() => {
            setScroll('next');
            setNextNumber(nextNumber + 1);
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .info {
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    color: var(--theme-font-color-1);

    .title {
      font-weight: 600;
      font-size: 36px;
      padding: 50px 0;
    }
    .tabs {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 32px;
      .tab {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-3);
        display: flex;
        height: 38px;
        padding: 0 36px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: var(--theme-background-color-8);
        cursor: pointer;
        &.active {
          background: var(--skin-color-active);
          color: var(--skin-font-color);
        }
      }
    }
    :global(.scroll-current) {
      display: flex;
      gap: 16px;
    }
    :global(.prev),
    :global(.next) {
      display: none !important;
    }
    .item {
      border-radius: 12px;
      padding: 0 18px;
      border: 1px solid var(--skin-border-color-1);
      position: relative;
      &.active {
        border-color: var(--skin-color-active);
        .i-grade {
          border-color: var(--skin-color-active);
        }
        .fee {
          background: var(--skin-active-linear-color);
          color: var(--skin-font-color);
        }
      }
      .vip-logo {
        position: absolute;
        top: 95px;
        right: 0;
        width: 180px;
        height: 280px;
        overflow: hidden;
        opacity: 0.2;
        :global(img) {
          margin-right: -100px;
        }
      }
      div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .i-grade {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 0;
        border-bottom: 1px solid var(--skin-border-color-1);
        font-size: 14px;
        font-weight: 400;
        :global(img) {
          width: 28px;
          height: auto;
          margin-right: 4px;
        }
      }
      .i-title {
        font-size: 14px;
        font-weight: 400;
        padding-top: 44px;
      }
      .i-trading {
        font-size: 16px;
        font-weight: 600;
        padding-top: 8px;
      }
      .text {
        padding: 24px 0;
        font-size: 14px;
        font-weight: 400;
      }
      .balance {
        flex-direction: column;
        font-size: 14px;
        font-weight: 400;
        div:nth-child(2) {
          font-size: 16px;
          font-weight: 600;
          padding: 8px 0 70px;
        }
      }
      .fee {
        width: 250px;
        flex-direction: column;
        margin-bottom: 32px;
        background: var(--theme-background-color-8);
        padding: 12px;
        border-radius: 8px;
        gap: 4px;
        position: relative;
        z-index: 1;
        & > div {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 400;
          height: 20px;
        }
      }
    }

    .scroll-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      margin-top: 24px;
      .scroll {
        width: 25px;
        height: 6px;
        background: var(--theme-background-color-8);
        border-radius: 3px;
        cursor: pointer;
        &.active {
          width: 50px;
          background: var(--skin-color-active);
        }
      }
    }
    @media ${MediaInfo.tablet} {
      padding: 0 32px;
      .title {
        font-size: 32px;
        padding: 40px 0;
      }
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px;
      .title {
        font-size: 20px;
        padding: 30px 0;
      }
      .scroll-box {
        display: none;
      }
    }
  }
`;

export default Info;
