import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';
import { ChangeEvent, ReactNode, useState } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: string | number;
  decimal?: number;
  label?: string;
  placeholder?: string;
  suffix?: ReactNode;
  onChange: (value: string) => void;
  isNegative?: boolean;
  onBlur?: () => void;
  max?: number;
  min?: number;
}

const CalculatorInput = ({
  value,
  decimal = 0,
  label = '',
  placeholder = '',
  suffix,
  onChange,
  isNegative = false,
  onBlur,
  max,
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  const { theme } = useTheme();

  const _onInput = (e: ChangeEvent<HTMLInputElement>) => {
    let currentValue = e.currentTarget.value;
    currentValue = currentValue.replace(/[^\-?\d.]/gi, '');

    // 最后添加的 - 号无效
    if (currentValue.length > 1 && currentValue.lastIndexOf('-') > 0) {
      currentValue = currentValue.substring(0, currentValue.length - 1);
    }

    // 第一位为 - 号不能添加小数点
    if (currentValue === '-.') {
      currentValue = currentValue.substring(0, 1);
    }

    // 不能存在多个小数点
    if (currentValue.length > 1 && currentValue.indexOf('.') !== currentValue.lastIndexOf('.')) {
      currentValue = currentValue.substring(0, currentValue.length - 1);
    }

    // isNegative 设置为 true，不允许输入负数
    if (isNegative && currentValue.indexOf('-') === 0) {
      currentValue = '';
    }

    // 第一位数为 0 的情况
    if (currentValue.length > 1 && currentValue.indexOf('0') === 0) {
      currentValue = currentValue.slice(1);
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
    onChange && onChange(e.currentTarget.value);
  };

  const _onBlur = () => {
    setIsFocus(false);
    onBlur && onBlur();
  };

  return (
    <>
      <div className={`${theme} ${clsx('container', isFocus && 'focus')}`}>
        <span className='label'>{label}</span>
        <input
          value={value}
          type='text'
          onInput={_onInput}
          placeholder={placeholder}
          onFocus={() => setIsFocus(true)}
          onBlur={_onBlur}
          onChange={_onChange}
        />
        {suffix}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default CalculatorInput;
const styles = css`
  .container {
    width: 100%;
    height: 37px;
    border-radius: 8px;
    padding: 0 10px;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    background: var(--theme-trade-tips-color);
    border: 1px solid transparent;
    &:hover {
      border-color: var(--skin-color-active) !important;
    }
    &.focus {
      box-shadow: 0 0 0 2px rgba(248, 187, 55, 0.1);
      border-color: var(--skin-color-active) !important;
    }
    .label {
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-3);
    }
    input {
      flex: 1;
      text-align: right;
      color: var(--theme-font-color-1);
      background: var(--theme-trade-tips-color);
      padding-right: 10px;
      font-size: 13px;
      outline: none;
      border: 0;
      width: 100%;
      &::placeholder,
      input::placeholder,
      input::-webkit-input-placeholder,
      &::-webkit-input-placeholder {
        color: #c3c6ce;
      }
    }
  }
`;
