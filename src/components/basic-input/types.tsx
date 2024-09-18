import React, { InputHTMLAttributes } from 'react';

export enum INPUT_TYPE {
  EMAIL = 'email',
  PASSWORD = 'password',
  PHONE = 'phone',
  CAPTCHA = 'captcha',
  NORMAL_TEXT = 'normal_text',
  RESET_PASSWORD = 'reset_password',
  ANTI_PHISHING_CODE = 'anti_phishing_code',
}
export interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement> {
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
}
