import CommonIcon from '@/components/common-icon';
import { RateText } from '@/components/rate-text';
import { useLocalStorage } from '@/core/hooks';
import { Account, Assets } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { MediaInfo, Polling, getUrlQueryParams } from '@/core/utils';
import { Dropdown, MenuProps } from 'antd';
import { memo, useEffect } from 'react';
import css from 'styled-jsx/css';
import { useCalcSwapAssets, useSwapBalance } from '../../../fund-management/assets-overview/hooks/use-swap-balance';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

export const AssetsBalanceBefore = memo(
  ({
    assetsBalance,
    selectedCurrency,
    enableHideBalance,
  }: {
    assetsBalance: string | number;
    selectedCurrency: string;
    enableHideBalance?: boolean;
  }) => {
    return (
      <div className='assets-before'>
        {enableHideBalance ? (
          '******'
        ) : (
          <>
            <RateText
              money={assetsBalance}
              suffix
              toCurrency={selectedCurrency}
              scale={selectedCurrency === 'USDT' ? 2 : 8}
            />
            <span className='px-1'>
              {selectedCurrency}
            </span>
          </>
        )}
      </div>
    );
  }
);
export const AssetsBalanceAfter = memo(
  ({ assetsBalance, enableHideBalance }: { assetsBalance: string | number; enableHideBalance?: boolean }) => {
    if (enableHideBalance) {
      return (
        <span className='hide-balance'>
          <RateText onlySymbol /> {'******'}
        </span>
      );
    }
    return (
      <div className='assets-after'>
        ≈
        <RateText money={assetsBalance} prefix useFormat />
      </div>
    );
  }
);

const items: any = [
  {
    label: 'BTC',
    key: '0',
  },
  {
    label: 'USDT',
    key: '1',
  },
];
export enum WalletType {
  ASSET_TOTAL = 'asset-total',
  ASSET_SPOT = 'asset-spot',
  ASSET_SWAP = 'asset-swap',
  ASSET_SWAP_U = 'asset-swap-u',
  ASSET_LITE = 'asset-lite',
}

type AssetsBalanceProps = {
  enableHideBalance?: boolean;
  type: WalletType;
  wallet: WalletKey;
  onCurrencyChange?: (currency: string) => void;
};
export const AssetsBalance = (props: AssetsBalanceProps) => {
  const swapType = getUrlQueryParams('type');
  const isSwapU = swapType === 'swap-u';
  const { enableHideBalance = false, type = WalletType.ASSET_TOTAL, wallet, onCurrencyChange } = props;
  const { spotAssetsStore } = Account.assets;
  const { spotTotalBalance } = spotAssetsStore;
  const { swapBalance, swapUBalance } = useSwapBalance(); // 不包含冻结部分，未实现盈亏不计算入内
  const swapUTotalMargin = useCalcSwapAssets({ isSwapU: true }).total.totalMargin2;
  const swapTotalMargin = useCalcSwapAssets({ isSwapU: false }).total.totalMargin2;
  const totalAssetsBalance = spotTotalBalance.add(swapTotalMargin || swapBalance).add(swapUTotalMargin || swapUBalance);
  // console.log('spotTotalBalance', spotTotalBalance, swapBalance, swapUBalance);

  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(LOCAL_KEY.ASSETS_COIN_UNIT, 'BTC');
  const handleButtonClick: MenuProps['onClick'] = (item) => {
    const value = items.find((i: any) => i?.key === item.key)?.label;
    setSelectedCurrency(value);
    onCurrencyChange?.(value);
  };

  const { total: calcTotal, wallets } = useCalcSwapAssets({ isSwapU });
  useEffect(() => {
    if (type === WalletType.ASSET_SPOT) {
      const polling = new Polling({
        interval: 4000,
        callback: () => {
          Account.assets.getAllSpotAssets(true);
        },
      });
      polling.start();
      Assets.dispatchWsListener();
      return () => {
        polling.stop();
        Assets.destroyWsListener();
      };
    }
    if (type === WalletType.ASSET_SWAP_U || type === WalletType.ASSET_TOTAL) {
      const polling = new Polling({
        interval: 4000,
        callback: () => {
          Account.assets.getAllSpotAssets(true);
          Account.assets.getPerpetualUAsset(true);
        },
      });
      polling.start();
      Assets.dispatchWsListener();
      return () => {
        polling.stop();
        Assets.destroyWsListener();
      };
    }

  }, [type]);
  const ASSETS_BALANCE_MAP: any = {
    [WalletType.ASSET_TOTAL]: totalAssetsBalance,
    [WalletType.ASSET_SPOT]: spotTotalBalance,
    [WalletType.ASSET_SWAP]: calcTotal.accb,
    // [WalletType.ASSET_SWAP_U]: calcTotal.accb,
    [WalletType.ASSET_SWAP_U]: {
      [WalletKey.SWAP_U]: wallets.find(item => item.wallet === WalletKey.SWAP_U)?.accb,
      [WalletKey.COPY]: wallets.find(item => item.wallet === WalletKey.COPY)?.accb,
    }
  };
  const assetsBalance = wallet ? ASSETS_BALANCE_MAP[type][wallet] : ASSETS_BALANCE_MAP[type];
  return (
    <div className='assets-text-wrapper'>
      <div className='assets-before-selector'>
        <AssetsBalanceBefore
          enableHideBalance={enableHideBalance}
          assetsBalance={assetsBalance}
          selectedCurrency={selectedCurrency}
        />
        <Dropdown menu={{ items, onClick: handleButtonClick }} trigger={['click']}>
          <div className='dropdown-btn'>
            <CommonIcon name='common-tiny-triangle-down' size={12} />
          </div>
        </Dropdown>
      </div>
      <AssetsBalanceAfter assetsBalance={assetsBalance} enableHideBalance={enableHideBalance} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .assets-text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    white-space: nowrap;
    gap: 8px;
    .assets-before-selector {
      display: flex;
      flex-direction: row;
      :global(.assets-before) {
        font-size: 32px;
        font-weight: 700;
        color: var(--text_1);
        line-height: 32px;
        @media ${MediaInfo.mobile} {
          font-size: 30px;
        }
      }
    }
    :global(.hide-balance) {
      color: var(--theme-font-color-6);
    }
    :global(.assets-after) {
      color: var(--text_3);
      font-size: 14px;
      font-weight: 400;
      white-space: nowrap;
      @media ${MediaInfo.mobile} {
        font-size: 14px;
      }
    }
    :global(.dropdown-btn) {
      cursor: pointer;
      background-color: transparent;
      border-radius: 5px;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
