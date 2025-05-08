import { useCurrencyScale, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
import { InputHTMLAttributes, useState } from 'react';
import css from 'styled-jsx/css';
import { DecimalInput } from '../numeric-input';
import { Size } from '../constants';
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
  const { isMobile } = useResponsive();
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
    <div className="amount-input-wrapper">
      {label ? <h3 className="label">{label}</h3> : null}
      <div
        className={clsx(
          'input-container',
          focus && border ? 'basic-input-bordered focused' : 'basic-input-bordered',
          !border ? 'none-bordered' : ''
        )}
      >
        <DecimalInput
          className={clsx('basic-input')}
          style={{ height: isMobile ? '40px' : '56px' }}
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
          type="number"
          {...rest}
        />
        {showBtn && (
          <span className="all-btn" onClick={onClickFillAllAmount}>
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
    @media ${MediaInfo.mobile} {
      margin-top: 0;
    }
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
      &:hover,
      &.active {
        box-shadow: 0 0 0 1px var(--brand);
      }
      .all-btn {
        display: flex;
        align-items: center;
      }
    }
    .basic-input-bordered {
      border-radius: 16px;
      background: var(--fill_3);
      @media ${MediaInfo.mobile}{
        border-radius: 8px;
      }
      :global(.basic-input) {
        border-radius: 16px;
        padding: 0 20px;
        background: var(--fill_3);
        @media ${MediaInfo.mobile} {
          font-size: 14px;
        }
      }
      .all-btn {
        margin-right: 20px;
        flex-shrink: 0;
        color: var(--text_brand);
        cursor: pointer;
        @media ${MediaInfo.mobile} {
          font-size: 12px;
        }
      }
    }
    .none-bordered {
      border: none;
    }

    .focused {
      box-shadow: 0 0 0 1px var(--brand);
    }
  }
`;
