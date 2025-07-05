// 资产账户
import {
  deleteAddressApi,
  getAssetsListApi,
  getCommonBaseInfoApi,
  getLiteAssetApi,
  getLitePositionApi,
  getLiteRewardsAccountApi,
  getPerpetualCoinAssetApi,
  getPerpetualUAssetApi,
  getSpotAssetApi,
  getSwapPositionApi
} from '@/core/api';
import { LITE_POSITION } from '@/core/formulas/src/lite-position';
import { SUBSCRIBE_TYPES } from '@/core/network';
import { resso } from '@/core/resso';
import { LiteListItem, MarketsMap, PositionSide, Rate } from '@/core/shared';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';
import { ILiteAsset, ISpotAsset, ISwapAsset, ISwapUAsset, SpotItem, SwapItem } from './types';
import { SWAP_WALLET_ALIAS } from '../../swap/modules/assets/constants';

const SPOT_STORE = resso<ISpotAsset>({
  allSpotAssets: [],
  noneZeroSpotAssets: [],
  spotTotalBalance: 0
});

const SWAP_STORE = resso<ISwapAsset>({
  assets: {
    accounts: {},
    equitySum: '0',
    wallet: SWAP_DEFAULT_WALLET_ID
  },
  wallets: [],
  swapList: [],
  swapBalance: 0, // 账户余额
  unrealisedPNL: 0, // 未实现盈亏
  bonusAmount: 0, // 体验金
  deductionAmount: 0, //抵扣金
  contractMarginBalance: 0, // 永续合约保证金余额
  frozenMargin: 0 // 冻结保证金
});

const SWAP_U_STORE = resso<ISwapUAsset>({
  assets: {
    accounts: {},
    equitySum: '0',
    wallet: SWAP_DEFAULT_WALLET_ID
  },
  wallets: [],
  swapList: [],
  swapUBalance: 0,
  unrealisedPNL: 0, // 未实现盈亏
  bonusAmount: 0, // 体验金
  deductionAmount: 0, //抵扣金
  contractMarginBalance: 0,
  frozenMargin: 0 // 冻结保证金
});

const LITE_STORE = resso<ILiteAsset>({
  assets: {
    currency: '',
    discount: '',
    game: 0,
    lucky: 0,
    money: 0,
    uid: '0'
  },
  luckyRate: 0,
  position: [],
  occupiedBalance: 0,
  floatProfit: 0, // 浮动收益
  experienceBalance: 0 // 体验金余额
});
function sortArray(arr: SpotItem[]): SpotItem[] {
  // 创建副本，避免更改原始数组
  const sortedArr = arr.slice();
  // 按 code 名称排序
  sortedArr.sort((a, b) => a.code.localeCompare(b.code));
  // 按 targetU 大小排序
  sortedArr.sort((a, b) => +b.targetU - +a.targetU);
  return sortedArr;
}
class Assets {
  // 现货资产store 请确保先请求getAllSpotAssets 后读取
  public static get spotAssetsStore() {
    return SPOT_STORE;
  }
  // 币本位合约资产store
  public static get swapAssetsStore() {
    return SWAP_STORE;
  }
  // U本位合约资产store
  public static get swapUAssetsStore() {
    return SWAP_U_STORE;
  }
  // 简单合约资产store
  public static get liteAssetsStore() {
    return LITE_STORE;
  }
  //获取资产列表
  public static getAssetsList() {
    return getAssetsListApi();
  }
  // 删除资产deleteAddress
  public static deleteAddress(addressId: number) {
    return deleteAddressApi(addressId);
  }
  // 获取现货资产总额
  private static _getSpotTotalBalance = (spotData: SpotItem[]) => {

    // const targetUBiggerZero = spotData.filter((item: SpotItem) => {
    //   return Number(item.targetU) > 0;
    // });
    // const total = targetUBiggerZero.reduce((acc: any, cur: any) => {
    //   return acc.add(cur.targetU);
    // }, 0);

    const total = spotData.reduce((acc: any, cur: any) => {
      return acc.add(cur.targetU).add(cur?.lite?.planMargin || 0).add(cur?.lite?.positionMargin || 0);
    }, 0);
    SPOT_STORE.spotTotalBalance = Number(total) < 0 ? 0 : total; // 若数值没有变化，则不会通知ui更新
    return total;
  };

  // 获取现货大于0的资产
  private static _getNoZeroSpotAssets = (spotData: SpotItem[]) => {
    const result = spotData.filter((item: SpotItem) => {
      return Number(item.total) > 0;
    });
    SPOT_STORE.noneZeroSpotAssets = result;
    Assets._getSpotTotalBalance(result);
    return result;
  };

  //fetchIfNotFetched 装饰器，将请求数据的重复逻辑提取出来；作用：防止重复请求
  //  @fetchIfNotFetched
  public static async getAllSpotAssets(forceFetch = false) {
    const spotAsset = await getSpotAssetApi();
    if (spotAsset?.code === 200) {
      const rate = await Rate.getInstance();
      const data = spotAsset.data || [];
      const newData = data.map(async (item: any) => {
        const total = item.balance.add(item.frozen) as number; // 代币总数
        const target = await rate.toRate({
          money: total,
          currency: item.currency,
          exchangeRateCurrency: 'USDT',
          useScale: false
        }); // 代币转为usdt
        const local = await rate.toRate({ money: total, currency: item.currency }); // 代币转为本地货币
        return {
          ...item,
          balance: item.balance < 0 ? 0 : item.balance, // 可用资产
          code: item.currency,
          total: total < 0 ? 0 : total,
          scale: item?.scale,
          targetU: target,
          local
        };
      });

      const response = await Promise.all(newData);
      const fiatList = Rate.store.fiatList;
      // 排除掉法币
      const removeTwoItemOfFiatList = fiatList.filter(code => code !== 'EUR' && code !== 'GBP');
      const excludeFiatList = response.filter((item: any) => {
        return !removeTwoItemOfFiatList.includes(item.code);
      });
      // 先按名字排序，然后按资产总额targetU排序
      const sortData = sortArray(excludeFiatList);
      SPOT_STORE.allSpotAssets = sortData;
      Assets._getNoZeroSpotAssets(sortData);
      return sortData;
    }
    return [];
  }

  // 简单合约资产
  // @fetchIfNotFetched
  public static async getLiteAsset(forceFetch = false) {
    const result = await getLiteAssetApi();
    LITE_STORE.assets = result.data;
    return result;
  }
  private static _formatSwapList(accounts: { [key: string]: SwapItem }, isUsdt: boolean) {
    const allList = Object.keys(accounts).map(v => ({ code: v, ...accounts[v] }));
    isUsdt ? (SWAP_U_STORE.swapList = allList) : (SWAP_STORE.swapList = allList);
    return allList;
  }
  // 获取永续合约持仓数据
  // @fetchIfNotFetched
  public static async getSwapPositionData(forceFetch = false, isUsdtType: boolean = false) {
    const positionData = await getSwapPositionApi(isUsdtType);
    return positionData.data;
  }
  public static getCryptoIsCross = async (code: string | undefined, isUsdtType: boolean = false) => {
    const data = (await Assets.getSwapPositionData(false, isUsdtType)) || [];
    const item = data.find((v: any) => v.symbol.toUpperCase() === code?.toUpperCase());
    if (item === undefined) {
      return true;
    }
    return item?.marginType === 1;
  };
  // 永续u本位资产
  // @fetchIfNotFetched
  public static async getPerpetualUAsset(forceFetch = false) {
    const perpetualUAsset = await getPerpetualUAssetApi();
    const defaultAsset = perpetualUAsset?.data?.find(e => e.wallet === SWAP_DEFAULT_WALLET_ID) || SWAP_U_STORE.assets;
    SWAP_U_STORE.assets = defaultAsset;
    const formatAssets = perpetualUAsset?.data?.map(v => {
      const { alias, pic, remark, url } = Object.values(v.accounts)[0] as any;
      return { accounts: v.accounts, wallet: v.wallet, alias: SWAP_WALLET_ALIAS[v.wallet] || alias || v.wallet, url: url, pic, remark };
    });
    SWAP_U_STORE.wallets = formatAssets;
    const accounts = defaultAsset.accounts;
    Assets._formatSwapList(accounts, true);
    return perpetualUAsset;
  }
  // 永续币本位资产
  // @fetchIfNotFetched
  public static async getPerpetualAsset(forceFetch = false) {
    const perpetualAsset = await getPerpetualCoinAssetApi();
    const defaultAsset = perpetualAsset.data.find(e => e.wallet === SWAP_DEFAULT_WALLET_ID) || SWAP_U_STORE.assets;
    SWAP_STORE.assets = defaultAsset;
    const formatAssets = perpetualAsset.data.map(v => {
      const { alias, pic, remark, url } = Object.values(v.accounts)[0] as any;
      return { accounts: v.accounts, wallet: v.wallet, alias: alias || v.wallet, url: url, pic, remark };
    });
    SWAP_STORE.wallets = formatAssets;
    const accounts = defaultAsset?.accounts || {};
    Assets._formatSwapList(accounts, false);
    return perpetualAsset;
  }

  // 获取简单合约扣除金余额
  // @fetchIfNotFetched
  public static async getLiteDeductionBalance(forceFetch = false) {
    const result = await getCommonBaseInfoApi();
    const luckyRate = result?.data?.liteLuckyRate;
    const numbericLuckyRate = Number(luckyRate.mul(100));
    LITE_STORE.luckyRate = numbericLuckyRate;
    return numbericLuckyRate;
  }
  // 获取简单合约占用资产
  public static async getLiteOccupiedBalance(data: LiteListItem[] = []) {
    const standData = data?.filter(item => {
      return Number(item.bonusId) === 0;
    });
    const occupiedBalance = standData?.reduce((acc: any, cur: any) => {
      return acc.add(cur.margin);
    }, 0);
    LITE_STORE.occupiedBalance = occupiedBalance;
    return occupiedBalance;
  }
  // 获取简单合约持仓
  // @fetchIfNotFetched
  public static async getLitePosition(forceFetch = false) {
    const result = await getLitePositionApi();
    const data = result.data;
    LITE_STORE.position = data || [];
    Assets.getLiteOccupiedBalance(data);
    return result;
  }

  // 发起监听3001
  public static dispatchWsListener() {
    window.removeEventListener(SUBSCRIBE_TYPES.ws3001, Assets.onWs3001 as any);
    window.addEventListener(SUBSCRIBE_TYPES.ws3001, Assets.onWs3001 as any);
  }

  // 监听 3001 的方法, 设置简单合约浮动盈亏
  private static onWs3001({ detail: marketsMap }: CustomEvent<MarketsMap>) {
    let profit = 0;
    LITE_STORE.position?.forEach((item: LiteListItem) => {
      const { buy, opPrice, lever, margin, commodity } = item;
      const price = marketsMap[commodity]?.price;
      const income = LITE_POSITION.positionProfitAndLoss(
        buy ? PositionSide.LONG : PositionSide.SHORT,
        price,
        opPrice,
        lever,
        margin
      );
      profit = Number(income.toFixed(2).add(profit));
    });
    LITE_STORE.floatProfit = profit;
  }

  // 销毁 3001 的监听
  public static destroyWsListener() {
    window.removeEventListener(SUBSCRIBE_TYPES.ws3001, Assets.onWs3001 as any);
  }

  // 获取简单合约体验金账户
  // @fetchIfNotFetched
  public static async getLiteBonus(forceFetch = false) {
    const res = await getLiteRewardsAccountApi();
    const data = res.data;
    const liteData = data.lite;

    const now = Date.now();
    const bonusList = []; // 体验金列表
    const luckyList = []; // 抵扣金列表
    let bonusBlance = 0; // 体验金余额
    let luckyBalance = 0; // 抵扣金余额

    for (const item of liteData) {
      // 体验金
      if (item.state === 1 && item.type === 1 && now < item.expireTime) {
        bonusList.push(item);
        bonusBlance = +bonusBlance.add(item.amount);
      }
      // 抵扣金
      if (item.state === 1 && item.type === 2 && now < item.expireTime) {
        luckyList.push(item);
        luckyBalance = +luckyBalance.add(item.amount);
      }
    }
    LITE_STORE.experienceBalance = bonusBlance;
    return {
      bonusList,
      luckyList,
      bonusBlance,
      luckyBalance
    };
  }
}
export { Assets };
