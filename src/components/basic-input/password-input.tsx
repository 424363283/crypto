import { INPUT_TYPE } from '@/components/basic-input';
import { AssetValueToggleIcon } from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput, BasicInputProps } from '.';
import { store } from '../account/store';
import { Size } from '../constants';
import { Dropdown } from 'antd';
import Radio from '@/components/Radio';
import { useResponsive } from '@/core/hooks';
interface ITEM_PROPS {
  key: string;
  reg: RegExp;
  label: string;
}
const SUGGEST_ITEMS: ITEM_PROPS[] = [
  {
    key: '1',
    reg: new RegExp('^.{6,16}$'),
    label: LANG('长度为6-16位字符'),
  },
  {
    key: '2',
    reg: new RegExp('[0-9]+'),
    label: LANG('至少包含1位数字字符'),
  },
  {
    key: '3',
    reg: new RegExp('[A-Za-z]+'),
    label: LANG('至少包含1位字母'),
  },
];

export const PasswordInput = (props: Partial<BasicInputProps> & { showPwdVerifyTips?: boolean }) => {
  const {
    label,
    placeholder = LANG('请输入登录密码'),
    onInputChange,
    className = '',
    type = INPUT_TYPE.PASSWORD,
    showPwdVerifyTips = false,
    value = '',
    ...rest
  } = props;
  const [val, setVal] = useState(value);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [verifyTipsVisible, setVerifyTipsVisible] = useState(false);
  const [pwdVerifyPassed, setPwdVerifyPassed] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  const onChange = (val: string, hasError?: boolean) => {
    if (onInputChange) {
      onInputChange(val, hasError);
    } else {
      setVal(val);
    }
  };
  const hasInputError = (inputValue: string, item: ITEM_PROPS) => {
    if (!inputValue) return false;
    return item.reg.test(inputValue);
  }
  const getItems = () => {
    return SUGGEST_ITEMS.map((item) => {
      return {
        ...item,
        label: <Radio size={14} fillColor='var(--green)' label={item?.label} checked={hasInputError(val, item)} />
      };
    });
  }

  useEffect(() => {
    setVal(value);
  }, [value]);
  useEffect(() => {
    const isPwdPassed = SUGGEST_ITEMS.every(item => hasInputError(val, item));
    setPwdVerifyPassed(isPwdPassed);
    store.password = val;
  }, [val]);
  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        if (showPwdVerifyTips) {
          setVerifyTipsVisible(true);
        }
        console.log('Input is focused');
      }, 100);
    };
    const handleBlur = () => {
      setVerifyTipsVisible(false);
      console.log('Input is blur');
    };
    inputRef.current?.addEventListener('focus', handleFocus);
    inputRef.current?.addEventListener('blur', handleBlur);

    return () => {
      inputRef.current?.removeEventListener('focus', handleFocus);
      inputRef.current?.removeEventListener('blur', handleBlur);
    };
  }, []);
  return (
    <div className={clsx('input-wrapper', className)}>
      <Dropdown
        overlayStyle={{
          minWidth: 202,
          padding: 0,
          marginTop: 8,
          borderRadius: '16px',
          backgroundColor: 'var(--dropdown-select-bg-color)',
          boxShadow: '0px 4px 16px 0px var(--dropdown-select-shadow-color)',
        }}
        menu={{ items: getItems() }}
        placement={isMobile ? 'bottomLeft' : 'bottomRight'}
        open={!pwdVerifyPassed && verifyTipsVisible}>
        <BasicInput
          ref={inputRef}
          label={label || LANG('登录密码')}
          type={type}
          size={isMobile ? Size.LG : Size.XL}
          value={val}
          showPwd={eyeOpen}
          placeholder={placeholder}
          onInputChange={onChange}
          suffix=<AssetValueToggleIcon className='eye-icon' show={eyeOpen} onClick={() => setEyeOpen(!eyeOpen)} />
          clearable={true}
          {...rest}
        />
      </Dropdown>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    :global(.eye-icon) {
      cursor: pointer;
      z-index: 1;
    }
  }
`;
