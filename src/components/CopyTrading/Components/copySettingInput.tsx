import { clsx } from '@/core/utils';
import { ChangeEvent, useState } from 'react';
import css from 'styled-jsx/css';
import { useTheme } from '@/core/hooks';
export type NS = number | string;
interface Props {
  value: number | string;
  decimal?: number;
  unit?: string;
  max?: NS;
  min?: NS;
  onChange: (value: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  maxUnit?: string;
  label?: string;
  disabled?: boolean;
  showError?: boolean;
  errorText?: string | (() => string);
  allowEmpty?: boolean;
}

const copySettingInput = ({
  unit,
  min,
  max,
  maxUnit,
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
  const { isDark } = useTheme();
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
      currentValue = maxUnit ? String(max) + maxUnit : String(max);
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
    setIsFocus(true);
    onFocus && onFocus();
  };

  const hasError = typeof errorText === 'string' ? errorText !== '' : errorText() !== '';

  return (
    <>
      <div className={`${clsx('container', isFocus && 'focus', showError && 'show-error')}`}>
        <div className={`${clsx('input-wrapper', isDark && 'inputDark')}`}>
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
          />
          <span className="unit">{unit}</span>
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
    .inputDark {
      background: var(--fill_line_3);
      input {
        background: var(--fill_line_3);
      }
    }
    .input-wrapper {
      padding: 0 4px;
      width: 76px;
      height: 24px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      border: 0.5px solid var(--fill_line_3);
      .label {
        color: var(--text_2);
        white-space: nowrap;
      }
      &.inputDark {
       input {
        background: none;
       }
      }
      input {
        width: 100%;
        color: var(--text_1);
        text-align: center;
         font-family: "Lexend";
        font-size: 12px;
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
      }
      .unit {
        color: var(--text_2);
         font-family: "Lexend";
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding-right: 8px;
      }
    }
    .error {
      margin-top: 5px;
      color: var(--text_red);
    }
  }
`;
