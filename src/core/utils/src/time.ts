import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

// 获取几天前
export const getDayDate = (dateTimeStamp: number) => {
  var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var now = new Date().getTime(); //获取当前时间毫秒
  var diffValue = now - dateTimeStamp; //时间差
  if (diffValue < 0) {
    return 0;
  }
  var dayC = diffValue / day;
  return parseInt(dayC + '');
};

interface DateRange {
  start?: string | dayjs.Dayjs;
  end?: string | dayjs.Dayjs;
}

export const getDayjsDateRange = (dateNow: Date, intervalDays?: number, isPastTime?: boolean): DateRange => {
  if (intervalDays === undefined) {
    return { start: undefined, end: undefined };
  }

  let list: dayjs.Dayjs[] = [];

  if (isPastTime) {
    list.push(
      dayjs(dateNow)
        .add(-1 * intervalDays, 'days')
        .startOf('day')
    );
    list.push(dayjs(dateNow).endOf('day'));
  } else {
    list.push(dayjs(dateNow).startOf('day'));
    list.push(dayjs(dateNow).add(intervalDays, 'days').endOf('day'));
  }

  return { start: list[0], end: list[1] };
};
/**
 *
 * @param dateNow 当前时间
 * @param intervalDays 间隔天数
 * @param isInCludeToday 是否包含当日
 * @returns- {start: 2023-4-25 00:00:00, end: 2023-5-9 23:59:59}
 */
export const getFormatDateRange = (dateNow: Date, intervalDays: number | undefined, isInCludeToday: boolean = true): { start: string | undefined; end: string | undefined } => {
  if (intervalDays === undefined) {
    return { start: undefined, end: undefined };
  }

  let oneDayTime = 24 * 60 * 60 * 1000;
  let list: string[] = [];

  let lastDay: Date;
  if (isInCludeToday) {
    lastDay = new Date(dateNow.getTime() - (intervalDays - 1) * oneDayTime);
    list.push(formatDateByType(lastDay, 'start'));
    list.push(formatDateByType(dateNow, 'end'));
  } else {
    lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
    list.push(formatDateByType(lastDay, 'start'));
    list.push(formatDateByType(new Date(dateNow.getTime() - oneDayTime), 'end')); // 不包含当日
  }

  return { start: list[0], end: list[1] };
};
// 如果type参数为start，则输出的字符串形式为YYYY-MM-DD 00:00:00，如果type参数为end，则输出的字符串形式为YYYY-MM-DD 23:59:59。
export const formatDateByType = (time: Date, type: 'start' | 'end'): string => {
  let year = time.getFullYear();
  let month: number = time.getMonth() + 1; // 将 month 的初始值设置为数字类型
  let day: number = time.getDate(); // 将 day 的初始值设置为数字类型
  if (month < 10) {
    month = 0 + month;
  }
  if (day < 10) {
    day = 0 + day;
  }
  const timeString = {
    start: '00:00:00',
    end: '23:59:59',
  };
  return `${year}-${month}-${day} ${timeString[type]}`;
};
/**
 * 将本地dayjs转换后的时间字符串换算东八区
 * @param {string} dateString  - 时间格式字符串 eg: 2023-7-19 23:59:59
 * @returns
 */

export function toEAST8Time(dateString: string) {
  return dayjs(dateString).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

// 获取指定天数范围的起始和结束时间
export function getSpecificRangeOfDay(days: number) {
  const end = dayjs(); // 结束时间为当前时间
  const start = end.subtract(days - 1, 'day'); // 开始时间为end往前days-1天

  return {
    createTimeGe: start.format('YYYY-MM-DD HH:mm:ss'),
    createTimeLe: end.format('YYYY-MM-DD HH:mm:ss'),
  };
}
