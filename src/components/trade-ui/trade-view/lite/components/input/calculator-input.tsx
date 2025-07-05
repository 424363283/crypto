import { useTheme } from '@/core/hooks';
import { clsx, MediaInfo } from '@/core/utils';
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
  max
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
    if (currentValue.length > 1 && currentValue.indexOf('0') === 0 && decimal === 0) {
      currentValue = currentValue.slice(1);
    }
    // 有小数点 && 第二位数不是. 而是0,删除0
    if (currentValue.length > 1 && decimal > 0 && currentValue.indexOf('.') !== 1 && currentValue.indexOf('00') === 0) {
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
    <div className="input-wrapper">
      <span className="label">{label}</span>
      <div className={`${theme} ${clsx('container', isFocus && 'focus')}`}>
        <input
          value={value}
          type="text"
          inputMode="decimal"
          onInput={_onInput}
          placeholder={placeholder}
          onFocus={() => setIsFocus(true)}
          onBlur={_onBlur}
          onChange={_onChange}
        />
        {suffix}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default CalculatorInput;
const styles = css`
  .input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    gap: 16px;
    @media ${MediaInfo.mobile} {
      gap: 8px;
    }
    .label {
      color: var(--text_3);
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    .container {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      border-radius: 8px;
      padding: 0 10px;
      background: var(--fill_input_2);
      border: 1px solid transparent;
      @media ${MediaInfo.mobile} {
        width: -webkit-fill-available;
      }
      &:hover {
        border-color: var(--brand) !important;
      }
      &.focus {
        border-color: var(--brand) !important;
      }
      input {
        flex: 1;
        text-align: left;
        background: var(--fill_input_2);
        padding-right: 10px;
        color: var(--text_1);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        outline: none;
        border: 0;
        width: 100%;
        &::placeholder,
        input::placeholder,
        input::-webkit-input-placeholder,
        &::-webkit-input-placeholder {
          color: var(--text_3);
        }
        @media ${MediaInfo.mobile} {
          background: var(--fill-input-2);
        }
      }
    }
  }
`;
