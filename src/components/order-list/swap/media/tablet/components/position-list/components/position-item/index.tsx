import { store } from '@/components/order-list/swap/stores/position-list';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Markets, Swap } from '@/core/shared';
import { formatNumber2Ceil } from '@/core/utils';
import { useEffect, useState } from 'react';
import { ItemActions } from './components/item-actions';
import { ItemHeader } from './components/item-header';
import { ItemInfo } from './components/item-info';
import { ItemLrInfo } from './components/item-lrinfo';
import { ItemSpsl } from './components/item-spsl';
import { ItemStatistics } from './components/item-statistics';

const useMarketPrice = (code?: string) => {
  const { isUsdtType } = Swap.Trade.base;
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const list = isUsdtType ? Markets.markets.getSwapUsdtList() : Markets.markets.getSwapCoinList();
    setPrice(list.find((v: any) => v.id === code?.toUpperCase())?.price || 0);
  }, [isUsdtType, code]);

  useWs(
    SUBSCRIBE_TYPES.ws3001,
    data => {
      const list = isUsdtType ? data.getSwapUsdtList() : data.getSwapCoinList();
      setPrice(list.find((v: any) => v.id === code?.toUpperCase())?.price || 0);
    },
    [isUsdtType, code]
  );

  return price;
};

export const PositionItem = ({
  data: item,
  onShare,
  onSpsl,
  onClose,
  onCloseAll,
  onTrack,
  onChangeMargin,
  onReverse,
  onWalletClick,
  assetsPage
}: {
  data: any;
  onShare: (item: any) => any;
  onSpsl: (item: any) => any;
  onClose: (item: any) => any;
  onCloseAll: (item: any) => any;
  onTrack: (item: any) => any;
  onReverse: (item: any) => any;
  onChangeMargin: (item: any) => any;
  onWalletClick?: (walletData?: any) => any;
  assetsPage?: boolean;
}) => {
  const { isUsdtType, priceUnitText } = Swap.Trade.base;
  const { incomeType } = store;
  const name = Swap.Info.getCryptoData(item.symbol).name;
  const code = item.symbol;
  const fixed = Number(item.baseShowPrecision);
  const flagPrice = Swap.Socket.getFlagPrice(item.symbol)?.toFormat(fixed);
  const liquidationPrice = item.liquidationPrice?.toFormat(fixed);
  const leverage = item?.leverage;
  const unit = Swap.Info.getUnitText({
    symbol: item.symbol
  });
  const buy = item?.side === '1';
  const volume = item?.currentPositionFormat;
  const margin = isUsdtType
    ? formatNumber2Ceil(item.margin, 2).toFixed(2)
    : Number(item.margin).toFixed(Number(item.basePrecision));
  const marginRate = `${(item.positionMarginRate * 100).toFixed(2)}%`;
  const scale = isUsdtType ? 2 : Number(item.basePrecision);
  const marketPrice = useMarketPrice(item.symbol);
  const baseShowPrecision = Number(item.baseShowPrecision);
  let stopProfit = '';
  let stopLoss = '';
  const wallet = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: Swap.Info.getIsUsdtType(item.symbol) });

  item.orders.forEach((o: any) => {
    if (o.strategyType === '1') stopProfit = Number(o.triggerPrice).toFixed(baseShowPrecision);
    if (o.strategyType === '2') stopLoss = Number(o.triggerPrice).toFixed(baseShowPrecision);
  });
  const income = Swap.Calculate.income({
    usdt: isUsdtType,
    code: code,
    isBuy: item.side === '1',
    avgCostPrice: item.avgCostPrice,
    volume: item.currentPosition,
    flagPrice: incomeType === 0 ? undefined : marketPrice
  });

  // 未实现利率计算
  const incomeRate = Swap.Calculate.positionROE({
    usdt: isUsdtType,
    data: item,
    income: income
  });
  const onLever = () => {
    if (!assetsPage) {
      Swap.Trade.setModal({
        leverVisible: true,
        leverData: { lever: leverage, symbol: code.toUpperCase(), wallet: item.subWallet }
      });
    }
  };

  return (
    <>
      <div className="position-item">
        <ItemHeader
          code={name}
          symbol={item.symbol}
          onShare={() => onShare(item)}
          info={
            <ItemInfo
              buy={buy}
              lever={leverage}
              marginType={item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}
              onLeverClick={onLever}
              assetsPage={assetsPage}
            />
          }
          right={<ItemLrInfo income={income} incomeRate={incomeRate} scale={scale} />}
        />

        <ItemStatistics
          marginType={item.marginType}
          volume={volume}
          margin={margin}
          marginRate={marginRate}
          closePrice={liquidationPrice}
          openPrice={formatNumber2Ceil(item.avgCostPrice, Number(item.baseShowPrecision), buy).toFormat(
            Number(item.baseShowPrecision)
          )}
          flagPrice={flagPrice}
          priceUnit={priceUnitText}
          unit={unit}
          onChangeMargin={() => onChangeMargin(item)}
          wallet={wallet}
          callbackValue={item.callbackValue}
          onTrack={() => onTrack(item)}
          onWalletClick={onWalletClick}
        />
        <ItemSpsl sp={stopProfit} sl={stopLoss} onClick={() => onSpsl(item)} />
        <ItemActions
          buy={buy}
          onReverse={() => onReverse(item)}
          onClose={() => onClose(item)}
          onCloseAll={() => onCloseAll(item)}
          onSpsl={() => onSpsl(item)}
          onTrack={() => onTrack(item)}
        />
      </div>
      <style jsx>{`
        .position-item {
        }
      `}</style>
    </>
  );
};
