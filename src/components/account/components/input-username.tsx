import { BasicInputProps, INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { store } from '../store';

type InputUsernameProps = { className?: string } & Partial<Pick<BasicInputProps, 'type' | 'label'>> &
  Omit<BasicInputProps, 'type' | 'label'>;
export const InputUsername = (props: InputUsernameProps) => {
  const { className, label = LANG('用户名称'), ...rest } = props;
  const [val, setVal] = useState('');
  const onChange = (value: string) => {
    setVal(value);
  };
 
  useEffect(() => {
    store.username = val;
  }, [val]); 
  
  return (
    <div className={clsx('login-username-container', className)}>
       <BasicInput
          placeholder={LANG('请输入用户名称')}
          type={INPUT_TYPE.NORMAL_TEXT}
          {...rest}
          value={val}
          className='username-input'
          label={label}
          autoComplete='off'
          autoCapitalize='off'
          onInputChange={onChange}
        ></BasicInput>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .login-username-container {
    margin-bottom: 30px;
    :global(.username-input) {
      :global(.error-input-tips) {
        position: absolute;
        font-size: 12px;
      }
    }
    :global(.email-icon) {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
  :global(.ant-dropdown) {
    :global(.ant-dropdown-menu) {
      background-color: var(--theme-background-color-2);
      :global(.ant-dropdown-menu-title-content) {
        color: var(--theme-font-color-1);
        padding: 6px 8px;
        &:hover {
          color: var(--skin-color-active);
          background-color: var(--theme-background-color-3);
          border-radius: 8px;
        }
      }
    }
  }
`;
