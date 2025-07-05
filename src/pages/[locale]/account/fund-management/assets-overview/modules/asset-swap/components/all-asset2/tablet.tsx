import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet } from '@/components/responsive';
import { WalletAvatar } from '@/components/wallet-avatar';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY, WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { DEFAULT_QUOTE_ID } from '@/core/shared/src/swap/modules/trade/constants';
import { clsx, MediaInfo } from '@/core/utils';
import { useState } from 'react';
import { CalcSwapAsset } from '../../../../hooks/use-swap-balance';
import { AssetListModal } from './components/asset-list-modal';
import { TradeHref } from './components/trade-href';
import { Size } from '@/components/constants';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
export const Tablet = ({
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
  const [listData, setListData] = useState<any>([]);
  const { isMobile } = useResponsive();
  const unit = Swap.Info.getPriceUnitText(isSwapU);
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  return (
    <>
      <div className='all-asset-swap-tablet'>
        {data.filter(item => !isSwapU || item.wallet === wallet).map((v, i) => {
          const code = isSwapU ? DEFAULT_QUOTE_ID.SWAP_U : DEFAULT_QUOTE_ID.SWAP;
          let accb = v.accb;
          let totalMargin = v.totalMargin;
          let canWithdrawAmount = v.canWithdrawAmount;
          if (v.wallet === SWAP_BOUNS_WALLET_KEY) {
            canWithdrawAmount = accb;
            accb = v.bonusAmount;
            totalMargin = totalMargin.add(v.bonusAmount);
          }

          return (
            <div key={i} className='item-wrapper'>
              <div className='item'>
                {/* <div className='header'>
                  <div className='wallet' onClick={() => Swap.Assets.walletFormat(v).edit && onOpenWalletFormModal(v)}>
                    <WalletAvatar type={v.pic} size={26} walletData={Swap.Assets.walletFormat(v)} />
                    <div>
                      <div>
                        <div>{Swap.Assets.walletFormat(v).alias}</div>
                        {Swap.Assets.walletFormat(v).edit && <CommonIcon name='common-edit-gray-0' size={12} />}
                      </div>
                      <div>
                        {LANG('备注')}:{!!v.remark ? v.remark : '-'}
                      </div>
                    </div>
                  </div>
                  <div className={clsx('income', Number(v.unrealisedPNL) >= 0 ? 'main-raise' : 'main-fall')}>
                    <div>{v.unrealisedPNL}</div>
                    <div>
                      {LANG('未实现盈亏')}({unit})
                    </div>
                  </div>
                </div> */}
                <div className='infos'>
                  <div>
                    <div>
                      {LANG('钱包余额')}({unit})
                    </div>
                    <div>{accb}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('保证金余额')}({unit})
                    </div>
                    <div>{totalMargin}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('可提现')}({unit})
                    </div>
                    <div>{canWithdrawAmount}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('未实现盈亏')}({unit})
                    </div>
                    <div className={clsx('income', Number(v.unrealisedPNL) >= 0 ? 'main-raise' : 'main-fall')}>
                      {v.unrealisedPNL}
                    </div>
                  </div>
                </div>
                <div className='item-content'>
                  <div className='swap-button-box'>
                    {/* <div
                      onClick={() => {
                        setShows(true);
                        setListData(Object.values(v.cryptos));
                      }}
                    >
                      {LANG('资产详情')}
                    </div> */}
                    <div className='action-btns'>
                      <Button type='primary' size={Size.SM} rounded width={110}>
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
                      <Button size={Size.SM} width={110} rounded onClick={() => onOpenTransferModal(code, v.wallet)} >
                        {LANG('划转')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AssetListModal isSwapU={isSwapU} data={listData} visible={shows} onClose={() => setShows(false)} />
      <style jsx>{`
        .all-asset-swap-tablet {
          font-size: 12px;
          color: var(--text_1);
          padding: 10px;
          .item-wrapper {
            margin-bottom: 10px;
            &:not(:last-child) {
              .item {
                border-bottom: 1px solid var(--fill_line_3);
              }
            }
          }
          .item {
            .wallet {
              display: flex;
              align-items: center;
              cursor: pointer;
              > div {
                display: flex;
                flex-direction: column;
                > div {
                  &:first-child {
                    font-size: 14px;
                    margin-bottom: 5px;
                    > div {
                      &:first-child {
                        margin-right: 5px;
                      }
                    }
                  }
                  &:last-child {
                    font-size: 12px;
                    color: var(--theme-trade-text-color-3);
                  }
                }
                :global(> *) {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                }
              }
              :global(> *) {
                margin-right: 8px;
              }
            }
            .header {
              height: 70px;
              padding: 0 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid var(--fill_line_1);

              .income {
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                > div {
                  &:first-child {
                    font-size: 16px;
                    font-weight: 500;
                    margin-bottom: 2px;
                  }
                  &:last-child {
                    font-size: 12px;
                    color: var(--theme-trade-text-color-3);
                  }
                }
              }
            }
            .infos {
              padding: 16px 0 0;
              > div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                font-size: 14px;
                > div {
                  &:first-child {
                    color: var(--text_3);
                  }
                  &:last-child {
                    font-weight: 500;
                  }
                }
              }
            }
            .item-content {
              .swap-button-box {
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                > div {
                  &:first-child {
                    height: 40px;
                    cursor: pointer;
                    color: var(--text_brand);
                  }
                }
                .action-btns {
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  flex: 1 auto;
                  gap: 12px;
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
                  &:first-child {
                    margin-right: 5px;
                  }
                }
                :global(.trade-button) {
                  padding: 6px 18px;
                  word-break: keep-all;
                  height: 28px;
                  line-height: 28px;
                  color: var(--white);
                  font-size: 12px;
                  border: none;
                  @media ${MediaInfo.mobile} {
                    padding: 0 18px;
                  }
                }
              }
            }
            .sub-list {
              .bar {
                padding: 5px 0 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                > div {
                  &:last-child {
                    color: var(--skin-primary-color);
                  }
                }
              }
            }
            .sub-item {
              padding-top: 10px;
              border-bottom: 1px dashed var(--theme-border-color-2);
              .sub-item-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
              }
              .sub-item-infos {
                > div {
                  margin-bottom: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  > div {
                    &:first-child {
                      color: var(--theme-trade-text-color-3);
                    }
                  }
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
