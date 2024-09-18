import { LANG } from '@/core/i18n';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { TradeDefaultId } from '@/core/shared';
import { MyData, Store, authKeyIsMatch } from '@/core/store/src/resso';
import { isSwapDemo, isSwapSLUsdt, isSwapUsdt } from '@/core/utils/src/is';
import { SwapTradeItem } from '../../../trade/trade-map/swap';
import { SWAP_BOUNS_WALLET_KEY } from '../assets/constants';
import { Calculate } from '../calculate';
import { PositionItemType } from '../order/field';
import { POSITION_MODE, UNIT_MODE } from './constants';

type StoreType = Store<{
  leverFindData: { [key: string]: any };
  riskDetailData: { [key: string]: any };
  riskListData: { [key: string]: any };
  positionMode: { u: string; c: string };
  priceProtection: { u: boolean; c: boolean };
  unitMode: { u: string; c: string };
  walletId: { u: string; c: string };
  cryptoDataMap: Map<string, SwapTradeItem>;
  depth: { sell1Price: number; buy1Price: number };
  agreement: { loading: boolean; allow: boolean };
  totalWallet: { u: number; c: number };
  notificationSetting: {
    addMarginWarn: number;
    fundRateVal: any;
    fundRateWarn: number;
    lpWarn: number;
    slTpWarn: number;
    warn1: number;
    warn2: number;
    warn3: number;
    warn4: number;
    warn5: number;
  };
}> &
  MyData;

type LocalStoreType = Store<{
  orderConfirm: {
    u: {
      limit: boolean;
      market: boolean;
      limitSpsl: boolean;
      marketSpsl: boolean;
      track: boolean;
      marketCloseAll: boolean;
      reverse: boolean;
    };
    c: {
      limit: boolean;
      market: boolean;
      limitSpsl: boolean;
      marketSpsl: boolean;
      track: boolean;
      marketCloseAll: boolean;
      reverse: boolean;
    };
  };
  tradePreference: {
    u: {
      lightningOrder: boolean;
      tradeNoticeSound: boolean;
    };
    c: {
      lightningOrder: boolean;
      tradeNoticeSound: boolean;
    };
  };
}> &
  MyData;

export class InfoField {
  // late
  store: StoreType = {} as StoreType;
  localStore: LocalStoreType = {} as LocalStoreType;

  POSITION_MODE = POSITION_MODE;
  UNIT_MODE = UNIT_MODE;

  leverFindErrorData: { [key: string]: any } = {};

  get usdtVolumeDigit() {
    return 2;
  }

  getTwoWayMode(usdt: boolean, { withHooks = true }: { withHooks?: boolean } = {}): boolean {
    const { c, u } = withHooks ? this.store.positionMode : this.store.getSnapshot('positionMode');
    return (usdt ? u : c) === POSITION_MODE.TWO;
  }
  getTotalWalletCount(usdt: boolean, { withHooks = true }: { withHooks?: boolean } = {}): boolean {
    const { c, u } = withHooks ? this.store.totalWallet : this.store.getSnapshot('totalWallet');
    return usdt ? u : c;
  }
  getIsBounsWallet(wallet?: string) {
    return wallet === SWAP_BOUNS_WALLET_KEY;
  }
  getWalletId(usdt: boolean, { withHooks = true }: { withHooks?: boolean } = {}): string {
    const { c, u } = withHooks ? this.store.walletId : this.store.getSnapshot('walletId');
    if (isSwapDemo()) {
      return 'W001';
    }
    return usdt ? u : c;
  }

  getDefaultQuoteId(usdt: boolean) {
    if (isSwapDemo()) {
      return usdt ? TradeDefaultId.SWAP_SL_USDT : TradeDefaultId.SWAP_SL_COIN;
    }
    return usdt ? TradeDefaultId.SWAP_USDT : TradeDefaultId.SWAP_COIN;
  }
  setWalletId(usdt: boolean, value: string) {
    this.store.walletId = { ...this.store.walletId, [usdt ? 'u' : 'c']: value };
  }

  getOrderConfirm(usdt: boolean) {
    const { c, u } = this.localStore.orderConfirm;
    return usdt ? u : c;
  }
  setOrderConfirm(usdt: boolean, data: any) {
    this.localStore.orderConfirm = { ...this.localStore.orderConfirm, [usdt ? 'u' : 'c']: { ...this.getOrderConfirm(usdt), ...data } };
  }
  getTradePreference(usdt: boolean) {
    const { c, u } = this.localStore.tradePreference;
    return usdt ? u : c;
  }
  setTradePreference(usdt: boolean, data: any) {
    this.localStore.tradePreference = { ...this.localStore.tradePreference, [usdt ? 'u' : 'c']: { ...this.getTradePreference(usdt), ...data } };
  }

  getAgreementIsAllow() {
    const result: any = localStorageApi.getItem(!isSwapDemo() ? LOCAL_KEY.SHARED_SWAP_INFO : LOCAL_KEY.SHARED_SWAP_DEMO_INFO);
    if (authKeyIsMatch(result)) {
      return result?.agreement?.allow;
    } else {
      return false;
    }
  }
  subscribeAgreementIsAllow(callback: Function) {
    const allow = this.getAgreementIsAllow();
    let unsubscribe = () => {};
    let done = false;
    const _callback = () => {
      if (done) {
        return;
      }
      callback();
      done = true;
    };
    if (allow) {
      _callback();
    } else {
      unsubscribe = this.store.subscribe('agreement', _callback);
    }

    return unsubscribe;
  }

  setAgreement(next: { loading?: boolean; allow?: boolean }) {
    this.store.agreement = { ...this.store.getSnapshot('agreement'), ...next };
  }

  getLeverFindData(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    return (withHooks ? this.store.leverFindData : this.store.getSnapshot('leverFindData'))[id] || { leverageLevel: 10, marginType: 0 };
  }
  getIsCross(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    return this.getLeverFindData(id, { withHooks }).marginType === 1;
  }
  getIsCrossByPositionData(id: string, data: PositionItemType[]) {
    const item = data.find((v) => v.symbol.toUpperCase() === id.toUpperCase());
    if (item === undefined) {
      return true;
    }
    return item?.marginType === 1;
  }

  getRiskDetailData(code: string, lever: number) {
    const id = code.toUpperCase();
    const key = `${id}_${lever}`;
    return (
      this.store.riskDetailData[key] || {
        maxVolume: 0,
        initMargins: 0,
      }
    );
  }

  getRiskListData(id: string) {
    return this.store.riskListData[id] || [];
  }

  getIsUsdtType(id: string) {
    if (isSwapDemo()) {
      return isSwapSLUsdt(id);
    }
    return isSwapUsdt(id);
  }
  getCryptoData(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    return ((withHooks ? this.store.cryptoDataMap : this.store.getSnapshot('cryptoDataMap'))?.get?.(id?.toUpperCase()) || new SwapTradeItem({})) as SwapTradeItem;
  }

  setCryptoData(data: any) {
    if (data) {
      const symbol: string = data['symbol'].toUpperCase();
      const value = new SwapTradeItem(data);
      const next = this.store.cryptoDataMap;
      next.set(symbol, value);
    }
  }

  getIsVolUnit(isUsdtType: boolean, { withHooks = true }: { withHooks?: boolean } = {}) {
    return [UNIT_MODE.VOL, UNIT_MODE.MARGIN].includes((withHooks ? this.store.unitMode : this.store.getSnapshot('unitMode'))[isUsdtType ? 'u' : 'c']);
  }
  getIsMarginUnit(isUsdtType: boolean, { withHooks = true }: { withHooks?: boolean } = {}) {
    return (withHooks ? this.store.unitMode : this.store.getSnapshot('unitMode'))[isUsdtType ? 'u' : 'c'] === UNIT_MODE.MARGIN;
  }
  getUnitMode(isUsdtType: boolean, { withHooks = true }: { withHooks?: boolean } = {}) {
    return (withHooks ? this.store.unitMode : this.store.getSnapshot('unitMode'))[isUsdtType ? 'u' : 'c'];
  }
  getPriceProtection(isUsdtType: boolean, { withHooks = true }: { withHooks?: boolean } = {}) {
    return (withHooks ? this.store.priceProtection : this.store.getSnapshot('priceProtection'))[isUsdtType ? 'u' : 'c'] === true;
  }

  getContractFactorDigit(id: string, { withHooks = true }: { withHooks?: boolean } = {}) {
    const swap = this.getCryptoData(id, { withHooks });
    const contractFactor = swap.contractFactor;
    const contractFactorDigit = contractFactor < 1 && contractFactor != 0 ? `${contractFactor}`.split('.')[1].split('').length || 0 : 0;
    return contractFactorDigit;
  }

  // 单笔最大委托数量
  getMaxEntrustNum(id: string, limit: boolean = true) {
    const usdt = this.getIsUsdtType(id);
    const { maxDelegateNum, maxMarketDelegateNum } = this.getCryptoData(id);

    return Number(Calculate.formatPositionNumber({ usdt: usdt, code: id, value: limit ? maxDelegateNum : maxMarketDelegateNum, fixed: this.getVolumeDigit(id) }));
  }

  getVolumeDigit(id: string, { withHooks = true, isVolUnit }: { withHooks?: boolean; isVolUnit?: boolean } = {}) {
    const swap = this.getCryptoData(id, { withHooks });
    const _isUsdtType = this.getIsUsdtType(id);
    let _isVolUnit = this.getIsVolUnit(_isUsdtType, { withHooks });
    _isVolUnit = isVolUnit !== undefined ? isVolUnit : _isVolUnit;
    const volumePrecision = swap.volumePrecision;
    const contractFactorDigit = this.getContractFactorDigit(id, { withHooks });
    const volumeDigit = !_isUsdtType ? (_isVolUnit ? 0 : volumePrecision) : _isVolUnit ? this.usdtVolumeDigit : contractFactorDigit;
    return Number(volumeDigit);
  }
  getUnitText({ symbol, volume = LANG('张'), isVolUnit, withHooks }: { symbol: string; volume?: string; isVolUnit?: boolean; withHooks?: boolean }) {
    symbol = symbol?.toUpperCase();
    const isUsdtType = this.getIsUsdtType(symbol);
    const _isVolUnit = isVolUnit === undefined ? this.getIsVolUnit(isUsdtType, { withHooks }) : isVolUnit;
    const { baseSymbol, settleCoin, alias } = this.getCryptoData(symbol, { withHooks });
    let code = baseSymbol;
    let result;
    const reg = !isSwapDemo() ? /usdt?$/i : /s?usdt?$/i;
    if (isUsdtType) {
      code = alias?.replace(reg, '');
      result = _isVolUnit ? settleCoin : code;
    } else {
      result = _isVolUnit ? volume : code;
    }
    return result;
  }

  getPriceUnitText = (usdt: boolean) => {
    if (isSwapDemo()) {
      return usdt ? 'SUSDT' : 'SUSD';
    }
    return usdt ? 'USDT' : 'USD';
  };
  getVolumeUnitOptions(symbol: string, { withHooks }: { withHooks?: boolean } = {}) {
    const usdt = this.getIsUsdtType(symbol);
    const { baseSymbol, alias } = this.getCryptoData(symbol, { withHooks });
    const reg = !isSwapDemo() ? /usdt?$/i : /s?usdt?$/i;
    return [usdt ? alias?.replace(reg, '') : baseSymbol, usdt ? this.getPriceUnitText(usdt) : LANG('张')];
  }
  getMarketPrice(isBuy: boolean) {
    const { sell1Price, buy1Price } = this.store.depth;
    return isBuy ? sell1Price : buy1Price;
  }
  getDepthPrice({ isBuy, id, volume }: { isBuy: boolean; id: string; volume: any }) {
    const { sell1Price, buy1Price } = this.store.depth;
    return isBuy ? sell1Price : buy1Price;
  }

  getContractName(usdt: boolean) {
    return usdt ? LANG('U本位合约') : LANG('币本位合约');
  }
  getContractList(_usdt: boolean) {
    const data: SwapTradeItem[] = [...this.store.cryptoDataMap.values()];

    return data.filter((v) => (_usdt ? v.isUsdtType : !v.isUsdtType));
  }

  getMaintenanceMargins(id: string, openPrice: any, num: any) {
    const isUsdtType = this.getIsUsdtType(id);
    const riskList = this.getRiskListData(id) ?? [];
    const maintenanceMarginsObj: any = {};
    const swapTradeList = this.getCryptoData(id);
    const maintenanceMarginsArr = riskList.map((e: any) => {
      maintenanceMarginsObj[`${e['maxVolume']}`] = e['maintenanceMargins'];
      return e['maxVolume'];
    });
    maintenanceMarginsArr.sort((a: any, b: any) => a - b);

    // vol*s/hp=价值
    var value = Number(`${num}`).mul(swapTradeList.contractFactor);
    value = isUsdtType ? value.mul(openPrice) : value.div(openPrice);
    const valueArr = maintenanceMarginsArr.filter((e: any) => {
      return Number(value) <= e;
    });
    return !!valueArr.length ? maintenanceMarginsObj[`${valueArr[0]}`] : 0;
  }
}
