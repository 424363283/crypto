import { useCompositions } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, isCaptcha, isEmail, isPassword, isPhishing, isPhoneNumber, isUserId } from '@/core/utils';
import { forwardRef, useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { ErrorTips } from '../account/components/error-tips';
import { BasicInputProps, INPUT_TYPE } from './types';
import { Intent, Size } from '../constants';
import CommonIcon from '../common-icon';

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
    size = Size.DEFAULT,
    intent = Intent.NONE,
    rounded,
    contentLeft,
    contentRight,
    clearable = false,
    ...rest
  } = props;
  const inputRef = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState('');
  const [showErrors, setErrors] = useState(false);
  const [focus, setFocus] = useState(false);
  const [borderRadius, setBorderRadius] = useState(className);

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
    if (type === INPUT_TYPE.USER_ID) {
      return !isUserId(inputValue);
    }
    return false;
  };
  useEffect(() => {
    setErrors(!!customErrorTips);
  }, [customErrorTips]);
  useEffect(() => {
    setVal(value);
    const hasError = hasInputError(value);
    const shouldShowError = !!customErrorTips || hasError;
    setErrors(shouldShowError);
  }, [value]);

  useEffect(() => {
    let radiusLevel = '';
    if (!rounded && inputRef.current) {
      const inputHeight = inputRef.current.clientHeight;
      if (inputHeight <= 40) {
        radiusLevel = 'nui-radius-1';
      } else if (inputHeight <= 48) {
        radiusLevel = 'nui-radius-2';
      } else {
        radiusLevel = 'nui-radius-3';
      }
    }
    setBorderRadius(radiusLevel);
  }, []);
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
    const classes = clsx(size && `nui-${size}`, intent && `nui-${intent}`, rounded && `nui-rounded`);
    if (withBorder) {
      return clsx(
        classes,
        showErrors && 'basic-input-bordered error-input-border',
        focus && 'basic-input-bordered focused',
        'basic-input-bordered'
      );
    } else {
      return clsx(classes, showErrors && 'error-input-border', focus && 'focused-border');
    }
  };
  const INPUT_TEXT_MAP: { [key: string]: string } = {
    [INPUT_TYPE.PASSWORD]: 'password',
    [INPUT_TYPE.RESET_PASSWORD]: 'password',
    [INPUT_TYPE.CAPTCHA]: 'number',
    [INPUT_TYPE.EMAIL]: 'email',
    [INPUT_TYPE.PHONE]: 'tel',
    [INPUT_TYPE.ANTI_PHISHING_CODE]: 'text'
  };
  const others: any = {};
  if (type === INPUT_TYPE.CAPTCHA) {
    others.inputmode = 'numeric';
  }
  return (
    <div className={clsx('basic-input-container', className)}>
      {showLabel && label ? <p className="label">{label}</p> : null}
      <div className={clsx('basic-input-box', getInputClassName(), borderRadius)} ref={inputRef}>
        {prefix ? <div className={clsx('nui-addon input-prefix-portal')}>{prefix}</div> : null}
        {contentLeft && contentLeft}
        <input
          {...rest}
          type={showPwd ? 'text' : INPUT_TEXT_MAP[type]}
          value={newValue}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder || LANG('请输入登录密码')}
          onChange={e => {
            if (rest.pattern) {
              const regex = new RegExp(rest.pattern);
              if (!regex.test(e.target.value)) {
                return;
              }
            }
            onChange(e);
          }}
          onCompositionStart={onComposition}
          onCompositionEnd={onComposition}
          className={clsx('basic-input')}
          ref={ref}
          maxLength={rest.maxLength || 100}
          {...others}
        />
        {contentRight && contentRight}
        {(suffix || clearable) && (
          <div className={clsx('nui-addon input-suffix-portal')}>
            {clearable && newValue?.length > 0 && (
              <CommonIcon
                style={{ position: 'relative', zIndex: 101, cursor: 'pointer' }}
                name="common-close-circle"
                className={clsx('clearable-btn')}
                size={24}
                onClick={() => {
                  onInputChange && onInputChange('', false);
                }}
              />
            )}
            {suffix}
          </div>
        )}
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
  @import './index.module.scss';
  .basic-input-container {
    width: 100%;
    .label {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 12px;
      @media ${MediaInfo.mobile} {
        font-size: 14px;
        color: var(--text_3);
      }
    }
    .basic-input-box {
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid var(--fill_input_1);
      @media ${MediaInfo.mobile} {
        border: 1px solid transparent;
      }

      &:hover-unused {
        border: 1px solid var(--brand);
        background-color: var(--fill_bg_1);
      }
      &:hover {
        box-shadow: none;
        border: 1px solid var(--brand);
      }
      .input-prefix-portal {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .input-suffix-portal {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .error-border {
        outline: 1px solid #ff4d4f;
      }
      .basic-input-children {
        position: absolute;
        right: 20px;
      }
      .basic-input-unused {
        padding-left: 14px;
        background: var(--fill_3);
        border-radius: 16px;
        border: none;
        color: var(--text_1);
        &:hover {
          background-color: var(--fill_bg_1);
        }
      }
      input::placeholder {
        color: var(--text_2);
        font-size: 14px;
        font-weight: 300;
        @media ${MediaInfo.mobile} {
          font-size: 14px;
          color: var(--text_1);
        }
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
      .basic-input {
        padding: 0 20px;
      }
      .input-portal {
        margin-right: 20px;
      }
    }
    .focused-unused {
      box-shadow: 0 0 0 1px var(--text_brand);
      background-color: var(--fill_bg_1);
    }
    .focused-border-unused {
      box-shadow: 0 0 0 1px var(--text_brand);
      background-color: var(--fill_bg_1);
    }
  }
`;
