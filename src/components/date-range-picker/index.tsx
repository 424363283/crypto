import { Svg } from '@/components/svg';
import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { clsx, styles } from './styled';
import CommonIcon from '../common-icon';

const { RangePicker } = DatePicker;

interface DateRangePickerProps extends Omit<RangePickerProps, 'isDark'> {
  isDark?: boolean;
  followSetting?: boolean;
  wrapperClassName?: string;
}
export const ORDER_HISTORY_MIN_DATE = dayjs().add(-90, 'd');
export const ORDER_HISTORY_MAX_DATE = dayjs().add(-89, 'd');
export const DATE_TODAY = dayjs().endOf('day');

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
                                                                  isDark,
                                                                  className,
                                                                  wrapperClassName,
                                                                  followSetting = true,
                                                                  ...props
                                                                }) => {
  // 所有日历默认限制只能查询最近90天的数据
  const dropdownClassName = clsx('dropdown', isDark && 'dark');
  const others: { disabledDate?: (current: Dayjs) => boolean } = {};
  const MY_ORDER_HISTORY_MIN_DATE: Dayjs = ORDER_HISTORY_MIN_DATE.add(-1, 'd');
  const formatDisableDate = (date: Dayjs): boolean => {
    return (date && date.isBefore(MY_ORDER_HISTORY_MIN_DATE)) || date.isAfter(DATE_TODAY);
  };
  const formatDisableDateNow = (date: Dayjs): boolean => {
    return date > DATE_TODAY;
  };
  if (followSetting) {
    others.disabledDate = formatDisableDate;
  } else {
    others.disabledDate = formatDisableDateNow;
  }
  return (
      <div className={clsx('picker-content', wrapperClassName)}>
        <CommonIcon name='common-calendar' className={clsx('icon')} size={16} />
        <RangePicker
            className={clsx('picker', className)}
            popupClassName={dropdownClassName}
            // separator={LANG('至')}
            separator={''}
            {...others}
            allowClear={false}
            {...props}
        />
        {styles}
      </div>
  );
};
