import { Loading } from '@/components/loading';
import { getAffiliateUserListApi } from '@/core/api';
import { message } from '@/core/utils';
import dayjs, { Dayjs } from 'dayjs';
import { state } from './state';

export class UserDetail {
  public static state = state;

  public static onUidChange = (val: string) => {
    UserDetail.state.uid = val;
  };

  public static defaultFilterModalData = {
    username: '',
    source: '',
    currency: 'USDT',
    dateRangeValue: 7,
  };

  public static onSearchBtnClicked = () => {
    UserDetail.fetchList();
  };

  public static handleOpenFilterModal() {
    UserDetail.state.filterModalOpen = true;
  }

  public static handleCloseFilterModal() {
    UserDetail.state.filterModalOpen = false;
    UserDetail.state.username = UserDetail.defaultFilterModalData.username;
    UserDetail.state.source = UserDetail.defaultFilterModalData.source;
    UserDetail.state.currency = UserDetail.defaultFilterModalData.currency;
    UserDetail.state.dateRangeValue = UserDetail.defaultFilterModalData.dateRangeValue;
  }

  public static onChangeTradeDateRangePicker(_: any, dateString: [string, string]) {
    UserDetail.state.dateRangeStart = dateString[0] ? dateString[0] : null;
    UserDetail.state.dateRangeEnd = dateString[1] ? dateString[1] : null;
    UserDetail.fetchList();
  }
  public static async fetchList() {
    const { uid, dateRangeStart, dateRangeEnd, page, source, username, currency } = state;
    if (dateRangeStart && dateRangeEnd) {
      Loading.start();
      getAffiliateUserListApi(source, currency, dateRangeStart, dateRangeEnd, uid, username, page)
        .then(({ data, code, message: msg }) => {
          if (code === 200) {
            UserDetail.state.userList = data?.list;
            UserDetail.state.total = data?.count;
          } else if (code === 510) {
            message.error(msg);
          }
        })
        .finally(() => {
          Loading.end();
        });
    }
  }
  public static onPageChange = (val: number) => {
    UserDetail.state.page = val;
    UserDetail.fetchList();
  };

  public static onUsernameChange = (val: string) => {
    UserDetail.state.username = val;
  };

  public static onSourceChange = (val: string) => {
    UserDetail.state.source = val;
  };

  public static onCurrencyChange = (val: string) => {
    UserDetail.state.currency = val;
  };

  public static onDateRangeValueChange = (val: number, immediate = false) => {
    UserDetail.state.dateRangeValue = val;
    if (immediate) {
      UserDetail.state.dateRangeEnd = dayjs().format('YYYY-MM-DD');
      UserDetail.state.dateRangeStart = dayjs()
        .subtract(UserDetail.state.dateRangeValue - 1, 'day')
        .format('YYYY-MM-DD');
    }
  };

  public static onStartDateChange = (val: Dayjs | null) => {
    UserDetail.state.dateRangeStart = val ? dayjs(val).format('YYYY-MM-DD') : null;
  };

  public static onEndDateChange = (val: Dayjs | null) => {
    UserDetail.state.dateRangeEnd = val ? dayjs(val).format('YYYY-MM-DD') : null;
  };

  public static onFilterModalConfirmClicked = (inMobile = false) => {
    UserDetail.defaultFilterModalData = {
      username: UserDetail.state.username,
      source: UserDetail.state.source,
      currency: UserDetail.state.currency,
      dateRangeValue: UserDetail.state.dateRangeValue,
    };
    if (!inMobile) {
      UserDetail.state.dateRangeEnd = dayjs().format('YYYY-MM-DD');
      UserDetail.state.dateRangeStart = dayjs()
        .subtract(UserDetail.state.dateRangeValue - 1, 'day')
        .format('YYYY-MM-DD');
    }
    UserDetail.state.filterModalOpen = false;
    UserDetail.fetchList();
  };
}
