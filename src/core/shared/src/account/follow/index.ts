import { cancelFollowApi, followTraderByIdApi, getAccountFollowDetailApi, getCommonTradeHistoryApi, getFailedFollowLogApi, getFilterDefaultValuesApi, getFollowDefaultValuesApi, getFollowDetailByIdApi, getFollowListApi, getFollowTraderDetailApi, getFollowTraderFollowersApi, getFollowTraderStateApi, getTradePositionApi, getTraderCommodityStateApi, setFollowerActiveApi, unfollowTraderByIdApi, updateFollowApplyApi } from '@/core/api';
import { Account } from '@/core/shared';
import { FollowTraderDetail, UpdateFollowApplyParams, UpdateTraderListParams } from './types';

export class Follow {
  // 获取跟单交易详情
  public static getAccountFollowDetail = async (data: { page: number; rows: number }) => {
    const result = await getAccountFollowDetailApi(data);
    return {
      data: result.data.list?.map((item: any) => {
        return {
          ...item,
          isBuy: item.buy,
          commodityCode: item.commodity,
          time: item.createTime,
        };
      }),
      total: result.data.totalPage,
      page: result.data?.page,
      size: result.data?.size,
    };
  };
  // getFailedFollowLog
  public static getFailedFollowLog = async (data: { page: number; rows: number; tagCodeExcludes?: string }) => {
    const result = await getFailedFollowLogApi(data);
    return {
      data: result.data.list || [],
      total: result.data.count,
      page: result.data?.page,
      size: result.data?.size,
      totalPage: result.data?.totalPage,
      code: result.code,
      message: result.message,
    };
  };
  // getFollowTraderDetail
  public static getFollowTraderDetail = async (data: { traderId: string; currency?: string }): Promise<FollowTraderDetail> => {
    const result = await getFollowTraderDetailApi(data);
    const element = result?.data;
    if (element) {
      return {
        userId: element.uid,
        traderId: element.uid,
        traderName: element.username,
        traderAvatar: element.avatar,
        traderType: element.type,
        data: element,
      };
    } else {
      return {
        userId: 0,
        traderId: 0,
        traderName: '',
        traderAvatar: '',
        traderType: '',
        data: {},
      };
    }
  };
  // getFollowTraderFollowers
  public static getFollowTraderFollowers = async (data: { currency?: string; rows: number; page: number; traderId: number; relation?: boolean }) => {
    const result = await getFollowTraderFollowersApi(data);
    return {
      code: result.code,
      message: result.message,
      data: (result.data.list || []).map((item) => {
        return {
          ...item,
          userId: item.uid,
          username: item.username,
        };
      }),
      total: result.data.count,
      page: result.data?.page,
      size: result.data?.size,
    };
  };
  // 获取跟单大厅列表数据
  public static updateTraderList(data: UpdateTraderListParams): Promise<{
    total: number;
    page: number;
    size: number;
    data: any;
  }> {
    data = Object.assign({ page: 1, rows: 12, _: new Date().getTime() }, data);
    return new Promise(async (resolve, reject) => {
      try {
        let result = await getFollowListApi(data);
        if (result.code === 200) {
          let userInfo = await Account.getUserInfo();
          let temp = result.data?.list;
          temp?.forEach(async (element: any) => {
            element.userId = element.uid;
            element.traderId = element.uid;
            element.traderType = element.type;
            element.traderAvatar = element.avatar;
            element.traderName = element.username;
            element.wIncome = element.wIncome?.toFixed(2);

            if (element.uid === userInfo?.uid) {
              element.self = true;
            }
          });

          resolve({
            total: result.data?.count,
            page: result.data?.page,
            size: result.data?.size,
            data: temp,
          });
        } else {
          reject(result?.message);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  // 获取交易员筛选参数预设值
  public static traderQuery(): Promise<{ data: any }> {
    return new Promise((resolve, reject) => {
      getFilterDefaultValuesApi()
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }

  // 关注交易员
  public static addAttention(uid: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      followTraderByIdApi(uid)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }

  // 取消关注交易员
  public static cancelAttention(uid: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      unfollowTraderByIdApi(uid)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 获取用户跟单详情
  public static getFollowDetail(data: { traderId: string; currency?: string }): Promise<any> {
    data = data || {};
    data = Object.assign({ _: new Date().getTime() }, data);
    return new Promise((resolve, reject) => {
      getFollowDetailByIdApi(data)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 获取跟单默认值
  public static getFollowDefaultValues(data?: { currency?: string }): Promise<any> {
    let params = data || {};
    params = Object.assign({ _: new Date().getTime() }, params);
    return new Promise((resolve, reject) => {
      getFollowDefaultValuesApi(params)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 取消跟随
  public static cancelFollow(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cancelFollowApi(id)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 跟单开关
  public static setFollowerActive(id: string, active: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      setFollowerActiveApi(id, active)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 跟单信息修改
  public static updateFollowApply(data: UpdateFollowApplyParams): Promise<any> {
    data = data || {};
    if (data.slRatio > 0) {
      data.slRatio = -data.slRatio;
    }
    data = Object.assign({ currency: 'USDT' }, data);
    return new Promise((resolve, reject) => {
      updateFollowApplyApi(data)
        .then((result) => {
          if (result.code === 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 交易员合约商品统计(图表)
  public static getFollowTraderState(traderId: string, days: number): Promise<any> {
    return new Promise((resolve, reject) => {
      getFollowTraderStateApi(traderId, days)
        .then((result) => {
          if (result.code === 200) {
            resolve(result.data);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 交易统计
  public static getTraderCommodityState(traderId: string, days: number): Promise<any> {
    return new Promise((resolve, reject) => {
      getTraderCommodityStateApi(traderId, days)
        .then((result) => {
          if (result.code === 200) {
            resolve(result.data);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 带单员当前持仓
  public static getTradePosition(traderId: string, page: number, rows: number): Promise<any> {
    return new Promise((resolve, reject) => {
      getTradePositionApi({ traderId, page, rows })
        .then((result) => {
          if (result.code === 200) {
            const data = result.data;
            resolve({
              data: data.list?.map((item: any) => {
                return {
                  ...item,
                  isBuy: item.buy,
                  commodityCode: item.commodity,
                  time: item.createTime,
                };
              }),
              total: Number(data?.count),
              page: data?.page,
              size: data?.size,
            });
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 带单员持仓历史
  public static getTradeHistory(traderId: string, page: number, rows: number): Promise<any> {
    return new Promise((resolve, reject) => {
      getCommonTradeHistoryApi({ traderId, page, rows })
        .then((result) => {
          if (result.code === 200) {
            const data = result.data;
            resolve({
              data: data.list?.map((item: any) => {
                return {
                  ...item,
                  isBuy: item.buy,
                  commodityCode: item.commodity,
                  time: item.createTime,
                };
              }),
              total: Number(data?.count),
              page: data?.page,
              size: data?.size,
            });
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    });
  }
}
