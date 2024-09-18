import { useCurrencyScale } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { InputHTMLAttributes, useState } from 'react';
import css from 'styled-jsx/css';
import { DecimalInput } from '../numeric-input';  
export interface AmountInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  onClickFillAllAmount?: () => void;
  onInputChange: (value: string) => void;
  value: string;
  showBtn?: boolean;
  max?: number;
  min?: number;
  digit?: number;
  border?: boolean;
  currency?: string;
}

export const AmountInput = (props: AmountInputProps) => {
  const {
    label,
    placeholder = LANG('最小提币1'),
    onClickFillAllAmount,
    onInputChange,
    value,
    showBtn = true,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    border = true,
    currency = 'USDT',
    digit,
    ...rest
  } = props;
  const { scale } = useCurrencyScale(currency);
  const handleInputChange = (value: string) => {
    let newValue = value;
    if (newValue !== '') {
      const numValue = parseFloat(newValue);
      if (numValue > max) {
        newValue = max.toString();
      }
    }
    onInputChange(newValue);
  };

  const handleBlur = () => {
    let newValue = value;
    if (newValue !== '') {
      const numValue = parseFloat(newValue);
      if (numValue < min) {
        newValue = min.toString();
      }
    }
    setFocus(false);
    onInputChange(newValue);
  };

  const [focus, setFocus] = useState(false);
  return (
    <div className='amount-input-wrapper'>
      {label ? <h3 className='label'>{label}</h3> : null}
      <div
        className={clsx(
          'input-container',
          focus && border ? 'basic-input-bordered focused' : 'basic-input-bordered',
          !border ? 'none-bordered' : ''
        )}
      >
        <DecimalInput
          className={clsx('basic-input')}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setFocus(true)}
          onBlur={(event, origin) => {
            handleBlur();
            origin();
          }}
          digit={digit || scale}
          value={value}
          max={max}
          type='number'
          {...rest}
        />
        {showBtn && (
          <span className='all-btn' onClick={onClickFillAllAmount}>
            {LANG('全部')}
          </span>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .amount-input-wrapper {
    margin-top: 30px;
    .label {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      margin-bottom: 15px;
    }
    .input-container {
      display: flex;
      align-items: center;
      position: relative;
      .all-btn {
        display: flex;
        align-items: center;
      }
    }
    .basic-input-bordered {
      background: var(--theme-background-color-8);
      :global(.basic-input) {
        border-radius: 6px;
        padding: 0 20px;
        background: var(--theme-background-color-8);
      }
      .all-btn {
        margin-right: 20px;
        flex-shrink: 0;
        color: #f8bb37;
        cursor: pointer;
      }
    }
    .none-bordered {
      border: none;
    }
    .focused {
      border: 1px solid #ffb627;
    }
  }
`;
