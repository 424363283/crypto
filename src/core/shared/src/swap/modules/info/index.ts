import { getSwapAgreementApi, getSwapContractDetailApi, getSwapGetAgreementApi, getSwapGetLeverageFindApi, getSwapGetRiskDetailApi, getSwapNotificationSettingApi, postSwapPriceProtectApi, postSwapUpdateLeverApi, postSwapUpdateUnitApi, swapGetContractRiskListApi, swapGetPositionTypeApi, swapSetNotificationSettingApi, swapUpdateMarginTypeApi, swapUpdatePositionTypeApi} from '@/core/api';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';
import { LOCAL_KEY } from '@/core/store';
import { Debounce, cachePromise, dispatchGeolocation } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { Account } from '../../../account';
import { TradeMap } from '../../../trade/trade-map';
import { POSITION_MODE, UNIT_MODE } from './constants';
import { InfoField } from './field';
import { SideType } from '../../../spot';
import { result } from 'lodash';
import { orderInstance as Order } from '../order';
import { MARGIN_TYPE } from '../trade/constants';
import { R } from '@/core/network';
export class Info extends InfoField {
  _fetchContractDetailDebounce = new Debounce(() => { }, 200);
  _newMarginMode = process.env.NEXT_PUBLIC_NEW_MARGIN_MODE === 'true';//新保证金模式

  init({ resso }: any) {
    this.store = resso(
      {
        /**
         *  账号币对杠杆信息
         *  marginType: 0
         *  leverageLevel: 10, 
         *  leverageLevelBuy: 20, 
         *  leverageLevelSell: 50 
         */
        leverFindData: {},
        // 账号币对风险信息
        riskDetailData: {},
        // 账号币对风险列表
        riskListData: {},
        // 下单单位
        unitMode: { c: UNIT_MODE.COIN, u: UNIT_MODE.COIN },
        // 持仓模式
        positionMode: { c: POSITION_MODE.ONE, u: POSITION_MODE.ONE },
        // 价差保护
        priceProtection: { c: false, u: false },
        // 钱包id
        walletId: { c: SWAP_DEFAULT_WALLET_ID, u: SWAP_DEFAULT_WALLET_ID },
        // 可创建钱包数量
        totalWallet: { c: 0, u: 0 },

        cryptoDataMap: new Map(),

        depth: { sell1Price: 0, buy1Price: 0 },
        agreement: { loading: true, allow: false },
        notificationSetting: {
          addMarginWarn: 0,
          fundRateVal: '0',
          fundRateWarn: 0,
          lpWarn: 0,
          slTpWarn: 0,
          warn1: 0,
          warn2: 0,
          warn3: 0,
          warn4: 0,
          warn5: 0,
        },
        isCopyTrader: false
      },
      { auth: true, nameSpace: !isSwapDemo() ? LOCAL_KEY.SHARED_SWAP_INFO : LOCAL_KEY.SHARED_SWAP_DEMO_INFO, whileList: ['leverFindData', 'riskDetailData', 'riskListData', 'unitMode', 'positionMode', 'agreement', 'priceProtection', 'walletId'] }
    );

    this.localStore = resso(
      {
        // 下单确认弹窗
        orderConfirm: {
          c: {
            limit: true, // 限价
            market: true, // 市价
            limitSpsl: true, // 限价止盈止损
            marketSpsl: true, // 市价止盈止损
            track: true, // 追踪止损
            marketCloseAll: true, // 市价平仓
            reverse: true, // 反向开仓
          },
          u: {
            limit: true,
            market: true,
            limitSpsl: true,
            marketSpsl: true,
            track: true,
            marketCloseAll: true,
            reverse: true,
          },
        },
        // 偏好设置
        tradePreference: {
          c: {
            lightningOrder: true,
            tradeNoticeSound: false,
          },
          u: {
            lightningOrder: true,
            tradeNoticeSound: false,
          },
        },
      },
      { nameSpace: !isSwapDemo() ? LOCAL_KEY.SHARED_SWAP_INFO_LOCAL : LOCAL_KEY.SHARED_SWAP_DEMO_INFO_LOCAL }
    );
    this.store.initCache();
    this.localStore.initCache();
  }

  fetchTradeMap() {
    TradeMap.getSwapTradeMap().then((data) => {
      if (data) {
        this.store.cryptoDataMap = data;
      }
    });
  }

  async fetchAgreement({ focus = false } = {}) {
    if (!Account.isLogin) return;
    this.setAgreement({ loading: true });
    const func = async () => getSwapGetAgreementApi();

    try {
      if (this.getAgreementIsAllow()) {
        return this.setAgreement({ allow: true });
      }
      const result = await (focus ? func() : cachePromise(func, { key: 'Http.swapAgreement' }));
      if (result.data) {
        this.setAgreement({ allow: true });
      }
    } catch (e) {
    } finally {
      this.setAgreement({ loading: false });
    }
  }
  async agreementConfirm() {
    this.setAgreement({ loading: true });
    try {
      const result: any = await getSwapAgreementApi();
      if (result.code === 200) {
        dispatchGeolocation?.();
        this.setAgreement({ allow: true });
      }
      return result;
    } catch (e) {
    } finally {
      this.setAgreement({ loading: false });
    }
  }

  async fetchContractDetail(id?: string) {
    if (id) {
      this._fetchContractDetailDebounce.run(async () => {
        const reuslt = await getSwapContractDetailApi(id);
        if (reuslt['code'] == 200) {
          this.setCryptoData(reuslt['data']);
        }
      });
    }
  }

  async fetchLeverageFind(usdt: boolean, code: string) {
    const id = code.toUpperCase();
    try {
      const result = await getSwapGetLeverageFindApi(usdt, { code: id });
      if (result['code'] == 200) {
        let lever = result['data']?.leverageLevel;
        let leverageItem = { ...result['data'] };
        if (this._newMarginMode && this.getTwoWayMode(usdt)) {
          const { marginType, leverageLevelBuy, leverageLevelSell, marginLeverage } = this.store.leverFindData[id];
          leverageItem = { ...leverageItem, ...this.store.leverFindData[id] };
          leverageItem.leverageLevelBuy = marginLeverage?.[leverageItem.marginType]?.leverageLevelBuy || leverageLevelBuy || lever;
          leverageItem.leverageLevelSell = marginLeverage?.[leverageItem.marginType]?.leverageLevelSell || leverageLevelSell || lever;
        }
        this.store.leverFindData = { ...this.store.leverFindData, [id]: leverageItem };
        this.leverFindErrorData[id] = null;
        // 获取杠杆对应风险信息
        if (this._newMarginMode && this.getTwoWayMode(usdt)) {
          // this.fetchRiskDetail(id, [leverageItem.leverageLevelBuy, leverageItem.leverageLevelSell]);
          this.fetchRiskDetail(id, leverageItem.leverageLevel);

        } else {
          this.fetchRiskDetail(id, leverageItem.leverageLevel);
        }
      } else {
        this.leverFindErrorData[id] = result;
      }
    } catch (e) {
      console.error('fetchLeverageFind', e);
    }
  }

  /// 获取风险详情
  async fetchRiskDetail(code: string, lever: string | string[]) {
    const id = code.toUpperCase();
    const levers = Array.isArray(lever) ? lever : [lever];
    try {
      const results: R<Record<string, string | number>>[] = [];
      for(let leverage of levers) {
        const res = await getSwapGetRiskDetailApi(id, leverage);
        results.push(res);
      }
      const riskDetailData = { ...this.store.riskDetailData };
      const regex = /(.*)(_\d+)$/;
      //清楚交易对杠杆修改之前的数据
      for (let name in riskDetailData) {
        const match = name.match(regex);
        if (match && match[1] === id) {
          delete riskDetailData[name];
        }
      }
      const dataList = levers.reduce((total, leverage, index) => {
        const key = `${id}_${leverage}`;
        const res = results[index];
        return {
          ...total,
          ...(res?.code === 200 ? { [key]: res.data } : {})
        };
      }, {});
      this.store.riskDetailData = { ...riskDetailData, ...this.store.leverFindData, ...dataList };

    } catch (e) {
      console.error('fetchRiskDetail', e);
    }
  }


  /// 获取风险详情
  // async fetchRiskDetail(code: string, lever: any) {
  //   const id = code.toUpperCase();
  //   const key = `${id}_${lever}`;
  //
  //   try {
  //     const result = await getSwapGetRiskDetailApi(id, lever);
  //     if (result['code'] == 200) {
  //       const riskDetailData = { ...this.store.riskDetailData };
  //       const isUsdtType = this.getIsUsdtType(id);
  //       if (!this._newMarginMode || !this.getTwoWayMode(isUsdtType)) {
  //         const regex = /(.*)(_\d+)$/;
  //         for (let name in riskDetailData) {
  //           const match = name.match(regex);
  //           if (match && match[1] === id) {
  //             delete riskDetailData[name];
  //           }
  //         }
  //       }
  //       this.store.riskDetailData = { ...riskDetailData, ...this.store.leverFindData, [key]: result['data'] };
  //     }
  //   } catch (e) {
  //     console.error('fetchRiskDetail', e);
  //   }
  // }

  /// 获取风险详情
  // async fetchRiskDetail(code: string, lever: any) {
  //   const id = code.toUpperCase();
  //   const key = `${id}_${lever}`;
  //
  //   try {
  //     const result = await getSwapGetRiskDetailApi(id, lever);
  //     if (result['code'] == 200) {
  //       this.store.riskDetailData = { ...this.store.leverFindData, [key]: result['data'] };
  //     }
  //   } catch (e) {
  //     console.error('fetchRiskDetail', e);
  //   }
  // }

  /// 获取风险详情
  async fetchPositionType(usdt: boolean) {
    try {
      const result: any = await swapGetPositionTypeApi(usdt);
      if (result['code'] == 200) {
        const data = result['data'];
        // const unit = [UNIT_MODE.VOL, UNIT_MODE.COIN, UNIT_MODE.MARGIN][data['unitModel'] - 1] || UNIT_MODE.VOL;
        const unit = [UNIT_MODE.VOL, UNIT_MODE.COIN][data['unitModel'] - 1] || UNIT_MODE.VOL;
        const mode = data['positionType'] == 2;
        const priceProtection = data['priceProtection'] == 1;
        this.store.totalWallet = { ...this.store.totalWallet, [usdt ? 'u' : 'c']: data['totalWallet'] || 0 };
        this.store.positionMode = { ...this.store.positionMode, [usdt ? 'u' : 'c']: mode ? POSITION_MODE.TWO : POSITION_MODE.ONE };
        this.store.unitMode = { ...this.store.unitMode, [usdt ? 'u' : 'c']: unit };
        this.store.priceProtection = { ...this.store.priceProtection, [usdt ? 'u' : 'c']: priceProtection };
      }
    } catch (e) {
      console.error('fetchPositionType', e);
    }
  }

  /// 更新仓位模式
  async updatePositionType(usdt: boolean, twoWayMode: boolean) {
    const result = await swapUpdatePositionTypeApi(usdt, twoWayMode);
    if (result['code'] == 200) {
      this.store.positionMode = { ...this.store.positionMode, [usdt ? 'u' : 'c']: twoWayMode ? POSITION_MODE.TWO : POSITION_MODE.ONE };
    }
    return result;
  }
  // 更新单位
  async updateIsVolUnit(usdt: boolean, value: string) {
    let result = { code: 200 };
    if (Account.isLogin) {
      result = await postSwapUpdateUnitApi(usdt, [UNIT_MODE.VOL, UNIT_MODE.COIN, UNIT_MODE.MARGIN].findIndex((v) => v === value) + 1);
    }
    if (result['code'] == 200) {
      this.store.unitMode = { ...this.store.unitMode, [usdt ? 'u' : 'c']: value };
    }
    return result;
  }

  // 价差保护
  async updatePriceProtection(usdt: boolean, value: boolean) {
    const result = await postSwapPriceProtectApi({ priceProtection: value ? 1 : 0 }, usdt);
    if (result['code'] == 200) {
      this.store.priceProtection = { ...this.store.priceProtection, [usdt ? 'u' : 'c']: value };
    }
    return result;
  }

  /// 更新保证金模式
  async updateMarginType(usdt: boolean, { id: _id, type }: { id: string; type: number }) {
    const id = _id.toUpperCase();
    const isUsdtType = this.getIsUsdtType(id);
    let result: { code: number, message: string };
    if (this._newMarginMode && this.getTwoWayMode(isUsdtType)) {
      result = { code: 200, message: "" };

    } else {
      result = await swapUpdateMarginTypeApi(usdt, { id, type });
    }
    if (result['code'] == 200) {
      this.store.leverFindData = { ...this.store.leverFindData, [id]: { ...this.getLeverFindData(id), marginType: type } };
      this.fetchLeverageFind(usdt, id);
    }
    return result;
  }

  /// 获取风险列表
  async fetchRiskList(code: string) {
    const id = code.toUpperCase();

    try {
      const result = await swapGetContractRiskListApi(code);
      if (result['code'] == 200) {
        this.store.riskListData = { ...this.store.riskListData, [id]: result['data'] };
      }
      return result;
    } catch (e) {
      console.error('fetchRiskList', e);
    }
  }
  /// 更新杠杆
  async updateLever(usdt: boolean, { id: _id, lever, wallet, side, pid }: { id: string; lever: number; wallet?: string; side?: SideType, pid?: string }) {
    const symbol = _id.toUpperCase();
    if (this._newMarginMode && this.getTwoWayMode(usdt)) {
      let result: { code: number, message: string };
      if (pid) {
        result = await postSwapUpdateLeverApi(usdt, { symbol, userLeverage: lever, subWallet: wallet, positionId: pid });
      } else {
        const isBuy = Number(side) === SideType.BUY;
        const { marginType } = this.store.leverFindData[symbol] || {};
        const { buyPosition, sellPosition } = Order.getTwoWayPosition({ usdt: usdt, openPosition: false, code: symbol, marginType });
        const position = isBuy ? buyPosition : sellPosition;
        const { buyPending, sellPending } = Order.getTwoWayPending({ usdt: usdt, code: symbol, marginType });
        const pending = isBuy ? buyPending : sellPending;
        const hasPositionOrOrder = position || pending;
        if (hasPositionOrOrder) {
          result = await postSwapUpdateLeverApi(usdt, { symbol, userLeverage: lever, subWallet: wallet, ...position ? { positionId: position.positionId } : {} });
        } else {
          result = { code: 200, message: "" };
        }
        if (result['code'] == 200) {
          const leverageLevel = { ...Number(side) === SideType.BUY ? { leverageLevelBuy: Number(lever) } : { leverageLevelSell: Number(lever) } };
          let { marginLeverage } = this.store.leverFindData[symbol];
          marginLeverage = { ...marginLeverage, [marginType]: { ...marginLeverage[marginType], ...leverageLevel } };
          this.store.leverFindData = { ...this.store.leverFindData, [symbol]: { ...this.getLeverFindData(symbol), marginLeverage, ...leverageLevel } };
          this.fetchLeverageFind(usdt, symbol);
        }
      }
      return result;

    } else {
      const result = await postSwapUpdateLeverApi(usdt, { symbol, userLeverage: lever, subWallet: wallet });
      if (result['code'] == 200) {
        this.store.leverFindData = { ...this.store.leverFindData, [symbol]: { ...this.getLeverFindData(symbol), leverageLevel: Number(lever) } };
        this.fetchLeverageFind(usdt, symbol);
        // updatePending(isUsdtType);
        // updatePositions(isUsdtType);
      }
      return result;
    }
  }
    // 是否是带单员
    setIsShareTrader(data: any) {
      this.store.isCopyTrader = data
    }
  /// 获取通知设置
  async getNotificationSetting() {
    const result = await getSwapNotificationSettingApi();
    if (result['code'] == 200) {
      this.store.notificationSetting = { ...result.data, fundRateVal: Number(result.data.fundRateVal) || '0.000001' };
    }
    return result;
  }
  /// 获取通知设置
  async setNotificationSetting(data: any) {
    const result = await swapSetNotificationSettingApi(data);
    if (result['code'] == 200) {
    }
    return result;
  }

  async syncLeverageFind(usdt: boolean, code: string) {
    const id = code.toUpperCase();
    if (this._newMarginMode && this.getTwoWayMode(usdt)) {
      const { marginLeverage: prevMarginLeverage } = this.store.leverFindData[id] || {};
      const marginLeverage = Object.values(MARGIN_TYPE).reduce((items, type, index) => {
        const { buyPosition, sellPosition } = Order.getTwoWayPosition({ usdt: usdt, openPosition: false, code: id, marginType: type });
        const { buyPending, sellPending } = Order.getTwoWayPending({ usdt: usdt, code: id, marginType: type });
        const leverageLevelBuy = buyPosition?.leverage || buyPending?.leverageLevel || 0;
        const leverageLevelSell = sellPosition?.leverage || sellPending?.leverageLevel || 0;
        return {
          ...items,
          [type]: {
            ...items[type],
            ...(leverageLevelBuy > 0 && { leverageLevelBuy }),
            ...(leverageLevelSell > 0 && { leverageLevelSell })
          }
        };
      }, { ...prevMarginLeverage } as Record<number, any>);
      const leverageItem = { ...this.store.leverFindData[id], marginLeverage };
      const { marginType, leverageLevelBuy, leverageLevelSell } = leverageItem;
      leverageItem.leverageLevelBuy = marginLeverage[marginType]?.leverageLevelBuy || leverageLevelBuy;
      leverageItem.leverageLevelSell = marginLeverage[marginType]?.leverageLevelSell || leverageLevelSell;
      this.store.leverFindData = { ...this.store.leverFindData, [id]: leverageItem };
    }
  }
}

export const infoInstance = new Info();

