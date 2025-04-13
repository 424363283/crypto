import { getTradeInvestSymbolsApi, postTradeCreateInvestStrategyApi, postTradeUpdateInvestStrategyApi } from '@/core/api';
import { state } from './state';
// 现货网格交易逻辑
export class Invest {
  public static state = state;

  public static async init() {
    this.getInvestSymbols();
  }

  // 获取现货定投支持列表
  public static async getInvestSymbols() {
    try {
      getTradeInvestSymbolsApi().then(({ data, code }) => {
        if (code === 200) {
          Invest.state.investSymbolList = data;
          data.forEach((item: any) => {
            Invest.state.investSymbolMap.set(item.symbol, item);
          });
        }
      });
    } catch (err) {
      Invest.state.investSymbolList = [];
    }
  }

  // 创建定投策略
  public static async createInvest(params: {
    title: string;
    period: number;
    copyId?: string;
    symbols: {
      symbol: string;
      amount: number | string;
    }[];
  }) {
    const payload = {
      ...params,
      stopSell: true,
    };
    try {
      return await postTradeCreateInvestStrategyApi(payload);
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  }

  // 更新定投策略
  public static async updateInvest(params: {
    planId: string;
    title: string;
    period: number;
    symbols: {
      symbol: string;
      amount: number | string;
    }[];
  }) {
    const payload = {
      ...params,
      stopSell: true,
    };
    try {
      return await postTradeUpdateInvestStrategyApi(payload);
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  }

  // 修改定投币种列表数据
  public static changeInvestDataList(
    list: {
      symbol: string;
      amount: number | string;
    }[]
  ) {
    Invest.state.investDataList = list;
  }

  // 修改定投币种列表
  public static changeInvestSymbolStringList(list: string[]) {
    Invest.state.investSymbolStringList = list;
  }

  // 设置定投周期
  public static setPeriod(period: number) {
    Invest.state.period = period;
  }

  // 设置定投标题
  public static setTitle(title: string) {
    Invest.state.title = title;
  }

  // 设置移动端下单弹窗显示状态
  public static changeMobileStrategyModalVisible(bol: boolean) {
    Invest.state.mobileStrategyModalVisible = bol;
  }
}
