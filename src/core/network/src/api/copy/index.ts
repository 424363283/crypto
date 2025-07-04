import { http } from '../../http/request';
import { paths } from '../paths';
/** 申请跟单 */
export function applyCopyTraderApi(data: { email: string; nodeUid: string; telegram: string; description: string }) {
  return http.post<object>(paths['copyTradeApplpy'], data);
}

/** 全部交易员 */
export function shareTraderListApi(data: FormData) {
  // return http.get<object[]>(paths['shareTraderList'], {
  //   params: params,
  // });
   return http.post<object>(paths['shareTraderList'], data);
}

/** 取消申请跟单 */
export function cancelCopyTraderApi(data: { email: string; telegram: string; content: string }) {
  return http.post<object>(paths['copyTradeApplpy'], data);
}
/** 图片上传 */
export function traderUploadApi(data: FormData) {
  return http.post(paths['traderUpload'], data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
/** 查询是否已开启跟单子钱包 */
export function isOpenCopyWalletApi(data?: FormData) {
  return http.post(paths['isOpenCopyWallet'], data);
}
/** 开启跟单钱包 */
export function openCopyWalletApi(data?: {contractType:number}) {
  return http.post<object>(paths['openCopyWallet'], data);
}

/** 查询带单员下的所有跟单员 */
export function getCopyFollowListApi(params: FormData) {
  return http.get<object[]>(paths['getCopyFollowList'], {
    params: params,
  });
}
/** 查询带单仓位历史 */
export function getPageCopyTradePositionHistoryApi(params: FormData) {
  return http.get<object[]>(paths['getPageCopyTradePositionHistory'], {
    params: params,
  });
}
/** 跟单员修改跟单信息 */
export function updateCopyConfigApi(data: FormData) {
 return http.post<object>(paths['updateCopyConfig'], data);
}

/** 判断是否是带单员 */
export function getIsShareTraderApi(params?: FormData) {
  return http.get<object[]>(paths['isShareTrader'], {
    params: params,
  });
}
/** 跟单员取消跟单 */
export function copyCancelStatusApi(params?: FormData) {
  return http.get<object[]>(paths['copyCancelStatus'], {
    params: params,
  });
}
/** 跟单员申请跟单 */
export function copyApplyStatusApi(data: FormData) {
  return http.post<object>(paths['copyApplyStatus'], data);
 }

/** 查询周期性带单员数据  k线 */
export function copyTradeUserStatisticsListApi(params?: FormData) {
  return http.get<object[]>(paths['copyTradeUserStatisticsList'], {
    params: params,
  });
}
/** 查询带单员详情 周期信息 */
export function copyTradeUserStatisticsSummaryApi(params?: FormData) {
  return http.get<object[]>(paths['copyTradeUserStatisticsSummary'], {
    params: params,
  });
}
/** 查询带单员详情 */
export function copyTradeUserStatisticsApi(params?: FormData) {
  return http.get<object[]>(paths['copyTradeUserStatistics'], {
    params: params,
  });
}
/** 查询带单员跟单详情 基础信息 */
export function copyTradeUserBaseApi(params?: FormData) {
  return http.get<object[]>(paths['copyTradeUserBase'], {
    params: params,
  });
}
/** 查询7天内交易比例 */
export function copyTradeuserTradProportionApi(params?: FormData) {
  return http.get<object[]>(paths['copyTradeuserTradProportion'], {
    params: params,
  });
}

/** 查询带单配置信息 */
export function getShareTradeConfigApi(params?: FormData) {
  return http.get<object[]>(paths['getShareTradeConfig'], {
    params: params,
  });
}
/** 带单员设置带单信息 */
export function updateShareConfigApi(data?: FormData) {
  return http.post<object>(paths['updateShareConfig'], data);
}
/** 交易员说明修改申请 */
export function updateTraderContentAuditApi(data?: FormData) {
  return http.post<object>(paths['updateTraderContentAudit'], data);
}
/** 查询带单员详情 */
export function shareTraderDetailApi(params?: FormData) {
  return http.get<object[]>(paths['shareTraderDetail'], {
    params: params,
  });
}
/** 跟随交易员 */
export function getShareTraderListApi(params?: FormData) {
  return http.get<object[]>(paths['getShareTraderList'], {
    params: params,
  });
}
/** 查询跟单员配置信息 */
export function copyTraderConfigDetailApi(params?: FormData) {
  return http.get<object[]>(paths['copyTraderConfigDetail'], {
    params: params,
  });
}

/** 根据uid查询用户持仓 */
export function positionByUidApi(params?: FormData) {
  return http.get<object[]>(paths['positionByUid'], {
    params: params,
  });
}
/** 带单员(取消)跟单人员 */
export function shareChannelStatusApi(params?: FormData) {
  return http.get<object[]>(paths['shareChannelStatus'], {
    params: params,
  });
}
/** 跟单数据统计 */
export function getSharedPnlApi(params?: FormData) {
  return http.get<object[]>(paths['getSharedPnl'], {
    params: params,
  });
}
/** 昵称修改 */
export function updateNickNameAuditApi(data?: FormData) {
  return http.post<object>(paths['updateNickNameAudit'], data);
}
/** 获取交易员昵称 */
export function getAllNickNameAuditsApi(params?: FormData) {
  return http.get<object[]>(paths['getAllNickNameAudits'], {
    params: params,
  });
}
/** 交易员备注状态 */
export function getAllTraderContentAuditsApi(params?: FormData) {
  return http.get<object[]>(paths['getAllTraderContentAudits'], {
    params: params,   
  });
}
/** 根据uid查询用户合约账户配置 */
export function getUserSettingsByUidApi(params?: FormData) {
  return http.get<object[]>(paths['getUserSettingsByUid'], {
    params: params,   
  });
}
/** 查询跟单员分润统计接口 */
export function getShareStatisticsApi(data?: FormData) {
  return http.post<object>(paths['getShareStatistics'], data);
}