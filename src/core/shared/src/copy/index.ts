import {
  applyCopyTraderApi,
  shareTraderListApi,
  traderUploadApi,
  isOpenCopyWalletApi,
  getCopyTraderListApi,
  getPageCopyTradePositionHistoryApi,
  updateCopyConfigApi,
  getIsShareTraderApi,
  openCopyWalletApi,
  copyTradeUserStatisticsListApi,
  copyTradeUserStatisticsSummaryApi,
  copyTradeUserStatisticsApi,
  copyTradeUserBaseApi,
  copyTradeuserTradProportionApi,
  copyApplyStatusApi,
  getShareTradeConfigApi,
  updateShareConfigApi,
  updateTraderContentAuditApi,
  shareTraderDetailApi,
  getPerpetualUAssetApi,
  getSwapPositionApi,
  postSwapPositionCloseAllApi,
  postSwapPositionCloseApi,
  getShareTraderListApi,
  copyTraderConfigDetailApi,
  positionByUidApi,
  shareChannelStatusApi
} from '@/core/api';
import { getCookie } from '@/core/utils';
import { mergeMultiFileFields } from '@/core/utils';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { USER_BENEFITS } from './types';
import { FilterInstance } from './modules/filter';
import { resso, useResso } from '@/core/resso';
class Copy {
  static instance: Copy;
  // 信息
  static Filter = FilterInstance;
  static userBenefits: USER_BENEFITS = {
    profitAmount7: 0,
    profitRate7: 0,
    profitAmount: 0
  };
  public static isLogin = () => !!getCookie('TOKEN');
  public static getUserInfo = () => {
    return localStorageApi && localStorageApi.getItem(LOCAL_KEY.LOGIN_USER);
  };
  constructor(data) {}
  // 初始化
  public static init = async () => {
    console.log(1111, 'init=====');
    if (this.isLogin()) {
      // 校验已经开启跟单钱包
      const isOpen: any = await this.fecthIsOpenCopyWallet();
      // 否
      if (!isOpen.data) {
        // 开启跟单账号
        await this.fetchOpenCopyWallet({
          contractType: 2 // 2=u本位 1=币本位
        });
      }
    }
    Copy.Filter.init({ resso });
  };
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
  static async getCopyTraderList(data: any): Promise<{ message: string; data: any; code: number }> {
    return await getCopyTraderListApi(data);
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
  // 跟单员申请(取消)跟单
  static async fetchCopyApplyStatus(data: any): Promise<{ message: string; data: any; code: number }> {
    return await copyApplyStatusApi(data);
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
  static async fetchSwapPositiont(params:any): Promise<{ message: string; data: any; code: number }> {
    return await positionByUidApi(params);
  }
   // 全部平仓
   static async fetchSwapPositionCloseAll(data:any): Promise<{ message: string; data: any; code: number }> {
    return await postSwapPositionCloseAllApi(true,data);
  }
  // 当前持仓 平仓
  static async fetchPostSwapPositionClose(data:any): Promise<{ message: string; data: any; code: number }> {
    return await postSwapPositionCloseApi(data,true);
  }
   // 跟随交易员
   static async fetchShareTraderList(data:any): Promise<{ message: string; data: any; code: number }> {
    return await getShareTraderListApi(data);
  }
   // 查询跟单员配置信息
   static async fetchCopyTraderConfigDetail(data:any): Promise<{ message: string; data: any; code: number }> {
    return await copyTraderConfigDetailApi(data);
  }
   // 带单员(取消)跟单人员
   static async fetchShareChannelStatusApi(data:any): Promise<{ message: string; data: any; code: number }> {
    return await shareChannelStatusApi(data);
  }
}
export { Copy };
