import { Button } from '@/components/button';
import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { WalletAvatar } from '@/components/wallet-avatar';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY, WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { DEFAULT_QUOTE_ID } from '@/core/shared/src/swap/modules/trade/constants';
import { clsx } from '@/core/utils';
import { useState } from 'react';
import { CalcSwapAsset } from '../../../../hooks/use-swap-balance';
import { TradeHref } from './components/trade-href';
import { Size } from '@/components/constants';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';

export const Desktop = ({
  data = [],
  isSwapU,
  wallet,
  onOpenTransferModal,
  onOpenWalletFormModal,
}: {
  data?: CalcSwapAsset[];
  isSwapU: boolean;
  wallet: WalletKey;
  onOpenTransferModal?: any;
  onOpenWalletFormModal?: any;
}) => {
  const [shows, setShows] = useState<any>(false);
  const unit = Swap.Info.getPriceUnitText(isSwapU);
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();

  return (
    <>
      <div className='all-asset-swap-desktop'>
        <div className='header'>
          {/* <div>{LANG('子钱包')}</div> */}
          <div>
            {LANG('钱包余额')}({unit})
          </div>
          <div>
            {LANG('保证金余额')}({unit})
          </div>
          <div>
            {LANG('可提现')}({unit})
          </div>
          <div>
            {LANG('未实现盈亏')}({unit})
          </div>
          <div>{LANG('操作')}</div>
        </div>
        {data.filter(item => !isSwapU || item.wallet === wallet).map((v, i) => {
          const code = isSwapU ? DEFAULT_QUOTE_ID.SWAP_U : DEFAULT_QUOTE_ID.SWAP;
          let accb = v.accb;
          let totalMargin = v.totalMargin.add(v.unrealisedPNL);
          let canWithdrawAmount = v.canWithdrawAmount;
          if (v.wallet === SWAP_BOUNS_WALLET_KEY) {
            canWithdrawAmount = accb;
            accb = v.bonusAmount;
            totalMargin = totalMargin.add(v.bonusAmount);
          }
          return (
            <div className='row-wrapper' key={i}>
              <div className='row'>
                {/* <div className='wallet'
                //  onClick={() => Swap.Assets.walletFormat(v).edit && onOpenWalletFormModal(v)} 隐藏设置子账号弹窗
                 >
                  { 
                    //<WalletAvatar type={v.pic} size={20} walletData={Swap.Assets.walletFormat(v)} /> 
                  }
                  <div>
                    <div>
                      {Swap.Assets.walletFormat(v).alias}
                      {
                      // Swap.Assets.walletFormat(v).edit && <CommonIcon name='common-edit-gray-0' size={14} />
                      }
                    </div>
                    <div className='gray hidden'>{v.remark || '-'}</div>
                  </div>
                </div> */}
                <div>{accb}</div>
                <div>{totalMargin}</div>
                <div>{canWithdrawAmount}</div>
                <div className={Number(v.unrealisedPNL) >= 0 ? 'positive-text' : 'negative-text'}>{v.unrealisedPNL}</div>
                <div className='swap-button-box'>
                  <Button type='primary' size={Size.SM} rounded width={72}>
                    <TradeHref href={`/swap/${code?.toLocaleLowerCase()}`}>
                      {(href) => (
                        <div
                          onClick={() => {
                            if (v.wallet === WalletKey.COPY) {
                              Swap.Info.setWalletId(isSwapU, isCopyTrader ? WalletKey.COPY : WalletKey.SWAP_U);
                            } else {
                              Swap.Info.setWalletId(isSwapU, v.wallet || '');
                            }
                            window.location.href = href;
                          }}
                        >
                          {LANG('交易')}
                        </div>
                      )}
                    </TradeHref>
                  </Button>
                  <Button size={Size.SM} width={72} rounded onClick={() => onOpenTransferModal(code, v.wallet)}>
                    {LANG('划转')}
                  </Button>
                  {!isSwapU && (
                    <div
                      className={clsx('show-arrow', !!shows[i] && 'active')}
                      onClick={() => setShows((v: any) => ({ ...v, [i]: !v[i] }))}
                    >
                      <CommonIcon name='common-arrow-down-0' width={12} height={7} />
                    </div>
                  )}
                </div>
              </div>
              {!isSwapU && !!shows[i] && (
                <div className='sub-list'>
                  <div className='header'>
                    <div>{LANG('合约')}</div>
                    <div>{LANG('钱包余额')}</div>
                    <div>{LANG('保证金余额')}</div>
                    <div>{LANG('可提现')}</div>
                    <div>{LANG('未实现盈亏')}</div>
                  </div>
                  {Object.values(v.cryptos).map((asset, i) => {
                    return (
                      <div key={i} className='row-wrapper'>
                        <div className='row'>
                          <div className='wallet'>
                            <CoinLogo width={20} height={20} coin={asset.currency || ''} />
                            <div>{asset.currency}</div>
                          </div>
                          <div>{asset.accb}</div>
                          <div>{asset.margin}</div>
                          <div>{asset.canWithdrawAmount}</div>
                          <div className={clsx(Number(asset.unrealisedPNL) >= 0 ? 'main-raise' : 'main-fall')}>
                            {asset.unrealisedPNL}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .all-asset-swap-desktop {
          color: var(--text_1);
          padding: 0 24px 16px;
          .header {
            height: 40px;
            font-size: 14px;
            color: var(--text_3);
            display: flex;
            align-items: center;
            > div {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;

              flex: 1;
              &:first-child {
              }
              &:last-child {
                display: flex;
                align-items: center;
                justify-content: flex-end;
              }
            }
          }

          .row-wrapper {
            margin-bottom: 10px;
            padding: 5px 0;
          }
          .row {
            display: flex;
            font-weight: 500;
            align-items: center;
            > div {
              white-space: nowrap;
              text-overflow: ellipsis;
              flex: 1;
              &:first-child {
              }
              &:last-child {
                display: flex;
                align-items: center;
                justify-content: flex-end;
              }
            }
            .wallet {
              display: flex;
              align-items: center;
              cursor: pointer;
              > div:last-child {
                margin-left: 0px;
              }
              > div > div {
                &:first-child {
                  display: flex;
                  align-items: center;
                  font-weight: 500;
                  :global(> *:last-child) {
                    margin-left: 16px;
                  }
                }
                &:last-child {
                  font-size: 12px;
                }
              }
              div {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
          .swap-button-box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            :global(> *:first-child) {
              margin-right: 10px;
            }
            :global(.button) {
              cursor: pointer;
              font-weight: 400;
              display: inline-block;
              min-width: 68px;
              padding: 6px 18px;
              color: var(--theme-font-color-1);
              font-size: 12px;
              border-radius: 5px;
              text-align: center;
              word-break: keep-all;
              flex-shrink: 0;
              &:last-child {
                margin-left: 10px;
              }
            }
            :global(.trade-button) {
              padding: 6px 18px;
              word-break: keep-all;
              height: 28px;
              color: var(--skin-font-color);
              font-size: 12px;
              border: none;
            }
          }
          .sub-list {
            margin-top: 10px;
            padding: 0 16px 8px;
            border-radius: 10px;
            background-color: var(--theme-background-color-3);
            .header {
              > div {
                flex: 1;
                &:first-child {
                }
                &:last-child {
                }
              }
            }
            .row-wrapper {
              margin-bottom: 10px;
              padding: 2.5px 0;
            }
            .row {
              > div {
                flex: 1;
                &:first-child {
                }
                &:last-child {
                }
              }
            }
          }
          .show-arrow {
            cursor: pointer;
            padding-left: 15px;
            padding-right: 5px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            &.active {
              :global(> *) {
                transform: rotate(180deg);
              }
            }
          }
          .gray {
            color: var(--theme-trade-text-color-3);
          }
        }
      `}</style>
    </>
  );
};
