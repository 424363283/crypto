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
            {selectedCurrency}
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
  onCurrencyChange?: (currency: string) => void;
};
export const AssetsBalance = (props: AssetsBalanceProps) => {
  const swapType = getUrlQueryParams('type');
  const isSwapU = swapType === 'swap-u';
  const { enableHideBalance = false, type = WalletType.ASSET_TOTAL, onCurrencyChange } = props;
  const { spotAssetsStore } = Account.assets;
  const { spotTotalBalance } = spotAssetsStore;
  const { swapBalance, swapUBalance } = useSwapBalance(); // 不包含冻结部分，未实现盈亏不计算入内
  const totalAssetsBalance = spotTotalBalance.add(swapBalance).add(swapUBalance);
  // console.log('spotTotalBalance', spotTotalBalance, swapBalance, swapUBalance);

  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(LOCAL_KEY.ASSETS_COIN_UNIT, 'BTC');
  const handleButtonClick: MenuProps['onClick'] = (item) => {
    const value = items.find((i: any) => i?.key === item.key)?.label;
    setSelectedCurrency(value);
    onCurrencyChange?.(value);
  };

  const { total: calcTotal } = useCalcSwapAssets({ isSwapU });
  useEffect(() => {
    if (type === WalletType.ASSET_SPOT || type === WalletType.ASSET_TOTAL) {
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
  }, [type]);
  const ASSETS_BALANCE_MAP: any = {
    [WalletType.ASSET_TOTAL]: totalAssetsBalance,
    [WalletType.ASSET_SPOT]: spotTotalBalance,
    [WalletType.ASSET_SWAP]: calcTotal.accb,
    [WalletType.ASSET_SWAP_U]: calcTotal.accb,
  };
  return (
    <div className='assets-text-wrapper'>
      <AssetsBalanceBefore
        enableHideBalance={enableHideBalance}
        assetsBalance={ASSETS_BALANCE_MAP[type]}
        selectedCurrency={selectedCurrency}
      />
      <Dropdown menu={{ items, onClick: handleButtonClick }} trigger={['click']}>
        <div className='dropdown-btn'>
          <CommonIcon name='common-arrow-down-0' size={12} />
        </div>
      </Dropdown>
      <AssetsBalanceAfter assetsBalance={ASSETS_BALANCE_MAP[type]} enableHideBalance={enableHideBalance} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .assets-text-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    white-space: nowrap;
    :global(.assets-before) {
      font-size: 20px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      background-image: linear-gradient(
        to right,
        transparent 50%,
        var(--theme-font-color-6) 0%,
        var(--theme-font-color-6) 50%
      );
      background-size: 8px 1px;
      background-position: bottom; /* 将虚线显示在下方 */
      background-repeat: repeat-x;
    }
    :global(.hide-balance) {
      color: var(--theme-font-color-6);
    }
    :global(.assets-after) {
      color: var(--theme-font-color-3);
      font-size: 18px;
      font-weight: 500;
      white-space: nowrap;
      @media ${MediaInfo.mobile} {
        font-size: 16px;
        position: absolute;
        top: 34px;
      }
    }
    :global(.dropdown-btn) {
      cursor: pointer;
      background-color: var(--theme-background-color-14);
      padding: 6px 7px;
      border-radius: 5px;
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
