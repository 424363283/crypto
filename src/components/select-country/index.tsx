import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { LOCAL_KEY, localStorageApi, useAppContext } from '@/core/store';
import { MediaInfo, isSafeValue } from '@/core/utils';
import { Input } from 'antd';
import Image from 'next/image';
import React, { ReactNode, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { clsx } from '../switch';
import { CountryListInfo, SelectCountryProps, SelectItem } from './types';
import { Desktop, Mobile, MobileOrTablet } from '@/components/responsive';
import { MobileBottomSheet } from '../mobile-modal';
import { useResponsive } from '@/core/hooks';
import { EmptyComponent } from '../empty';
import { Layer } from '../constants';
import { useRouter } from '@/core/hooks/src/use-router';

let common = [1, 82, 81, 66, 84, 44, 62, 90, 7];
let map = {} as any;
let timeout: any = null;

const SelectCountry = (props: SelectCountryProps) => {
  const {
    small = false,
    shouldReset,
    noName = false,
    className,
    selectedClassName,
    hideCode,
    onChange,
    showLabel = false
  } = props;
  const router = useRouter();
  const { isMobileOrTablet } = useResponsive();
  // const { locale } = useAppContext();
  const { locale }: { locale: string } = router.query;
  const [list, setList] = useState<SelectItem[]>([]);
  const [countryData, setCountryData] = useState<CountryListInfo>({} as CountryListInfo);
  const [select, setSelect] = useState<number>(36);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [focus, setFocus] = useState(false);

  const countryList: SelectItem[] = countryData?.list;
  const countryIconUrl: string = countryData?.countryIconUrl;

  useEffect(() => {
    const data = localStorageApi.getItem(LOCAL_KEY.COUNTRY_CODES) as CountryListInfo;
    if (data && data.list) {
      setCountryData(data);
    }

    const fetchCountryList = async () => {
      const res = (await Account.getCountryList()) as CountryListInfo;
      if (res?.list?.length !== data?.list?.length || !data?.list) {
        setCountryData(res);
        localStorageApi.setItem(LOCAL_KEY.COUNTRY_CODES, res);
      }
      return res;
    };

    fetchCountryList();
  }, []);

  useEffect(() => {
    const formatCountryList = async () => {
      const cacheIndex = localStorageApi.getItem(LOCAL_KEY.COUNTRY_INDEX) as Number
      const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      const countryCode = userLocale.split('-')[1] || ''
      const localIndex  = countryList.findIndex((country) => country?.code === countryCode)
      let selectedIndex = cacheIndex || localIndex || countryList.findIndex((item: any) => item.countryCode === Account.countryCode);
      countryList.forEach((e: any, index) => {
        map[e.countryCode] = e;
        map[e.countryCode].index = index;
      });
      if (selectedIndex === -1 || !isSafeValue(Account.countryCode, true)) {
        selectedIndex = 35;
      }
      onChange?.(countryList[selectedIndex]);
      setSelect(Number(selectedIndex));
      setList(countryList);
    };
    if (countryList?.length) {
      formatCountryList();
    }
  }, [shouldReset, countryData,]);
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
    let result = list.reduce((total: ReactNode[], item: SelectItem, key: number) => {
      const nameEn = item.nameEn?.toUpperCase();
      const nameCn = item.nameCn?.toUpperCase();
      if (inputValue !== '') {
        if (isNaN(Number(input))) {
          if (locale === 'zh') {
            if (!nameCn?.includes(input) && !nameEn?.includes(input)) return total;
          } else {
            if (!nameEn?.includes(input) && !nameCn?.includes(input)) return total;
          }
        } else {
          if (!item.countryCode.toString().startsWith(inputValue.toString())) return total;
        }
      }

      let listItem = (
        <div
          className={['emulate-select-option', select === key && 'active'].join(' ')}
          key={key}
          onClick={() => {
            setSelect(key);
            setShow(false);
            onChange?.(item);
            localStorageApi.setItem(LOCAL_KEY.COUNTRY_INDEX,key);
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {countryIconUrl && <Image alt="" src={countryIconUrl + item.icon} width="24" height="24" />}
            <div style={{ paddingLeft: '15px' }}>{locale === 'zh' ? item?.nameCn : item?.nameEn}</div>
          </div>
          <div className="country-code"> +{item.countryCode} </div>
        </div>
      );
      total.push(listItem);
      return total;
    }, []);
    if (!result.length) {
      return <EmptyComponent style={{ height: 300 }} text={LANG('暂无数据')} layer={Layer.Overlay} />;
    }
    return result;
  };

  const renderCommonList = () => {
    if (inputValue === '') {
      return (
        <>
          <div className="emulate-select-option-divider">{LANG('常用')}</div>
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
                  localStorageApi.setItem(LOCAL_KEY.COUNTRY_INDEX,item.index);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {countryIconUrl && <Image alt="" src={countryIconUrl + item.icon} width="24" height="24" />}
                  <div style={{ paddingLeft: '15px' }}>{locale === 'zh' ? item?.nameCn : item?.nameEn}</div>
                </div>
                <div className="country-code"> +{item.countryCode} </div>
              </div>
            );
          })}
          <div className="emulate-select-option-divider">{LANG('全部')}</div>
        </>
      );
    }
    return null;
  };

  const onInputFocus = () => {
    clearTimeout(timeout);
    setFocus(true);
  };

  const selectMain = () => {
    return (
      <>
        <div className={clsx('emulate-select-options', show && 'show')}>
          <div className={clsx('emulate-select-input', focus && 'input-focus')}>
            <Image
              src="/static/images/common/search-icon.svg"
              width={16}
              height={16}
              alt="search icon"
              className="country-search-icon"
            />
            <Input
              variant='filled'
              value={inputValue}
              onChange={(e: any) => setInputValue(e.target.value)}
              placeholder={LANG('搜索地区')}
              className="emulate-input"
              onFocus={onInputFocus}
              onBlur={() => {
                _setHide();
                setFocus(false);
              }}
            />
          </div>
          <div className="emulate-select-scroll">
            {renderCommonList()}
            {renderList()}
          </div>
        </div>
        <style jsx>{styles}</style>
      </>
    );
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
          isMobileOrTablet ? null : _setHide();
        }}
      >
        <div className={clsx('country-info')}>
          {countryIconUrl && <Image alt="" src={countryIconUrl + country.icon} width="24" height="24" />}
          {showLabel ? (locale === 'zh' ? country?.nameCn : country?.nameEn) : ''}
        </div>
        <div className="select-country-action">
          {!hideCode && <span className="country-code">+{country?.countryCode} </span>}
          {!!hide ? (
            ''
          ) : (
            <React.Fragment>
              {!hideCode && <b>|</b>}{' '}
              <span className="country-name">{locale === 'zh' ? country?.nameCn : country?.nameEn}</span>
            </React.Fragment>
          )}
          <CommonIcon name={'common-tiny-triangle-down3'} size={14} />
        </div>
      </div>
      <Desktop>{selectMain()}</Desktop>
      <MobileOrTablet>
        <>
          <MobileBottomSheet
            title={LANG('选择国家')}
            content={selectMain()}
            visible={show}
            hasBtn={false}
            close={() => setShow(false)}
          />
        </>
      </MobileOrTablet>
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
    height: 56px;
    padding: 16px;
    align-items: center;
    border-radius: 16px;
    background-color: var(--fill_input_1);
    border: 1px solid transparent;
    box-sizing: border-box;
    &:hover {
      border-color: var(--brand);
      background-color: var(--fill_bg_1);
    }
    &.focus {
      box-shadow: var(--skin-focus-shadow-1);
    }
    @media ${MediaInfo.mobile} {
      height: 50px;
      border-radius: 12px;
    }
    .emulate-select-selected {
      display: flex;
      align-items: center;
      position: relative;
      color: var(--text_1);
      font-size: 14px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      & :global(*:not(:last-child)) {
        margin-right: 5px;
      }
      b {
        color: var(--theme-font-color-1);
      }
      .country-info {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .select-country-action {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
      }
    }
    &.small {
      flex: none;
      width: 110px;
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

  .emulate-select-options {
    display: none;
    opacity: 0;
    position: absolute;
    transition: all 0.3s;
    top: 60px;
    left: 0px;
    width: 100%;
    background: var(--dropdown-select-bg-color);
    z-index: 99;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
    @media ${MediaInfo.mobile} {
      position: relative;
      top: 0px;
      box-shadow: none;
    }
    &.show {
      display: block;
      animation: fadeOut 0.3s;
      animation-fill-mode: forwards;
    }
    :global(.emulate-select-input) {
      margin: 16px;
      display: flex;
      align-items: center;
      position: relative;
      @media ${MediaInfo.mobile} {
        margin: 0 0 16px;
      }
      :global(.country-search-icon) {
        position: absolute;
        left: 2px;
        z-index: 99;
        align-self: center;
        width: 40px;
      }
      :global(.emulate-input) {
        background-color: var(--fill_input_2);
        margin: 0 auto;
        text-indent: 32px;
        height: 32px;
        color: var(--text_1);
        border-radius: 48px;
        &::placeholder {
          color: var(--text_2);
        }
        @media ${MediaInfo.mobile} {
          text-indent: 48px;
          height: 48px;
        }
      }
    }
    :global(.input-focus) {
      // border: 1px solid var(--brand);
      border-radius: 8px;
    }
    .emulate-select-scroll {
      overflow: auto;
      height: 300px;
      @media ${MediaInfo.mobile} {
        height: 300px;
      }
    }
    :global(.emulate-select-option-divider) {
      padding: 0 16px;
      margin-bottom: 8px;
      height: 32px;
      line-height: 32px;
      color: var(--theme-font-color-1);
      font-size: 14px;
      font-weight: 500;
      @media ${MediaInfo.mobile} {
        padding: 0;
      }
    }
    :global(.emulate-select-option) {
      height: 32px;
      line-height: 32px;
      padding: 8px 16px;
      box-sizing: content-box !important;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.5s;
      color: var(--theme-font-color-1);
      display: flex;
      align-items: center;
      display: flex;
      justify-content: space-between;
      items-align: center;
      @media ${MediaInfo.mobile} {
        padding: 8px 0;
      }
      &.active {
        color: var(--brand);
      }
      &:hover {
        color: var(--brand);
        background: rgba(7, 130, 139, 0.5);
      }
      &:not(:last-child) { 
        @media ${MediaInfo.mobile} {
          margin-bottom: 24px; 
        }
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
