import { Loading } from '@/components/loading';
import { getAffiliateStepsListApi, getAffiliateTeamsListApi, getAffiliateTradeDataApi, upgradeSpotRateApi, upgradeSwapRateApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import dayjs, { Dayjs } from 'dayjs';
import { TradeTab } from '../summary/types';
import { state } from './state';

export class Teams {
  public static state = state;

  public static onUidChange = (val: string) => {
    Teams.state.uid = val;
  };

  public static defaultFilterModalData = {
    username: '',
    type: TradeTab.Swap,
    ratio: 0,
    currency: 'USDT',
    dateRangeValue: 30,
  };

  public static onSearchBtnClicked = () => {
    Teams.onPageChange(1);
    Teams.fetchList();
  };

  public static handleOpenFilterModal() {
    Teams.state.filterModalOpen = true;
  }

  public static handleCloseFilterModal() {
    Teams.state.filterModalOpen = false;
    Teams.state.username = Teams.defaultFilterModalData.username;
    Teams.state.type = Teams.defaultFilterModalData.type;
    Teams.state.ratio = Teams.defaultFilterModalData.ratio;
    Teams.state.currency = Teams.defaultFilterModalData.currency;
    Teams.state.dateRangeValue = Teams.defaultFilterModalData.dateRangeValue;
  }

  public static handleOpenUpgradeModal() {
    Teams.state.upgradeModalOpen = true;
    Teams.state.upgradeUid = '';
    Teams.state.upgradeType = TradeTab.Spot;
    Teams.state.upgradeRatio = 0.05;
  }

  public static handleCloseUpgradeModal() {
    Teams.state.upgradeModalOpen = false;
  }

  public static onChangeTradeDateRangePicker(_: any, dateString: [string, string]) {
    Teams.state.dateRangeStart = dateString[0] ? dateString[0] : null;
    Teams.state.dateRangeEnd = dateString[1] ? dateString[1] : null;
    Teams.onPageChange(1);
    Teams.fetchList();
  }

  public static async fetchList() {
    const { uid, dateRangeStart, dateRangeEnd, page, username, currency, ratio, type, orderBy, order } = state;
    if (dateRangeStart && dateRangeEnd) {
      Loading.start();
      getAffiliateTeamsListApi(type, currency, dateRangeStart, dateRangeEnd, orderBy, order, uid, username, page, ratio === 0 ? '' : ratio)
        .then(({ data, code, message: msg }) => {
          if (code === 200) {
            Teams.state.userList = data?.list;
            Teams.state.total = data?.count;
          } else if (code === 510) {
            message.error(msg);
          }
        })
        .finally(() => {
          Loading.end();
        });
    }
  }

  public static async fetchStepsList() {
    getAffiliateStepsListApi()
      .then(({ data: { spot_steps, swap_steps }, code }) => {
        if (code === 200) {
          Teams.state.spotStepsList = spot_steps;
          Teams.state.swapStepsList = swap_steps;
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

  public static onPageChange = (val: number) => {
    Teams.state.page = val;
  };

  public static onUsernameChange = (val: string) => {
    Teams.state.username = val;
  };

  public static onCurrencyChange = (val: string) => {
    Teams.state.currency = val;
  };

  public static onTypeChange = (type: TradeTab) => {
    Teams.state.type = type;
  };

  public static onRatioChange = (ratio: number) => {
    Teams.state.ratio = ratio;
  };

  public static onDateRangeValueChange = (val: number, immediate = false) => {
    Teams.state.dateRangeValue = val;
    if (immediate) {
      Teams.state.dateRangeEnd = dayjs().format('YYYY-MM-DD');
      Teams.state.dateRangeStart = dayjs()
        .subtract(Teams.state.dateRangeValue - 1, 'day')
        .format('YYYY-MM-DD');
    }
  };

  public static onStartDateChange = (val: Dayjs | null) => {
    Teams.state.dateRangeStart = val ? dayjs(val).format('YYYY-MM-DD') : null;
  };

  public static onEndDateChange = (val: Dayjs | null) => {
    Teams.state.dateRangeEnd = val ? dayjs(val).format('YYYY-MM-DD') : null;
  };

  public static onOrderByChange = (orderBy: number) => {
    if (Teams.state.orderBy !== orderBy) {
      Teams.state.orderBy = orderBy;
      Teams.state.order = 'asc';
    } else {
      Teams.state.orderBy = orderBy;
      if (Teams.state.order === 'asc') {
        Teams.state.order = 'desc';
      } else if (Teams.state.order === 'desc') {
        Teams.state.order = '';
        Teams.state.orderBy = '';
      } else {
        Teams.state.order = 'asc';
      }
    }
    Teams.onPageChange(1);
    Teams.fetchList();
  };

  public static onOrderBySelect = (orderBy: number | string) => {
    if (Teams.state.orderBy !== orderBy) {
      if (orderBy === '') {
        Teams.state.orderBy = '';
        Teams.state.order = '';
      } else {
        Teams.state.orderBy = orderBy;
        Teams.state.order = 'asc';
      }
    } else {
      Teams.state.orderBy = orderBy;
      if (Teams.state.order === 'asc') {
        Teams.state.order = 'desc';
      } else if (Teams.state.order === 'desc') {
        Teams.state.order = '';
      } else {
        Teams.state.order = 'asc';
      }
    }
    Teams.onPageChange(1);
    Teams.fetchList();
  };

  public static onOrderChange = (order: string) => {
    Teams.state.order = order;
  };

  public static onFilterModalConfirmClicked = (inMobile = false) => {
    Teams.defaultFilterModalData = {
      username: Teams.state.username,
      type: Teams.state.type,
      ratio: Teams.state.ratio,
      currency: Teams.state.currency,
      dateRangeValue: Teams.state.dateRangeValue,
    };
    if (!inMobile) {
      Teams.state.dateRangeEnd = dayjs().format('YYYY-MM-DD');
      Teams.state.dateRangeStart = dayjs()
        .subtract(Teams.state.dateRangeValue - 1, 'day')
        .format('YYYY-MM-DD');
    }

    Teams.state.filterModalOpen = false;
    Teams.onPageChange(1);
    Teams.fetchList();
  };

  public static onUpgradeModalConfirmClicked = async () => {
    const isSpot = Teams.state.upgradeType === TradeTab.Spot;
    try {
      const result = await (isSpot ? upgradeSpotRateApi : upgradeSwapRateApi)(Teams.state.upgradeUid, Teams.state.upgradeRatio);
      if (result.code === 200) {
        Teams.handleCloseUpgradeModal();
        message.success(LANG('操作成功'));
        Teams.fetchList();
      }
      return result;
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  };

  public static onUpgradeUidChange = (val: string) => {
    Teams.state.upgradeUid = val;
  };

  public static onUpgradeTypeChange = (type: TradeTab) => {
    Teams.state.upgradeType = type;
  };

  public static onUpgradeRatioChange = (ratio: number) => {
    Teams.state.upgradeRatio = ratio;
  };

  public static onListExpandedRowsChange = (arr: string[]) => {
    Teams.state.listExpandedRows = arr;
  };

  public static getTradeDataByUid = async (uid: string) => {
    const {
      data: { data2: SpotList },
    } = await getAffiliateTradeDataApi(TradeTab.Spot, 'USDT', dayjs().subtract(89, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), uid);
    const {
      data: { data2: SwapList },
    } = await getAffiliateTradeDataApi(TradeTab.Swap, 'USDT', dayjs().subtract(89, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), uid);
    if (SpotList?.length > 0 && SwapList?.length > 0 && SpotList?.length === SwapList?.length) {
      let data: { value: number; date: string }[] = [];
      SpotList.forEach((item, index) => {
        let obj = <{ value: number; date: string }>{};
        obj.value = item.amount + SwapList[index].amount;
        obj.date = item.date;
        data.push(obj);
      });

      let combineData: { value: number; date: string }[] = [];
      let temp = <{ value: number; date: string }>{};

      data.forEach((item, index) => {
        if (dayjs(item.date).day() === 1) {
          temp.date = item.date;
          temp.value = item.value;
        } else {
          if (temp?.date) {
            temp.value += item.value;
            if (dayjs(item.date).day() === 0) {
              combineData.push(temp);
              temp = <{ value: number; date: string }>{};
            }
          }
        }
        if (index === data.length - 1) {
          combineData.push(temp);
        }
      });
      data = combineData;

      return data;
    }
    return [];
  };

  public static setNextLevelList = (arr: { uid: string; username: string }[]) => {
    Teams.state.nextLevelList = arr;
  };

  public static onFetchNextLevelData = (uid: string, username: string) => {
    Loading.start();
    Teams.setNextLevelList([...Teams.state.nextLevelList, { uid, username }]);
    const { page, currency, type, orderBy, order } = state;
    getAffiliateTeamsListApi(type, currency, dayjs().subtract(6, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), orderBy, order, '', '', page, '', uid)
      .then(({ data, code, message: msg }) => {
        if (code === 200) {
          Teams.state.userList = data?.list;
          Teams.state.total = data?.count;
        } else if (code === 510) {
          message.error(msg);
        }
      })
      .finally(() => {
        Loading.end();
      });
  };

  public static onFetchPrevLevelData = () => {
    Loading.start();
    let arr = Teams.state.nextLevelList.slice();
    arr.pop();
    Teams.setNextLevelList([...arr]);
    const { page, currency, type, orderBy, order } = state;
    getAffiliateTeamsListApi(type, currency, dayjs().subtract(6, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'), orderBy, order, '', '', page, '')
      .then(({ data, code, message: msg }) => {
        if (code === 200) {
          Teams.state.userList = data?.list;
          Teams.state.total = data?.count;
        } else if (code === 510) {
          message.error(msg);
        }
      })
      .finally(() => {
        Loading.end();
      });
  };
}
