import { getSpotAssetApi, getSpotGridPositionListApi, getSpotHistoryCommissionApi, getSpotHistoryDetailApi, getSpotInvestPositionListApi, getSpotPositionListApi } from '@/core/api';
import { Polling, message } from '@/core/utils';
import dayjs from 'dayjs';
import { Account } from '../../account';
import { Trade } from '../trade';
import { state } from './state';
import { CommissionType, HistoryRange, LoadingType } from './types';
// 现货持仓逻辑
export class Position {
  public static id: string;

  public static state = state;

  public static pollingPosition = new Polling({
    interval: 1000,
    callback: Position.fetchPositionList,
  });

  public static pollingTradeHistory = new Polling({
    interval: 1000,
    callback: Position.fetchTradeHistoryList,
  });

  public static pollingOrderHistory = new Polling({
    interval: 1000,
    callback: Position.fetchOrderHistoryList,
  });

  public static pollingAssets = new Polling({
    interval: 1000,
    callback: Position.fetchSpotAssetsList,
  });

  public static pollingGrid = new Polling({
    interval: 2000,
    callback: Position.fetchSpotGridPositionList,
  });

  public static pollingGridAtFiveSeconds = new Polling({
    interval: 5000,
    callback: Position.fetchSpotGridPositionList,
  });

  public static pollingInvest = new Polling({
    interval: 2000,
    callback: Position.fetchSpotInvestPositionList,
  });

  public static pollingInvestAtFiveSeconds = new Polling({
    interval: 5000,
    callback: Position.fetchSpotInvestPositionList,
  });

  // 记录上一次请求时的持仓数据数量，有变化时代表有交易成交，重新拉取余额
  public static count = 0;
  /**
   * 拉取现货持仓列表
   */
  public static async fetchPositionList(showLoading = LoadingType.Hide) {
    if (!Account.isLogin) return;
    if (showLoading) {
      Position.state.loading = true;
    }

    let payload = {};
    if (Position.state.positionCommissionType !== CommissionType.All) {
      payload = {
        type: Position.state.positionCommissionType,
      };
    }

    const res = await getSpotPositionListApi(payload);

    if (res.code === 200) {
      const { data } = res;
      Position.state.orderList = data;
      if (data.length !== Position.count) {
        Trade.getBalance();
        Position.count = data.length;
      }
    }

    if (showLoading) {
      Position.state.loading = false;
    }
  }
  /**
   * 拉取历史委托列表
   */
  public static async fetchOrderHistoryList() {
    if (!Account.isLogin) return;
    // Position.state.orderHistoryList = [];
    // Position.state.loading = true;

    let payload: any = {
      openTypes: '0,2',
    };

    if (Position.state.historyCommissionType !== CommissionType.All) {
      payload = {
        type: Position.state.historyCommissionType,
        ...payload,
      };
    }

    const res = await getSpotHistoryCommissionApi(payload);

    if (res.code === 200) {
      const {
        data: { list },
      } = res;
      Position.state.orderHistoryList = list;
    }

    Position.state.loading = false;
  }
  /**
   * 拉取历史成交列表
   */
  public static async fetchTradeHistoryList() {
    if (!Account.isLogin) return;
    // Position.state.tradeHistoryList = [];
    let [createTimeGe, createTimeLe] = <dayjs.Dayjs[]>[];
    const historyRange = Position.state.historyRange;
    switch (historyRange) {
      case HistoryRange.DAY:
        createTimeGe = dayjs().startOf('day');
        createTimeLe = dayjs().endOf('day');
        break;
      case HistoryRange.WEEK:
        createTimeGe = dayjs().startOf('week').add(1, 'd');
        createTimeLe = dayjs().endOf('week').add(1, 'd');
        break;
      case HistoryRange.MONTH:
        createTimeGe = dayjs().startOf('month');
        createTimeLe = dayjs().endOf('month');
        break;
      case HistoryRange.THREE_MONTH:
        createTimeGe = dayjs().subtract(2, 'month').startOf('month');
        createTimeLe = dayjs().endOf('month');
        break;
    }

    // Position.state.loading = true;

    const res = await getSpotHistoryDetailApi({
      openTypes: '0,2',
      createTimeGe: createTimeGe.format('YYYY-MM-DD HH:mm:ss'),
      createTimeLe: createTimeLe.format('YYYY-MM-DD HH:mm:ss'),
    });

    if (res.code === 200) {
      const {
        data: { list },
      } = res;
      Position.state.tradeHistoryList = list;
    } else {
      message.error(res.message);
    }

    Position.state.loading = false;
  }
  /**
   * 拉取现货资产列表
   */
  public static async fetchSpotAssetsList(showLoading = LoadingType.Hide) {
    if (!Account.isLogin) return;
    if (showLoading) {
      Position.state.loading = true;
      Position.state.spotAssetsList = [];
    }
    const res = await getSpotAssetApi();

    if (res.code === 200) {
      const { data } = res;
      Position.state.spotAssetsList = data;
    }
    if (showLoading) {
      Position.state.loading = false;
    }
  }
  /**
   * 拉取现货网格列表
   */
  public static async fetchSpotGridPositionList(showLoading = LoadingType.Hide) {
    if (!Account.isLogin) return;
    if (showLoading) {
      Position.state.loading = true;
      Position.state.spotGridList = [];
    }
    const res = await getSpotGridPositionListApi();

    if (res.code === 200) {
      const { data } = res;
      Position.state.spotGridList = data;
    }
    if (showLoading) {
      Position.state.loading = false;
    }
  }
  /**
   * 拉取现货定投列表
   */
  public static async fetchSpotInvestPositionList(showLoading = LoadingType.Hide) {
    if (!Account.isLogin) return;
    if (showLoading) {
      Position.state.loading = true;
      Position.state.spotInvestList = [];
    }
    const res = await getSpotInvestPositionListApi();

    if (res.code === 200) {
      const { data } = res;
      Position.state.spotInvestList = data;
    }
    if (showLoading) {
      Position.state.loading = false;
    }
  }
  /**
   * 改变 hideOrder
   */
  public static changeHideOrder(checked: boolean) {
    Position.state.hideOther = checked;
  }
  /**
   * 改变 hideRevoke
   */
  public static changeHideRevoke(checked: boolean) {
    Position.state.hideRevoke = checked;
  }
  /**
   * 改变 hideMinimal
   */
  public static changeHideMinimal(checked: boolean) {
    Position.state.hideMinimal = checked;
  }
  /**
   * 改变 historyRange
   */
  public static changeHistoryRange(val: HistoryRange) {
    Position.state.historyRange = val;
    Position.fetchTradeHistoryList();
  }
  /**
   * 重置 historyRange
   */
  public static resetHistoryRange() {
    Position.state.historyRange = HistoryRange.DAY;
  }
  /**
   * 改变 historyCommissionType
   */
  public static changeHistoryCommissionType(type: CommissionType) {
    Position.state.historyCommissionType = type;
    Position.fetchOrderHistoryList();
  }
  /**
   * 改变 positionCommissionType
   */
  public static changePositionCommissionType(type: CommissionType) {
    Position.state.positionCommissionType = type;
    Position.fetchPositionList();
  }

  /**
   * 重置 commissionType
   */
  public static resetCommissionType() {
    Position.state.historyCommissionType = CommissionType.All;
    Position.state.positionCommissionType = CommissionType.All;
  }
}
