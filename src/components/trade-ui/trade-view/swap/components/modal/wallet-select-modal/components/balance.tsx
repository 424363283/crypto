import { Swap } from '@/core/shared';
import React from 'react';

export const Balance = React.memo(({ wallet = '' }: { wallet?: string }) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const swapPositions = Swap.Order.getPosition(isUsdtType);
  const twoWayMode = Swap.Info.getTwoWayMode(isUsdtType);
  const calcPositionData = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: Swap.Order.getPosition(isUsdtType),
    twoWayMode: twoWayMode,
  });
  const { allCrossIncomeLoss } = calcPositionData.wallets[wallet] || {};
  const calcItem = calcPositionData.wallets?.[wallet]?.data?.[quoteId];
  const balanceData = Swap.Assets.getBalanceData({ code: quoteId, walletId: wallet });
  const balance = Swap.Calculate.balance({
    usdt: isUsdtType,
    twoWayMode,
    balanceData,
    isCross: Swap.Info.getIsCrossByPositionData(quoteId, swapPositions),
    crossIncome: Number((isUsdtType ? allCrossIncomeLoss : calcItem?.crossIncomeLoss) || 0),
  });
  const { basePrecision } = Swap.Info.getCryptoData(quoteId);
  return <>{balance.toFixed(isUsdtType ? 2 : basePrecision)}</>;
});
