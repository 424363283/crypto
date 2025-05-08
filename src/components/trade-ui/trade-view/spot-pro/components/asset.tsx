import { Button } from '@/components/button';
import CoinLogo from '@/components/coin-logo';
import { RateText } from '@/components/rate-text';
import { LANG, TrLink } from '@/core/i18n';
import { Account, Spot } from '@/core/shared';
import { MediaInfo, Polling } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

const UNIT: {
  [name: string]: string;
} = {
  USDT: 'Tether',
  USDC: 'USDC',
};

const { Trade } = Spot;

const Asset = () => {
  const { coin, quoteCoin, quoteCoinBalance, coinBalance, currentSpotContract, quoteCoinScale, coinScale, tradeTab } =
    Trade.state;
  const isLogin = Account.isLogin;
  useEffect(() => {
    const polling = new Polling({
      interval: 2000,
      callback: () => {
        if (isLogin) {
          Trade.getBalance()
        }
      }
    });
    polling.start();
    return () => {
      polling.stop();
    };
  }, [isLogin]);
  return (
    <>
      <div className='footer'>
        {isLogin ? (
          <>
            <div className='title'>{LANG('资产')}</div>
            <div className='content'>
              <div className='asset'>
                <div className='asset-name'>
                  <CoinLogo coin={coin} width={24} height={24} alt='coin-icon' />
                  <div className='coinName'>
                    <div>{coin}</div>
                    <div>{currentSpotContract.fullname}</div>
                  </div>
                </div>
                <div className='money'>
                  <div>{coinBalance.toFormat(coinScale)}</div>
                  <div>
                    ≈ <RateText money={coinBalance} prefix currency={coin} />
                  </div>
                </div>
              </div>
              <div className='asset'>
                <div className='asset-name'>
                  <CoinLogo coin={quoteCoin} width={24} height={24} alt='coin-icon' />
                  <div className='coinName'>
                    <div>{quoteCoin}</div>
                    <div>{UNIT[quoteCoin]}</div>
                  </div>
                </div>
                <div className='money'>
                  <div>{quoteCoinBalance.toFormat(quoteCoinScale)}</div>
                  <div>
                    ≈ <RateText money={quoteCoinBalance} prefix currency={quoteCoin} />
                  </div>
                </div>
              </div>
            </div>
            <div className='links'>
              <Button>
                <TrLink href='/account/fund-management/asset-account/recharge'>{LANG('充币')}</TrLink>
              </Button>
              {/* <Button>
              <TrLink href='/fiat-crypto'>{LANG('买币')}</TrLink>
            </Button> */}
              <Button>
                <TrLink href='/account/fund-management/asset-account/withdraw'>{LANG('提币')}</TrLink>
              </Button>
            </div>
          </>
        ) : ''}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Asset;
const styles = css`
  :global(.footer) {
    display: flex;
    flex-direction: column;
    background-color: var(--fill_bg_1);
    padding: 16px;
    margin-top: var(--theme-trade-layout-spacing);
    flex: 1;
    gap: 16px;
    @media ${MediaInfo.isSmallDesktop} {
      border-radius: var(--theme-trade-layout-radius);
    }
    @media ${MediaInfo.isTablet} {
      display: none;
      flex: auto;
    }
    .title {
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    .links {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      :global(button) {
        flex: 1 auto;
      }
      &.disabled {
        cursor: not-allowed;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      gap: 32px;
      .asset {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .asset-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .coinName, .money {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-weight: 500;
          color: var(--text_1);
          gap: 8px;
          > div:last-child {
            font-size: 12px;
            font-weight: 400;
            color: var(--text_3);
          }
        }
        .money {
          text-align: right;
        }
      }
      .line {
        width: 100%;
        height: 1px;
        flex-shrink: 0;
        background: var(--common-line-color);
      }
    }
  }
`;
