import { LANG } from '@/core/i18n';
import { SideType, Swap } from '@/core/shared';

import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { WalletAvatar } from '@/components/wallet-avatar';
import { useRouter } from '@/core/hooks';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';
import { useAppContext } from '@/core/store';
import { clsx, MediaInfo } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-use';
import CommonIcon from '@/components/common-icon';
import TradeSettingIcon from '@/components/header/components/icon/trade-setting-icon';
import { orderInstance as Order } from '@/core/shared/src/swap/modules/order';
import { Mobile } from '@/components/responsive';

export const ToolBar = ({ wrapperClassName }: { wrapperClassName?: string }) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const newMarginMode = Swap.Info._newMarginMode;
  const twoWayMode = Swap.Trade.twoWayMode;
  const { leverageLevel, leverageLevelBuy, leverageLevelSell, marginType } = Swap.Info.getLeverFindData(quoteId);
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const wallets = Swap.Assets.getWallets({ usdt: isUsdtType });
  const walleetOptionIndex = wallets.findIndex(v => v.wallet === walletId);
  const isBounsWallet = Swap.Info.getIsBounsWallet(walletId);
  const walleetOption = wallets[walleetOptionIndex] || { alias: SWAP_DEFAULT_WALLET_ID };
  const { isLogin } = useAppContext();
  const router = useRouter();
  const isDemo = isSwapDemo(useLocation().pathname);
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  const { buyPosition, sellPosition } = Order.getTwoWayPosition({
    usdt: isUsdtType,
    openPosition: false,
    code: quoteId,
    marginType
  });

  const authFunction = (func: Function) => {
    return () => {
      if (!isLogin) {
        return router.push('/login');
      }
      func();
    };
  };
  const walletName = Swap.Assets.walletFormat(walleetOption).alias;
  const walletBar = (
    <div
      className={clsx('wallet-bar', 'wallet-view-guide-step-1')}
      onClick={() => {
        if (isDemo) {
          return;
        }
        isLogin ? Swap.Trade.setModal({ walletSelectVisible: true }) : router.push('/login');
      }}
    >
      {/* <WalletAvatar
        size={20}
        type={!isDemo ? walleetOption.pic || '' : null}
        walletData={Swap.Assets.walletFormat(walleetOption)}
      /> */}
      {/* <CommonIcon name="swap-wallet-icon-rounded-0" size={16} /> */}
      <div className='wallet-title'>
        {!isDemo ? (
          <>
            {/* <InfoHover className={clsx('name')}>{LANG(walletName)}</InfoHover> */}
            <div className={clsx('name')}>{LANG(walletName)}</div>
          </>

        ) : (
          <div className={clsx('name')}>{LANG('模拟交易账户')}</div>
        )}
        <CommonIcon name="common-chevron-down-text_2-0" size={16} className="arrow" />
      </div>
      {/* {!isDemo && <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />} */}
    </div>
  );
  return (
    <>
      <div className={clsx('root', wrapperClassName)}>
        {isLogin ? (
          !isDemo ? (
            <>
              {/* <Tooltip
                placement="bottomLeft"
                title={
                  <div
                    className="trade-tool-bar-wallet-name-tips"
                    dangerouslySetInnerHTML={{
                      __html: LANG('您当前正在使用{walletName}，点击可添加或切换其他子钱包', {
                        walletName: `<span>${!isBounsWallet ? LANG(walletName) : LANG('体验金钱包')}</span>`
                      })
                    }}
                  />
                }
              >
                {walletBar}
              </Tooltip> */}
              {walletBar}
            </>
          ) : (
            walletBar
          )
        ) : (
          <div />
        )}

        <div className={'right swap-guide-step-2'}>
          {/* <SubButton className={'btn'} onClick={() => Swap.Trade.setModal({ marginTypeVisible: true })}>
            {marginType === 1 ? LANG('全仓') : LANG('逐仓')}
          </SubButton>
          <SubButton
            className={'btn'}
            onClick={() =>
              Swap.Trade.setModal({
                leverVisible: true,
                leverData: { lever: leverageLevel, symbol: Swap.Trade.base.quoteId },
              })
            }
          >
            {leverageLevel}X
          </SubButton> */}
          <div className="swap-title">
            <div
              className={'margin-type'}
              onClick={authFunction(() =>
                Swap.Trade.setModal({
                  marginTypeVisible: true,
                  leverData: { lever: leverageLevel, symbol: Swap.Trade.base.quoteId }
                })
              )}
            >
              <div> {marginType === 1 ? LANG('全仓') : LANG('逐仓')} </div>
              <CommonIcon name="common-chevron-down-text_2-0" size={16} className="arrow" />
            </div>
            {newMarginMode && twoWayMode ? (
              <div className="twoway-mode-leverage">
                <div
                  className={'margin-leverage'}
                  onClick={authFunction(() =>
                    Swap.Trade.setModal({
                      leverVisible: true,
                      leverData: {
                        lever: leverageLevelBuy,
                        symbol: quoteId,
                        side: SideType.BUY,
                        pid: buyPosition?.positionId
                      }
                    })
                  )}
                >
                  <div className="buy"> {leverageLevelBuy}x </div>
                  <CommonIcon name="common-chevron-down-text_2-0" size={16} className="arrow" />
                </div>
                <div
                  className={'margin-leverage'}
                  onClick={authFunction(() =>
                    Swap.Trade.setModal({
                      leverVisible: true,
                      leverData: {
                        lever: leverageLevelSell,
                        symbol: quoteId,
                        side: SideType.SELL,
                        pid: sellPosition?.positionId
                      }
                    })
                  )}
                >
                  <div className="sell"> {leverageLevelSell}x </div>
                  <CommonIcon name="common-chevron-down-text_2-0" size={16} className="arrow" />
                </div>
              </div>
            ) : (
              <div
                className={'margin-leverage'}
                onClick={authFunction(() =>
                  Swap.Trade.setModal({
                    leverVisible: true,
                    leverData: { lever: leverageLevel, symbol: quoteId }
                  })
                )}
              >
                <div>
                  {leverageLevel}x
                  {leverageLevel >
                    (Swap.Info.getIsBounsWallet(walletId)
                      ? cryptoData?.experienceMaxLeverage
                      : cryptoData?.leverageLevel) && <ExclamationCircleOutlined className={clsx('icon')} />}
                </div>
                <CommonIcon name="common-chevron-down-text_2-0" size={16} className="arrow" />
              </div>
            )}
          </div>
          <Mobile>
            <div className="swap-setting">
              <CommonIcon
                name="swap-calculator-0"
                size={16}
                onClick={() => Swap.Trade.setModal({ calculatorVisible: true })}
              />
              <TradeSettingIcon />
            </div>
          </Mobile>

          {/* <div className='line'></div>
          <div
            className='preference'
            onClick={authFunction(() => Swap.Trade.setModal({ preferenceMenuVisible: true }))}
          >
            <div>
              <CommonIcon name='common-preference-0' width={16} height={13.474} />
            </div>
          </div> */}
        </div>
        {/* <PreferenceMenu /> */}
      </div>
      <style jsx>
        {`
          :global(.trade-tool-bar-wallet-name-tips) {
            :global(span) {
              color: var(--skin-primary-color);
            }
          }
          .root {
            font-size: 12px;
            height: 40px;
            padding-bottom: 3px;
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid var(--fill_line_1);
            gap: 16px;
            @media ${MediaInfo.mobile} {
              height: 2.5rem;
              padding: 0;
            }
            :global(.wallet-bar) {
              display: flex;
              align-items: center;
              line-height: 14px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 4px;
              :global(.wallet-title) {
                display: flex;
                align-items: center;
                gap: 0px;
                :global(.name) {
                  color: var(--text_1);
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: normal;
                }
              }
              :global(> .arrow) {
                transform: rotate(-90deg);
              }
            }

            .right {
              display: flex;
              height: 40px;
              justify-content: space-between;
              align-items: center;
              align-self: stretch;
              flex: 1 auto;
              @media ${MediaInfo.mobile} {
                height: 2.5rem;
              }
              .swap-title {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-radius: 8px;
                gap: 16px;
                :global(.icon) {
                  margin-left: 4px;
                  color: var(--const-color-error);
                }
                .margin-type,
                .margin-leverage {
                  display: flex;
                  align-items: center;
                  gap: 0px;
                  > div {
                    color: var(--text_1);
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 14px;
                    &.buy {
                      color: var(--color-green);
                    }
                    &.sell {
                      color: var(--color-red);
                    }
                  }
                }
                .twoway-mode-leverage {
                  display: flex;
                  align-items: center;
                  gap: 16px;
                }
                .line {
                  height: 13px;
                  width: 1px;
                  background-color: var(--theme-deep-border-color-1);
                }
                .preference {
                  user-select: none;
                  height: inherit;
                  width: 36px;
                  cursor: pointer;
                  flex: none;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }
              @media ${MediaInfo.mobile} {
                .swap-setting {
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 16px;
                }
              }
            }
          }
        `}
      </style>
    </>
  );
};
