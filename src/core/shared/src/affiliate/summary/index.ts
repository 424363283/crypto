import { getAffiliateBalanceApi, getAffiliateBarGraphDataApi, getAffiliateSummaryApi, getAffiliateSummaryCommissionApi, getAffiliateTradeDataApi, getAffiliateUserinfoApi, getAffiliateWithdrawListApi, postAffiliateWithdrawApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { state } from './state';
import { BarGraphDataItem, BarGraphDataType, BarGraphType, TradeTab } from './types';

export class Summary {
  public static state = state;
  // 初始化
  public static async init() {
    // Summary.onChangeBarGraphDateRangeValue(Summary.state.barGraphDateRangeValue);
    // Summary.onChangeTradeDateRangeValue(Summary.state.tradeDateRangeValue);
    // getAffiliateSummaryApi().then(({ data, code }) => {
    //   if (code === 200) {
    //     Summary.state.todayIncome = data.tcommission || 0;
    //     Summary.state.yesterdayIncome = data.ycommission || 0;
    //     Summary.state.totalIncome = data.hcommission || 0;
    //     Summary.state.invites = data.invites;
    //   }
    // });
    // getAffiliateSummaryCommissionApi().then(({ data: originData, code }) => {
    //   if (code === 200) {
    //     let data = originData.commissions;
    //     const total = data.reduce((prev, cur) => prev + cur.hcommissionValue, 0);
    //     data = data
    //       .sort((a, b) => b.hcommissionValue - a.hcommissionValue)
    //       .map((item) => {
    //         item.hcommissionValue = item.hcommissionValue > 0 ? Number(item.hcommissionValue.div(total).toFixed(3).mul(100)) : item.hcommissionValue;
    //         return item;
    //       });

    //     if (data.length >= 4) {
    //       const result = data.slice(0, 3);
    //       const sum = result.reduce((prev, cur) => prev + cur.hcommissionValue, 0);
    //       result.push({
    //         currency: LANG('其它'),
    //         hcommissionValue: Number(Number(100).sub(sum).toFixed(1)),
    //       });
    //       data = result;
    //     }
    //     if (data.length === 0) {
    //       data.push({
    //         currency: LANG('其它'),
    //         hcommissionValue: 0,
    //       });
    //     }
    //     Summary.state.totalIncomeArray = data;
    //   }
    // });
    // Summary.fetchBalance();
  }

  public static fetchUserInfo() {
    getAffiliateUserinfoApi().then(({ data, code }) => {
      if (code === 200) {
        Summary.state.swapRatio = data.swapRatio;
        Summary.state.spotRatio = data.spotRatio;
        Summary.state.username = data.username;
        Summary.state.uid = data.uid;
        Summary.state.refer = data.refer;
        Summary.state.avatar = data.avatar;
      }
    });
  }

  public static fetchBalance() {
    getAffiliateBalanceApi().then(({ data, code }) => {
      if (code === 200) {
        let map = new Map();
        let map2 = new Map();
        data.forEach((item) => {
          if (!map.has(item.currency)) {
            map.set(item.currency, item.balance);
            map2.set(item.currency, item.withdrawableBalance);
          }
        });
        Summary.state.balanceMap = map;
        Summary.state.withdrawableBalanceMap = map2;
      }
    });
  }

  public static handleOpenShareModal() {
    Summary.state.shareModalOpen = true;
  }

  public static handleCloseShareModal() {
    Summary.state.shareModalOpen = false;
  }

  public static handleOpenTransferModal() {
    Summary.state.transferModalOpen = true;
    Summary.onTransferCurrencyChanged(Summary.state.transferCurrency);
  }

  public static handleCloseTransferModal() {
    Summary.state.transferModalOpen = false;
  }

  public static handleOpenHistoryModal() {
    Summary.state.historyModalOpen = true;
    Summary.fetchWithdrawHistoryList();
  }

  public static handleCloseHistoryModal() {
    Summary.state.historyModalOpen = false;
  }

  // --start--: 累计数据相关
  public static onChangeBarGraphCurrency(val: string) {
    Summary.state.barGraphCurrency = val;
    Summary.fetchBarGraphData();
  }

  public static onChangeBarGraphDateRangeValue(val: number) {
    Summary.state.barGraphDateRangeValue = val;
    Summary.state.barGraphDateRangeEnd = dayjs().format('YYYY-MM-DD');
    Summary.state.barGraphDateRangeStart = dayjs()
      .subtract(val - 1, 'day')
      .format('YYYY-MM-DD');
    Summary.fetchBarGraphData();
  }

  public static onChangeBarGraphDateRangePicker(_: any, dateString: [string, string]) {
    Summary.state.barGraphDateRangeStart = dateString[0] ? dateString[0] : null;
    Summary.state.barGraphDateRangeEnd = dateString[1] ? dateString[1] : null;
    Summary.fetchBarGraphData();
  }

  public static async fetchBarGraphData() {
    const { barGraphCurrency, barGraphDateRangeStart, barGraphDateRangeEnd, barGraphType } = Summary.state;
    if (barGraphDateRangeStart && barGraphDateRangeEnd) {
      const {
        data: { data1: list1, data2: list2, sum1, sum2 },
      } = await getAffiliateBarGraphDataApi(barGraphType, barGraphCurrency, barGraphDateRangeStart, barGraphDateRangeEnd);

      if (list1?.length > 0 && list2?.length > 0 && list1?.length === list2?.length) {
        let data: BarGraphDataItem[] = [];
        list1.forEach((item, index) => {
          let obj = <BarGraphDataItem>{};
          obj.value1 = item.value;
          obj.value2 = list2[index].value;
          obj.date = item.date;
          data.push(obj);
        });

        // 选择90天时，合并一个周的数据
        if (Summary.state.barGraphDateRangeValue === 90) {
          let combineData: BarGraphDataItem[] = [];
          let temp = <BarGraphDataItem>{};

          data.forEach((item, index) => {
            if (dayjs(item.date).day() === 1) {
              temp.date = item.date;
              temp.value1 = item.value1;
              temp.value2 = item.value2;
            } else {
              if (temp?.date) {
                temp.value1 += item.value1;
                temp.value2 += item.value2;
                if (dayjs(item.date).day() === 0) {
                  combineData.push(temp);
                  temp = <BarGraphDataItem>{};
                }
              }
            }
            if (index === data.length - 1) {
              combineData.push(temp);
            }
          });
          data = combineData;
        }
        Summary.state.barGraphData = [...data];
      }
      Summary.state.barGraphDirectSum = sum1;
      Summary.state.barGraphAllSum = sum2;
    }
  }

  public static onChangeBarGraphType(val: BarGraphType) {
    Summary.state.barGraphType = val;
    Summary.fetchBarGraphData();
  }
  // --end--: 累计数据相关

  // --start--: 交易详情数据相关
  public static onClickTradeType(val: TradeTab) {
    Summary.state.tradeTabValue = val;
    Summary.fetchTradeData();
  }

  public static onChangeTradeCurrency(val: string) {
    Summary.state.tradeCurrency = val;
    Summary.fetchTradeData();
  }

  public static onChangeTradeDateRangeValue(val: number) {
    Summary.state.tradeDateRangeValue = val;
    Summary.state.tradeDateRangeEnd = dayjs().format('YYYY-MM-DD');
    Summary.state.tradeDateRangeStart = dayjs()
      .subtract(val - 1, 'day')
      .format('YYYY-MM-DD');
    Summary.fetchTradeData();
  }

  public static onChangeTradeDateRangePicker(_: any, dateString: [string, string]) {
    Summary.state.tradeDateRangeStart = dateString[0] ? dateString[0] : null;
    Summary.state.tradeDateRangeEnd = dateString[1] ? dateString[1] : null;
    Summary.fetchTradeData();
  }

  public static async fetchTradeData() {
    const { tradeCurrency, tradeDateRangeStart, tradeDateRangeEnd, tradeTabValue } = Summary.state;
    if (tradeDateRangeStart && tradeDateRangeEnd) {
      const {
        data: { data1: list1, data2: list2 },
      } = await getAffiliateTradeDataApi(tradeTabValue, tradeCurrency, tradeDateRangeStart, tradeDateRangeEnd);
      Summary.state.directList = list1 ? list1 : [];
      Summary.state.teamList = list2 ? list2 : [];

      if (list1?.length > 0 && list2?.length > 0 && list1?.length === list2?.length) {
        let data: BarGraphDataItem[] = [];
        list1.forEach((item, index) => {
          let obj = <BarGraphDataItem>{};
          obj.value1 = item.amount;
          obj.value2 = list2[index].amount;
          obj.date = item.date;
          data.push(obj);
        });
        Summary.state.tradeData = [...data];
      }
    }
  }

  public static onChangeTradeDetailType(val: BarGraphDataType) {
    Summary.state.tradeDetailType = val;
    Summary.state.tradeListPage = 1;
  }

  public static onChangeTradeDetailPage(val: number) {
    Summary.state.tradeListPage = val;
  }
  // --end--: 交易详情数据相关

  public static onTransferCurrencyChanged(val: string) {
    Summary.state.transferCurrency = val;
    Summary.onTransferValueChanged('');

    Summary.state.transferCurrentCurrencyBalance = Summary.state.balanceMap.get(Summary.state.transferCurrency) !== undefined ? Summary.state.balanceMap.get(Summary.state.transferCurrency) : 0;
    Summary.state.transferWithdrawableBalance = Summary.state.withdrawableBalanceMap.get(Summary.state.transferCurrency) !== undefined ? Summary.state.withdrawableBalanceMap.get(Summary.state.transferCurrency) : 0;
  }

  public static onTransferValueChanged(val: string) {
    Summary.state.transferValue = val;
  }

  // 代理中心——提现
  public static onWithdrawBtnClicked() {
    postAffiliateWithdrawApi(Summary.state.transferCurrency, Number(Summary.state.transferValue)).then(({ code, message: msg }) => {
      if (code === 200) {
        message.success(LANG('操作成功'));
        Summary.fetchBalance();
        Summary.handleCloseTransferModal();
      } else {
        message.error(msg);
      }
    });
  }

  // 代理中心——转账历史记录
  public static fetchWithdrawHistoryList() {
    getAffiliateWithdrawListApi(Summary.state.historyPage).then(({ data: { list, count }, code }) => {
      if (code === 200) {
        Summary.state.historyList = list;
        Summary.state.historyListTotal = count;
      }
    });
  }

  public static onPageChange = (val: number) => {
    Summary.state.historyPage = val;
    Summary.fetchWithdrawHistoryList();
  };

  public static onInviteTypeChange(val: string) {
    Summary.state.inviteType = val;
  }
}
