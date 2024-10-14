import { useCompositions } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, isCaptcha, isEmail, isPassword, isPhishing, isPhoneNumber } from '@/core/utils';
import { forwardRef, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { ErrorTips } from '../account/components/error-tips';
import { BasicInputProps, INPUT_TYPE } from './types';

const BasicInput = forwardRef((props: BasicInputProps, ref: any) => {
  const {
    label,
    placeholder,
    type,
    children,
    onInputChange,
    hideErrorTips = false,
    withBorder,
    value = '',
    className,
    customErrorTips,
    prefix,
    suffix,
    showPwd,
    showLabel = true,
    ...rest
  } = props;
  const [val, setVal] = useState('');
  const [showErrors, setErrors] = useState(false);
  const [focus, setFocus] = useState(false);

  const hasInputError = (inputValue: string) => {
    if (!inputValue) return false;
    if (type === INPUT_TYPE.PASSWORD || type === INPUT_TYPE.RESET_PASSWORD) {
      return !isPassword(inputValue);
    }
    if (type === INPUT_TYPE.CAPTCHA) {
      return !isCaptcha(inputValue);
    }
    if (type === INPUT_TYPE.EMAIL) {
      return !isEmail(inputValue);
    }
    if (type === INPUT_TYPE.PHONE) {
      return !isPhoneNumber(inputValue);
    }
    if (type === INPUT_TYPE.ANTI_PHISHING_CODE) {
      return !isPhishing(inputValue);
    }
    return false;
  };
  useEffect(() => {
    setErrors(!!customErrorTips);
  }, [customErrorTips]);
  useEffect(() => {
    setVal(value);
    if (value) {
      const hasError = hasInputError(value);
      const shouldShowError = !!customErrorTips || hasError;
      setErrors(shouldShowError);
    }
  }, [value]);
  const onInputStart = (inputValue: string) => {
    const hasError = hasInputError(inputValue);
    const shouldShowError = !!customErrorTips || hasError;
    setErrors(shouldShowError);
    if (onInputChange) {
      onInputChange(inputValue, hasError);
    } else {
      setVal(inputValue);
    }
  };
  const { value: newValue, onChange, onComposition } = useCompositions(val, onInputStart);

  const getInputClassName = () => {
    if (withBorder) {
      if (showErrors) return 'basic-input-bordered error-input-border';
      if (focus) return 'basic-input-bordered focused';
      return 'basic-input-bordered';
    } else {
      if (showErrors) return 'error-input-border';
      if (focus) return 'focused-border';
      return '';
    }
  };
  const INPUT_TEXT_MAP: { [key: string]: string } = {
    [INPUT_TYPE.PASSWORD]: 'password',
    [INPUT_TYPE.RESET_PASSWORD]: 'password',
    [INPUT_TYPE.CAPTCHA]: 'text',
    [INPUT_TYPE.EMAIL]: 'email',
    [INPUT_TYPE.PHONE]: 'tel',
    [INPUT_TYPE.ANTI_PHISHING_CODE]: 'text',
  };
  return (
    <div className={clsx('basic-input-container', className)}>
      {showLabel && label ? <p className='label'>{label}</p> : null}
      <div className={clsx('basic-input-box', getInputClassName())}>
        {prefix ? prefix : null}
        <input
          {...rest}
          type={showPwd ? 'text' : INPUT_TEXT_MAP[type]}
          value={newValue}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder || LANG('请输入登录密码')}
          onChange={onChange}
          onCompositionStart={onComposition}
          onCompositionEnd={onComposition}
          className={clsx('basic-input')}
          ref={ref}
        />
        {suffix ? <div className={clsx('input-suffix-portal')}>{suffix}</div> : null}
      </div>
      {INPUT_TYPE.NORMAL_TEXT === type ? null : (
        <ErrorTips
          type={type}
          showErrors={showErrors}
          hideErrorTips={hideErrorTips}
          customErrorTips={customErrorTips}
        />
      )}
      <style jsx>{styles}</style>
    </div>
  );
});
export { BasicInput, INPUT_TYPE };
const styles = css`
  .basic-input-container {
    width: 100%;
    .label {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 12px;
      @media ${MediaInfo.mobile} {
        font-size: 14px;
      }
    }
    .basic-input-box {
      display: flex;
      align-items: center;
      position: relative;
      border-radius: 6px;
      background-color: var(--theme-sub-button-bg);
      &:hover {
        box-shadow: 0 0 0 1px var(--color-active);
      }
      .input-suffix-portal {
        display: flex;
        align-items: center;
        padding-right: 15px;
        justify-content: flex-end;
        padding-left: 10px;
      }
      .error-border {
        outline: 1px solid #ff4d4f;
      }
      .basic-input-children {
        position: absolute;
        right: 20px;
      }
      .basic-input {
        padding-left: 14px;
        background: var(--theme-sub-button-bg);
        border-radius: 6px;
        border: none;
        color: var(--theme-font-color-1);
      }
      input::-input-placeholder {
        color: var(--theme-font-color-2);
        padding-left: 14px;
      }
    }
    .error-input-border {
      &:hover {
        box-shadow: none !important;
      }
    }
    :global(.small-error) {
      font-size: 12px;
      color: #ff6960;
    }
    .basic-input-bordered {
      border: none;
      .basic-input {
        padding: 0 20px;
      }
      .input-portal {
        margin-right: 20px;
      }
    }
    .focused {
      box-shadow: 0 0 0 1px var(--color-active);
    }
    .focused-border {
      box-shadow: 0 0 0 1px var(--color-active);
    }
  }
`;
