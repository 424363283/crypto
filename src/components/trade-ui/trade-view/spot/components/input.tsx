import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';
import { ChangeEvent, useState } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: number | string;
  decimal?: number;
  unit: string;
  max?: number;
  min?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  defaultValue?: number | string;
  label?: string;
}

const Input = ({ unit, min, max, value, decimal = 0, onChange, placeholder, onBlur, defaultValue, label }: Props) => {
  const { theme } = useTheme();
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

    if (max && max > 0 && Number(currentValue) > max) {
      currentValue = String(max);
    }

    e.currentTarget.value = currentValue;
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    onChange && onChange(currentValue);
  };

  const _onBlur = () => {
    if (min && (!value || Number(value) < min)) {
      onChange(String(min));
    }
    setIsFocus(false);
    if (onBlur) {
      onBlur();
    } else {
      if (value === '' && defaultValue !== undefined) {
        onChange(defaultValue as string);
      }
    }
  };

  return (
    <>
      <div className={`${theme} ${clsx('container', isFocus && 'focus')}`}>
        {label && <span className='label'>{label}</span>}
        <input
          placeholder={placeholder}
          type='text'
          onFocus={() => setIsFocus(true)}
          onBlur={() => _onBlur()}
          onInput={_onInput}
          value={value}
          onChange={_onChange}
        />
        <span className='unit'>{unit}</span>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Input;
const styles = css`
  .container {
    flex: 1;
    height: 36px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    background: var(--theme-background-color-2-4);
    input {
      flex: 1;
      border: none;
      font-weight: 500;
      text-indent: 14px;
      background: var(--theme-background-color-2-4);
      color: var(--theme-font-color-1);
      ::placeholder {
        color: var(--theme-font-color-1-half);
      }
    }
    .label {
      font-weight: 500;
      width: 70px;
      margin-left: 10px;
      color: var(--theme-font-color-2);
    }
    .unit {
      color: var(--theme-font-color-3);
      margin-right: 17px;
      font-weight: 500;
    }
    &.dark {
      border-color: transparent;
    }
  }
`;
