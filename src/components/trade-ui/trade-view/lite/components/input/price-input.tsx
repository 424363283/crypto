import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite } from '@/core/shared';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const Trade = Lite.Trade;

interface Props {
  value: number | string;
  decimal?: number;
  label?: string;
  labelRender?: () => ReactNode;
  placeholder?: string;
  onChange: (value: string) => void;
  isNegative?: boolean;
  max?: number;
  min?: number;
  addStep: number;
  minusStep: number;
  isCoupon?: boolean;
  onCouponClick?: () => void;
  labelClass?: string;
  canEmpty?: boolean;
  onBlur?: () => void;
  bonusId?: string;
  controls?: boolean;
  controlsAlign?: 'between' | 'left';
}

const PriceInput = ({
  value,
  decimal = 0,
  label = '',
  placeholder = '',
  onChange,
  isNegative = true,
  min,
  max,
  addStep,
  minusStep,
  isCoupon = false,
  onCouponClick,
  labelRender,
  labelClass,
  canEmpty = false,
  onBlur,
  bonusId = '',
  controls = true,
  controlsAlign = 'between',
}: Props) => {
  const { isDark, theme } = useTheme();
  const [isFocus, setIsFocus] = useState(false);
  const [originVal, setOriginVal] = useState(value);

  const { bonusList } = Trade.state;

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

    e.currentTarget.value = currentValue;
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    setOriginVal(currentValue);
    onChange(currentValue);
  };

  const _onBlur = () => {
    if (min && (!originVal || Number(originVal) < min || originVal === '-')) {
      if (canEmpty && originVal === '') {
        onChange('');
      } else {
        onChange(String(min));
        setOriginVal(min);
      }
    }
    setIsFocus(false);
    onBlur && onBlur();
  };

  const onAdd = () => {
    if (max !== undefined && Number(originVal) < max) {
      const result = Number(originVal).add(addStep);
      onChange(Number(result) > max ? String(max) : String(result));
    }
    if (max === 0) {
      const result = originVal.add(addStep);
      onChange(result);
    }
  };

  const onMinus = () => {
    if (min !== undefined && Number(originVal) > min) {
      const result = Number(originVal).sub(minusStep);
      onChange(Number(result) < min ? String(min) : String(result));
    }
  };

  const renderCoupon = useCallback(() => {
    if (bonusList.length === 0) return null;
    return (
      <div className='controller select-coupon' onClick={onCouponClick}>
        <Image src='/static/images/lite/coupon_icon.png' width={12} height={12.44} alt='' className='coupon-icon' />
        <span>{LANG('赠金')}</span>
      </div>
    );
  }, [onCouponClick, bonusList]);

  return (
    <>
      <div className='trade-input'>
        {labelRender ? labelRender() : <span className={`label ${labelClass && labelClass}`}>{label}</span>}
        <div className={`${theme} ${clsx('container', isFocus && 'focus')}`}>
          {(!isCoupon && controls && controlsAlign === 'between') && <div className='controller'>
            <button className='btn-control' onClick={onAdd}>
              <span>+</span>
            </button>
          </div>}
          <input
            value={isCoupon && bonusId === '' ? LANG('暂无赠金') : originVal}
            type='text'
            onInput={_onInput}
            placeholder={placeholder}
            onFocus={() => setIsFocus(true)}
            onBlur={_onBlur}
            onChange={_onChange}
            disabled={isCoupon}
          />
          {(!isCoupon && controls) && <div className='controller'>
            {controlsAlign === 'left' && <button className='btn-control' onClick={onAdd}>
              <span>+</span>
            </button>}
            <button className='btn-control' onClick={onMinus}>
              <span>-</span>
            </button>
          </div>}
          {isCoupon && renderCoupon()}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default PriceInput;
const styles = css`
  .trade-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    .label {
      color: var(--text-tertiary);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .container {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      background: var(--fill-3);
      input {
        flex: 1;
        color: var(--text-primary);
        padding: 0 8px;
        font-size: 14px;
        font-weight: 500;
        outline: none;
        border: 0;
        width: 100%;
        text-align: center;
        background: var(--fill-3);
        &::placeholder,
        input::placeholder,
        input::-webkit-input-placeholder,
        &::-webkit-input-placeholder {
          color: var(--text-tertiary);
        }
        &:disabled {
          background: transparent;
        }
      }
      .controller {
        width: auto;
        overflow: hidden;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        span {
          font-size: 12px;
          font-weight: 500;
        }
        .btn-control {
          border: none;
          outline: 0;
          height: 40px;
          width: auto;
          background: transparent;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          border-radius: 6px;
          cursor: pointer;
          padding: 0 8px;
          span {
            color: var(--text-tertiary);
            text-align: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
        }
      }
      :global(.select-coupon) {
        padding-right: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: var(--text-primary);
        &:after {
          content: '';
          display: inline-block;
          border: 5px solid transparent;
          border-top-color: #6c6c6d;
          margin: 5px 0 0 4px;
        }
        :global(.coupon-icon) {
          margin-right: 4px;
        }
      }
    }
  }
`;
