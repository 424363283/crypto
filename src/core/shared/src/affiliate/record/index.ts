import { Loading } from '@/components/loading';
import { getRecordListApi } from '@/core/api';
import dayjs from 'dayjs';
import { TIME_TAB, TYPES, state } from './state';

export class Record {
  public static state = state;

  public static onUidChange = (val: string) => {
    Record.state.uid = val;
  };

  public static onTypeChange = (val: TYPES) => {
    Record.state.type = val;
  };

  public static onNameChange = (val: string) => {
    Record.state.sname = val;
  };

  public static onTimeRangeChange = (val: TIME_TAB) => {
    Record.state.timeTab = val;
    if (val === TIME_TAB.TODAY) {
      Record.state.dateGe = dayjs().startOf('day').format('YYYY-MM-DD');
      Record.state.dateLe = dayjs().endOf('day').format('YYYY-MM-DD');
    } else if (val === TIME_TAB.ONE_WEEK) {
      Record.state.dateGe = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
      Record.state.dateLe = dayjs().endOf('day').format('YYYY-MM-DD');
    } else if (val === TIME_TAB.ONE_MONTH) {
      Record.state.dateGe = dayjs().subtract(29, 'day').format('YYYY-MM-DD');
      Record.state.dateLe = dayjs().endOf('day').format('YYYY-MM-DD');
    }
  };

  public static fetchRecordLinkList = () => {
    Loading.start();
    let payload: any = {
      sid: Record.state.uid,
      type: Record.state.type,
      sname: Record.state.sname,
      dateGe: dayjs(Record.state.dateGe).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dateLe: dayjs(Record.state.dateLe).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      page: Record.state.page,
      rows: 10,
    };

    try {
      getRecordListApi(payload)
        .then(({ data, code }) => {
          if (code === 200) {
            if (data.list.length > 0) {
              data.list = data.list.map((item: any, index: number) => {
                item.index = (Record.state.page - 1) * 10 + index + 1;
                return item;
              });
              Record.state.recordList = data.list;
            } else {
              Record.state.recordList = [];
            }
            Record.state.recordListTotal = data.count;
          }
        })
        .finally(() => {
          Loading.end();
        });
    } catch (err) {
      Record.state.recordList = [];
      Record.state.recordListTotal = 0;
      Loading.end();
    }
  };

  public static onPageChange = (page: number) => {
    Record.state.page = page;
    Record.fetchRecordLinkList();
  };

  public static onChangeTradeDateRangePicker(_: any, dateString: [string, string]) {
    Record.state.dateGe = dateString[0] ? dateString[0] : null;
    Record.state.dateLe = dateString[1] ? dateString[1] : null;
  }
}
