import { DatePicker as AntdDatePicker, DatePickerProps as DatePickerProps2 } from 'antd';
import React from 'react';
import { clsx, styles } from './styled';

type DatePickerProps = DatePickerProps2 & {
  wrapperClassName?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({ wrapperClassName, className, ...props }) => {
  return (
    <div className={clsx('date-picker-content', wrapperClassName)}>
      <AntdDatePicker {...props} popupClassName={clsx('my-date-picker')} className={clsx(className)} />
      {styles}
    </div>
  );
};
