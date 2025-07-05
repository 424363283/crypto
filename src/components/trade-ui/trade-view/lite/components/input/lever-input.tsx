import { MediaInfo } from '@/core/utils';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: number | string;
  max: number;
  min: number;
  onChange: (val: string) => void;
  symbol: string;
  isNegative?: boolean;
  disabled?: boolean;
}

const LeverInput = ({ value, min, max, symbol, isNegative = true, onChange, disabled = false }: Props) => {
  const [originVal, setOriginVal] = useState(value);

  useEffect(() => {
    setOriginVal(value);
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
    if (currentValue.length > 1 && currentValue.indexOf('0') === 0) {
      currentValue = currentValue.slice(1);
    }

    if (max && max > 0 && Number(currentValue) > max) {
      currentValue = String(max);
    }

    if (min !== undefined && min < 0 && Number(currentValue) < min) {
      currentValue = String(min);
    }

    // 不支持小数
    if (currentValue.toString().indexOf('.') !== -1) {
      currentValue = currentValue.replace('.', '');
    }
    e.currentTarget.value = currentValue;
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    setOriginVal(currentValue);

    if (currentValue !== '0' && currentValue !== '') {
      onChange && onChange(currentValue);
    }
  };

  const _getSymbolLeft = useCallback((length: number) => {
    return (length + 2) * 8 + 1;
  }, []);

  const _onBlur = () => {
    if (min) {
      if (!originVal || Number(originVal) < min || originVal === '') {
        onChange(String(min));
        setOriginVal(min);
      }
    }
  };

  return (
    <>
      <div className="input-wrap">
        <input
          type="text"
          inputMode="decimal"
          value={originVal}
          onInput={_onInput}
          onBlur={_onBlur}
          onChange={_onChange}
          disabled={disabled}
        />
        <span className="symbol" style={{ left: _getSymbolLeft(String(originVal).length) }}>
          {symbol}
        </span>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default LeverInput;

const styles = css`
  .input-wrap {
    position: relative;
    input {
      background: var(--fill_input_1);
      color: var(--text_1);
      width: 100%;
      padding: 0 16px;
      height: 36px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      touch-action: manipulation;
      -webkit-appearance: none;
      overflow: visible;
      border: 0;
      outline: none;
      @media ${MediaInfo.mobile} {
        width: -webkit-fill-available;
      }
    }
    .symbol {
      color: var(--text_1);
      position: absolute;
      font-size: 14px;
      pointer-events: none;
      font-weight: 400;
      user-select: none;
      top: 9px;
    }
  }
`;
