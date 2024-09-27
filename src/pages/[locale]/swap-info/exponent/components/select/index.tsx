import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import SearchInput from './search-input';

/**
 * @prop {boolean} autoDefaultValue 自动赋予默认值
 * @returns
 */
const CryptoSelect = ({ options = [], value, onChange, label = '', screen }: any) => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState(options);
  const [visible, setVisible] = useState(false);
  let focus = false;
  useEffect(() => {
    if (keyword) {
      setData(options.filter((v: any) => v?.indexOf(keyword) !== -1));
    } else {
      setData(options);
    }
  }, [options, keyword]);

  const _onChange = (index: number) => {
    onChange?.(index);
    // console.log(index);
  };

  const _setKeyword = (v: any) => {
    const val = v?.toLocaleUpperCase();
    setKeyword(val);
  };

  const _focus = () => {
    setVisible(true);
  };

  const _blur = () => {
    const time = setTimeout(() => {
      if (!focus) setVisible(false);
      clearTimeout(time);
    }, 200);
  };

  const setFocus = (v: any) => {
    focus = v;
    if (!v) {
      _blur();
    }
  };

  const overlay = (
    <div className={'overlay'}>
      {screen && <SearchInput value={keyword} onChange={_setKeyword} setVisible={setFocus} />}
      <div className={'menus'}>
        {data.map((item: any, index: number) => {
          const key = options.findIndex((v: any) => v === data[index]);
          const active = key === value;
          return (
            <div key={index} className={clsx('menu', active && 'active')} onClick={() => _onChange(key)}>
              <div className={'text'}>{item}</div>
            </div>
          );
        })}
      </div>
      <style jsx>{styles}</style>
    </div>
  );

  return (
    <div className={'content'}>
      <div className={'label'}>{LANG(label)}</div>
      <Dropdown dropdownRender={(menu) => overlay} open={visible}>
        <div className={'select'} tabIndex={1} onFocus={_focus} onBlur={_blur}>
          {options[value]}
        </div>
      </Dropdown>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .overlay {
    background: var(--theme-background-color-3-2);
    border-radius: 4px;
    min-width: 100px;
    padding: 6px 10px;
    margin-left: -32px;
  }
  .menus {
    max-height: 250px;
    overflow: scroll;
    .menu {
      cursor: pointer;
      text-align: center;
      line-height: 1.5;
      font-size: 14px;
      font-weight: 400;
      padding: 6px 0px;
      color: var(--theme-font-color-3);
      &.active {
        color: var(--skin-primary-color) !important;
        font-weight: 500;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: var(--theme-background-color-3-2);
    border-radius: 3px;
    padding-left: 10px;
    .label {
      font-size: 14px;
      color: var(--theme-font-color-1);
    }
    .select {
      position: relative;
      cursor: pointer;
      padding: 0 30px 0 15px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: var(--theme-font-color-3);
      min-width: 100px;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 13px;
        right: 10px;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid rgba(123, 130, 148, 0.5);
      }
    }
  }
`;

export default CryptoSelect;
