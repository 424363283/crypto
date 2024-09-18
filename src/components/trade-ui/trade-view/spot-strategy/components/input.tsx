import { ChangeEvent } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: number | string;
  decimal?: number;
  max?: number;
  min?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onMaxTextClicked?: () => void;
  placeholder?: string;
  maxText?: string;
  disabled?: boolean;
  errorText?: string | (() => string);
}

const Input = ({
  min,
  max,
  value,
  decimal = 0,
  onChange,
  placeholder,
  onBlur,
  disabled = false,
  maxText = '',
  onMaxTextClicked,
  errorText = '',
}: Props) => {
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
    if (min && value !== '' && Number(value) < min) {
      onChange(String(min.toFixed(decimal)));
    }
    onBlur && onBlur();
  };

  const hasError = typeof errorText === 'string' ? errorText !== '' : errorText() !== '';

  return (
    <>
      <div className='container'>
        <div className='input-wrapper'>
          <input
            placeholder={placeholder}
            type='text'
            onBlur={() => _onBlur()}
            onInput={_onInput}
            value={value}
            onChange={_onChange}
            disabled={disabled}
          />
          {maxText && <span onClick={onMaxTextClicked}>{maxText}</span>}
        </div>
        {value !== '' && hasError && (
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
          border-color: var(--const-color-error);
        }
      }
    }
    .input-wrapper {
      box-sizing: border-box;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      background: var(--theme-tips-color);
      > input {
        flex: 1;
        border: none;
        font-weight: 500;
        padding: 0 10px;
        background: var(--theme-tips-color);
        color: var(--theme-font-color-1);
        border: 1px solid var(--theme-tips-color);
        width: 100%;
        font-size: 12px;
        line-height: 38px;
        height: 38px;
        border-radius: 8px;
      }
      span {
        font-size: 12px;
        color: var(--skin-main-font-color);
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .error {
      margin-top: 5px;
      color: var(--const-color-error);
    }
  }
`;
