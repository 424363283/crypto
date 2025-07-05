import { clsx } from '@/core/utils';
import { ChangeEvent, useState } from 'react';
import css from 'styled-jsx/css';
export type NS = number | string;
import CommonIcon from '@/components/common-icon';
interface Props {
  value: number | string;
  decimal?: number;
  unit?: any;
  max?: NS;
  min?: NS;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  showError?: boolean;
  errorText?: string | (() => string);
  allowEmpty?: boolean;
  clearable?: boolean;
}

const copySettingInput = ({
  clearable = false,
  unit,
  min,
  max,
  value,
  decimal = 0,
  onChange,
  placeholder,
  onBlur,
  onFocus,
  label,
  disabled = false,
  showError = false,
  allowEmpty = false,
  errorText = ''
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  const _onInput = (e: ChangeEvent<HTMLInputElement>) => {
    let currentValue = e.currentTarget.value;
    currentValue = currentValue.replace(/[^\-?\d.]/gi, '');

    // 最后添加的 - 号无效
    if (currentValue.length > 1 && currentValue.lastIndexOf('-') > 0) {
      currentValue = currentValue.substring(0, currentValue.length - 1);
    }

    // 不能输入多个小数点
    if (currentValue.indexOf('.') !== currentValue.lastIndexOf('.')) {
      currentValue = currentValue.substring(0, currentValue.length - 1);
    }

    //不允许输入负号
    if (currentValue.indexOf('-') === 0) {
      currentValue = '';
    }

    //不允许输入00
    if (currentValue.length > 1 && currentValue.at(0) === '0' && currentValue.at(1) !== '.') {
      currentValue = '0';
    }

    // 不设置 decimal 的话，默认不能输入小数
    if (currentValue.indexOf('.') !== -1) {
      if (decimal === 0) {
        currentValue = currentValue.replace('.', '');
      } else {
        const [, float] = currentValue.toString().split('.');
        if (float.length > decimal) {
          currentValue = Number(currentValue).toFixed(decimal);
        }
      }
    }

    if (max && Number(max) > 0 && Number(currentValue) > Number(max)) {
      currentValue = String(max);
    }

    e.currentTarget.value = currentValue;
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    onChange && onChange(currentValue);
  };

  const _onBlur = () => {
    if (min && value !== '' && Number(value) < Number(min)) {
      onChange(String(min));
    }
    setIsFocus(false);
    onBlur && onBlur();
  };

  const _onFocus = () => {
    // setIsFocus(true);
    // onFocus && onFocus();
  };
  const handleClear = () => {
    onChange('');
    _onFocus();
  };
  const hasError = typeof errorText === 'string' ? errorText !== '' : errorText() !== '';
  const CloseIcon = () => {
    return (
      <span onClick={() => onChange('')}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.47561 3.254L6.26761 0.733999H7.87761L5.23161 4.346L7.87761 8H6.16961L4.40561 5.48L2.61361 8H0.975609L3.63561 4.402L0.975609 0.733999H2.71161L4.47561 3.254Z"
            fill="#2B2F33"
          />
        </svg>
      </span>
    );
  };

  return (
    <>
      <div className={`${clsx('container', isFocus && 'focus', showError && 'show-error')}`}>
        <div className="input-wrapper">
          <span className="label">{label}</span>
          <input
            placeholder={placeholder}
            type="text"
            onFocus={_onFocus}
            onBlur={_onBlur}
            onInput={_onInput}
            value={value}
            onChange={_onChange}
            disabled={disabled}
            maxLength={16}
          />
          <span className="unit">{unit}</span>
          {clearable && value && (
            <p className="clear">
              <CloseIcon />
            </p>
          )}
        </div>
        {((value !== '' && hasError) || allowEmpty) && (
          <div className="error">{typeof errorText === 'string' ? errorText : errorText()}</div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default copySettingInput;
const styles = css`
  .container {
    display: flex;
    &:has(.error) {
      .input-wrapper {
        > input {
          border-color: var(--text_red);
        }
      }
    }
    &.show-error {
      .input-wrapper {
        border-color: var(--text_red);
      }
    }
    .input-wrapper {
      padding: 0 16px;
      width: 100%;
      border-radius: 8px;
      display: flex;
      align-items: center;
      background: var(--fill_3);
      .label {
        color: var(--text_2);
        white-space: nowrap;
      }
      input {
        background: transparent;
        width: 100%;
        color: var(--text_1);
        text-align: center;
         font-family: "Lexend";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        border: 0;
        line-height: normal;
        text-align: left;
        margin-right: 6px;
        color: var(--text_1);
        &:disabled {
          color: var(--text_3);
        }
        &::placeholder {
          color: var(--text_2);
        }
      }
      .unit {
        color: var(--text_1);
         font-family: "Lexend";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
      .clear {
        cursor: pointer;
        padding: 6px 8px;
      }
    }
    .error {
      margin-top: 5px;
      color: var(--text_red);
    }
  }
`;
