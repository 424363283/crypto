import { AssetValueToggleIcon } from '@/components/common-icon';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import ProTooltip from '@/components/tooltip';
import { useLocalStorage } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY } from '@/core/store';
import { MediaInfo, getUrlQueryParams } from '@/core/utils';
import { memo } from 'react';
import css from 'styled-jsx/css';
import { AssetsBalance } from '../../../../dashboard/components/assets-balance';
import { PnlNavButton } from '../profit-analysis-card/pnl-nav-button';
import { store } from '../store';
import { WalletType } from '../types';
import { SWAP_COPY_WALLET_KEY, SWAP_DEFAULT_WALLET_KEY, WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

type CardProps = {
  type: WalletType;
  wallet?: WalletKey | '';
  buttons: { [key: string]: () => any };
};
const FundWalletCardUi = (props: CardProps) => {
  const WALLET_BALANCE_COMMENT = LANG(
    '钱包余额=总共净划入+总共已实现盈亏+总共净资金费用-总共手续费；资产折合BTC、USD数据仅供参考，由于数据汇率波动，可能导致计算误差情况，具体资产以下方全部资产明细数据为准'
  );
  const { type, wallet, buttons } = props;
  const { hideBalance } = store;
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(LOCAL_KEY.ASSETS_COIN_UNIT, 'BTC');
  const BUTTON_MAP = buttons;
  const onEyeClick = () => {
    store.hideBalance = !hideBalance;
  };
  const WALLET_TITLE_MAP: any = {
    [WalletType.ASSET_SPOT]: LANG('现货账户'),
    // [WalletType.ASSET_SWAP]: LANG('币本位合约账户'),
    [WalletType.ASSET_SWAP_U]: {
      [WalletKey.SWAP_U]: LANG('U本位合约账户'),
      [WalletKey.COPY]: LANG('跟单账户')
    },
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
      <Desktop>
        <p className='head-title'>{wallet ? WALLET_TITLE_MAP[type][wallet] : WALLET_TITLE_MAP[type]}</p>
      </Desktop>
      <div className='assets-info'>
        <div className='left-asset-wrapper'>
          <div className='title'>
            <div className='title-box'>
              {TITLE_MAP[type]}
              <AssetValueToggleIcon show={!hideBalance} onClick={onEyeClick} className='eye-icon' size={18} />
            </div>
            {type !== WalletType.ASSET_TOTAL && (
              <MobileOrTablet>
                {type !== WalletType.ASSET_SPOT && <PnlNavButton type={type} />}
              </MobileOrTablet>
            )}
          </div>
          <AssetsBalance enableHideBalance={hideBalance} type={type} wallet={wallet} onCurrencyChange={onCurrencyChange} />
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
    background-color: var(--fill_bg_1);
    width: 100%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-bottom: 16px;
    @media ${MediaInfo.mobile} {
      margin:0;
      border-bottom: 1px solid var(--fill_line_1);
      position: relative;
      border-radius: 0px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }
    .head-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--text_1);
      @media ${MediaInfo.mobile} {
        padding: 18px 10px 15px;
      }
      @media ${MediaInfo.mobileOrTablet} {
        border-bottom: 1px solid var(--fill_line_1);
      }
    }
    .assets-info {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0 0 0 16px;
      align-items: start;
      @media ${MediaInfo.mobile} {
        padding:0 0 15px 0;
        display: flex;
        flex-direction:column;
      }
      .left-asset-wrapper {
        position: relative;
        display:flex;
        flex-direction:column;
        align-items: start;
        @media ${MediaInfo.mobile} {
          margin-bottom:15px;
          width:100%;
        }
        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 22px;
          font-size: 16px;
          font-weight: 400;
          color: var(--text_2);
          gap: 8px;
          @media ${MediaInfo.mobile}{
            width: 100%;
            justify-content: space-between;
          }
          .title-box{
            display: flex;
            align-items: center;
            .text {
              cursor: pointer;
              border-bottom: 1px solid var(--fill_line_1);
            }
            :global(.eye-icon) {
              cursor: pointer;
              margin-left: 7px;
              margin-right: 7px;
            }
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
          margin-top: 16px;
          @media ${MediaInfo.tablet} {
            position: absolute;
            top: 28px;
          }
          @media ${MediaInfo.mobile} {
           margin-top: 24px;
           gap:12px;
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
          width:100%;
          gap: 8px;
        }
        :global(.button-wrapper) {
          margin-right: 15px;
         
          @media ${MediaInfo.mobile} {
            flex: 1;
            width:100%;
            margin-right: 0;
          }
          &:last-child {
            margin-right: 0px;
          }
          :global(.common-button){
            min-width:72px;
            @media ${MediaInfo.mobile} {
              padding: 0;
              width: 100%;
            }
          }
        }
      }
    }
  }
`;
