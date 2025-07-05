import {
  getCommonBaseInfoApi,
  getLiteConfigInfoApi,
  getLiteFeeApi,
  liteLimitOrderApi,
  liteMarketOrderApi,
  setLiteConfigInfoApi
} from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES } from '@/core/network';
import { SESSION_KEY, SessionStorageApi } from '@/core/store';
import { formatNumber2Ceil, getUUID } from '@/core/utils';
import { Account } from '../../account';
import { SpotCurrency } from '../../rate/spot-currency';
import { DetailMap } from '../../trade/market-detail';
import { LiteTradeItem, TradeMap } from '../../trade/trade-map';
import { Position } from '../position';
import { LoadingType } from '../position/types';
import { state } from './state';
import { AccountType, OrderType, PositionSide, StopType } from './types';
import { Swap } from '@/core/shared';

// 简单合约交易逻辑
export class Trade {
  public static id: string;
  public static state = state;
  // 默认设置信息，存储默认设置，用于重置
  private static defaultSettingInfo = {
    defaultStopLossRate: 0,
    defaultStopProfitRate: 0,
    closeConfirm: false,
    orderConfirm: false,
    deferPref: false
  };
  // 存储简单合约接口返回手续费
  private static fee = {} as {
    [key: string]: string;
  };
  private static _tradeMapItem = {} as LiteTradeItem;

  // 是否初始化
  private static isInitialized = false;
  // 初始化
  public static async init(id: string) {
    const formatPair = (symbolId: string): string => symbolId.replace(/^([a-z]+)(usdt)$/i, '$1-$2');
    Swap.Info.fetchContractDetail(formatPair(id));
    Trade.dispatchWsListener();
    if (Trade.id !== id) {
      Trade.id = id;
      Trade.state.id = id;
      await Trade.getTradeInfo(id);
      Trade.setMaxMargin();
      if (Trade.isInitialized) {
        // id变化，重新获取费率
        Trade.state.feex = +Trade.fee[id]?.[1] || 0;
      }
      // Account.isLogin &&
      if (!Trade.isInitialized) {
        Trade.state.isLogin = true;
        await Trade.getUSDTScale();
        await Trade.getSettingsInfo();
        await Trade.getFee();
        await Trade.initOrderType();
        await Trade.getBalance();
        await Trade.getTraderActive();
        await Trade.getDeductionRate();
        Trade.isInitialized = true;
      } else {
        Trade.destroy();
        return console.error('Please login first');
      }
    }
  }
  // 获取USDT精度
  public static getUSDTScale = async () => {
    const scale = await SpotCurrency.getScale('USDT');
    Trade.state.USDTScale = scale;
  };
  // 销毁
  public static destroy() {
    window.removeEventListener(SUBSCRIBE_TYPES.ws4001, Trade.onWs4001 as any);
    Trade.isInitialized = false;
  }
  // 发起监听4001
  private static dispatchWsListener() {
    window.removeEventListener(SUBSCRIBE_TYPES.ws4001, Trade.onWs4001 as any);
    window.addEventListener(SUBSCRIBE_TYPES.ws4001, Trade.onWs4001 as any);
  }
  // 监听的方法
  private static onWs4001(e: CustomEvent<DetailMap>) {
    const item = e.detail;
    const spread = Trade.state.spread;
    Trade.state.marketBuyPrice = item.buyPrice.add(spread).toFixed(item.digit);
    Trade.state.marketSellPrice = item.sellPrice.add(spread).toFixed(item.digit);
    Trade.state.positionCurrency = item.coin;

    if (Trade.state.orderType == OrderType.MARKET) {
      // 实时价格计算仓位
      Trade.calcPosition();
      Trade.updateStopRateGroup();
    }
    if (Trade.state.orderType == OrderType.LIMIT) {
      // 计算限价的价格范围
      Trade.calcLimitPriceRange();
    }
    Trade.calcTotalMargin(); // 计算总费用

    // console.log(logState());
  }
  // 获取交易信息
  private static async getTradeInfo(id: string) {
    const tradeMapItem = await TradeMap.getLiteById(id);
    const { identityPhotoValid } = (await Account.getUserInfo()) || {};
    // 获取用户信息 是否KYC

    if (tradeMapItem) {
      Trade._tradeMapItem = tradeMapItem;
      Trade.state.name = tradeMapItem.name;
      Trade.state.coin = tradeMapItem.coin;
      Trade.state.contract = tradeMapItem.contract;
      Trade.state.currentCommodityDigit = tradeMapItem.digit;
      Trade.state.positionPrecision = tradeMapItem.positionPrecision;
      Trade.state.isFollow = tradeMapItem.isFollow;
      Trade.state.copyMaxLeverage = tradeMapItem.copyMaxLeverage;
      Trade.state.stopLossRange = tradeMapItem.stopLossList;
      Trade.state.stopProfitRange = tradeMapItem.takeProfitList;
      Trade.state.maxAmountOne = tradeMapItem.maxAmountOne;
      // 实名认证后，使用2类型数据
      if (identityPhotoValid) {
        Trade.state.leverage = tradeMapItem.lever2List?.[2] || tradeMapItem.leverList[0];
        Trade.state.leverageRange = tradeMapItem.lever2List;
        Trade.state.marginRange = tradeMapItem.margin2List;
        Trade.state.amountRange = tradeMapItem.amount2List;
      } else {
        Trade.state.leverage = tradeMapItem.lever0List?.[2] || tradeMapItem.leverList[0];
        Trade.state.leverageRange = tradeMapItem.lever0List;
        Trade.state.marginRange = tradeMapItem.margin0List;
        Trade.state.amountRange = tradeMapItem.amount0List;
      }
      Trade.state.defer = tradeMapItem.defer;
      Trade.state.deferDays = tradeMapItem.deferDays;
      Trade.state.deferFee = tradeMapItem.deferFee;
      Trade.state.volumeDigit = tradeMapItem.volumeDigit;
    }
  }
  // 获取配置接口
  private static async getSettingsInfo() {
    const result = await getLiteConfigInfoApi();
    if (result && result.code === 200) {
      const { data } = result;
      this.defaultSettingInfo.closeConfirm = data.confirmClose;
      this.defaultSettingInfo.orderConfirm = data.confirmPlace;
      this.defaultSettingInfo.defaultStopLossRate = data.sl || -1;
      this.defaultSettingInfo.defaultStopProfitRate = data.tp || 3;
      this.defaultSettingInfo.deferPref = data.deferPref;

      Trade.state.defaultStopLossRate = data.sl || -1;
      Trade.state.defaultStopProfitRate = data.tp || 3;
      Trade.state.closeConfirm = data.confirmClose;
      Trade.state.orderConfirm = data.confirmPlace;
      // Trade.state.stopLoss = data.sl * -1 || -1;
      Trade.state.stopLoss = data.sl || -1;
      Trade.state.stopProfit = data.tp || 3;
      Trade.state.overnight = data.overnight;
      Trade.state.deferPref = data.deferPref;
      Trade.state.deferOrderChecked = data.deferPref && Trade.state.defer && Trade.state.deferFee > 0;
    } else {
      this.defaultSettingInfo.closeConfirm = false;
      this.defaultSettingInfo.orderConfirm = false;
      this.defaultSettingInfo.defaultStopLossRate = -1;
      this.defaultSettingInfo.defaultStopProfitRate = 3;
      this.defaultSettingInfo.deferPref = false;

      Trade.state.defaultStopLossRate = -1;
      Trade.state.defaultStopProfitRate = 3;
      Trade.state.closeConfirm = false;
      Trade.state.orderConfirm = false;
      Trade.state.stopLoss = -1;
      Trade.state.stopProfit = 3;
      Trade.state.overnight = false;
      Trade.state.deferPref = false;
      Trade.state.deferOrderChecked = false;
    }
  }
  // 最大下单保证金
  private static setMaxMargin() {
    const { leverageRange, leverage, amountRange } = Trade.state;
    const max = FORMULAS.LITE.maxLevelMargin(amountRange, leverageRange, leverage);
    Trade.state.marginRange = [Trade.state.marginRange[0], Trade.state.isMarginRangeLimited ? max : Number.MAX_SAFE_INTEGER];
    // console.log('maxLevelMargin max',max,'marginRange',Trade.state.marginRange)
  }
  // 获取接口手续费因子
  private static async getFee() {
    const { data, code } = await getLiteFeeApi();
    if (code === 200) {
      for (const key in data) {
        const _item = data[key];
        // Trade.fee[key] = _item.charge;

        // {
        //   "chargeUnit": -3,
        //   "chargeOriginal": -3,
        //   "chargeUnitList": [
        //       -3,
        //       0.4
        //   ],
        //   "chargeCoinList": [
        //       -3,
        //       0.4
        //   ],
        //   "coins": true,
        //   "discountType": 2,
        //   "discountVal": 1,
        //   "petSkillList": null
        // }
        Trade.fee[key] = _item.chargeCoinList?.map((num, index) => (index === 0 ? num : num / 1000)) || [];
        // 默认获取设置费率因子
        if (key == Trade.id) {
          Trade.state.feex = +Trade.fee[key]?.[1] || 0;
        }
      }
    }
  }
  // 计算手续费
  private static calcFee() {
    const { leverage, margin } = Trade.state;
    const feex = Trade.fee[Trade.id]?.[1] || 0;
    const fee = FORMULAS.LITE.fee(margin, leverage, feex);
    Trade.changeFee(fee);
  }
  // 获取账户余额
  public static async getBalance() {
    const { accountType } = Trade.state;
    try {
      // 实盘
      if (accountType == AccountType.REAL) {
        const { data } = await Account.assets.getLiteAsset(true);
        Trade.state.balance = +data.money;
        Trade.state.frozen = +data.frozen;
        Trade.state.holdings = +data.position;
        Trade.state.plan = +data.plan;
        // Trade.state.balance = 0.0321312312;
        Trade.state.deductionTotal = +data.lucky;
      }
      // 模拟盘
      if (accountType == AccountType.SIMULATED) {
        const { data } = await Account.assets.getLiteAsset(true);
        Trade.state.balance = +data.game;
      }
      // 体验金账户
      if (accountType == AccountType.TRIAL) {
        const { bonusBlance, bonusList, luckyBalance } = await Account.assets.getLiteBonus(true);
        Trade.state.balance = bonusBlance;
        Trade.state.bonusList = bonusList;
        Trade.state.deductionTotal = luckyBalance;
        if (bonusList.length > 0) {
          Trade.changeSelectCard(bonusList[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * 计算仓位
   * 1. 市价采用 做多：买一价+点差  做空：卖一价-点差
   * 2. 限价采用 输入价格
   */
  private static calcPosition() {
    const { margin, leverage, marketBuyPrice, marketSellPrice, orderType, limitPrice, positionSide, volumeDigit } = Trade.state;
    let price = 0;
    if (orderType == OrderType.MARKET) {
      if (positionSide == PositionSide.LONG) {
        price = +marketBuyPrice;
      }
      if (positionSide == PositionSide.SHORT) {
        price = +marketSellPrice;
      }
    }
    if (orderType == OrderType.LIMIT && limitPrice) {
      price = +limitPrice;
    }
    if (price > 0) {
      const position = FORMULAS.LITE.position(margin, price, leverage);
      Trade.state.position = +position.toRound(volumeDigit);
    }
  }

  private static calcTotalMargin() {
    Trade.state.totalMargin = Trade.state.margin.sub(Trade.state.deductionAmount).add(Trade.state.tradeFee);
  }
  // 根据比例计算止盈止损价格
  private static calcStopPrice() {
    const priceDigit = Trade._tradeMapItem.digit;
    let price =
      Trade.state.positionSide == PositionSide.LONG ? Trade.state.marketBuyPrice : Trade.state.marketSellPrice;
    if (Trade.state.orderType == OrderType.LIMIT) {
      price = Trade.state.limitPrice;
    }
    const Lrate = Trade.state.stopLoss;
    const Frate = Trade.state.stopProfit;
    const data = FORMULAS.LITE.tradeStopLossAndStopProfitPrice(
      Trade.state.positionSide,
      price,
      Lrate,
      Frate,
      Trade.state.leverage
    );
    Trade.state.stopProfitPrice = data.Fprice.toFixed(priceDigit);
    Trade.state.stopLossPrice = data.Lprice.toFixed(priceDigit);
  }
  // 根据比例计算盈亏保证金
  private static calcLFMargin() {
    const M = Trade.state.margin;
    const Lrate = Trade.state.stopLoss;
    const Frate = Trade.state.stopProfit;
    const { Lmargin, Fmargin } = FORMULAS.LITE.tradeExpectProfitMargin(M, +Lrate, +Frate);
    Trade.state.LMargin = Lmargin;
    Trade.state.FMargin = Fmargin;
  }
  // 计算限价 委托价格范围
  private static calcLimitPriceRange() {
    console.log('calcLimitPriceRange');
    const priceDigit = Trade._tradeMapItem.digit;
    const type = Trade.state.positionSide;
    const price = type == PositionSide.LONG ? Trade.state.marketBuyPrice : Trade.state.marketSellPrice;
    const max = Trade.state.isPriceRangeLimited ? price.mul(1 + Trade._tradeMapItem.planOpenUpper) : String(Number.MAX_SAFE_INTEGER);
    const min = Trade.state.isPriceRangeLimited ? price.mul(1 - Trade._tradeMapItem.planOpenLower) : '0';
    Trade.state.limitPriceRange = [min.toFixed(priceDigit), max.toFixed(priceDigit)];
  }

  // 计算限价 成交价格范围
  private static calcLimitPriceDealRange() {
    const limitPrice = Trade.state.limitPrice;
    const buyPrice = limitPrice.mul(1 + Trade._tradeMapItem.planSafeOffset);
    const sellPrice = limitPrice.mul(1 - Trade._tradeMapItem.planSafeOffset);
    const priceDigit = Trade._tradeMapItem.digit;
    const type = Trade.state.positionSide;

    if (type == PositionSide.LONG) {
      Trade.state.limitPriceDeal = formatNumber2Ceil(Number(buyPrice), priceDigit, true);
    }
    if (type == PositionSide.SHORT) {
      Trade.state.limitPriceDeal = formatNumber2Ceil(Number(buyPrice), priceDigit, true);
    }
  }

  // 根据止盈止损的最大最小值计算价格区间
  private static calcLFPriceRange() {
    const priceDigit = Trade._tradeMapItem.digit;
    const type = Trade.state.positionSide;
    let price = type ? Trade.state.marketBuyPrice : Trade.state.marketSellPrice;
    if (Trade.state.orderType == OrderType.LIMIT) {
      price = Trade.state.limitPrice;
    }
    const { leverage, stopLossRange, stopProfitRange } = Trade.state;
    const data = FORMULAS.LITE.tradeStopLossAndStopProfitPriceRange(
      type,
      price,
      leverage,
      stopLossRange,
      stopProfitRange
    );
    Trade.state.FPriceRange = [data.FminPrice.toFixed(priceDigit), data.FmaxPrice.toFixed(priceDigit)];
    Trade.state.LPriceRange = [data.LminPrice.toFixed(priceDigit), data.LmaxPrice.toFixed(priceDigit)];
  }
  // 根据止盈止损比例发生变化，更新函数
  private static updateStopRateGroup() {
    // 已知比例算止盈止损价格
    Trade.calcStopPrice();
    // 计算保证金盈亏
    Trade.calcLFMargin();
    // 计算止盈止损的价格范围
    Trade.calcLFPriceRange();
  }

  /**
   * 用户设置平仓确认提示配置
   */
  public static changeCloseConfirmSetting(): void {
    Trade.state.closeConfirm = !Trade.state.closeConfirm;
  }
  /**
   * 用户设置下单确认提示配置
   */
  public static changeOrderConfirmSetting(): void {
    Trade.state.orderConfirm = !Trade.state.orderConfirm;
  }
  /**
   * 用户设置下单递延偏好配置
   */
  public static changeDeferPrefSetting(value: boolean): void {
    Trade.state.deferPref = value;
  }
  /**
   * 用户设置默认止损比例配置
   * @param val 默认止损比例 传入例如0.1（10%）
   */
  public static changeDefaultStopLossSetting(val: number): void {
    // 判断val是否是数字
    if (typeof val === 'number' && !isNaN(val)) {
      // 判断val是否在止损范围内
      const s = Trade.state.stopLossRange;
      const [min, max] = [s[s.length - 1], s[0]];
      if (val >= min && val <= max) {
        Trade.state.defaultStopLossRate = val;
      } else {
        return console.error(`Default stop loss rate must be between ${min} and ${max}`);
      }
    } else {
      return console.error('Default stop loss rate must be a number');
    }
  }
  /**
   * 用户非保存关闭设置，恢复默认设置
   */
  public static resetTradeSetting(): void {
    const { defaultStopLossRate, defaultStopProfitRate, closeConfirm, orderConfirm, deferPref } =
      this.defaultSettingInfo;
    Trade.state.defaultStopLossRate = defaultStopLossRate;
    Trade.state.defaultStopProfitRate = defaultStopProfitRate;
    Trade.state.closeConfirm = closeConfirm;
    Trade.state.orderConfirm = orderConfirm;
    Trade.state.deferPref = deferPref;
  }
  /**
   * 用户设置默认止盈比例配置
   * @param val 默认止盈比例 传入例如0.1（10%）
   */
  public static changeDefaultStopProfitSetting(val: number): void {
    // 判断val是否是数字
    if (typeof val === 'number' && !isNaN(val)) {
      // 判断val是否在止盈范围内
      const s = Trade.state.stopProfitRange;
      const [min, max] = [s[0], s[s.length - 1]];
      if (val >= min && val <= max) {
        Trade.state.defaultStopProfitRate = val;
      } else {
        return console.error(`Default stop profit rate must be between ${min} and ${max}`);
      }
    } else {
      return console.error('Default stop profit rate must be a number');
    }
  }
  /**
   * 用户设置下单区递延开关
   */
  public static changeDeferOrderSetting(value: boolean): void {
    Trade.state.deferOrderChecked = value;
  }
  /**
   * 交易设置保存
   */
  public static async saveTradeSetting(): Promise<boolean> {
    try {
      const { code } = await setLiteConfigInfoApi({
        confirmClose: Trade.state.closeConfirm,
        confirmPlace: Trade.state.orderConfirm,
        sl: Trade.state.defaultStopLossRate,
        tp: Trade.state.defaultStopProfitRate,
        overnight: Trade.state.overnight,
        deferPref: Trade.state.deferPref
      });
      if (code == 200) {
        this.defaultSettingInfo.closeConfirm = Trade.state.closeConfirm;
        this.defaultSettingInfo.orderConfirm = Trade.state.orderConfirm;
        this.defaultSettingInfo.defaultStopLossRate = Trade.state.defaultStopLossRate;
        this.defaultSettingInfo.defaultStopProfitRate = Trade.state.defaultStopProfitRate;
        this.defaultSettingInfo.deferPref = Trade.state.deferPref;

        Trade.state.deferOrderChecked = Trade.state.deferPref;
        Trade.state.stopLoss = Trade.state.defaultStopLossRate;
        Trade.state.stopProfit = Trade.state.defaultStopProfitRate;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  /**
   * 用户输入委託價：
   * @param price 价格
   */
  public static changePrice1(price: number | string): void {
    if (price == '') {
      Trade.state.limitPrice = '';
      return;
    } else {
      Trade.state.limitPrice = price;
      price = Number(price);
      if (isNaN(price)) return console.error('Price must be a number');
      if (price < 0) return console.error('Price must be greater than 0');
      // 价格的区间
      const p = Trade.state.limitPriceRange;
      const [min, max] = [p[0], p[p.length - 1]];
      if (price >= +min && price <= +max) {
        // 计算仓位
        Trade.calcPosition();
        // 计算委託成交價
        Trade.calcLimitPriceDealRange();
        // 根据输入价计算止盈止损价格
        Trade.calcStopPrice();
        // 计算保证金盈亏
        Trade.calcLFMargin();
        // 计算止盈止损的价格范围
        Trade.calcLFPriceRange();
      } else {
        return console.error(`Price must be between ${min} and ${max}`);
      }
    }
  }
  /**
   * 用户输用户输入委託價失去焦点验证
   */
  public static changeBlurPrice1(): void {
    const price = Trade.state.limitPrice;
    // 价格的区间
    const p = Trade.state.limitPriceRange;
    const limitPrice = Trade.state.limitPrice;
    const [min, max] = [p[0], p[p.length - 1]];
    if (Number(price) === 0) {
      if (Trade.state.positionSide == PositionSide.LONG) {
        Trade.state.limitPrice = Trade.state.marketBuyPrice;
      }
      if (Trade.state.positionSide == PositionSide.SHORT) {
        Trade.state.limitPrice = Trade.state.marketSellPrice;
      }
      // 切换为限价，那么获取当前的最新价填充到限价输入框
      Trade.changePrice1(Trade.state.limitPrice);
    }
    if (+limitPrice < +min) {
      Trade.changePrice1(min);
      return;
    }
    if (+limitPrice > +max) {
      Trade.changePrice1(max);
    }
  }
  /**
   * 用户输入委託成交價
   */
  public static changePrice2(price: number | string): void {
    Trade.state.limitFinalPrice = price;
    // if (price == '') {
    //   Trade.state.limitFinalPrice = '';
    //   return;
    // }

    // price = Number(price);
    // if (isNaN(price)) return console.error('Price must be a number');
    // if (price < 0) return console.error('Price must be greater than 0');
  }
  /**
   * 用户输入保证金
   * @param margin 保证金
   */
  public static changeMargin(margin: number | string): void {
    if (margin == '') {
      Trade.state.margin = '';
      return;
    }
    margin = Number(margin);
    if (isNaN(margin)) return console.error('Margin must be a number');
    if (margin < 0) return console.error('Margin must be greater than 0');
    // 保证的区间
    const m = Trade.state.marginRange;
    const [min, max] = [0, m[m.length - 1]];
    if (margin >= min && margin <= max) {
      Trade.state.margin = margin;
      // // 保证金小于可用保证金
      // if (margin <= Trade.state.balance) {
      //   Trade.state.margin = margin;
      // } else {
      //   Trade.state.margin = Trade.state.balance;
      // }
      Trade.calcFee(); // 根据保证金计算手续费
      Trade.calcPosition(); // 计算仓位
      Trade.calcTotalMargin(); // 计算总费用
    } else {
      return console.error(`Margin must be between ${min} and ${max}`);
    }
  }
  /**
   * 用户输入增加保证金
   */
  public static changeAddMargin(margin: string): void {
    // 保证的区间
    // const m = Trade.state.marginRange;
    const {marginRange: m, balance, leverage, feex, USDTScale} = Trade.state;

    const [min, max] = [0, m[m.length - 1]];
    if (margin == 'All') {
      if (Trade.state.balance >= max) {
        Trade.changeMargin(max.toFixed(Trade.state.USDTScale));
      } else {
        if (Trade.state.balance >= min) {
          // All=可用/(1+杠杆*手续费率)
          Trade.changeMargin(balance.div((1).add(leverage.mul(feex))).toFixed(USDTScale));
        }
      }
    } else {
      const _margin = Number(margin);
      Trade.changeMargin(_margin.add(Trade.state.margin || 0));
    }
  }
  /**
   * 用户输入保证金 失去焦点验证
   */
  public static changeMarginBlur(): void {
    const { margin, marginRange } = Trade.state;
    const [min, max] = [marginRange[0], marginRange[marginRange.length - 1]];
    if (+margin < min) {
      Trade.changeMargin(min);
    }
    if (+margin > max) {
      Trade.changeMargin(max);
    }
  }
  /**
   * 用户输入杠杆
   * 要计算可开最大保证金
   * @param leverage 杠杆
   */
  public static changeLeverage(leverage: number | string): void {
    leverage = Number(leverage);
    if (isNaN(leverage)) return console.error('Leverage must be a number');
    if (leverage < 0) return console.error('Leverage must be greater than 0');
    // 杠杆的区间
    const l = Trade.state.leverageRange;
    const [min, max] = [l[0], l[l.length - 1]];

    if (leverage >= min && leverage <= max) {
      Trade.state.leverage = leverage;
      Trade.setMaxMargin(); // 计算可开最大保证金
      Trade.calcFee(); // 计算手续费
      Trade.calcPosition(); // 计算仓位
      Trade.updateStopRateGroup(); // 计算止盈止损相关数据
    } else {
      return console.error(`Leverage must be between ${min} and ${max}`);
    }
  }
  /**
   * 用户切换仓位方向
   * @param side 仓位方向
   */
  public static changePositionSide(side: PositionSide): void {
    if ([PositionSide.LONG, PositionSide.SHORT].includes(side as PositionSide)) {
      Trade.state.positionSide = side;
      // 切换仓位方向，计算委托成交价
      Trade.calcLimitPriceDealRange();
      // 计算止盈止损相关数据
      Trade.updateStopRateGroup();
    } else {
      return console.error('Position side error');
    }
  }
  /**
   * 用户切换订单类型
   * @param type 订单类型
   */
  public static changeOrderType(type: OrderType): void {
    if ([OrderType.MARKET, OrderType.LIMIT].includes(type as OrderType)) {
      Trade.state.orderType = type;
      SessionStorageApi.set(SESSION_KEY.LITE_ORDER_TYPE, { type });
      // 切换为限价，那么获取当前的最新价填充到限价输入框
      if (type == OrderType.LIMIT) {
        if (Trade.state.positionSide == PositionSide.LONG) {
          Trade.state.limitPrice = Trade.state.marketBuyPrice;
        }
        if (Trade.state.positionSide == PositionSide.SHORT) {
          Trade.state.limitPrice = Trade.state.marketSellPrice;
        }
        // 切换为限价，那么获取当前的最新价填充到限价输入框
        Trade.changePrice1(Trade.state.limitPrice);
      }
      Trade.calcPosition(); // 计算仓位
    } else {
      return console.error('Order type error');
    }
  }
  /**
   * 账户切换
   */
  public static changeAccount(type: AccountType): void {
    if ([AccountType.REAL, AccountType.SIMULATED, AccountType.TRIAL].includes(type as AccountType)) {
      // 1.保证金清空
      Trade.changeMargin('');
      // 2.手续费清空
      Trade.changeFee('');
      // 3.抵扣手续费清空
      Trade.state.deductionAmount = 0;

      Trade.state.accountType = type;
      Trade.getBalance(); // 刷新余额
      // 如果切换非实盘，那么不存在限价
      if (type != AccountType.REAL) {
        Trade.state.orderType = OrderType.MARKET;
      }
      // 切换账户类型，立即更新持仓列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      return console.error('Account type error');
    }
  }
  /**
   * 止盈止损价格设置 算出比例
   */
  public static changeStopPrice(price: number | string, type: StopType): void {
    price = Number(price);
    if (isNaN(price)) return console.error('Price must be a number');
    if (price < 0) return console.error('Price must be greater than 0');
    //应该是委托价
    let lastPrice =
      Trade.state.positionSide == PositionSide.LONG ? Trade.state.marketBuyPrice : Trade.state.marketSellPrice;
    //这里增加了限价委托价计算
    if (Trade.state.orderType == OrderType.LIMIT) {
      lastPrice = Trade.state.limitPrice;
    }
    const { Frate, Lrate } = FORMULAS.LITE.tradeStopLossAndStopProfitRate(
      Trade.state.positionSide,
      price,
      lastPrice,
      Trade.state.leverage
    );
    if (type == StopType.STOP_LOSS) {
      // 止损为正数才是合理区间
      if (+Lrate >= 0) {
        Trade.changeStopRate(+('-' + Lrate).toFixed(2), StopType.STOP_LOSS);
      }
    }
    if (type == StopType.STOP_PROFIT) {
      Trade.changeStopRate(+Frate.toFixed(2), StopType.STOP_PROFIT);
    }
  }

  /**
   * 止盈止损比例
   */
  public static changeStopRate(rate: number, type: StopType): void {
    if (type == StopType.STOP_LOSS) {
      const L = Trade.state.stopLossRange;
      const [min, max] = [L[L.length - 1], L[0]];
      if (rate >= min && rate <= max) {
        Trade.state.stopLoss = rate;
        Trade.updateStopRateGroup();
        return;
      }
      if (rate < min) {
        Trade.state.stopLoss = min;
        Trade.updateStopRateGroup();
        return;
      }
      if (rate > max) {
        Trade.state.stopLoss = max;
        Trade.updateStopRateGroup();
        return;
      }
    }
    if (type == StopType.STOP_PROFIT) {
      const F = Trade.state.stopProfitRange;
      const [min, max] = [F[0], F[F.length - 1]];
      if (rate >= min && rate <= max) {
        Trade.state.stopProfit = rate;
        Trade.updateStopRateGroup();
        return;
      }
      if (rate < min) {
        Trade.state.stopProfit = min;
        Trade.updateStopRateGroup();
        return;
      }
      if (rate > max) {
        Trade.state.stopProfit = max;
        Trade.updateStopRateGroup();
        return;
      }
    }
  }

  /**
   * 用户选择体验金的卡券
   */
  public static changeSelectCard(bonusId: string) {
    const { bonusList, feex, leverage } = Trade.state;
    const bonus = bonusList.find(item => item.id === bonusId);
    if (!bonus) return;
    Trade.state.bonusId = bonusId;
    const { lever, amount } = bonus;
    Trade.state.selectedBonusLever = lever;
    if (lever > 0) {
      // 1.设置杠杆
      Trade.changeLeverage(lever);
    }

    // 2.设置保证金，计算保证金和手续费
    const { margin, fee } = FORMULAS.LITE.tradeExperienceFormula(amount, leverage, feex);

    Trade.changeMargin(margin);
    Trade.changeFee(fee);
  }

  /**
   * 手续费
   */
  public static changeFee(fee: string) {
    if (fee == '') {
      Trade.state.tradeFee = 0;
      return;
    }

    // 如果是体验金，那么费率在返推保证金,保证0误差
    if (Trade.state.accountType === AccountType.TRIAL) {
      const { bonusList, bonusId, feex, leverage } = Trade.state;
      // 获取当前卡券保证金面额
      if (bonusId) {
        const { amount } = bonusList.find(item => item.id === bonusId);
        if (amount) {
          const { margin, fee } = FORMULAS.LITE.tradeExperienceFormula(amount, leverage, feex);
          Trade.state.margin = margin;
          Trade.state.tradeFee = fee;
        }
      }
    } else {
      Trade.state.tradeFee = fee;
    }

    // 非模拟盘，手续费通过抵扣金抵扣
    if (Trade.state.accountType !== AccountType.SIMULATED) {
      if (+Trade.state.tradeFee > 0 && Trade.state.deductionTotal > 0) {
        // 根据后台配置的手续费可以抵扣比例计算可抵扣金额
        const min = Math.min(+Trade.state.deductionTotal, +Trade.state.tradeFee.mul(Trade.state.liteLuckyRate));
        Trade.state.deductionAmount = min;
      }
    }
  }

  /**
   * 用户下单
   * @param price
   */
  public static async openOrder(): Promise<{ code: number; message: string }> {
    const buy = Trade.state.positionSide === PositionSide.LONG;
    const identity = getUUID(16);
    const commodity = Trade.state.id;
    const contract = Trade.state.contract;
    const platform = 'pc';
    const lever = Trade.state.leverage;
    const margin = Trade.state.margin;
    const standard = AccountType.SIMULATED === Trade.state.accountType ? false : true;
    const volume = Trade.state.position;
    const stopLoss = Trade.state.stopLoss;
    const takeProfit = Trade.state.stopProfit;
    const bonusId = Trade.state.bonusId;
    const defer = Trade.state.defer && Trade.state.deferOrderChecked;
    if (!Account.isLogin) {
      return {
        code: 500,
        message: LANG('请先登录')
      };
    }
    if (!margin) {
      return {
        code: 500,
        message: LANG('请输入保证金')
      };
    }
    // 市价下单
    if (OrderType.MARKET === Trade.state.orderType) {
      const config: any = {
        identity,
        platform,
        commodity,
        buy,
        margin,
        lever,
        stopLoss,
        takeProfit,
        standard,
        volume,
        contract,
        defer,
      };
      // 体验账户，那么携带卡券id
      if (Trade.state.accountType == AccountType.TRIAL) {
        config['bonusId'] = bonusId;
      }
      try {
        const result = await liteMarketOrderApi(config);
        if (result.code == 200) {
          // 下单成功,刷新余额
          Trade.getBalance();
          // 下单成功，更新持仓列表数据
          Position.fetchPositionList(LoadingType.Show);
        }
        return result;
      } catch (e: any) {
        return {
          code: 500,
          message: e.message
        };
      }
    }
    // 限价计划委托挂单
    if (OrderType.LIMIT === Trade.state.orderType) {
      const { limitFinalPrice, limitPriceDeal } = Trade.state;
      // 如果用户没有输入委托成交价，则不做大小判断
      if (!!limitFinalPrice) {
        if (buy) {
          if (+limitFinalPrice < +limitPriceDeal) {
            return {
              code: 500,
              message: LANG('成交价格必须大于等于 {price}', { price: limitPriceDeal })
            };
          }
        } else {
          if (limitFinalPrice > limitPriceDeal) {
            return {
              code: 500,
              message: LANG('成交价格必须小于等于 {price}', { price: limitPriceDeal })
            };
          }
        }
      }
      const config = {
        identity,
        platform,
        commodity,
        contract,
        volume,
        buy,
        margin,
        lever,
        stopLoss,
        takeProfit,
        shared: standard,
        safetyPrice: Number(limitFinalPrice), // 用户没有输入委托成交价的话，按 0 处理
        triggerPrice: Trade.state.limitPrice,
        triggerType: buy ? 1 : 2,
        defer,
      };
      try {
        const result = await liteLimitOrderApi(config);
        if (result.code == 200) {
          // 下单成功,刷新余额
          Trade.getBalance();
          // 下单成功，更新持仓列表数据
          Position.fetchPendingList(LoadingType.Show);
        }
        return result;
      } catch (e: any) {
        return {
          code: 500,
          message: e.message
        };
      }
    }

    return { code: 0, message: '' };
  }

  /**
   * 设置用户是否未开启带单交易的状态
   */
  public static async getTraderActive() {
    const userInfo = await Account.getUserInfo();

    userInfo && (Trade.state.traderActive = userInfo.traderActive);
  }

  /**
   * 从 SessionStorage 中初始化 orderType
   */
  public static async initOrderType() {
    const orderType: { type: OrderType } | null = SessionStorageApi.get(SESSION_KEY.LITE_ORDER_TYPE);
    Trade.state.orderType = orderType?.type || OrderType.MARKET;
    // 初始化如果是限价，设置默认价格
    if (Trade.state.orderType == OrderType.LIMIT) {
      // Trade.changeOrderType(OrderType.LIMIT);
    }
  }

  /**
   * 设置浮动盈亏
   */
  public static setFloatingProfit = (val: number) => {
    Trade.state.floatingProfit = val;
  };

  /**
   * 设置占用保证金
   */
  public static setOccupiedMargin = (val: number) => {
    Trade.state.occupiedMargin = val;
  };

  /**
   * 获取简单合约后台设置的可用抵扣金比例
   */
  public static getDeductionRate = async () => {
    const result = await getCommonBaseInfoApi();
    if (result.code === 200) {
      Trade.state.liteLuckyRate = result.data.liteLuckyRate;
    }
  };
}
