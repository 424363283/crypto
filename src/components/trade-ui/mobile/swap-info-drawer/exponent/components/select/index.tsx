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
      <Dropdown
        dropdownRender={menu => overlay}
        open={visible}
        //  open={true}
      >
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
  }
  .menus {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    border-radius:0 0 8px 8px;
    background: var(--fill_pop);
    box-shadow: 0px 0px 4px 0px var(--fill_shadow);
    padding: 4px 0;
    max-height: 250px;
    overflow: scroll;
    .menu {
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 12px;
      font-weight: 500;
      color: var(--text_2);
      &.active {
        color: var(--brand);
      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    gap: 8px;
    .label {
      font-size: 14px;
      color: var(--theme-font-color-1);
    }
    .select {
      position: relative;
      display: flex;
      align-items: center;
      line-height: 1.5rem;
      border-radius: 4px;
      height: 1.5rem;
      padding: 0 1rem;
      gap: 8px;
      font-size: 12px;
      min-width: 4.375rem;
      background: var(--fill_3);
      color: var(--text_1);
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--text_3);
      }
    }
  }
`;

export default CryptoSelect;
