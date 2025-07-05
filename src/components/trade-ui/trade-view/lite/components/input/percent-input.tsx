import { THEME } from '@/core/store';
import { ChangeEvent, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import MinusIcon from '../minus-icon';
import PlusIcon from '../plus-icon';
import { MediaInfo } from '@/core/utils';

interface Props {
  value: number | string;
  onChange: (value: string) => void;
  max?: number;
  min?: number;
  addStep?: number;
  minusStep?: number;
  decimal?: number;
  isNegative?: boolean;
  label?: string;
  isPrice?: boolean;
  placeholder?: string;
  theme: THEME;
  className?: string;
  inputType?: string;
}

const PercentInput = ({
  value = '',
  onChange,
  max,
  min,
  isNegative = true,
  label = '',
  addStep = 1,
  minusStep = 1,
  decimal = 0,
  isPrice = false,
  placeholder = '',
  theme,
  className = '',
  inputType = 'number'
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  const [originVal, setOriginVal] = useState<number | string>(value === '' ? '' : Number(value.toFixed(decimal)));
  useEffect(() => {
    setOriginVal(value === '' ? '' : Number(value.toFixed(decimal)));
  }, [value]);

  const _onInput = (e: ChangeEvent<HTMLInputElement>) => {
    let currentValue = e.currentTarget.value;
    currentValue = currentValue.replace(/[^\-?\d.]/gi, '');

    // 最后添加的 - 号无效
    if (currentValue.length > 1 && currentValue.lastIndexOf('-') > 0) {
      currentValue = currentValue.substring(0, currentValue.length - 1);
    }

    // isNegative 为 true 不允许输入 - 号
    if (isNegative && currentValue.indexOf('-') === 0) {
      currentValue = '';
    }

    // 第一位数为 0 的情况
    if (currentValue.length > 1 && currentValue.indexOf('0') === 0 && !currentValue.includes('0.')) {
      currentValue = currentValue.slice(1);
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

    if (min !== undefined && min < 0 && Number(currentValue) < min) {
      currentValue = String(min);
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
    e.currentTarget.value = currentValue;
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    setOriginVal(currentValue);

    if (isPrice && Number(currentValue) === 0) {
      return;
    }

    if (
      currentValue !== '0' &&
      currentValue !== '-' &&
      currentValue !== '' &&
      currentValue[currentValue.length - 1] !== '.' // 最后一位为小数点时不触发 onChange 事件
    ) {
      onChange && onChange(currentValue);
    }
  };

  const _onBlur = () => {
    if (min) {
      if (!originVal || Number(originVal) < min || originVal === '-') {
        onChange(String(min));
        setOriginVal(min);
      }
    }

    if (max && max < 0) {
      if (!originVal || Number(originVal) > max || originVal === '-') {
        onChange(String(max));
        setOriginVal(max);
      }
    }
    setIsFocus(false);
  };

  const _getSymbolLeft = (length: number) => {
    if (length < 2) {
      return 23;
    } else if (length === 2) {
      return 32;
    } else if (length === 3) {
      return length * 13;
    } else {
      return 18 + length * 7;
    }
  };

  const _onAdd = () => {
    if (originVal != max) {
      onChange(originVal.add(addStep));
    }
  };

  const _onMinus = () => {
    if (originVal != min) {
      onChange(originVal.sub(minusStep));
    }
  };

  return (
    <>
      {label && <div className="prefix">{label}</div>}
      <div className={`container ${isFocus && 'focus'} ${theme} ${className}`}>
        <div className="inputWrapper">
          <input
            value={isFocus || inputType === 'price' ? originVal : originVal + '%'}
            type="text"
            inputMode="decimal"
            onInput={_onInput}
            onFocus={() => setIsFocus(true)}
            onBlur={_onBlur}
            onChange={_onChange}
            placeholder={placeholder}
          />
          {/* {!isPrice && (
            <span className='symbol' style={{ left: _getSymbolLeft(String(originVal).length) }}>
              %
            </span>
          )} */}
        </div>
        <div className="controller add">
          <button className="btn-control" onClick={_onAdd}>
            <PlusIcon width="13px" height="13px" />
          </button>
        </div>
        <div className="controller minus">
          <button className="btn-control" onClick={_onMinus}>
            <MinusIcon width="13px" height="3px" />
          </button>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default PercentInput;
const styles = css`
  .prefix {
    color: var(--text_2);
    font-size: 14px;
    font-weight: 400;
  }
  .container {
    position: relative;
    width: 100%;
    height: 48px;
    border: 1px solid transparent;
    border-radius: 8px;
    margin: 16px 0 8px;
    display: flex;
    align-items: center;
    background: var(--fill_3);
    &:hover {
      border-color: var(--brand) !important;
    }
    &.focus {
      box-shadow: 0 0 0 2px rgba(248, 187, 55, 0.1);
      border-color: var(--brand) !important;
    }
    @media ${MediaInfo.mobile} {
      height: 2.5rem;
      border: 0;
      background: var(--fill_input_2);
      &:hover,
      &.focus {
        box-shadow: 0 0 0 0 transparent;
        // border-color: transparent !important;
      }
    }
    .inputWrapper {
      flex: 1;
      position: relative;
      input {
        color: var(--text_1);
        font-size: 14px;
        font-weight: 500;
        text-indent: 12px;
        outline: none;
        border: 0;
        width: 100%;
        background: var(--fill_3);
        text-align: center;
        &::placeholder,
        input::placeholder,
        input::-webkit-input-placeholder,
        &::-webkit-input-placeholder {
          color: var(--text_3);
        }
        @media ${MediaInfo.mobile} {
          width: -webkit-fill-available;
          background: var(--fill_input_2);
        }
      }
      .symbol {
        color: var(--text_3);
        position: absolute;
        font-size: 14px;
        pointer-events: none;
        font-weight: 400;
        user-select: none;
        top: 1px;
      }
    }
    .controller {
      width: auto;

      overflow: hidden;
      position: absolute;
      display: flex;
      justify-content: center;
      .btn-control {
        border: none;
        outline: 0;
        height: 22px;
        width: 22px;
        background: transparent;
        margin-right: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        cursor: pointer;
        padding: 0;
      }
    }
    .add {
      left: 8px;
    }
    .minus {
      right: 0;
    }
  }
  .pure-container {
    border-radius: 8px;
    margin: 0;
  }
`;
