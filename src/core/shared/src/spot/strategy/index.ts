import { getSpotAssetApi, getTradeGridAiListApi, getTradeGridSymbolsApi, getTradeInvestSymbolsApi, postTradeCreateInvestStrategyApi, postTradeUpdateInvestStrategyApi } from '@/core/api';
import { Account } from '../../account';
import { LIST_TYPE } from '../position/types';
import { state } from './state';
import { CREATE_TYPE } from './types';
// 现货网格交易逻辑
export class Strategy {
  public static state = state;

  public static async init(id = '') {
    await this.getGridSymbols(id);
    this.getInvestSymbols();
    if (id) {
      this.getGridAiList(id);
    }
    if (id) {
      const [baseCoin, quoteCoin] = id.split('_');
      Strategy.state.baseCoin = baseCoin;
      Strategy.state.quoteCoin = quoteCoin;
    }
    if (Account.isLogin) {
      await this.getBalance();
    }
  }
  // 获取现货网格支持列表
  public static async getGridSymbols(id = '') {
    try {
      getTradeGridSymbolsApi().then(({ data, code }) => {
        if (code === 200) {
          Strategy.state.symbolList = data;
          let findItem = Strategy.state.symbolList.find((item) => item.symbol === id);
          Strategy.state.currentQuoteInfo = findItem;
        }
      });
    } catch (err) {
      Strategy.state.symbolList = [];
    }
  }
  // 获取现货定投支持列表
  public static async getInvestSymbols() {
    try {
      getTradeInvestSymbolsApi().then(({ data, code }) => {
        if (code === 200) {
          Strategy.state.investSymbolList = data;
          data.forEach((item: any) => {
            Strategy.state.investSymbolMap.set(item.symbol, item);
          });
        }
      });
    } catch (err) {
      Strategy.state.investSymbolList = [];
    }
  }
  // 获取现货网格AI列表
  public static async getGridAiList(id = '') {
    try {
      getTradeGridAiListApi(id).then(({ data, code }) => {
        if (code === 200) {
          Strategy.state.aiList = data;
        }
      });
    } catch (err) {
      Strategy.state.aiList = [];
    }
  }
  // 获取现货账户余额
  public static async getBalance(coin = '') {
    try {
      const res = await getSpotAssetApi();
      if (res.code === 200) {
        const { data: spotList } = res;
        const quoteCoinItem = spotList?.find((item) => item.currency === (coin ? coin : Strategy.state.quoteCoin));
        Strategy.state.balance = quoteCoinItem?.balance || 0;
      }
    } catch (err) {
      Strategy.state.balance = 0;
    }
  }
  // 现货网格是否支持该币对
  public static isSupportSymbol(symbol: string) {
    return Strategy.state.symbolList.findIndex((item) => item.symbol === symbol) > -1;
  }
  // 选择交易类型现货
  public static changeSelectType(type: LIST_TYPE | null) {
    Strategy.state.selectType = type;
  }
  // 选择创建类型
  public static changeCreateType(type: CREATE_TYPE) {
    Strategy.state.createType = type;
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

  // 创建定投策略
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

  // 设置网格下单高级参数折叠状态
  public static setCollapse(collapse: boolean) {
    Strategy.state.collapse = collapse;
  }

  // 修改币种列表数据
  public static changeInvestDataList(
    list: {
      symbol: string;
      amount: number | string;
    }[]
  ) {
    Strategy.state.investDataList = list;
  }

  // 修改定投币种列表
  public static changeInvestSymbolStringList(list: string[]) {
    Strategy.state.investSymbolStringList = list;
  }

  // 设置定投周期
  public static setPeriod(period: number) {
    Strategy.state.period = period;
  }

  // 设置定投标题
  public static setTitle(title: string) {
    Strategy.state.title = title;
  }

  // 设置移动端下单弹窗显示状态
  public static changeMobileStrategyModalVisible(bol: boolean) {
    Strategy.state.mobileStrategyModalVisible = bol;
  }
}
