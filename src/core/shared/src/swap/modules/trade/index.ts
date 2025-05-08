import { Account, Swap } from '@/core/shared';
import { ORDER_TRADE_TYPE, POSITION_MODE, PRICE_TYPE } from './constants';
import { DEFAULT_SPSL_VALUE, TradeField } from './field';

import { Loading } from '@/components/loading';
import { postSwapAddOtocoApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message, playAudio } from '@/core/utils';
import { assetsInstance as Assets } from '../assets';
import { SWAP_BOUNS_WALLET_KEY } from '../assets/constants';
import { Calculate } from '../calculate';
import { infoInstance as Info } from '../info';
import { SWAP_DEFAULT_WALLET_ID } from '../info/constants';
import { orderInstance as Order } from '../order';
import { Utils } from '../utils';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { UsingAccountType } from '@/core/shared/src/copy/types';
export class Trade extends TradeField {
  init({ resso }: any) {
    this.store = resso({
      quoteId: '',
      usdtTypeByNotId: undefined,
      positionMode: POSITION_MODE.OPEN,
      price: '',
      volume: '',
      triggerPrice: '',
      triggerPriceType: PRICE_TYPE.FLAG,
      orderTradeType: ORDER_TRADE_TYPE.LIMIT,
      percentVolume: 0,
      modal: {
        marginTypeVisible: false,
        leverVisible: false,
        leverData: {},
        calculatorVisible: false,
        calculatorData: {},
        spslVisible: false,
        orderConfirmVisible: false,
        orderConfirmData: {},
        ruleVisible: false,
        transferVisible: false,
        transferData: {},
        effectiveTimeVisible: false,
        preferenceMenuVisible: false,
        walletSelectVisible: false,
        walletFormVisible: false,
        walletFormData: {},
        rechargeVisible: false,
        welcomeDemoVisible: false,
        selectUnitVisible: false
      },
      onlyReducePosition: false,
      effectiveTime: 0,
      spslMode: {
        ...DEFAULT_SPSL_VALUE
        // enable: false, // 是否开启
        // editEnable: false, // 下单止盈止损编辑模式
        // stopProfitEnable: true, // 下单止盈开启
        // stopLossEnable: true, // 下单止损开启
        // stopProfitPrice: '', // 下单止盈价格
        // stopLossPrice: '', // 下单止损价格
        // stopProfitPriceType: 0, // 止盈价格类型 0 标记 1最新
        // stopLossPriceType: 0, // 止损价格类型 0 标记 1最新
        // isBuy: true, //是否开多
      }
    });
  }

  // 初始化币对信息
  async initQuote(id?: string) {
    // default id
    const quoteId = (id || this.store.quoteId).toUpperCase();

    if (!quoteId) return;
    this.store.quoteId = quoteId;

    // console.log('swap-log Account.isLogin',Account.isLogin,Info.getAgreementIsAllow())

    if (Account.isLogin && Info.getAgreementIsAllow()) {
      const { isUsdtType } = Swap.Trade.base;
      const walletId = Swap.Info.getWalletId(isUsdtType);
      const cryptoData = Swap.Info.getCryptoData(quoteId);
      if (cryptoData?.id) {
        if (walletId === SWAP_BOUNS_WALLET_KEY && !cryptoData.supportBouns) {
          Swap.Info.setWalletId(isUsdtType, SWAP_DEFAULT_WALLET_ID);
        }
      }

      Swap.Trade.clearInputVolume();
      Swap.Trade.resetSpslSetting();
      // 同步持仓和委托杠杆
      Swap.Info.syncLeverageFind(isUsdtType, quoteId);
      // 获取单位和仓位方向
      Swap.Info.fetchLeverageFind(isUsdtType, quoteId);
      Swap.Info.fetchRiskList(quoteId);
      Swap.Info.fetchContractDetail(quoteId);
    }
  }

  // 只下单止盈止损修改
  onChangeSpslSetting = (next: any) => {
    const prev = this.store.spslMode;
    const onlyReducePosition = this.store.onlyReducePosition;
    if (next.enable && onlyReducePosition === true) {
      this.onChangeOnlyReducePosition(false);
    }
    this.store.spslMode = { ...prev, ...next };
  };

  // 修改子钱包id
  async onChangeWallet({ wallet }: { wallet: string }) {
    const { isUsdtType } = this.base;
    this.onResetTradeForm();
    this.setPositionMode(POSITION_MODE.OPEN);
    Swap.Info.setWalletId(isUsdtType, wallet);
    await Swap.Info.fetchPositionType(isUsdtType);
    Swap.Trade.initQuote();
  }

  // 同意协议后
  onAgreementDone() {
    const { quoteId, isUsdtType } = this.base;
    setTimeout(() => Swap.Assets.fetchBalance(isUsdtType, false), 1000);
    this.initQuote(quoteId);
  }

  // 下单
  onPlaceAnOrder({
    buy: _isBuy,
    confirmModal = true,
    volume,
    onOrderConfirm,
    inputVolume: _inputVolume,
    direct = false
  }: {
    buy?: boolean;
    confirmModal?: boolean;
    volume?: any;
    onOrderConfirm?: any;
    inputVolume?: any;
    direct?: boolean;
  }) {
    const { isUsdtType, quoteId } = this.base;
    const walletId = Info.getWalletId(isUsdtType);
    const { isCopyTrader} = Info.store
    const { limit: limitOrderConfirm, market: marketOrderConfirm } = Swap.Info.getOrderConfirm(isUsdtType);
    const {
      price: inputPrice,
      effectiveTime,
      spslMode,
      onlyReducePosition,
      triggerPrice,
      triggerPriceType,
      modal,
    } = this.store;

    const { leverageLevelBuy, leverageLevelSell, marginType } = Info.getLeverFindData(quoteId);
    const newMarginMode = Info._newMarginMode;
    const twoWayMode = this.twoWayMode;
    const isOpenPosition = this.isOpenPositionMode;
    const { priceOrderPrecision } = Info.getCryptoData(quoteId);
    const price = inputPrice.toFixed(priceOrderPrecision);
    const isBuy = _isBuy === undefined ? this.store.isBuy : _isBuy;
    let { isLimit, isSpsl: isSpslType } = this.orderTradeType;
    // 快捷下单 只有市价
    if (isLimit && direct) {
      isLimit = false;
    }
    const isMarketType = !isLimit;
    const orderPrice = Number(isMarketType ? Info.getMarketPrice(isBuy) : inputPrice);
    const { buyPosition, sellPosition } = Order.getTwoWayPosition({
      usdt: isUsdtType,
      openPosition: false,
      code: quoteId,
      marginType
    });
    const position = isBuy ? buyPosition : sellPosition;
    const { buyPending, sellPending } = Order.getTwoWayPending({
      usdt: isUsdtType,
      code: quoteId,
      marginType
    });
    const pending = isBuy ? buyPending : sellPending;
    const volumeDigit = Info.getVolumeDigit(quoteId);
    let value: number | string = '';

    if (direct && _inputVolume) {
      const isVolUnit = Info.getIsVolUnit(isUsdtType);
      value = (isUsdtType ? true : !isVolUnit)
        ? Calculate.amountToVolume({
            usdt: isUsdtType,
            value: _inputVolume,
            code: quoteId,
            flagPrice: Info.getMarketPrice(isBuy)
          })
        : value;
    } else {
      value = this.getInputVolume({ isBuy, flagPrice: orderPrice, inputVolume: _inputVolume });
    }
    const maxVolume = this.getMaxVolume({ isBuy, direct });

    const orderConfirm = Swap.Info.getOrderConfirm(isUsdtType);
    const shouldOrderConfirm = {
      [ORDER_TRADE_TYPE.LIMIT]: orderConfirm.limit,
      [ORDER_TRADE_TYPE.LIMIT_SPSL]: orderConfirm.limitSpsl,
      [ORDER_TRADE_TYPE.MARKET]: orderConfirm.market,
      [ORDER_TRADE_TYPE.MARKET_SPSL]: orderConfirm.marketSpsl
    }[direct ? 'market' : this.store.orderTradeType];
    if (isSpslType && !direct) {
      /// 止盈止损触发价为空
      if (!(Number(triggerPrice) > 0)) {
        return message.error(LANG('请输入触发价格'), 1);
      }
    }

    /* 最大可开0判断*/
    if (maxVolume == 0) {
      // 只减仓判断
      if (!twoWayMode && onlyReducePosition) {
        return message.error(
          LANG(
            '平仓委托失败，请检查持仓与挂单。如果您当前合约有挂单，请取消该合约的挂单，并再次尝试平仓。如果您当前合约无持仓，请取消该合约只减仓设置，并再次尝试下单。'
          ),
          1
        );
      }

      if (Info.leverFindErrorData[quoteId]?.code && Info.leverFindErrorData[quoteId].message) {
        return message.error(Info.leverFindErrorData[quoteId].message, 1);
      }
      if (!isOpenPosition && !direct) {
        if (isBuy) {
          return message.error(LANG('无多仓，无法平仓。'), 1);
        } else {
          return message.error(LANG('无空仓，无法平仓。'), 1);
        }
      } else {
        return message.error(LANG('当前最大可开数量为0，委托失败'), 1);
      }
    }

    /// 止盈止损价格区间判断
    if (
      !direct &&
      spslMode.enable &&
      this.spslPriceValidate({
        isBuy,
        stopProfitPrice: spslMode.stopProfitPrice,
        stopLossPrice: spslMode.stopLossPrice,
        marketPrice: this.getOrderPrice(isBuy),
        price: Number(this.store.price),
        isLimit
      }) != true
    ) {
      // return;
      return message.error(LANG('您设置的止盈止损价格不合理，止盈止损订单将立即被触发，请重新设置。'), 1);
    }

    if (!isOpenPosition && !position && !direct) {
      return message.error(LANG('当前没有仓位'), 1);
    }
    // 下单数量最少判断
    if (!value) {
      const minOrderVolume = this.getMinOrderVolume({ isBuy, code: quoteId, costMode: true, direct });
      return message.error(
        LANG('下单数量最少为{volume}', {
          volume: `${minOrderVolume} ${this.getUnitText()}`
        }),
        1
      );
    }
    // if (isOpenPosition && value > Number(Swap.Trade.maxVolumeNumber)) {
    //   return message.error(`${LANG('当前杠杆下最大可开为')} ${Swap.Trade.maxVolumeNumber.toFormat(volumeDigit)} ${Swap.Info.getUnitText({ symbol: quoteId })}`, 1);
    // }
    if (twoWayMode && !isOpenPosition && !direct) {
      const closeValue = this.getInputVolume({ isBuy, inputVolume: _inputVolume });
      if (closeValue > Number(position?.availPosition || 0)) {
        return message.error(
          LANG('最多可平{volume}', {
            volume: `${this.formatPositionNumber(
              Number(position?.availPosition || 0),
              volumeDigit,
              Number(position?.avgCostPrice)
            )} ${this.getUnitText()}`
          }),
          1
        );
      }
    }
    // 弹窗确认逻辑
    if (shouldOrderConfirm && confirmModal && !modal.orderConfirmVisible) {
      this.setModal({
        orderConfirmVisible: true,
        orderConfirmData: { isBuy, onConfirm: onOrderConfirm },
        direct,
        inputVolume: _inputVolume
      });
      return;
    } else {
      this.setModal({ orderConfirmVisible: false, orderConfirmData: {} });
    }

    const planOrders = [];
    const closePosition = twoWayMode && !isOpenPosition;
    const params: any = {
      symbol: quoteId.toLocaleLowerCase(),
      orderQty: value,
      future: isMarketType ? undefined : effectiveTime,
      price: isMarketType ? undefined : price,
      side: isBuy ? 1 : 2,
      type: isMarketType ? '2' : '1',
      source: Utils.getSource()
    };
    if (twoWayMode) {
      if (isOpenPosition) {
        params.isAssociatedOrder = true;
        if (pending?.isAssociatedOrder && pending?.linkedOrderId) {
          params.linkedOrderId = pending?.linkedOrderId;
        }
      }
      params.positionId = position?.positionId;
    }
    if (closePosition && !direct) {
      params['type'] = isLimit ? 4 : 5;
      params.side = isBuy ? 2 : 1;
    }
    if (spslMode.enable) {
      params.opType = 2;
      if (Number(spslMode.stopProfitPrice) > 0) {
        planOrders.push(
          Utils.getSpslParams(true, {
            symbol: quoteId,
            buy: isBuy,
            volume: params.orderQty,
            triggerPrice: Number(spslMode.stopProfitPrice),
            priceType: spslMode.stopProfitPriceType,
            price: spslMode.stopLossLimitPriceType ? spslMode.stopProfitLimitPrice : '' // 市价则传空 限价传stopProfitLimitPrice
          })
        );
      }
      if (Number(spslMode.stopLossPrice) > 0) {
        planOrders.push(
          Utils.getSpslParams(false, {
            symbol: quoteId,
            buy: isBuy,
            volume: params.orderQty,
            triggerPrice: Number(spslMode.stopLossPrice),
            priceType: spslMode.stopLossPriceType,
            price: spslMode.stopProfitLimitPriceType ? spslMode.stopLossLimitPrice : '' // 市价则传空 限价传stopProfitLimitPrice
          })
        );
      }
    }
    if (isSpslType) {
      params.opType = 3;
      if (Number(triggerPrice) > 0) {
        params['triggerPrice'] = triggerPrice;
        params['priceType'] = triggerPriceType === PRICE_TYPE.FLAG ? 2 : 1; // 1:市场价格，2:标记价格
      }
    }

    if (planOrders.length > 0) {
      params.planOrders = planOrders;
    }
    // 平仓模式 默认 传 1
    if ((onlyReducePosition || closePosition) && !direct) {
      params.reduceOnly = 1;
    }
    /**
     * One-Way Mode
     * 下单参数增加OrdFlag, 1=reduceonly只减仓;2=postonly被动;3=iceberg冰山
     */
    if (onlyReducePosition) {
      params.ordFlag = 1;
    }
    /**
     *  双向持仓开新仓位时传递保证金类型
     */
    if (newMarginMode && twoWayMode) {
      params.marginType = marginType;
      params.leverage = isBuy ? leverageLevelBuy : leverageLevelSell;
    }
    const onDone = (data: any) => {
      if (data && data.code === 200) {
        this.onResetTradeForm();

        const { tradeNoticeSound } = Swap.Info.getTradePreference(Swap.Trade.base.isUsdtType);
        message.success(LANG('下单成功'), 1);
        tradeNoticeSound && playAudio('/static/music/swap_order_sound.mp3');
      } else {
        message.error(data.message, 1);
      }
      Assets.fetchBalance(isUsdtType);
      Loading.end();
    };
    const onFail = function (error: any) {
      message.error(error?.error?.message, 1);
      Loading.end();
    };
    params.usingAccountType = walletId  === WalletKey.COPY ? (isCopyTrader ? UsingAccountType.trader : UsingAccountType.follower ): UsingAccountType.ordinary,
    Loading.start();
    return postSwapAddOtocoApi(isUsdtType, params).then(onDone).catch(onFail);
  }

  /// 闪电下单
  onLightningOrder({ isBuy, value }: { isBuy: boolean; value?: any }) {
    const { isUsdtType, quoteId } = this.base;

    const isVolUnit = Info.getIsVolUnit(isUsdtType);
    const orderQty = (isUsdtType ? true : !isVolUnit)
      ? Calculate.amountToVolume({
          usdt: isUsdtType,
          value: value,
          code: quoteId,
          flagPrice: Info.getMarketPrice(isBuy)
        })
      : value;

    if (!orderQty) {
      return message.error(
        LANG('下单数量最少为{volume}', {
          volume: `${this.getMinOrderVolume({ isBuy, code: quoteId })} ${this.getUnitText()}`
        }),
        1
      );
    }

    Loading.start();
    const onDone = (data: any) => {
      if (data && data.code === 200) {
      } else {
        message.error(data.message, 1);
      }
      Assets.fetchBalance(isUsdtType);
      Loading.end();
    };
    const onFail = function (error: any) {
      message.error(error?.error?.message, 1);
      Loading.end();
    };

    return postSwapAddOtocoApi(isUsdtType, {
      orderQty: orderQty,
      side: isBuy ? 1 : 2,
      source: Utils.getSource(),
      symbol: quoteId.toLocaleLowerCase(),
      type: '2'
    })
      .then(onDone)
      .catch(onFail);
  }

  ///  止盈止损下单
  async submitSpslOrder(data: any) {
    const { isUsdtType, quoteId } = this.base;
    data['source'] = Utils.getSource();
    return await postSwapAddOtocoApi(isUsdtType, data);
  }

  getCalculateIncome(others: any = {}) {
    const { isUsdtType, quoteId } = this.base;
    others = {
      isBuy: this.store.isBuy,
      ...others
    };
    const orderPrice = this.getOrderPrice();

    const volume = this.getInputVolume({
      isBuy: others.isBuy,
      flagPrice: orderPrice
    });
    return Calculate.income({
      usdt: isUsdtType,
      code: quoteId,
      avgCostPrice: orderPrice,
      volume,
      ...others
    });
  }

  // 止盈止损价格区间判断
  spslPriceValidate({
    isBuy,
    stopProfitPrice,
    stopLossPrice,
    marketPrice,
    price,
    isLimit
  }: {
    isLimit: boolean;
    isBuy: boolean;
    stopProfitPrice: any;
    stopLossPrice: any;
    marketPrice: number;
    price: number;
  }) {
    // 【限价委托&做多】
    // 止盈价格>委托价格
    // 止损价格<委托价格
    // 【限价委托&做空】
    // 止盈价格<委托价格
    // 止损价格>委托价格

    // 【市委委托&做多】
    // 止盈价格>卖一价格
    // 止损价格<卖一价格
    // 【市委委托&做空】
    // 止盈价格<买一价格
    // 止损价格>买一价格
    const _price = Number(isLimit ? price : marketPrice); // 委托价格 : 买卖一价格
    const spText = `${stopProfitPrice}`;
    const slText = `${stopLossPrice}`;
    const sp = Number(spText) || 0;
    const sl = Number(slText) || 0;

    // const flagPrice = this._getFlagPrice();
    // const newPrice = this._getCurrentPrice();

    // let spFP = flagPrice;
    // let slFP = flagPrice;

    // if (isSpslType) {
    //   spFP = spslMode.stopProfitPriceType == 0 ? flagPrice : newPrice;
    //   slFP = spslMode.stopLossPriceType == 0 ? flagPrice : newPrice;
    // }
    if (stopProfitPrice) {
      if (isBuy) {
        // 止盈价格>委托价格
        // 止盈价格>卖一价格
        if (!(sp > _price)) {
          return false;
        }
      } else {
        if (isLimit) {
          // 止盈价格<委托价格
          if (!(sp < _price)) {
            return false;
          }
        } else {
          // 止盈价格<买一价格
          if (!(sp < _price)) {
            return false;
          }
        }
      }
    }
    if (stopLossPrice) {
      if (isBuy) {
        // 止损价格<委托价格
        // 止损价格<卖一价格
        if (!(sl < _price)) {
          return false;
        }
      } else {
        if (isLimit) {
          // 止损价格>委托价格
          if (!(sl > _price)) {
            return false;
          }
        } else {
          // 止损价格>买一价格
          if (!(sl > _price)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  syncLeverageFind = () => {
    const { quoteId, isUsdtType } = this.base;
    Swap.Info.syncLeverageFind(isUsdtType, quoteId);
  };
}

export const tradeInstance = new Trade();
