import { clsx } from '@/core/utils';
import { ChangeEvent, useState } from 'react';
import css from 'styled-jsx/css';
import { NS } from '../../spot';
import { Layer } from '@/components/constants';

interface Props {
  value: number | string;
  decimal?: number;
  unit?: string;
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
  type?:string;
  layer?: Layer;
}

const Input = ({
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
  errorText = '',
  type='text',
  layer=Layer.Default
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
    setIsFocus(true);
    onFocus && onFocus();
  };
  const others: any = {};
  if (type === 'number') {
    others.inputMode = 'decimal'; // 手机数字键盘
  }
  const hasError = typeof errorText === 'string' ? errorText !== '' : errorText() !== '';

  return (
    <>
      <div className={`${clsx('container', isFocus && 'focus', showError && 'show-error', `layer${layer}`)}`}>
        <div className={clsx('input-wrapper')}>
          <span className='label'>{label}</span>
          <input
            placeholder={placeholder}
            type={type}
            onFocus={_onFocus}
            onBlur={_onBlur}
            onInput={_onInput}
            value={value}
            onChange={_onChange}
            disabled={disabled}
            {...others}
          />
          <span className='unit'>{unit}</span>
        </div>
        {((value !== '' && hasError) || allowEmpty) && (
          <div className='error'>{typeof errorText === 'string' ? errorText : errorText()}</div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Input;
const styles = css`
  .container {
    flex: 1;
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

    .error {
      margin-top: 5px;
      color: var(--text_red);
    }
    /* 移除数字输入框箭头 */
    input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  .input-wrapper {
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    .container.layer1 & {
      background: var(--fill_input_1);
      border: 1px solid var(--fill_input_1);
    }
    .container.layer2 & {
      background: var(--fill_input_2);
      border: 1px solid var(--fill_input_2);
    }
    .label {
      color: var(--text_2);
      white-space: nowrap;
    }
    input {
      flex: 1;
      border: none;
      font-weight: 500;
      text-indent: 14px;
      text-align: left;
      margin-right: 6px;
      min-width: 100px;
      .container.layer1 & {
        background: var(--fill_input_1);
      }
      .container.layer2 & {
        background: var(--fill_input_2);
      }
      color: var(--text_1);
      &:disabled {
        color: var(--text_3);
      }
    }
    .unit {
      color: var(--text_2);
      margin-right: 12px;
    }
  }
`;
