import React, { InputHTMLAttributes } from 'react';
import { Intent, Size } from '../constants';

export enum INPUT_TYPE {
  EMAIL = 'email',
  PASSWORD = 'password',
  PHONE = 'phone',
  CAPTCHA = 'captcha',
  NORMAL_TEXT = 'normal_text',
  RESET_PASSWORD = 'reset_password',
  ANTI_PHISHING_CODE = 'anti_phishing_code',
  USER_ID = 'user_id',
}
export interface BasicInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string | JSX.Element;
  placeholder?: string;
  type: INPUT_TYPE;
  children?: React.ReactNode;
  onInputChange?: (value: string, hasError?: boolean) => void;
  withBorder?: boolean;
  value?: string;
  className?: string;
  customErrorTips?: string;
  hideErrorTips?: boolean;
  prefix?: any;
  suffix?: any;
  showPwd?: boolean;
  showLabel?: boolean;
  size?: Size;
  intent?: Intent;
  rounded?: boolean;
  contentLeft?: React.ReactNode;
  contentRight?: React.ReactNode;
  clearable?: boolean;
}
