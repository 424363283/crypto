import { getTradeGridAiListApi, getTradeGridSymbolsApi } from '@/core/api';
import { Strategy } from '..';
import { Account } from '../../../account';
import { state } from './state';
import { CREATE_TYPE } from './types';
// 现货网格交易逻辑
export class Grid {
  public static state = state;

  public static async init(id = '') {
    await this.getGridSymbols(id);
    if (id) {
      this.getGridAiList(id);

      const [baseCoin, quoteCoin] = id.split('_');
      Grid.state.baseCoin = baseCoin;
      Grid.state.quoteCoin = quoteCoin;
    }
    if (Account.isLogin) {
      await Strategy.getBalance();
    }
  }
  // 获取现货网格支持列表
  public static async getGridSymbols(id = '') {
    try {
      getTradeGridSymbolsApi().then(({ data, code }) => {
        if (code === 200) {
          Grid.state.symbolList = data;
          let findItem = Grid.state.symbolList.find((item) => item.symbol === id);
          Grid.state.currentQuoteInfo = findItem;
        }
      });
    } catch (err) {
      Grid.state.symbolList = [];
    }
  }
  // 获取现货网格AI列表
  public static async getGridAiList(id = '') {
    try {
      getTradeGridAiListApi(id).then(({ data, code }) => {
        if (code === 200) {
          Grid.state.aiList = data;
        }
      });
    } catch (err) {
      Grid.state.aiList = [];
    }
  }
  // 现货网格是否支持该币对
  public static isSupportSymbol(symbol: string) {
    return Grid.state.symbolList.findIndex((item) => item.symbol === symbol) > -1;
  }
  // 选择创建类型
  public static changeCreateType(type: CREATE_TYPE) {
    Grid.state.createType = type;
  }

  // 设置网格下单高级参数折叠状态
  public static setCollapse(collapse: boolean) {
    Grid.state.collapse = collapse;
  }

  // 设置移动端下单弹窗显示状态
  public static changeMobileStrategyModalVisible(bol: boolean) {
    Grid.state.mobileStrategyModalVisible = bol;
  }
}
