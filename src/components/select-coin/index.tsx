import CoinLogo from '@/components/coin-logo';
import { Select } from '@/components/select';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useMemo, useState } from 'react';
import { SelectProps } from 'react-dropdown-select';
import css from 'styled-jsx/css';
import SearchInput from './components/search-input';
import { EmptyComponent } from '@/components/empty';
/**
 * @prop {string} value         币种
 * @prop {array} options        币种数据
 * @prop {function} onChange    币种改变事件
 */
export interface SelectCoinProps
  extends Pick<SelectProps<any>, Exclude<keyof SelectProps<any>, 'values' | 'options' | 'onChange'>> {
  values: number | number[];
  hideSearch?: boolean;
  options: { code: string; title?: string }[];
  label?: string;
  bgColor?: string;
  borderColor?: string;
  vertical?: boolean;
  icon?: string;
  width?: number;
  height?: number;
  onChange: (value: any) => void;
}
const DropdownContent = ({ options, methods, hideSearch }: { options: any[]; methods: any; hideSearch?: boolean }) => {
  const [keyword, setKeyword] = useState('');
  const keywordRegExp = new RegExp(keyword, 'i');
  const _options = useMemo(() => options.map((v, i) => ({ ...v, ___index___: i })), [options]);
  const opts = keyword ? _options.filter((v) => keywordRegExp.test(v.code)) : _options;
  return (
    <>
      {!hideSearch && (
        <div className='search-wrapper'>
          <SearchInput value={keyword?.toUpperCase()} onChange={setKeyword} />
        </div>
      )}
      {opts.length ? opts.map((item) => {
        const index = item.___index___;
        return (
          <div className='dropdown-content' onClick={() => methods.addItem(index, item)} key={index}>
            {item.code === LANG('全部') || item.code === LANG('币种') ? (
              <span className='xx'></span>
            ) : (
              <CoinLogo coin={item.code} width='24' height='24' className='icon' key={item.code} />
            )}
            <div className={clsx('label', item.code === LANG('全部') && 'all-text')}>{item.title || item.code}</div>
          </div>
        );
      }) : <EmptyComponent size='small' text={LANG('暂无数据')} />
      }
    </>
  );
};
const SelectCoin = ({
  placeholder,
  values,
  hideSearch,
  height,
  bgColor,
  borderColor,
  options,
  icon,
  ...others
}: SelectCoinProps) => {
  const dropdownRenderer = ({ props, methods, ...res }: { props: any; methods: any }) => {
    return <DropdownContent hideSearch={hideSearch} {...props} methods={methods} />;
  };
  return (
    <>
      <Select
        height={height}
        placeholder={LANG('选择币种')}
        bgColor={bgColor}
        borderColor={borderColor}
        wrapperClassName='select-coin-wrapper'
        icon={icon}
        dropdownRenderer={dropdownRenderer}
        values={values as []}
        options={options}
        {...others}
      />
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  :global(.select-coin-wrapper.select-wrapper) {
    :global(.react-dropdown-select) {
      border: none;
      width: 100%;
      &::after {
        top: 21px;
        right: 20px;
      }
      :global(.react-dropdown-select-dropdown) {
        overflow-x: hidden;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
        top: 44px;
        padding: 0 12px 0!important;
      }
    }
    :global(.search-wrapper) {
      position: sticky;
      top: 0;
      padding: 16px 12px;
      background: var(--dropdown-select-bg-color);
    }
  }
  :global(.dropdown-content),
  :global(.content) {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    :global(.icon) {
      height: auto;
      width: 24px;
      border-radius: 50%;
      margin-right: 10px;
    }
    :global(.label) {
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-1);
    }
    :global(.placeholder) {
      font-size: 15px;
      font-weight: 400;
      color: #bcc0ca;
    }
  }
  :global(.dropdown-content) {
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    padding: 0px 6px;
    &:hover {
      background-color: var(--fill_3);
      border-radius: 5px;
      :global(.label) {
        color: var(--text_1);
      }
    }
  }
`;
export default SelectCoin;
