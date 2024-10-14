import { INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { store } from '../store';
import { CaptchaButton } from './captcha-btn';

export const InputVerificationCode = (props: {
  type: LOCAL_KEY;
  scene: SENCE;
  onInputChange?: (code: string) => void;
  className?: string;
  withBorder?: boolean;
  autoSend?: boolean;
  label?: string;
  withdrawData?: any;
  showLabel?: boolean;
}) => {
  const {
    type,
    scene,
    className,
    onInputChange,
    withBorder = false,
    autoSend = true,
    label = '',
    withdrawData,
    showLabel = true
  } = props;
  const isEmailInput = type === LOCAL_KEY.INPUT_VERIFICATION_EMAIL || type === LOCAL_KEY.INPUT_REGISTER_EMAIL;
  const isPhoneInput = type === LOCAL_KEY.INPUT_VERIFICATION_PHONE || type === LOCAL_KEY.INPUT_REGISTER_PHONE;
  const [code, setCode] = useState('');
  const getPlaceholder = () => {
    if (isEmailInput) {
      return LANG('请输入邮箱验证码');
    }
    if (isPhoneInput) {
      return LANG('请输入短信验证码');
    }
    return '';
  };

  store.withdrawData = withdrawData;

  useEffect(() => {
    return () => {
      store.emailCode = '';
      store.smsCode = '';
      store.gaCode = '';
    };
  }, []);

  const handleInputChange = (value: string) => {
    if (isEmailInput) {
      store.emailCode = value;
    } else if (isPhoneInput) {
      store.smsCode = value;
    } else {
      store.gaCode = value;
    }
    setCode(value);
    onInputChange?.(value);
  };
  const LABEL_MAP: { [key: string]: string } = {
    [LOCAL_KEY.INPUT_VERIFICATION_EMAIL]: LANG('邮箱验证码'),
    [LOCAL_KEY.INPUT_VERIFICATION_PHONE]: LANG('短信验证码'),
    [LOCAL_KEY.INPUT_REGISTER_EMAIL]: LANG('邮箱验证码'),
    [LOCAL_KEY.INPUT_REGISTER_PHONE]: LANG('短信验证码'),
  };
  return (
    <div className={clsx('verification-item', className)}>
      <BasicInput
        type={INPUT_TYPE.CAPTCHA}
        label={label || LABEL_MAP[type]}
        value={code}
        onInputChange={handleInputChange}
        placeholder={getPlaceholder()}
        maxLength={6}
        withBorder={withBorder}
        suffix={<CaptchaButton type={type} scene={scene} autoSend={autoSend} />}
        showLabel = {showLabel}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .verification-item {
    width: 100%;
    .label {
      font-weight: 400;
    }
    .input-container {
      display: flex;
      align-items: center;
      position: relative;
      padding-right: 20px;
      border-bottom: 1px solid #d8d8d8;
      .verify-btn {
        cursor: pointer;
        color: var(--skin-primary-color);
        border-radius: 5px;
        border: 1px solid var(--skin-primary-color);
        font-weight: 500;
        display: inline-block;
      }
      .verify-btn-active {
        cursor: not-allowed;
        border-color: #d8d8d8;
        color: #bcc0ca;
      }
    }
    .focus-border {
      border: 1px solid var(--skin-primary-color) !important;
    }
    .focused {
      border-bottom: 1px solid var(--skin-primary-color);
    }
  }
`;
