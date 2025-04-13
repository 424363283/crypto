import { Button } from '@/components/button';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { RateText } from '@/components/rate-text';
import { LANG, TrLink } from '@/core/i18n';
import { Account, Lite } from '@/core/shared';
import { MediaInfo, Polling } from '@/core/utils';
import css from 'styled-jsx/css';
import { useRouter, useTheme } from '@/core/hooks';
import { useEffect, useState } from 'react';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { useImmer } from 'use-immer';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { InfoHover } from '@/components/trade-ui/common/info-hover';

const UNIT: {
  [name: string]: string;
} = {
  USDT: 'Tether',
  USDC: 'USDC',
};

const { Trade } = Lite;

const Asset = () => {
  const {
    coin,
    quoteCoin,
    quoteCoinBalance,
    coinBalance,
    currentSpotContract,
    quoteCoinScale,
    coinScale,
    tradeTab,
    balance,
    holdings,
    plan,
    frozen,
    USDTScale
  } = Trade.state;
  const availableAmont = balance.toFixed(USDTScale);
  const totalAmont = balance.add(holdings).add(plan).add(frozen).toFixed(USDTScale);
  const [state, setState] = useImmer({
    transferModalVisible: false,
    sourceAccount: ACCOUNT_TYPE.SPOT,
    targetAccount: ACCOUNT_TYPE.SWAP_U,
  })
  const { transferModalVisible, sourceAccount, targetAccount } = state;
  const router = useRouter();
  const isLogin = Account.isLogin;
  useEffect(() => {
    const polling = new Polling({
      interval: 2000,
      callback: Trade.getBalance,
    });
    if (isLogin) {
      polling.start();
    } else {
      polling?.stop();
    }
    return () => polling?.stop();
  }, [isLogin])
  const onTransfer = () => {
    if (!Account.isLogin) {
      router.replace('/login');
      return;
    }
    setState((draft) => {
      draft.transferModalVisible = true;
    });
  }
  const onTransferModalClose = () => {
    setState((draft) => {
      draft.transferModalVisible = false;
    });
  }
  return (
    <>
      <div className='asset'>
        {isLogin ? (
          <>
            <div className='title'>
              <span>{LANG('资产')}</span>
              <div className='operate'>
                <TrLink href='/account/fund-management/asset-account/recharge' >
                  <div className='recharge'>
                    <CommonIcon name='common-recharge-0' size={14} /><span>{LANG('充值')}</span>
                  </div>
                </TrLink>
                {/* Account.isLogin && <div className='transfer' onClick={onTransfer}>
                  <CommonIcon name='common-exchange-0' size={14} /><span>{LANG('划转')}</span>
                </div> */}
              </div>
            </div>
            <div className='asset-section'>
              <div className='subtitle'>USDT</div>
              <div className='asset-content'>
                <div className={'row'}>
                  <span>{LANG('全部资产')}:</span>
                  <span> {totalAmont} </span>
                </div>
                <div className={'row'}>
                  <span>{LANG('可用资产')}:</span>
                  <span> {availableAmont} </span>
                </div>
              </div>
            </div>
            {transferModalVisible && (
              <TransferModal
                defaultSourceAccount={sourceAccount}
                defaultTargetAccount={targetAccount}
                open={transferModalVisible}
                onCancel={onTransferModalClose}
              />
            )}
          </>
        ) : ''}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Asset;
const styles = css`
  :global(.asset) {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-1);
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
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      line-height: 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      .operate {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        .recharge, .transfer {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          color: var(--text-brand);
        }
      }
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
    .asset-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .subtitle {
        display: flex;
        height: 24px;
        flex-direction: column;
        justify-content: center;
        align-self: stretch;
        color: var(--text-primary);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
      .asset-content { 
        display: flex;
        flex-direction: column;
        gap: 8px;
        :global(.row) {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 14px;
          font-size: 12px;
          font-weight: 400;
          > :global(*) {
            &:nth-child(1) {
              color: var(--text-tertiary);
            }
            &:nth-child(2) {
              flex: 1 0 0;
              text-align: right;
              color: var(--text-primary);
            }
          }
        }
      }
    }
  }
`;
