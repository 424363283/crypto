import { BasicInputProps, INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { getUrlQueryParams } from '@/core/utils/src/get';
import { Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { store } from '../store';
interface ITEM_PROPS {
  key: string;
  label: string;
}
const SUGGEST_ITEMS: ITEM_PROPS[] = [
  {
    key: '1',
    label: '@gmail.com',
  },
  {
    key: '2',
    label: '@outlook.com',
  },
  {
    key: '3',
    label: '@yahoo.com',
  },
  {
    key: '4',
    label: '@icloud.com',
  },
];
type InputEmailProps = { className?: string } & Partial<Pick<BasicInputProps, 'type' | 'label'>> &
  Omit<BasicInputProps, 'type' | 'label'>;
export const InputEmail = (props: InputEmailProps) => {
  const { className, label = LANG('电子邮箱'), ...rest } = props;
  const [val, setVal] = useState('');
  const urlEmailValue = getUrlQueryParams('email');

  const onChange = (value: string) => {
    setVal(value);
  };
  const getItems = () => {
    return SUGGEST_ITEMS.map((item) => {
      return {
        ...item,
        label: `${val.replace(/@/g, '')}${item?.label}`,
      };
    });
  };

  useEffect(() => {
    if (urlEmailValue) {
      setVal(urlEmailValue);
    }
    return () => {
      store.emailCode = '';
    };
  }, [urlEmailValue]);
  useEffect(() => {
    store.email = val;
  }, [val]);
  const onClick = (item: any) => {
    const items = getItems();
    const selectedItem = items.find((i) => i.key === item.key);
    const label = selectedItem?.label || '';
    setVal(label);
  };
  const isVisible = () => {
    const value = val;
    return !/@[^@]+/.test(value) && !!value;
  };
  return (
    <div className={clsx('login-email-container', className)}>
      <Dropdown menu={{ items: getItems(), onClick }} placement='bottom' open={isVisible()}>
        <BasicInput
          placeholder={LANG('请输入邮箱地址')}
          type={INPUT_TYPE.EMAIL}
          {...rest}
          value={val}
          className='email-input'
          label={label}
          autoComplete='off'
          autoCapitalize='off'
          onInputChange={onChange}
        ></BasicInput>
      </Dropdown>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .login-email-container {
    margin-bottom: 30px;
    :global(.email-input) {
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
