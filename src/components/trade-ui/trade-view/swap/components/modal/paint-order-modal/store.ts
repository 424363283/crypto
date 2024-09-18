import { Swap } from '@/core/shared';
import { ORDER_TRADE_TYPE, PRICE_TYPE } from '@/core/shared/src/swap/modules/trade/constants';
import { resso } from '@/core/store';
import { formatNumber2Ceil } from '@/core/utils';

export const storeDefaultValue = {
  price: '',
  volume: '',
  triggerPrice: '',
  triggerPriceType: PRICE_TYPE.FLAG,
  orderTradeType: ORDER_TRADE_TYPE.LIMIT,
  onlyReducePosition: false,
  effectiveTime: 0,
  volumeRate: 0,
  reset(data: { price: string }) {
    store.price = data.price;
    store.volume = storeDefaultValue.volume;
    store.triggerPrice = storeDefaultValue.triggerPrice;
    store.triggerPriceType = storeDefaultValue.triggerPriceType;
    store.orderTradeType = storeDefaultValue.orderTradeType;
    store.onlyReducePosition = storeDefaultValue.onlyReducePosition;
    store.effectiveTime = storeDefaultValue.effectiveTime;
    store.volumeRate = storeDefaultValue.volumeRate;
  },
};
export const store = resso({ ...storeDefaultValue });

export const useCalc = () => {
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const { orderTradeType, price } = store;
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  let volumeUnit = Swap.Trade.getUnitText();
  const depthData = Swap.Info.store.depth;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const positionData = Swap.Order.getPosition(isUsdtType);
  const twoWayMode = Swap.Trade.twoWayMode;
  const calcPositionData = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: positionData,
    symbol: quoteId,
    twoWayMode: twoWayMode,
  });
  const { allCrossIncomeLoss } = calcPositionData.wallets[walletId] || {};
  const item = calcPositionData.wallets?.[walletId]?.data?.[quoteId];
  const calcPendingData = Swap.Calculate.pendingData(Swap.Order.getPending(isUsdtType));
  const { data: walletsPendingData } = calcPendingData.wallets[walletId] || {};
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  volumeUnit = /^[0-9]/.test(volumeUnit) ? ` ${volumeUnit}` : volumeUnit;
  const lever = Swap.Info.getLeverFindData(quoteId).leverageLevel;
  const riskDetail = Swap.Info.getRiskDetailData(quoteId, lever);

  const calcMax = (data: { isBuy: boolean }) => {
    const value = Swap.Calculate.maxVolume({
      usdt: isUsdtType,
      code: quoteId,
      isBuy: data.isBuy,
      isLimitType: Swap.Trade.formatOrderTradeType(orderTradeType).isLimit,
      inputPrice: Number(price || 0),
      flagPrice,
      sell1Price: depthData.sell1Price,
      buy1Price: depthData.buy1Price,
      buyPositionValue: Number(item?.buyPositionValue),
      buyPendingValue: Number(walletsPendingData?.[quoteId]?.buyPendingValue),
      sellPositionValue: Number(item?.sellPositionValue),
      sellPendingValue: Number(walletsPendingData?.[quoteId]?.sellPendingValue),
      maxVolume: riskDetail.maxVolume,
      balanceData: Swap.Assets.getBalanceData({ code: quoteId, walletId: Swap.Info.getWalletId(isUsdtType) }),
      crossIncome: Number(isUsdtType ? allCrossIncomeLoss : item?.crossIncomeLoss),
      lever: lever,
      twoWayMode: twoWayMode,
    });
    return value;
  };
  const calcMargin = (data: { isBuy: boolean; maxVolume: any; inputVolume: number }) => {
    // const { isUsdtType, quoteId } = this.base;
    // const flagPrice = Socket.getFlagPrice(quoteId);
    // const storeIsBuy = this.store.isBuy;
    // const isBuy = _isBuy === undefined ? storeIsBuy : _isBuy;
    // const lever = Info.getLeverFindData(quoteId).leverageLevel;
    // const depthData = Info.store.depth;
    // const riskDetail = Info.getRiskDetailData(quoteId, lever);
    // const cryptoData = Info.getCryptoData(quoteId);
    // const isLimitType = this.orderTradeType.isLimit;
    // const price = this.store.price;
    const inputVolume = data.inputVolume;
    const margin =
      inputVolume <= 0
        ? 0
        : Swap.Calculate.commissionCost({
            usdt: isUsdtType,
            code: quoteId,
            isBuy: data.isBuy,
            isLimitType: true,
            lever,
            flagPrice,
            sell1Price: depthData.sell1Price,
            buy1Price: depthData.buy1Price,
            inputPrice: Number(price || 0),
            inputVolume,
            initMargins: riskDetail.initMargins,
            maxVolume: data.maxVolume,
          });

    if (isUsdtType) {
      return formatNumber2Ceil(margin, 2);
    }

    return Swap.Utils.numberDisplayFormat(margin?.toFixed(cryptoData.basePrecision));
  };

  const getInputVolume = (data: { isBuy: boolean; maxVolume: any }) => {
    // const isExternalValue = _inputVolume !== undefined;
    // const inputPrice = Number(this.store.price || 0);
    // const inputVolume = !isExternalValue ? this.store.volume : Number(_inputVolume);
    // const inputSellVolume = this.store.volume;
    // const percentVolume = this.store.percentVolume;
    // const { isUsdtType, quoteId } = this.base;
    // const isVolUnit = Info.getIsVolUnit(isUsdtType);
    // const max = this.getMaxVolume({ isBuy });
    let volume = store.volume;
    // const isLimit = this.orderTradeType.isLimit;
    // const depthData = Info.store.depth;
    const max = data.maxVolume;
    const calculateAmountToVolume = Swap.Calculate.amountToVolume({
      usdt: isUsdtType,
      value: Number(volume || 0),
      code: quoteId,
      flagPrice,
    });

    const lever = Swap.Info.getLeverFindData(quoteId).leverageLevel;
    if (Swap.Info.getIsMarginUnit(isUsdtType)) {
      let cost = Swap.Calculate.costToVol({
        usdt: isUsdtType,
        code: quoteId,
        isBuy: data.isBuy,
        isLimit: true,
        inputPrice: Number(price || 0),
        buy1Price: depthData.buy1Price,
        sell1Price: depthData.sell1Price,
        volume: Number(volume || 0),
        lever: lever,
      });
      cost = Number(cost) > max ? max.toString() : cost;
      volume = `${cost}`.toFixed(0);
    }

    if (isUsdtType ? true : !isVolUnit) {
      // 币数转换为张数
      volume = `${calculateAmountToVolume}`;
    }

    return Number(volume) > max ? max : volume;
  };
  return { calcMax, getInputVolume, calcMargin };
};
