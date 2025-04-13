import { useWs1060Position } from '@/core/network/src/hooks/use-ws-1060';
import { Account, Swap } from '@/core/shared';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';
import { Polling } from '@/core/utils';
import { useEffect, useState } from 'react';
import { ACCOUNT_TYPE } from './types';

type CryptoOptions = {
  sourceAccount: ACCOUNT_TYPE; // from
  targetAccount: ACCOUNT_TYPE; // to
  open: boolean;
};
type FormatCryptoOptions = {
  id: string;
  crypto: string;
  price: number;
  canWithdraw?: string;
  wallet?: string;
  walletName?: string;
  icon?: string;
};
export const useFormatCryptoOptions = ({
  sourceAccount,
  targetAccount,
}: {
  sourceAccount: ACCOUNT_TYPE;
  targetAccount: ACCOUNT_TYPE;
}) => {
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const usdtKey = 'USDT';

  const { swapAssetsStore, swapUAssetsStore, spotAssetsStore, liteAssetsStore } = Account.assets;
  const getCryptoOptions = ({ account }: { account: ACCOUNT_TYPE }): FormatCryptoOptions[] => {
    const isUsdtType = account === ACCOUNT_TYPE.SWAP_U ? true : false;
    const twoWayMode = Swap.Info.getTwoWayMode(isUsdtType, { withHooks: false });
    const swapPositions = Swap.Order.getPosition(isUsdtType);
    const swapWalletsData = isUsdtType ? swapUAssetsStore.wallets : swapAssetsStore.wallets;

    switch (account) {
      case ACCOUNT_TYPE.SPOT:
        const isUsdtKey = [ACCOUNT_TYPE.LITE, ACCOUNT_TYPE.SWAP_U].includes(
          [ACCOUNT_TYPE.SPOT].includes(sourceAccount) ? targetAccount : sourceAccount
        );
        const keys = isUsdtKey
          ? ['USDT']
          : Object.keys(swapWalletsData.find((v) => v.wallet === SWAP_DEFAULT_WALLET_ID)?.accounts || {}).map((key) =>
              key.split('-')[0]?.toUpperCase()
            );
        const spotAssetsList = spotAssetsStore.allSpotAssets;
        return spotAssetsList
          .filter(({ currency }) => keys.includes(currency))
          .map((item) => {
            return {
              id: isUsdtKey ? usdtKey : `${item.currency}-USD`,
              price: item.balance,
              crypto: isUsdtKey ? usdtKey : item.currency.replace(/usdt$/i, ''),
            };
          });
      case ACCOUNT_TYPE.SWAP:
      case ACCOUNT_TYPE.SWAP_U:
        const options: FormatCryptoOptions[] = [];

        const calcPositionData = Swap.Calculate.positionData({
          usdt: isUsdtType,
          data: Swap.Order.getPosition(isUsdtType),
          twoWayMode: twoWayMode,
        });

        swapWalletsData.forEach((data) => {
          const assetsData = data.accounts;
          return Object.keys(assetsData).map((key) => {

            const item = assetsData[key];
            const quoteId = key.toUpperCase(); 
            const walletId = data.wallet;
            const { allCrossIncomeLoss } = calcPositionData.wallets[walletId] || {};
            const calcItem = calcPositionData.wallets?.[walletId]?.data?.[quoteId];
            const price = Swap.Calculate.balance({
              isTransfer: true,
              usdt: isUsdtType,
              balanceData: Swap.Assets.getBalanceData({ code: quoteId, usdt: isUsdtType, withHooks: false, walletId }),
              isCross: isUsdtType ? true : Swap.Info.getIsCrossByPositionData(quoteId, swapPositions),
              crossIncome: Number((isUsdtType ? allCrossIncomeLoss : calcItem?.crossIncomeLoss) || 0),
              twoWayMode,
            });
            options.push({
              id: quoteId,
              price: Number(price.toFixed(4)),
              crypto: isUsdtType ? usdtKey : key.toUpperCase().replace(/-usd$/i, ''),
              canWithdraw: item.canWithdrawAmount,
              wallet: walletId,
              walletName: data['alias'],
              icon: data['pic'],
            });
          });
        });
        return options;
      case ACCOUNT_TYPE.LITE:
        if (enableLite) {
          return [
            {
              id: usdtKey,
              crypto: usdtKey,
              price: liteAssetsStore.assets?.money,
            },
          ];
        }
        return [];
    }
  };

  return { getCryptoOptions };
};
export const useCryptoOptions = (props: CryptoOptions) => {
  const [cryptoOptions, setCryptoOptions] = useState<
    { id: string; crypto: string; price: number; wallet?: string; pic?: string; remark?: string }[]
  >([]);
  const { sourceAccount, targetAccount, open } = props;

  const isUsdtType = sourceAccount === ACCOUNT_TYPE.SWAP_U ? true : false;
  const account = sourceAccount;

  const swapPositions = Swap.Order.getPosition(isUsdtType);
  const { spotAssetsStore, liteAssetsStore } = Account.assets;

  const { getCryptoOptions } = useFormatCryptoOptions({ sourceAccount, targetAccount });
  // const { allCrossIncomeLoss, data: clacData } = Swap.Calculate.positionData({
  //   usdt: isUsdtType,
  //   data: swapPositions,
  //   twoWayMode,
  // });

  useWs1060Position(
    () => {
      if (!open) return;
      Swap.Assets.fetchBalance(isUsdtType);
      Swap.Order.fetchPosition(isUsdtType);
    },
    [isUsdtType],
    { open }
  );

  const handleCryptoOptions = () => {
    const options = getCryptoOptions({ account });
    setCryptoOptions(options);
  };
  useEffect(() => {
    handleCryptoOptions();
  }, [swapPositions, open, spotAssetsStore.allSpotAssets, liteAssetsStore.assets?.money]);
  // }, [allCrossIncomeLoss, swapPositions, open, spotAssetsStore.allSpotAssets, liteAssetsStore.assets.money]);

  useEffect(() => {
    if (!open) return;
    const fetchAssetsStore = async () => {
      await Promise.all([
        // Account.assets.getPerpetualAsset(true),
        Account.assets.getPerpetualUAsset(true),
        Account.assets.getAllSpotAssets(true),
        // Account.assets.getLiteAsset(true),
      ]);
    };
    const polling = new Polling({
      interval: 2000,
      callback: fetchAssetsStore,
    });
    polling.start();
    return () => polling.stop();
  }, [sourceAccount, targetAccount, open]);

  return cryptoOptions;
};
