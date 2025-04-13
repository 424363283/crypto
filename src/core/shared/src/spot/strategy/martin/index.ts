// import { getTradeMartinSymbolsApi, postTradeCreateMartinStrategyApi } from '@/core/api';
import { FORMULAS } from '@/core/formulas';
import { state } from './state';
// 现货网格交易逻辑
export class Martin {
  public static state = state;

  public static async init() {
    this.getMartinSymbols();
    this.resetMartinData();
  }
  // 获取马丁支持列表
  public static async getMartinSymbols() {
    try {
    //   getTradeMartinSymbolsApi().then(({ data, code }) => {
    //     if (code === 200) {
    //       Martin.state.martinSymbolList = data;
    //     }
    //   });
    } catch (err) {
      Martin.state.martinSymbolList = [];
    }
  }

  // 创建马丁策略
  public static async createMartin(params: { symbol: string; triggerRate: number; tpRate: number; initQuote: number; safetyQuote: number; safetyCount: number; triggerPrice: number; safetyPriceRate: number; safetyQuoteRate: number; slRate: number; copyId?: string }) {
    try {
        return {
            code: 500,
            message: e.message,
          };
    //   return await postTradeCreateMartinStrategyApi({ ...params });
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  }

  // 设置当前所选的币对配置
  public static fetchSymbolInfo(symbol: string) {
    Martin.state.symbolInfo = Martin.state.martinSymbolList.find((i) => i.symbol === symbol) || null;
  }

  // 修改马丁表单数据
  public static changeMartinData(params: any) {
    Martin.state.martinData = {
      ...Martin.state.martinData,
      ...params,
    };

    Martin.state.investAmount = FORMULAS.SPOT_MARTIN.getMartinInvestAmount(Number(Martin.state.martinData.initQuote), Number(Martin.state.martinData.safetyQuote), Number(Martin.state.martinData.safetyQuoteRate), Number(Martin.state.martinData.safetyCount));
  }

  // 重置马丁表单数据
  public static resetMartinData() {
    Martin.state.martinData = {
      ...Martin.state.martinData,
      symbol: '',
      copyId: '',
      copyIndex: 0,
      initQuote: '',
      triggerRate: 1,
      tpRate: 1.5,
      slRate: '',
      safetyQuote: '',
      safetyCount: 8,
      safetyPriceRate: 1,
      safetyQuoteRate: 1,
      triggerPrice: '',
    };
    Martin.setAdvancedVisible(false);
  }
  // 马丁是否支持该币对
  public static isSupportSymbol(symbol: string) {
    return Martin.state.martinSymbolList.findIndex((item) => item.symbol === symbol) > -1;
  }

  // 重置马丁表单数据
  public static setAdvancedVisible(visible: boolean) {
    Martin.state.advancedVisible = visible;
  }

  // 设置移动端下单弹窗显示状态
  public static changeMobileStrategyModalVisible(bol: boolean) {
    Martin.state.mobileStrategyModalVisible = bol;
  }
}
