import { Loading } from '@/components/loading';
import { closeLiteOrderApi, getLiteHistoryApi, getLitePlanOrdersApi, getLitePositionApi, liteAddMarginApi, liteAutoAddMarginApi, liteReverseOpenOrderApi, liteShiftStopLossApi, liteUpdateTPSLApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES } from '@/core/network';
import { Polling, getPlatform, message } from '@/core/utils';
import { Account } from '../../account';
import { Assets } from '../../account/assets';
import { MarketsMap } from '../../markets/types';
import { TradeMap } from '../../trade/trade-map';
import { Trade } from '../trade';
import { AccountType, PositionSide } from '../trade/types';
import { state } from './state';
import { InAssetsType, LiteListItem, LiteTabType, LoadingType } from './types';

export class Position {
  public static state = state;

  // 是否初始化
  private static isInitialized = false;

  public static pollingPosition = new Polling({
    interval: 2000,
    callback: Position.fetchPositionList,
  });

  public static pollingPending = new Polling({
    interval: 2000,
    callback: Position.fetchPendingList,
  });

  public static async init(inAssets = InAssetsType.NotInAssets) {
    if (Account.isLogin && !Position.isInitialized) {
      Position.dispatchWsListener();
      Position.getContractInfo();
      // 初始化时开始轮询更新持仓列表
      Position.pollingPosition.start();
      Position.pollingPending.start();
      Position.isInitialized = true;
      Position.state.inAssets = inAssets;
    }
  }

  // 销毁
  public static destroy() {
    window.removeEventListener(SUBSCRIBE_TYPES.ws3001, Position.onWs3001 as any);
    Position.isInitialized = false;
    Position.pollingPosition.stop();
    Position.pollingPending.stop();
  }

  // 发起监听3001
  private static dispatchWsListener() {
    window.removeEventListener(SUBSCRIBE_TYPES.ws3001, Position.onWs3001 as any);
    window.addEventListener(SUBSCRIBE_TYPES.ws3001, Position.onWs3001 as any);
  }

  // 监听 3001 的方法
  private static onWs3001({ detail: marketsMap }: CustomEvent<MarketsMap>) {
    Position.state.marketMap = { ...marketsMap };
    let profit = 0;
    Position.state.positionList.forEach((item: LiteListItem) => {
      const { buy, opPrice, lever, margin, commodity } = item;
      const price = marketsMap[commodity]?.price;
      const income = FORMULAS.LITE_POSITION.positionProfitAndLoss(buy ? PositionSide.LONG : PositionSide.SHORT, price, opPrice, lever, margin);
      profit = Number(income.toFixed(2).add(profit));
    });
    Trade.setFloatingProfit(profit);
  }

  /**
   * 拉取实盘持仓列表
   */
  public static async fetchPositionList(showLoading = LoadingType.Hide) {
    if (showLoading) {
      Position.state.loading = true;
    }
    const params = {
      standard: Trade.state.accountType !== AccountType.SIMULATED,
    };

    const { code, data } = await getLitePositionApi(params);

    if (code === 200) {
      // 在资产页面不区分账户类型
      if (Position.state.inAssets) {
        Position.state.positionList = data;
      } else {
        // 选择体验金账户时，列表需要过滤掉 未使用体验金 的数据
        if (Trade.state.accountType === AccountType.TRIAL) {
          Position.state.positionList = data.filter(({ bonusId }) => bonusId !== '0');
        } else {
          Position.state.positionList = data.filter(({ bonusId }) => bonusId === '0');
        }
      }
    }
    if (showLoading) {
      Position.state.loading = false;
    }
    Assets.getLiteOccupiedBalance(Position.state.positionList).then((occupiedMargin) => {
      Trade.setOccupiedMargin(occupiedMargin);
    });
  }

  /**
   * 拉取计划委托列表
   */
  public static async fetchPendingList(showLoading = LoadingType.Hide) {
    if (showLoading) {
      Position.state.loading = true;
    }

    const { code, data } = await getLitePlanOrdersApi();

    if (code === 200) {
      Position.state.pendingList = data.filter((v) => v.state === 0);
    }
    if (showLoading) {
      Position.state.loading = false;
    }
  }

  /**
   * 拉取历史成交记录
   */
  public static async fetchHistoryList() {
    if (Account.isLogin) {
      Position.state.historyList = [];
      Position.state.loading = true;

      const params = {
        standard: Trade.state.accountType !== AccountType.SIMULATED,
        size: 20,
        commodityZone: 'crypto',
      };

      const { code, data } = await getLiteHistoryApi(params);

      if (code === 200) {
        // 在资产页面不区分账户类型
        if (Position.state.inAssets) {
          Position.state.historyList = data;
        } else {
          // 如果选择的是资金流水 tab，那么不对 是否使用了体验金 进行过滤
          if (Position.state.selectedTab === LiteTabType.FUNDS) {
            Position.state.historyList = data;
          } else {
            // 选择体验金账户时，列表需要过滤掉 未使用体验金 的数据
            if (Trade.state.accountType === AccountType.TRIAL) {
              Position.state.historyList = data.filter(({ bonusId }) => bonusId !== '0');
            } else {
              Position.state.historyList = data.filter(({ bonusId }) => bonusId === '0');
            }
          }
        }
      }
      Position.state.loading = false;
    }
  }

  /**
   * 改变 tab
   */
  public static changeSelectedTab(tab: LiteTabType) {
    Position.state.selectedTab = tab;
    Position.updateCurrentListData();
  }

  /**
   * 改变 hideOrder
   */
  public static changeHideOrder(checked: boolean) {
    Position.state.hideOther = checked;
  }

  /**
   * 改变 tab 时拉取数据
   */
  public static updateCurrentListData() {
    switch (Position.state.selectedTab) {
      case LiteTabType.HISTORY:
      case LiteTabType.FUNDS:
        Position.fetchHistoryList();
        break;
    }
  }

  /**
   * 改变分享弹窗里的数据
   */
  public static setShareModalData(data: LiteListItem | null) {
    Position.state.shareModalData = data;
  }

  /**
   * 改变设置弹窗里的数据
   */
  public static setSettingModalData(data: LiteListItem | null) {
    Position.state.settingModalData = data;
  }

  /**
   * 改变增加保证金弹窗里的数据
   */
  public static setAddMarginModalData(data: LiteListItem | null) {
    Position.state.addMarginModalData = data;
  }

  /**
   * 根据当前价算出某一笔订单的盈亏和收益比
   */
  public static calculateIncome(data: LiteListItem, marketMap: MarketsMap | null) {
    if (!marketMap) {
      return { income: 0, incomeRate: 0 };
    }
    const { commodity, buy, opPrice, lever, margin, takeProfit, stopLoss } = data;
    const price = marketMap[commodity]?.price || 0;

    let income = FORMULAS.LITE_POSITION.positionProfitAndLoss(buy ? PositionSide.LONG : PositionSide.SHORT, price, opPrice, lever, margin);
    income = Math.min(takeProfit, Math.max(stopLoss, income));
    const incomeRate = Number(income.div(margin).mul(100)) || 0;
    return { income, incomeRate };
  }

  /**
   * 获取当前订单的止盈价和强平价
   */
  public static calculateProfitAndLoss(data: LiteListItem, takeProfitRate?: number, stopLossRate?: number, newLever?: number) {
    const { buy, lever, margin, opPrice, takeProfit, stopLoss } = data;
    takeProfitRate = takeProfitRate ?? Number(takeProfit.div(margin));
    stopLossRate = stopLossRate ?? Number(stopLoss.div(margin));
    newLever = newLever ?? lever;

    const Fprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(buy ? PositionSide.LONG : PositionSide.SHORT, opPrice, takeProfitRate, newLever);
    const Lprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(buy ? PositionSide.LONG : PositionSide.SHORT, opPrice, stopLossRate, newLever);

    return { Fprice, Lprice };
  }

  /**
   * 根据 开仓价 和 止盈止损金额 获取当前订单可以设置的止盈止损价格范围
   */
  public static calculatePriceRange(data: LiteListItem, stopProfitRange: number[], stopLossRange: number[]) {
    const { buy, lever, opPrice } = data;
    const [maxFRate, minFRate] = [stopProfitRange[stopProfitRange.length - 1], stopProfitRange[0]];
    const [maxLRate, minLRate] = [stopLossRange[stopLossRange.length - 1], stopLossRange[0]];

    const maxFprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(buy ? PositionSide.LONG : PositionSide.SHORT, opPrice, maxFRate, lever);
    const minFprice = FORMULAS.LITE_POSITION.positionCalculateProfitPrice(buy ? PositionSide.LONG : PositionSide.SHORT, opPrice, minFRate, lever);
    const maxLprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(buy ? PositionSide.LONG : PositionSide.SHORT, opPrice, maxLRate, lever);
    const minLprice = FORMULAS.LITE_POSITION.positionCalculateStopPrice(buy ? PositionSide.LONG : PositionSide.SHORT, opPrice, minLRate, lever);

    return { maxFprice, minFprice, maxLprice, minLprice };
  }

  /**
   * 根据 保证金 和 止盈止损范围 获取当前订单可以设置的止盈价格范围
   */
  public static calculateAmountRange(margin: number, stopProfitRange: number[], stopLossRange: number[]) {
    const [maxFRate, minFRate] = [stopProfitRange[stopProfitRange.length - 1], stopProfitRange[0]];
    const [maxLRate, minLRate] = [stopLossRange[0], stopLossRange[stopLossRange.length - 1]];

    const maxFAmount = Number(margin.mul(maxFRate));
    const minFAmount = Number(margin.mul(minFRate));
    const maxLAmount = Number(margin.mul(maxLRate));
    const minLAmount = Number(margin.mul(minLRate));

    return { maxFAmount, minFAmount, maxLAmount, minLAmount };
  }

  /**
   * 按止盈止损价计算当前订单的止盈止损比例
   */
  public static calculateFRateByFPrice(data: LiteListItem, Fprice: number, Lprice: number) {
    const { buy, lever, opPrice } = data;

    const FRate = FORMULAS.LITE_POSITION.positionCalculateFRateByFPrice(buy ? PositionSide.LONG : PositionSide.SHORT, Fprice, opPrice, lever);
    const LRate = FORMULAS.LITE_POSITION.positionCalculateLRateByLPrice(buy ? PositionSide.LONG : PositionSide.SHORT, Lprice, opPrice, lever);

    return { FRate, LRate };
  }

  /**
   * 按 id 单个平仓
   */
  public static async closePositionById(id: string) {
    Loading.start();
    const res = await closeLiteOrderApi({ id });
    if (res.code === 200) {
      message.success(LANG('操作成功'));
      // 平仓成功，刷新余额
      Trade.getBalance();
      // 平仓成功，立即拉取列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  }

  /**
   * 按 ids 一键平仓
   */
  public static async batchClosePositionByIds() {
    Loading.start();
    const { positionList, hideOther } = Position.state;
    const ids = positionList.filter(({ commodity }) => (hideOther ? commodity === Trade.state.id : true)).map(({ id }) => id);
    const res = await closeLiteOrderApi({ ids });
    if (res.code === 200) {
      const { successNum, failureNum } = res.data;
      message.success(
        LANG(`平仓成功{successNumber}单，失败{failNumber}单`, {
          successNumber: successNum,
          failNumber: failureNum,
        })
      );
      // 平仓成功，刷新余额
      Trade.getBalance();
      // 平仓成功，立即拉取列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  }

  /**
   * 按 id 修改止盈止损比列
   */
  public static async updateTPSL(id: string, takeProfit: number, stopLoss: number) {
    Loading.start();
    const res = await liteUpdateTPSLApi({ id, takeProfit, stopLoss });
    if (res.code === 200) {
      message.success(LANG('订单设置成功'));
      // 更新成功，立即拉取列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  }

  /**
   * 计算当前订单可增加的最大保证金
   */
  public static async calculateMaxMargin(data: LiteListItem, lever: number, maxMargin: number) {
    const { maxAmountOne } = Trade.state;
    const { volume, opPrice, margin } = data;
    if (maxAmountOne) {
      return Math.min(Number(volume.mul(opPrice).div(lever).sub(margin).toFixed(2)), Number(maxAmountOne.div(lever).sub(margin)));
    } else {
      return Math.min(Number(volume.mul(opPrice).div(lever).sub(margin).toFixed(2)), Number(maxMargin.sub(margin)));
    }
  }

  /**
   * 追加保证金
   */
  public static async addMargin(id: string, margin: number) {
    Loading.start();
    const res = await liteAddMarginApi({ id, margin });
    if (res.code === 200) {
      message.success(LANG('追加保证金成功'));
      // 刷新余额
      Trade.getBalance();
      // 更新成功，立即拉取列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  }

  /**
   * 反向开仓
   */
  public static async reverseOpenOrder(id: string) {
    Loading.start();
    const res = await liteReverseOpenOrderApi({ positionId: id, platform: getPlatform() });
    if (res.code === 200) {
      message.success(LANG('操作成功'));
      // 平仓成功，立即拉取列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  }

  /**
   * 自动追加保证金
   */
  public static async autoAddMargin(id: string, auto: boolean, margin: number) {
    // 如果弹窗里还修改了保证金，那么就把 UI 逻辑的控制放到 Position.addMargin 去处理，否则在这边处理
    if (margin > 0) {
      liteAutoAddMarginApi({ id, auto });
    } else {
      Loading.start();
      const res = await liteAutoAddMarginApi({ id, auto });
      if (res.code === 200) {
        message.success(LANG('操作成功'));
        // 操作成功，立即拉取列表数据
        Position.fetchPositionList(LoadingType.Show);
      } else {
        message.error(res.message || LANG('系统繁忙，请稍后再试'));
      }
      Loading.end();
    }
  }

  /**
   * 拉取简单合约商品 map
   */
  public static async getContractInfo() {
    const liteTradeMap = await TradeMap.getLiteTradeMap();
    Position.state.liteTradeMap = liteTradeMap;
  }

  /**
   * 设置移动止损
   */
  public static async setShiftStopLoss(data: { id: string; price: number; offset: number }) {
    Loading.start();
    const res = await liteShiftStopLossApi(data);
    if (res.code === 200) {
      message.success(LANG('操作成功'));
      // 操作成功，立即拉取列表数据
      Position.fetchPositionList(LoadingType.Show);
    } else {
      message.error(res.message || LANG('系统繁忙，请稍后再试'));
    }
    Loading.end();
  }
}
