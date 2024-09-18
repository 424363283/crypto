import { LANG } from '@/core/i18n';
import { Store } from '@/core/store/src/resso';
import { formatNumber2Ceil } from '@/core/utils';
import { assetsInstance as Assets } from '../assets';
import { Calculate } from '../calculate';
import { infoInstance as Info } from '../info';
import { orderInstance as Order } from '../order';
import { socketInstance as Socket } from '../socket';
import { Utils } from '../utils';
import { ORDER_TRADE_TYPE, POSITION_MODE, PRICE_TYPE } from './constants';

export const DEFAULT_SPSL_VALUE = {
  enable: false, // 是否开启
  editEnable: false, // 下单止盈止损编辑模式
  stopProfitEnable: true, // 下单止盈开启
  stopLossEnable: true, // 下单止损开启
  stopProfitPrice: '', // 下单止盈价格
  stopLossPrice: '', // 下单止损价格
  stopProfitPriceType: PRICE_TYPE.FLAG, // 止盈价格类型
  stopLossPriceType: PRICE_TYPE.FLAG, // 止损价格类型
  isBuy: true, //是否开多
};

type StoreType = Store<{
  isBuy: boolean;
  quoteId: string;
  usdtTypeByNotId?: boolean;
  positionMode: string;
  orderTradeType: string;

  // 开仓价格
  price: string;
  // 开仓数量
  volume: string;
  // 开仓数量百分比
  percentVolume: number;
  // 触发价格
  triggerPrice: string;
  // 触发价格类型
  triggerPriceType: string;
  // 只减仓
  onlyReducePosition: boolean;
  // 弹窗
  modal: {
    marginTypeVisible: boolean;
    leverVisible: boolean;
    effectiveTimeVisible: boolean;
    leverData: any;
    calculatorVisible: boolean;
    calculatorData: any;
    spslVisible: boolean;
    orderConfirmVisible: boolean;
    orderConfirmData: any;
    ruleVisible: boolean;
    transferVisible: boolean;
    transferData: any;
    walletSelectVisible: boolean;
    walletSelectData: any;
    preferenceMenuVisible: boolean;
    walletFormVisible: boolean;
    walletFormData: any;
    rechargeVisible: boolean;
    welcomeDemoVisible: boolean;
    selectUnitVisible: boolean;
    paintOrderVisible: boolean;
    paintOrderData: any;
    paintOrderOptionsVisible: boolean;
    paintOrderOptionsData: any;
  };
  spslMode: {
    enable: boolean; // 是否开启
    editEnable: boolean; // 下单止盈止损编辑模式
    stopProfitEnable: boolean; // 下单止盈开启
    stopLossEnable: boolean; // 下单止损开启
    stopProfitPrice: string; // 下单止盈价格
    stopLossPrice: string; // 下单止损价格
    stopProfitPriceType: string; // 止盈价格类型 0 标记 1最新
    stopLossPriceType: string; // 止损价格类型 0 标记 1最新
    isBuy: boolean; //是否开多
  };
  // 下单时间类型
  effectiveTime: number;
}>;

export class TradeField {
  // late
  store: StoreType = {} as StoreType;

  POSITION_MODE = POSITION_MODE;
  ORDER_TRADE_TYPE = ORDER_TRADE_TYPE;
  PRICE_TYPE = PRICE_TYPE;

  get orderTradeType() {
    return this.formatOrderTradeType(this.store.orderTradeType);
  }

  get base() {
    let quoteId = this.store.quoteId;
    let isUsdtType = Info.getIsUsdtType(quoteId);

    let usdtTypeByNotId = this.store.usdtTypeByNotId;

    if (usdtTypeByNotId !== undefined) {
      quoteId = '';
      isUsdtType = usdtTypeByNotId;
    }
    const priceUnitText = Info.getPriceUnitText(isUsdtType);
    return { quoteId, quoteName: Info.getCryptoData(quoteId).name, isUsdtType, isCoinType: isUsdtType === false, priceUnitText };
  }
  get buyMaxVolume() {
    return this.getMaxVolume({ isBuy: true });
  }
  get sellMaxVolume() {
    return this.getMaxVolume({ isBuy: false });
  }
  get maxVolume() {
    const maxVolume = Math.max(this.buyMaxVolume, this.sellMaxVolume);
    return maxVolume;
  }
  get buyMaxVolumeNumber() {
    return this.formatPositionNumber(this.buyMaxVolume, Info.getVolumeDigit(this.base.quoteId));
  }
  get sellMaxVolumeNumber() {
    return this.formatPositionNumber(this.sellMaxVolume, Info.getVolumeDigit(this.base.quoteId));
  }
  get maxVolumeNumber() {
    return this.formatPositionNumber(this.maxVolume, Info.getVolumeDigit(this.base.quoteId));
  }

  get twoWayMode() {
    return Info.getTwoWayMode(this.base.isUsdtType);
  }

  get isOpenPositionMode() {
    return this.store.positionMode === POSITION_MODE.OPEN;
  }
  get buyCommissionCost() {
    return Utils.numberDisplayFormat(this.getCommissionCost({ isBuy: true }));
  }
  get sellCommissionCost() {
    return Utils.numberDisplayFormat(this.getCommissionCost({ isBuy: false }));
  }

  setPositionMode(v: string) {
    this.store.positionMode = v;
  }

  setUsdtTypeByNotId(value: boolean) {
    this.store.usdtTypeByNotId = value;
  }

  getMaxVolume({ isBuy: _isBuy, onlyOpenPosition }: { isBuy: boolean; onlyOpenPosition?: boolean }) {
    const { isUsdtType, quoteId } = this.base;
    const flagPrice = Socket.getFlagPrice(quoteId);
    const isOpenPosition = this.isOpenPositionMode;
    const { buyPosition, sellPosition } = Order.getTwoWayPosition({ usdt: isUsdtType, openPosition: isOpenPosition, code: quoteId });
    const twoWayMode = this.twoWayMode;
    const storeIsBuy = this.store.isBuy;
    const isBuy = _isBuy === undefined ? storeIsBuy : _isBuy;
    const depthData = Info.store.depth;
    const lever = Info.getLeverFindData(quoteId).leverageLevel;
    const riskDetail = Info.getRiskDetailData(quoteId, lever);
    const positionData = Order.getPosition(isUsdtType);
    const walletId = Info.getWalletId(isUsdtType);
    const calcPositionData = Calculate.positionData({ usdt: isUsdtType, data: positionData, symbol: quoteId, twoWayMode: twoWayMode });
    const { buyPositionValue, sellPositionValue, allCrossIncomeLoss } = calcPositionData.wallets[walletId] || {};
    const item = calcPositionData.wallets?.[walletId]?.data?.[quoteId];
    const calcPendingData = Calculate.pendingData(Order.getPending(isUsdtType));
    const onlyReducePosition = this.store.onlyReducePosition;
    const { data: walletsPendingData, buyPendingValue, sellPendingValue } = calcPendingData.wallets[walletId] || {};

    const calculateMaxVolume = Calculate.maxVolume({
      usdt: isUsdtType,
      code: quoteId,
      isBuy,
      isLimitType: this.orderTradeType.isLimit,
      inputPrice: Number(this.store.price || 0),
      flagPrice,
      sell1Price: depthData.sell1Price,
      buy1Price: depthData.buy1Price,
      buyPositionValue: Number(item?.buyPositionValue),
      buyPendingValue: Number(walletsPendingData?.[quoteId]?.buyPendingValue),
      sellPositionValue: Number(item?.sellPositionValue),
      sellPendingValue: Number(walletsPendingData?.[quoteId]?.sellPendingValue),
      maxVolume: riskDetail.maxVolume,
      balanceData: Assets.getBalanceData({ code: quoteId, walletId: Info.getWalletId(isUsdtType) }),
      crossIncome: Number(isUsdtType ? allCrossIncomeLoss : item?.crossIncomeLoss),
      lever: lever,
      twoWayMode: twoWayMode,
    });

    if (onlyOpenPosition) {
      return calculateMaxVolume;
    }
    let vol = 0;

    // APP勾选了 只减仓 之后，这个最大可开的计算，就不用根据公式算了，而是根据持仓数量来算
    // 1）开仓方向与持仓相同，最大可开固定0
    // 2）开仓方向与持仓方向相反，最大可开=持仓总量

    if (!twoWayMode && onlyReducePosition) {
      const item = positionData.find((v: any) => {
        if (v.symbol.toUpperCase() === quoteId) {
          return v;
        }
      });

      if (item != null) {
        const itemBuy = item?.['side'] === '1';

        return itemBuy == isBuy ? 0 : Number(item?.currentPosition || 0);
      }
    } else if (!isOpenPosition) {
      if (isBuy) {
        vol = Number(buyPosition?.availPosition || 0);
      } else {
        vol = Number(sellPosition?.availPosition || 0);
      }
    } else {
      vol = calculateMaxVolume;
    }

    return vol;
  }

  getCommissionCost({ isBuy: _isBuy, positionMode, fixed }: { isBuy?: boolean; positionMode?: boolean; fixed?: any } = {}) {
    const { isUsdtType, quoteId } = this.base;
    const flagPrice = Socket.getFlagPrice(quoteId);
    const storeIsBuy = this.store.isBuy;
    const inputPrice = this.store.price;
    const isBuy = _isBuy === undefined ? storeIsBuy : _isBuy;
    const lever = Info.getLeverFindData(quoteId).leverageLevel;
    const depthData = Info.store.depth;
    const maxVolume = this.getMaxVolume({ isBuy });
    const riskDetail = Info.getRiskDetailData(quoteId, lever);
    const cryptoData = Info.getCryptoData(quoteId);
    const isMarketType = !this.orderTradeType.limit;
    const marketPrice = Info.getMarketPrice(isBuy);
    const orderPrice = Number(isMarketType ? marketPrice : inputPrice);
    const inputVolume = this.getInputVolume({ isBuy, flagPrice: orderPrice });
    const isLimitType = this.orderTradeType.isLimit;
    const price = this.store.price;

    const margin =
      inputVolume <= 0
        ? 0
        : Calculate.commissionCost({
            usdt: isUsdtType,
            code: quoteId,
            isBuy,
            isLimitType: isLimitType,
            lever,
            flagPrice,
            sell1Price: depthData.sell1Price,
            buy1Price: depthData.buy1Price,
            inputPrice: Number(price || 0),
            inputVolume,
            initMargins: riskDetail.initMargins,
            maxVolume,
            positionMode: positionMode,
          });

    if (fixed) {
      return margin?.toFixed(Number(fixed));
    }

    if (isUsdtType) {
      return formatNumber2Ceil(margin, 2);
    }

    return margin?.toFixed(cryptoData.basePrecision);
  }

  getBaseSymbol(symbol: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    return Info.getUnitText({
      symbol,
      volume: LANG('张'),
      isVolUnit: false,
      withHooks,
    });
  }
  // 只减仓修改
  onChangeOnlyReducePosition = (value: boolean) => {
    this.store.onlyReducePosition = value;
    if (this.store.onlyReducePosition && this.store.spslMode.enable) {
      this.resetSpslSetting();
    }
  };

  onResetTradeForm() {
    this.clearInputVolume();
    this.resetSpslSetting();
    this.store.triggerPrice = '';
    this.onChangeOnlyReducePosition(false);
  }

  getInputVolume = ({ isBuy, flagPrice, inputVolume: _inputVolume }: { isBuy: boolean; flagPrice?: number; inputVolume?: any }) => {
    const isExternalValue = _inputVolume !== undefined;
    const inputPrice = Number(this.store.price || 0);
    const inputVolume = !isExternalValue ? this.store.volume : Number(_inputVolume);
    const inputSellVolume = this.store.volume;
    const percentVolume = 0;
    // const percentVolume = this.store.percentVolume;
    const { isUsdtType, quoteId } = this.base;
    const isVolUnit = Info.getIsVolUnit(isUsdtType);
    const max = this.getMaxVolume({ isBuy });
    let volume = Number((isBuy ? inputVolume : inputSellVolume) || 0);
    const isLimit = this.orderTradeType.isLimit;
    const depthData = Info.store.depth;
    const calculateAmountToVolume = Calculate.amountToVolume({
      usdt: isUsdtType,
      value: volume,
      code: quoteId,
      flagPrice,
    });

    const lever = Info.getLeverFindData(quoteId).leverageLevel;
    if (Info.getIsMarginUnit(isUsdtType)) {
      let cost = Calculate.costToVol({
        usdt: isUsdtType,
        code: quoteId,
        isBuy,
        isLimit,
        inputPrice,
        buy1Price: depthData.buy1Price,
        sell1Price: depthData.sell1Price,
        volume,
        lever: lever,
      });
      // cost = Number(cost) > max ? max.toString() : cost;
      return Number(`${cost}`.toFixed(0));
    }

    if (!percentVolume || isExternalValue) {
      if (isUsdtType ? true : !isVolUnit) {
        // 币数转换为张数
        volume = calculateAmountToVolume;
      }
      return volume;
    } else {
      return parseInt(max.mul(percentVolume / 100));
    }
  };

  getPriceTypeIsFlag(type: string) {
    return type === PRICE_TYPE.FLAG;
  }

  setModal(next: { selectUnitVisible?: boolean; welcomeDemoVisible?: boolean; rechargeVisible?: boolean; marginTypeVisible?: boolean; walletFormVisible?: boolean; walletFormData?: any; leverVisible?: boolean; leverData?: any; effectiveTimeVisible?: boolean; calculatorVisible?: boolean; calculatorData?: any; spslVisible?: boolean; orderConfirmVisible?: boolean; orderConfirmData?: any; ruleVisible?: boolean; transferVisible?: boolean; transferData?: any; walletSelectVisible?: boolean; walletSelectData?: any; preferenceMenuVisible?: boolean; paintOrderVisible?: boolean; paintOrderData?: any; paintOrderOptionsVisible?: boolean; paintOrderOptionsData?: any }) {
    this.store.modal = { ...this.store.modal, ...next };
  }

  setTransferModalVisible(params: { wallet?: string; isUsdtType?: boolean } = {}) {
    this.setModal({ transferVisible: true, transferData: params });
  }

  onPriceChange(price: any) {
    this.store.price = `${price || ''}`;
  }
  onVolumeChange(volume?: any) {
    this.store.volume = `${volume || ''}`;
    this.store.percentVolume = 0;
  }
  onPercentVolumeChange(percent: any) {
    const buyMaxVolume = this.getMaxVolume({ isBuy: true });
    const sellMaxVolume = this.getMaxVolume({ isBuy: false });
    const maxVolume = Math.max(buyMaxVolume, sellMaxVolume);
    const inputVolume = this.formatPositionNumber(maxVolume * (percent / 100), Info.getVolumeDigit(this.store.quoteId));
    this.store.volume = `${inputVolume || ''}`.toFixed();
    this.store.percentVolume = Number(percent);
  }

  onTriggerPriceChange(price: any) {
    this.store.triggerPrice = `${price || ''}`;
  }
  onTriggerPriceTypeChange(triggerPriceType: string) {
    const triggerPrice = this.store.triggerPrice;
    const cryptoData = Info.getCryptoData(this.base.quoteId);

    if (!this.getPriceTypeIsFlag(triggerPriceType) && Number(triggerPrice) > 0) {
      this.onTriggerPriceChange(Utils.minChangeFormat(cryptoData.minChangePrice, triggerPrice));
    }

    this.store.triggerPriceType = triggerPriceType;
  }

  resetSpslSetting() {
    this.store.spslMode = { ...DEFAULT_SPSL_VALUE };
  }
  getUnitText = () => {
    return Info.getUnitText({
      symbol: this.base.quoteId,
      volume: LANG('张'),
    });
  };

  // 获取当前货币单位的值
  formatPositionNumber = (num: number, fixed?: number, flagPrice?: number) => {
    const { isUsdtType, quoteId } = this.base;
    const { baseShowPrecision } = Info.getCryptoData(quoteId);
    return Calculate.formatPositionNumber({
      usdt: isUsdtType,
      value: num,
      code: quoteId,
      fixed: fixed || baseShowPrecision,
      flagPrice,
    });
  };

  // 最小下单数量
  getMinOrderVolume = ({ isBuy, code, costMode }: { isBuy: boolean; code: string; costMode?: boolean }) => {
    const inputPrice = Number(this.store.price || 0);
    const isMarketType = !this.orderTradeType.limit;
    const marketPrice = Info.getMarketPrice(isBuy);
    const cryptoData = Info.getCryptoData(code);
    const orderPrice = (isMarketType ? marketPrice : inputPrice) || 0;
    const usdt = Info.getIsUsdtType(code);
    const lever = Info.getLeverFindData(code).leverageLevel;
    const riskDetail = Info.getRiskDetailData(code, lever);
    const volumeDigit = Info.getVolumeDigit(code);
    let minOrderVol = '0';
    if (Info.getIsMarginUnit(usdt) && costMode) {
      // 保证金
      minOrderVol = `${Calculate.commissionCost({
        usdt: usdt,
        code,
        inputVolume: isMarketType ? cryptoData.minMarketDelegateNum : cryptoData.minDelegateNum,
        initMargins: riskDetail.initMargins,
        isBuy,
        isLimitType: true,
        lever,
        // flagPrice: Number(openPrice),
        inputPrice,
        maxVolume: cryptoData.minDelegateNum,
        // positionMode: true,
      })}`;
    } else {
      minOrderVol = this.formatPositionNumber(isMarketType ? cryptoData.minMarketDelegateNum : cryptoData.minDelegateNum, volumeDigit, orderPrice);
    }
    return formatNumber2Ceil(minOrderVol, volumeDigit, true);
  };

  clearInputVolume() {
    this.onVolumeChange();
  }
  getOrderPrice(_isBuy?: boolean) {
    const storeIsBuy = this.store.isBuy;
    const storePrice = this.store.price;
    const marketPrice = Info.getMarketPrice(_isBuy !== undefined ? _isBuy : storeIsBuy);
    return Number((!this.orderTradeType.isLimit ? marketPrice : storePrice) || 0);
  }
  formatOrderTradeType(orderTradeType: string) {
    return {
      limit: orderTradeType === ORDER_TRADE_TYPE.LIMIT,
      limitSpsl: orderTradeType === ORDER_TRADE_TYPE.LIMIT_SPSL,
      market: orderTradeType === ORDER_TRADE_TYPE.MARKET,
      marketSpsl: orderTradeType === ORDER_TRADE_TYPE.MARKET_SPSL,
      isLimit: [ORDER_TRADE_TYPE.LIMIT, ORDER_TRADE_TYPE.LIMIT_SPSL].includes(orderTradeType),
      isMarket: [ORDER_TRADE_TYPE.MARKET, ORDER_TRADE_TYPE.MARKET_SPSL].includes(orderTradeType),
      isSpsl: [ORDER_TRADE_TYPE.LIMIT_SPSL, ORDER_TRADE_TYPE.MARKET_SPSL].includes(orderTradeType),
    };
  }
}
