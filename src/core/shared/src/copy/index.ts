import {
  applyCopyTraderApi,
  shareTraderListApi,
  traderUploadApi,
  isOpenCopyWalletApi,
  getPageCopyTradePositionHistoryApi,
  updateCopyConfigApi,
  getIsShareTraderApi,
  openCopyWalletApi,
  copyTradeUserStatisticsListApi,
  copyTradeUserStatisticsSummaryApi,
  copyTradeUserStatisticsApi,
  copyTradeUserBaseApi,
  copyTradeuserTradProportionApi,
  getShareTradeConfigApi,
  updateShareConfigApi,
  updateTraderContentAuditApi,
  shareTraderDetailApi,
  getPerpetualUAssetApi,
  postSwapPositionCloseAllApi,
  postSwapPositionCloseApi,
  getShareTraderListApi,
  copyTraderConfigDetailApi,
  positionByUidApi,
  shareChannelStatusApi,
  getSharedPnlApi,
  getSwapTradeListApi,
  updateNickNameAuditApi,
  getAllNickNameAuditsApi,
  copyCancelStatusApi,
  copyApplyStatusApi,
  getAllTraderContentAuditsApi,
  getUserSettingsByUidApi,
  getCopyFollowListApi,
  getShareStatisticsApi
} from '@/core/api';
import { getCookie } from '@/core/utils';
import { mergeMultiFileFields } from '@/core/utils';
import { Account } from '@/core/shared';
import { LOCAL_KEY, localStorageApi, useLoginUser } from '@/core/store';
import { formatNumber2Ceil, getUrlQueryParams } from '@/core/utils';
import { FORMULAS } from '@/core/formulas';
import { USER_BENEFITS } from './types';
import { Throttle, isBrowser } from '@/core/utils';
import { useWs1050 } from '@/core/network';
import { Swap } from '@/core/shared';
import { ContractType } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
class Copy {
  static instance: Copy;
  // 信息
  static userBenefits: USER_BENEFITS = {
    profitAmount7: 0,
    profitRate7: 0,
    profitAmount: 0
  };
  static swapCoinList: any = [];
  static flagPriceList:any = []
  static isUsdtType: boolean = true;
  static copyFixed: number = 2;
  public static isLogin = () => !!getCookie('TOKEN');
  public static getUserInfo = () => {
    return Account.getUserInfo();
  };
  constructor(data) {
    
  }
  // 初始化
  public static init = async () => {
    // if (this.isLogin()) {
    //   // 校验已经开启跟单钱包
    //   const isOpen: any = await this.fecthIsOpenCopyWallet();
    //   // 否
    //   if (!isOpen?.data) {
    //     // 开启跟单账号
    //     await this.fetchOpenCopyWallet({
    //       contractType: 2 // 2=u本位 1=币本位
    //     });
    //   }
    // }
    this.getSwapCoinList();
  };
    // 持仓回报率
    public static positionROE({
      usdt,
      data,
      income,
      flagPrice
    }: {
      usdt: boolean;
      data: {
        basePrecision: number;
        marginType: number;
        symbol: string;
        currentPosition: number;
        margin: number;
        avgCostPrice: number;
        side: string;
        leverage: number;
      };
      income: number;
      flagPrice:number
    }) {
      const isCross = data.marginType === 1; // 全仓
      const code = data?.symbol.toUpperCase();
      const { contractFactor } = Copy.getCryptoData(code);
      const currentPosition = Number(data.currentPosition);
      const margin = Number(data.margin);
      const _margin = Number(
        usdt ? formatNumber2Ceil(data.margin, 2).toFixed(2) : Number(data.margin).toFixed(Number(data.basePrecision))
      );
      const avgCostPrice = Number(data.avgCostPrice);
      let _income =
        income !== undefined
          ? income
          : this.income({
            usdt: usdt,
            code: code,
            isBuy: data.side === '1',
            flagPrice,
            avgCostPrice,
            volume: currentPosition,
          });
  
      const scale = usdt ? 2 : Number(data.basePrecision);
      _income = Number(formatNumber2Ceil(income, scale, false).toFixed(scale));
      if (!usdt) {
        return FORMULAS.SWAP.coin.positionROE(
          isCross,
          _margin,
          currentPosition,
          contractFactor,
          flagPrice,
          data.leverage,
          _income || 0
        );
      } else {
        return FORMULAS.SWAP.usdt.positionROE(
          isCross,
          _margin,
          currentPosition,
          contractFactor,
          flagPrice,
          data.leverage,
          _income || 0
        );
      }
    }
  // 新持仓回报率公式
  // 多 收益率=(触发价格-持仓均价)/(持仓均价*max(IMR,1/杠杆))
  // 空 收益率=(持仓均价-触发价格)/(持仓均价*max(IMR, 1/杠杆))
  public static newPositionROE({
    side,
    avgCostPrice,
    markPrice,
    leverage,
    imr = 0
  }: {
    side: string;
    avgCostPrice: number;
    markPrice: number;
    leverage: number;
    imr?: number;
  }) {
    // 计算 max(IMR, 1 / 杠杆)
    const marginFactor = Math.max(imr, 1 / leverage);
    // 计算收益率
    const spread = side === '2' ? avgCostPrice.sub(markPrice) : markPrice.sub(avgCostPrice);
    return spread.div(avgCostPrice.mul(marginFactor))?.mul(100);
  }
  static async getSwapCoinList() {
    const group = await this.fetchSwapTradeList();
    if (group?.code === 200) {
      const filterGroup = group.data.filter((item) => item.contractType === ContractType.swap)
      this.swapCoinList = filterGroup;
    }
  }
  static getContractList() {
    return this.swapCoinList;
  }
  static getCryptoData(code: string) {
    return this.swapCoinList && this.swapCoinList.find(item => item?.symbol?.toUpperCase() === code.toUpperCase()) || {};
  }
  static setFlagPrice(data:any) {
      this.flagPriceList = data
  }
  static getFlagPriceList(){
    return this.flagPriceList
  }
  // 盈亏
  public static income({
    usdt,
    code,
    flagPrice: _flagPrice,
    isBuy,
    volume,
    avgCostPrice,
  }: {
    usdt: boolean;
    code: string;
    flagPrice?: number;
    isBuy?: boolean;
    volume: number;
    avgCostPrice: number;
  }) {
    const { contractFactor } = Copy.getCryptoData(code);
    const symbol = code.toUpperCase()
    if (!usdt) {
      const value = FORMULAS.SWAP.coin.income(!!isBuy, volume, contractFactor, avgCostPrice, _flagPrice);
      return formatNumber2Ceil(value, 8, false);
    } else {
      const value = FORMULAS.SWAP.usdt.income(!!isBuy, volume, contractFactor, avgCostPrice, _flagPrice);
      return formatNumber2Ceil(value, 8, false);
    }
  }

  //  申请跟单
  static async applyCopyTrader(data: {
    phone: string;
    email: string;
    nodeUid: string;
    telegram: string;
    description: string;
    file?: string;
  }): Promise<{ message: string; data: any; code: number }> {
    return await applyCopyTraderApi(data);
  }
  //  跟单
  static async getAllTraders(data: any): Promise<{ message: string; data: any; code: number }> {
    return await shareTraderListApi(data);
  }

  // 上传图片
  public static traderUpload(data: { images: any }): Promise<{ code: number; message: string }> {
    const formData = mergeMultiFileFields({ ...data, front: true }) as any;
    return traderUploadApi(formData);
  }
  //  查询是否已开启跟单子钱包
  static async fecthIsOpenCopyWallet(): Promise<{ message: string; data: any; code: number }> {
    return await isOpenCopyWalletApi();
  }
  // 查询带单员下的所有跟单员
  static async getCopyFollowList(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getCopyFollowListApi(data);
  }
  // 查询带单仓位历史
  static async getPageCopyTradePositionHistory(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getPageCopyTradePositionHistoryApi(data);
  }
  // 判断是否是带单员
  static async getIsShareTrader(): Promise<{ message: string; data: any; code: number }> {
    return await getIsShareTraderApi();
  }
  // 跟单员修改跟单信息
  static async fetchUpdateCopyConfig(data: any): Promise<{ message: string; data: any; code: number }> {
    return await updateCopyConfigApi(data);
  }
  // 开启跟单钱包
  static async fetchOpenCopyWallet(data: any): Promise<{ message: string; data: any; code: number }> {
    return await openCopyWalletApi(data);
  }
  static getObjectIntersection(arr1 = [], arr2 = [], key: string) {
    return arr1.filter(item1 => arr2.some(item2 => item1[key]?.toUpperCase() === item2[key]?.toUpperCase()));
  }
  // 查询周期性带单员数据  k线
  static async fetchCopyTradeuserStatisticsList(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyTradeUserStatisticsListApi(data);
  }
  // 查询带单员详情 周期信息
  static async fetchCopyTradeuserStatisticsSummary(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyTradeUserStatisticsSummaryApi(data);
  }
  // 查询带单员详情
  static async fetchCopyTradeuserStatistics(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyTradeUserStatisticsApi(data);
  }
  // 查询带单员跟单详情 基础信息
  static async fetchCopyTradeuserBase(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyTradeUserBaseApi(data);
  }
  // 查询7天内交易比例
  static async fetchCopyTradeUserTradProportion(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyTradeuserTradProportionApi(data);
  }
  // 查询带单配置信息
  static async fetchShareTradeConfig(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getShareTradeConfigApi(data);
  }
  // 带单员设置带单信息
  static async fetchUpdateShareConfig(data: any): Promise<{ message: string; data: any; code: number }> {
    return await updateShareConfigApi(data);
  }
  // 交易员说明修改申请
  static async fetchUpdateTraderContentAudit(data: any): Promise<{ message: string; data: any; code: number }> {
    return await updateTraderContentAuditApi(data);
  }
  // 查询带单员详情
  static async fetchShareTraderDetail(data: any): Promise<{ message: string; data: any; code: number }> {
    return await shareTraderDetailApi(data);
  }
  // 查询跟单账户余额
  static async fetchPerpetualUAsset(): Promise<{ message: string; data: any; code: number }> {
    return await getPerpetualUAssetApi();
  }
  // 获取当前持仓
  static async fetchSwapPositiont(params: any): Promise<{ message: string; data: any; code: number }> {
    return await positionByUidApi(params);
  }
  // 全部平仓
  static async fetchSwapPositionCloseAll(data: any): Promise<{ message: string; data: any; code: number }> {
    return await postSwapPositionCloseAllApi(data, true);
  }
  // 当前持仓 平仓
  static async fetchPostSwapPositionClose(data: any): Promise<{ message: string; data: any; code: number }> {
    return await postSwapPositionCloseApi(data, true);
  }
  // 跟随交易员
  static async fetchShareTraderList(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getShareTraderListApi(data);
  }
  // 查询跟单员配置信息
  static async fetchCopyTraderConfigDetail(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyTraderConfigDetailApi(data);
  }
  // 带单员(取消)跟单人员
  static async fetchShareChannelStatusApi(data: any): Promise<{ message: string; data: any; code: number }> {
    return await shareChannelStatusApi(data);
  }
  // 跟单数据统计
  static async fetchSharedPnl(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getSharedPnlApi(data);
  }
  // 跟单合约
  static async fetchSwapTradeList(): Promise<{ message: string; data: any; code: number }> {
    return await getSwapTradeListApi();
  }
  // 昵称修改
  static async fetchUpdateNickNameAudit(data: any): Promise<{ message: string; data: any; code: number }> {
    return await updateNickNameAuditApi(data);
  }
  // 昵称修改
  static async getAllNickNameAudits(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getAllNickNameAuditsApi(data);
  }
  // 跟单员取消跟单
  static async fetchCopyCancelStatus(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyCancelStatusApi(data);
  }
  // 跟单员取消跟单
  static async fetchCopyApplyStatus(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyApplyStatusApi(data);
  }
  // 交易员备注状态
  static async fetchAllTraderContentAudits(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getAllTraderContentAuditsApi(data);
  }
  // 根据uid查询用户合约账户配置
  static async fetchUserSettingsByUid(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getUserSettingsByUidApi(data);
  }
  // 查询跟单员分润统计接口
  static async fetchShareStatistics(data?: any): Promise<{ message: string; data: any; code: number }> {
    return await getShareStatisticsApi(data);
  }
}
export { Copy };
