import { StoreApi, UseBoundStore, create } from 'zustand';

export const enum USDT_ACCOUNT_TYPE {
  /** 现货 */
  SPOT = 1,
  /** 合约 */
  CONTRACT = 24,
  /** 带单 */
  COPYTRADE = 68,
  /** 其他 */
  FUND = 70
}

export const useUsdtAssetsStore: UseBoundStore<StoreApi<IUsdtAssetsStore>> = create(set => ({
  spotUSDT: 0,
  contractUSDT: 0,
  copyTradeUSDT: 0,
  fundUSDT: 0,
  setUsdtAsset: (usdType: USDT_ACCOUNT_TYPE, value: number) =>
    set(state => {
      let usdtTypeKey = '';

      switch (usdType) {
        case USDT_ACCOUNT_TYPE.SPOT:
          usdtTypeKey = 'spotUSDT';
          break;
        case USDT_ACCOUNT_TYPE.CONTRACT:
          usdtTypeKey = 'contractUSDT';
          break;
        case USDT_ACCOUNT_TYPE.COPYTRADE:
          usdtTypeKey = 'copyTradeUSDT';
          break;
        case USDT_ACCOUNT_TYPE.FUND:
          usdtTypeKey = 'fundUSDT';
          break;
      }

      return usdtTypeKey ? { ...state, [usdtTypeKey]: value } : state;
    })
}));
