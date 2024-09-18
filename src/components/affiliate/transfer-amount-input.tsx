import { ChangeEvent } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onMaxBtnClicked: () => void;
  placeholder?: string;
  decimal?: number;
}

const AffiliateAmountInput = ({ value, onChange, placeholder, onMaxBtnClicked, decimal = 0 }: Props) => {
  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.currentTarget.value);
  };

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

    e.currentTarget.value = currentValue;
  };

  return (
    <>
      <div className='container'>
        <input type='text' onChange={_onChange} value={value} placeholder={placeholder} onInput={_onInput} />
        <span onClick={onMaxBtnClicked}>MAX</span>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default AffiliateAmountInput;

const styles = css`
  .container {
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    padding: 0 16px;
    background-color: var(--theme-background-color-8);
    width: 100%;
    input {
      flex: 1;
      color: var(--theme-font-color-1);
      border: none;
      background-color: inherit;
      &::placeholder {
        color: var(--theme-font-color-3);
      }
    }
    span {
      color: var(--skin-primary-color);
      cursor: pointer;
    }
  }
`;
