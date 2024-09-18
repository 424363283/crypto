import AppInput, { DecimalInput } from '@/components/numeric-input';
import { clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';

const InputSection = ({ label, labelRight, renderRight, value, onBlur, ...props }: any) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className={'input-setion'}>
      <div className={'label'}>
        {label}
        {labelRight}
      </div>
      <div className={clsx('input-wrapper', 'pc-v2-input', focus && 'focus')}>
        <AppInput
          component={DecimalInput}
          className={'input'}
          onFocus={() => setFocus(true)}
          onBlur={(event: any, originLogic: any) => {
            setFocus(false);
            onBlur(event, originLogic);
          }}
          value={value}
          {...props}
        />
        {renderRight}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .input-setion {
    .label {
      min-height: 14px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-3);
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .input-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 48px;
      border: 1px solid transparent;
      border-radius: 5px;
      background: var(--theme-background-color-8);
      &.focus {
        border-color: var(--skin-color-active);
      }
      &:hover {
        border-color: var(--skin-color-active);
      }
      :global(.input) {
        margin: 0;
        height: 100%;
        flex: 1;
        border: 0;
        border-radius: 5px;
        :global(input) {
          height: 100%;
          text-indent: 10px;
          color: var(--theme-font-color-1);
        }
        :global(label) {
          left: 19px;
        }
        :global(label),
        :global(input) {
          font-size: 18px;
          font-weight: 500;
        }
      }
      :global(> *:nth-child(2)) {
        flex: none;
        width: 95px;
        position: relative;
        right: 9px;
      }
    }
  }
`;

export default InputSection;
