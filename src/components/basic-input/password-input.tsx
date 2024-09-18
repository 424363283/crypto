import { INPUT_TYPE } from '@/components/basic-input';
import { AssetValueToggleIcon } from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput, BasicInputProps } from '.';
import { store } from '../account/store';
export const PasswordInput = (props: Partial<BasicInputProps>) => {
  const {
    label,
    placeholder = LANG('请输入登录密码'),
    onInputChange,
    className = '',
    type = INPUT_TYPE.PASSWORD,
    value = '',
    ...rest
  } = props;
  const [val, setVal] = useState(value);
  const [eyeOpen, setEyeOpen] = useState(false);

  const onChange = (val: string, hasError?: boolean) => {
    if (onInputChange) {
      onInputChange(val, hasError);
    } else {
      setVal(val);
    }
  };
  useEffect(() => {
    setVal(value);
  }, [value]);
  useEffect(() => {
    store.password = val;
  }, [val]);
  return (
    <div className={clsx('input-pwd-wrapper', className)}>
      <BasicInput
        label={label || LANG('登录密码')}
        type={type}
        {...rest}
        value={val}
        showPwd={eyeOpen}
        placeholder={placeholder}
        onInputChange={onChange}
      />
      <AssetValueToggleIcon className='eye-icon' show={eyeOpen} onClick={() => setEyeOpen(!eyeOpen)} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .input-pwd-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    .login-pwd-label {
      line-height: 16px;
      font-size: 14px;
      font-weight: bold;
      color: #232e34;
    }
    :global(.eye-icon) {
      position: absolute;
      right: 15px;
      top: 50px;
      cursor: pointer;
    }
    :global(.basic-input-container) {
      :global(.basic-input) {
        margin-right: 40px;
      }
    }
    .input-pwd-box {
      padding-right: 0;
      .small {
        font-size: 12px;
      }
    }
  }
`;
