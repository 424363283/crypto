import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: number | string;
  decimal?: number;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isNegative?: boolean;
  isPercent?: boolean;
  max?: number;
  min: number;
  addStep: number;
  minusStep: number;
  least?: number;
  onOriginValueChange?: (value: string) => void;
}

const RatioInput = ({
  value,
  decimal = 0,
  placeholder = '',
  onChange,
  isNegative = true,
  min,
  max,
  addStep,
  minusStep,
  isPercent = false,
  onFocus,
  onBlur,
  least = 0,
  onOriginValueChange,
}: Props) => {
  const { theme } = useTheme();
  const [isFocus, setIsFocus] = useState(false);
  const [originVal, setOriginVal] = useState(value);

  useEffect(() => {
    setOriginVal(value);
  }, [value]);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
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

    // isNegative 设置为 true，不允许输入负数
    if (isNegative && currentValue.indexOf('-') === 0) {
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

    if (max && max < 0 && Number(currentValue) > 0) {
      currentValue = String(-currentValue);
    }

    if (min && min < 0 && Number(currentValue) < min) {
      currentValue = String(min);
    }

    e.currentTarget.value = currentValue;
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;

    if (currentValue.length >= least) {
      setOriginVal(currentValue);
      onOriginValueChange && onOriginValueChange(currentValue);
    }

    if (currentValue !== '0' && currentValue !== '' && currentValue !== '0.' && currentValue !== '-') {
      onChange && onChange(currentValue);
    }
  };

  const _onFocus = () => {
    setIsFocus(true);
    onFocus && onFocus();
  };

  const _onBlur = () => {
    if (!originVal || Number(originVal) < min || originVal === '-') {
      onChange(String(min));
      setOriginVal(min);
    }
    setIsFocus(false);
    onBlur && onBlur();
  };

  const _onAdd = () => {
    if (originVal != max) {
      const result = Number(originVal).add(addStep);
      onChange(max && Number(result) > max ? String(max) : String(result));
    }
  };

  const _onMinus = () => {
    if (originVal != min) {
      const result = Number(originVal).sub(minusStep);
      onChange(Number(result) < min ? String(min) : String(result));
    }
  };

  return (
    <>
      <div className={`${theme} ${clsx('container', isFocus && 'focus')}`}>
        <div className='controller'>
          <button className='btn-control' onClick={_onMinus}>
            <Svg src='/static/images/lite/minus.svg' width={12} height={12} />
          </button>
        </div>
        <input
          value={originVal}
          type='text'
          onInput={onInput}
          placeholder={placeholder}
          onFocus={_onFocus}
          onBlur={_onBlur}
          onChange={_onChange}
        />
        {isPercent && String(originVal).length > 0 && (
          <span
            className={'symbol'}
            style={{
              left: `${value.toString().length * 4 + 132}px`,
            }}
          >
            %
          </span>
        )}
        <div className='controller'>
          <button className='btn-control' onClick={_onAdd}>
            <Svg src='/static/images/lite/plus.svg' width={12} height={12} />
          </button>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default RatioInput;
const styles = css`
  .container {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    position: relative;
    background: var(--theme-trade-tips-color);
    &:hover {
      border-color: var(--skin-color-active) !important;
    }
    &.focus {
      box-shadow: 0 0 0 2px rgba(248, 187, 55, 0.1);
      border-color: var(--skin-color-active) !important;
    }
    input {
      flex: 1;
      color: var(--theme-font-color-1);
      padding-right: 10px;
      font-size: 14px;
      outline: none;
      text-align: center;
      border: 0;
      width: 100%;
      background: var(--theme-trade-tips-color);
      &::placeholder,
      input::placeholder,
      input::-webkit-input-placeholder,
      &::-webkit-input-placeholder {
        color: var(--theme-font-color-placeholder);
      }
    }
    .symbol {
      position: absolute;
      font-size: 14px;
      pointer-events: none;
      color: var(--theme-font-color-1);
    }
    .controller {
      width: auto;
      overflow: hidden;
      display: flex;
      justify-content: space-evenly;
      .btn-control {
        border: none;
        outline: 0;
        height: 36px;
        width: 44px;
        background: var(--theme-trade-tips-color);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border-radius: 6px;
        cursor: pointer;
        padding: 0;
      }
    }
  }
`;
