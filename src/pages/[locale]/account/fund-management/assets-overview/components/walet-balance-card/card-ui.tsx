import { AssetValueToggleIcon } from '@/components/common-icon';
import { MobileOrTablet } from '@/components/responsive';
import ProTooltip from '@/components/tooltip';
import { useLocalStorage } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import { memo } from 'react';
import css from 'styled-jsx/css';
import { AssetsBalance } from '../../../../dashboard/components/assets-balance';
import { PnlNavButton } from '../profit-analysis-card/pnl-nav-button';
import { store } from '../store';
import { WalletType } from '../types';

type CardProps = {
  type: WalletType;
  buttons: { [key: string]: () => any };
};
const FundWalletCardUi = (props: CardProps) => {
  const WALLET_BALANCE_COMMENT = LANG(
    '钱包余额=总共净划入+总共已实现盈亏+总共净资金费用-总共手续费；资产折合BTC、USD数据仅供参考，由于数据汇率波动，可能导致计算误差情况，具体资产以下方全部资产明细数据为准'
  );
  const { type, buttons } = props;
  const { hideBalance } = store;
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(LOCAL_KEY.ASSETS_COIN_UNIT, 'BTC');
  const BUTTON_MAP = buttons;
  const onEyeClick = () => {
    store.hideBalance = !hideBalance;
  };
  const WALLET_TITLE_MAP: any = {
    [WalletType.ASSET_SPOT]: LANG('现货账户'),
    [WalletType.ASSET_SWAP]: LANG('币本位合约账户'),
    [WalletType.ASSET_SWAP_U]: LANG('U本位合约账户'),
    [WalletType.ASSET_TOTAL]: LANG('资产总览'),
  };
  const TITLE_MAP: any = {
    [WalletType.ASSET_SPOT]: LANG('资产估值({currency})', { currency: selectedCurrency }),
    [WalletType.ASSET_SWAP]: (
      <ProTooltip title={WALLET_BALANCE_COMMENT}>
        {LANG('钱包余额({currency})', { currency: selectedCurrency })}
      </ProTooltip>
    ),
    [WalletType.ASSET_SWAP_U]: (
      <ProTooltip title={WALLET_BALANCE_COMMENT}>
        {LANG('钱包余额({currency})', { currency: selectedCurrency })}
      </ProTooltip>
    ),
    [WalletType.ASSET_TOTAL]: LANG('总资产估值({currency})', { currency: selectedCurrency }),
  };
  const onCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };
  return (
    <div className='fund-wallet-card'>
      <p className='head-title'>{WALLET_TITLE_MAP[type]}</p>
      <div className='assets-info'>
        <div className='left-asset-wrapper'>
          <div className='title'>
            {TITLE_MAP[type]}
            <AssetValueToggleIcon show={!hideBalance} onClick={onEyeClick} className='eye-icon' size={18} />
            {type !== WalletType.ASSET_TOTAL && (
              <MobileOrTablet>
                <PnlNavButton type={type} />
              </MobileOrTablet>
            )}
          </div>
          <AssetsBalance enableHideBalance={hideBalance} type={type} onCurrencyChange={onCurrencyChange} />
        </div>
        <div className='right-button-area'>{BUTTON_MAP[type] && BUTTON_MAP[type]()}</div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
export const FundWalletCardUiMemo = memo(FundWalletCardUi);
const styles = css`
  .fund-wallet-card {
    background-color: var(--theme-background-color-2);
    width: 100%;
    border-radius: 15px;
    @media ${MediaInfo.mobile} {
      border-bottom: 1px solid var(--theme-border-color-2);
      padding-bottom: 20px;
      position: relative;
      border-radius: 0px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }
    .head-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      padding: 18px 14px 15px;
      @media ${MediaInfo.mobile} {
        padding: 18px 10px 15px;
      }
      border-bottom: 1px solid var(--theme-border-color-2);
    }
    .assets-info {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 20px 14px 20px;
      align-items: center;
      @media ${MediaInfo.mobile} {
        padding: 20px 12px 20px;
        margin-bottom: 60px;
      }
      .left-asset-wrapper {
        position: relative;
        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 22px;
          font-size: 16px;
          font-weight: 400;
          color: var(--theme-font-color-3);
          .text {
            cursor: pointer;
            border-bottom: 1px dashed #798296;
          }
          :global(.eye-icon) {
            cursor: pointer;
            margin-left: 7px;
            margin-right: 7px;
          }
        }
        .total {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          margin-bottom: 30px;
          .before {
            line-height: 36px;
            font-size: 30px;
            font-weight: bold;
            color: #232e34;
          }
          .after {
            margin-left: 10px;
            margin-bottom: 3px;
            font-size: 16px;
            font-weight: 500;
            color: #798296;
            line-height: 19px;
          }
        }
        :global(.assets-text-wrapper) {
          margin-top: 10px;
          @media ${MediaInfo.tablet} {
            position: absolute;
            top: 28px;
          }
        }
      }
      .right-button-area {
        display: flex;
        flex-shrink: 0;
        @media ${MediaInfo.desktop} {
          margin-top: -40px;
          position: absolute;
          right: 20px;
        }
        @media ${MediaInfo.mobile} {
          position: absolute;
          right: 0px;
          top: 130px;
          width: 100%;
        }
        :global(.mobile-action-button-wrapper) {
          display: flex;
          align-items: center;
          @media ${MediaInfo.mobile} {
            width: 100%;
            margin-left: 10px;
          }
          :global(.common-button) {
            padding: 7px 0px;
            width: 100%;
          }
          :global(a.button) {
            color: inherit;
          }
          :global(.primary) {
            margin-right: 10px;
            :global(.button) {
              color: var(--skin-font-color);
            }
          }
          :global(.light-sub-2) {
            color: var(--theme-font-color-1);
          }
          :global(.dropdown-btn) {
            margin-left: 10px;
            display: flex;
            align-items: center;
            min-width: 58px;
            :global(.more) {
              color: var(--theme-font-color-1);
              font-size: 12px;
              margin-right: 10px;
            }
          }
        }
        :global(.button-wrapper) {
          margin-right: 10px;
          @media ${MediaInfo.mobile} {
            flex: 1;
          }
          &:first-child {
            @media ${MediaInfo.mobile} {
              margin-left: 10px;
            }
          }
          &:last-child {
            margin-right: 0px;
            @media ${MediaInfo.mobile} {
              margin-right: 10px;
            }
          }
          :global(.common-button) {
            width: 100%;
          }
          :global(.button) {
            cursor: pointer;
            padding: 7px 18px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: var(--theme-font-color-1);
            border-radius: 5px;
          }
          :global(.primary.active .button) {
            color: var(--skin-font-color);
          }
          :global(.button.active) {
            border: none;
            background: var(--skin-primary-color);
            &:hover {
              background: var(--skin-primary-color) !important;
              border: none;
            }
          }
        }
      }
    }
  }
`;
