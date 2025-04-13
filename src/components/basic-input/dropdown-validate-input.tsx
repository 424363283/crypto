import { INPUT_TYPE } from '@/components/basic-input';
import { AssetValueToggleIcon } from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput, BasicInputProps } from '.';
// import { store } from '../account/store';
import { Size } from '../constants';
import { Dropdown } from 'antd';
import Radio from '@/components/Radio';
import { useResponsive } from '@/core/hooks';
interface ITEM_PROPS {
  key: string;
  reg: RegExp;
  label: string;
}
export const DropdownValidateInput = (props: Partial<BasicInputProps> & { options: ITEM_PROPS[], showVerifyOptionsTips?: boolean }) => {
  const {
    label = LANG('文本标题'),
    placeholder = LANG('请输入文本'),
    onInputChange,
    className = '',
    type = INPUT_TYPE.NORMAL_TEXT,
    showVerifyOptionsTips = false,
    value = '',
    options = [],
    ...rest
  } = props;
  const [val, setVal] = useState(value);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [verifyTipsVisible, setVerifyTipsVisible] = useState(false);
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
    return options.map((item) => {
      return {
        ...item,
        label: <Radio size={14} fillColor='var(--green)' label={item?.label} checked={hasInputError(val, item)} />
      };
    });
  }

  useEffect(() => {
    setVal(value);
  }, [value]);
  // useEffect(() => {
  //   store.password = val;
  // }, [val]);
  useEffect(() => {
    const handleFocus = () => {
      if (showVerifyOptionsTips) {
        setVerifyTipsVisible(true);
      }
      console.log('Input is focused');
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
        placement='bottomRight'
        open={verifyTipsVisible}>
        <BasicInput
          ref={inputRef}
          label={label}
          type={type}
          size={isMobile ? Size.LG : Size.XL}
          value={val}
          showPwd={eyeOpen}
          placeholder={placeholder}
          onInputChange={onChange}
          suffix={type === INPUT_TYPE.PASSWORD && <AssetValueToggleIcon className='eye-icon' show={eyeOpen} onClick={() => setEyeOpen(!eyeOpen)} />}
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
