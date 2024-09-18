import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { LOCAL_KEY, localStorageApi, useAppContext } from '@/core/store';
import { MediaInfo, isSafeValue } from '@/core/utils';
import { Input } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { clsx } from '../switch';
import { SelectCountryProps, SelectItem } from './types';

let common = [1, 82, 81, 66, 84, 44, 62, 90, 7];
let map = {} as any;
let timeout: any = null;

const SelectCountry = (props: SelectCountryProps) => {
  const { small = false, shouldReset, noName = false, className, selectedClassName, hideCode, onChange } = props;
  const { locale } = useAppContext();
  const [list, setList] = useState<SelectItem[]>([]);
  const [countryList, setCountryList] = useState<SelectItem[]>([]);
  const [select, setSelect] = useState<number>(36);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const list = localStorageApi.getItem(LOCAL_KEY.COUNTRY_CODE) as SelectItem[];
    if (list) {
      setCountryList(list);
    }
    const fetchCountryList = async () => {
      const res = await Account.getCountryList();
      if (res?.length !== list?.length || !list) {
        setCountryList(res);
        localStorageApi.setItem(LOCAL_KEY.COUNTRY_CODE, res);
      }
      return res;
    };

    fetchCountryList();
  }, []);

  useEffect(() => {
    const formatCountryList = async () => {
      let selectedIndex = countryList.findIndex((item: any) => item.countryCode === Account.countryCode);
      countryList.forEach((e: any, index) => {
        map[e.countryCode] = e;
        map[e.countryCode].index = index;
      });
      if (selectedIndex === -1 || !isSafeValue(Account.countryCode, true)) {
        selectedIndex = 35;
      }
      onChange?.(countryList[selectedIndex]);
      setSelect(selectedIndex);
      setList(countryList);
    };
    if (countryList.length) {
      formatCountryList();
    }
  }, [shouldReset, countryList]);
  if (list.length === 0) return null;
  const country = list[select] as any;
  const hide = noName || small;
  const input = inputValue?.toUpperCase();
  const _setHide = () => {
    timeout = setTimeout(() => {
      setShow(false);
      clearTimeout(timeout);
    }, 300);
  };
  const renderList = () => {
    return list.map((item: SelectItem, key: number) => {
      const nameEn = item.nameEn?.toUpperCase();
      const nameCn = item.nameCn?.toUpperCase();
      if (inputValue !== '') {
        if (isNaN(Number(input))) {
          if (locale === 'zh-CN') {
            if (!nameCn?.includes(input) && !nameEn?.includes(input)) return null;
          } else {
            if (!nameEn?.includes(input) && !nameCn?.includes(input)) return null;
          }
        } else {
          if (!item.countryCode.toString().startsWith(inputValue.toString())) return null;
        }
      }
      return (
        <div
          className={['emulate-select-option', select === key && 'active'].join(' ')}
          key={key}
          onClick={() => {
            setSelect(key);
            setShow(false);
            onChange?.(item);
          }}
        >
          {item.nameEn}&nbsp;+
          {item.countryCode}
        </div>
      );
    });
  };
  const renderCommonList = () => {
    if (inputValue === '') {
      return (
        <>
          <div className='emulate-select-option-divider'>{LANG('常用')}</div>
          {common.map((ele: number, key: number) => {
            const item = map[ele];
            if (!item) return null;
            return (
              <div
                className={['emulate-select-option', select === item.index && 'active'].join(' ')}
                key={key}
                onClick={() => {
                  setSelect(item.index);
                  setShow(false);
                  onChange?.(item);
                }}
              >
                {item.nameEn}&nbsp;+
                {item.countryCode}
              </div>
            );
          })}
          <div className='emulate-select-option-divider'>{LANG('全部')}</div>
        </>
      );
    }
    return null;
  };
  const onInputFocus = () => {
    clearTimeout(timeout);
    setFocus(true);
  };
  return (
    <div
      className={clsx(
        'emulate-select-country',
        'emulate-select-base',
        small && 'small',
        show && hideCode && 'focus',
        className
      )}
    >
      <div
        tabIndex={0}
        className={clsx('emulate-select-selected', selectedClassName)}
        onClick={() => setShow(!show)}
        onBlur={() => {
          _setHide();
        }}
      >
        {!hideCode && <>+{country?.countryCode} </>}
        {!!hide ? (
          ''
        ) : (
          <React.Fragment>
            {!hideCode && <b>|</b>} {locale === 'zh-CN' ? country?.nameCn : country?.nameEn}
          </React.Fragment>
        )}
        <CommonIcon name={show ? 'common-tiny-triangle-up-0' : 'common-tiny-triangle-down'} size={14} />
      </div>
      <div className={clsx('emulate-select-options', show && 'show')}>
        <div className={clsx('emulate-select-input', focus && 'input-focus')}>
          <Image
            src='/static/images/common/search-icon.svg'
            width={16}
            height={16}
            alt='search icon'
            className='country-search-icon'
          />
          <Input
            value={input}
            onChange={(e: any) => setInputValue(e.target.value)}
            placeholder={'search'}
            className='emulate-input'
            onFocus={onInputFocus}
            onBlur={() => {
              _setHide();
              setFocus(false);
            }}
          />
        </div>
        <div className='emulate-select-scroll'>
          {renderCommonList()}
          {renderList()}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
export default SelectCountry;

const styles = css`
  .emulate-select-base {
    flex: 1 1;
    display: flex;
    position: relative;
    height: 40px;
    align-items: center;
    &.focus {
      box-shadow: var(--skin-focus-shadow-1);
    }
    .emulate-select-selected {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px 0 10px;
      position: relative;
      padding-left: 16px;
      color: var(--theme-font-color-3);
      font-size: 14px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      b {
        color: var(--theme-font-color-1);
      }
    }
    .emulate-select-options {
      display: none;
      position: absolute;
      transition: all 0.3s;
      opacity: 0;
      top: 50px;
      left: -12px;
      width: 100%;
      background: var(--theme-background-color-2);
      z-index: 99;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      &.show {
        display: block;
        animation: fadeOut 0.3s;
        animation-fill-mode: forwards;
      }
      :global(.emulate-select-input) {
        margin: 14px 8px;
        display: flex;
        align-items: center;
        position: relative;
        :global(.country-search-icon) {
          position: absolute;
          left: 2px;
          z-index: 99;
          align-self: center;
          width: 40px;
        }
        :global(.emulate-input) {
          background-color: var(--theme-background-color-2);
          border-radius: 8px;
          margin: 0 auto;
          text-indent: 32px;
          height: 42px;
          color: var(--theme-font-color-1);
          border: 1px solid var(--skin-border-color-1);
          &::placeholder {
            color: var(--theme-font-color-2);
          }
        }
      }
      :global(.input-focus) {
        border: 1px solid var(--skin-color-active);
        border-radius: 8px;
      }
      .emulate-select-scroll {
        overflow: auto;
        height: 300px;
      }
      :global(.emulate-select-option-divider) {
        padding: 0 16px;
        margin-bottom: 8px;
        height: 32px;
        line-height: 32px;
        color: var(--theme-font-color-1);
        font-size: 14px;
        font-weight: 500;
      }
      :global(.emulate-select-option) {
        height: 20px;
        line-height: 20px;
        padding: 8px 16px;
        box-sizing: content-box !important;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        margin: 0 10px;
        border-radius: 8px;
        transition: all 0.5s;
        color: var(--theme-font-color-1);
        &.active {
          color: var(--skin-primary-color);
        }
        &:hover {
          color: var(--skin-hover-font-color);
          background: rgba(var(--skin-primary-color-rgb), 0.15);
        }
      }
    }
  }

  .emulate-select-country {
    &.small {
      flex: none;
      width: 70px;
      .emulate-select-options {
        width: 410px;
        @media ${MediaInfo.mobile} {
          width: 325px;
        }
      }
      .emulate-select-selected::after {
        right: 2px;
      }
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;
