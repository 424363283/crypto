import { RecoverAntdSelectStyle } from '@/core/styles';
import { Select } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { ReactNode } from 'react';
import css from 'styled-jsx/css';
import { Svg } from '../svg';

type NS = number | string;

interface Props {
  value: NS;
  style?: any;
  onChange?: (val: NS) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelect?: (val: NS) => void;
  onSearch?: (val: NS) => void;
  list: { value: NS; label: string }[];
  renderItem?: (item: { value: NS; label: string }) => ReactNode;
  suffixIcon?: ReactNode;
  placeholder?: string;
  popupClassName?: string;
  small?: boolean;
  className?: string;
  showSearch?: boolean;
  size?: SizeType;
  placement?: 'bottomRight' | 'bottomLeft' | 'topLeft' | 'topRight';
}

const selectText = ({ text, list }: { text: NS; list: any }) => {
  return (
    <div className='select-text-box'>
      <div className='select-label'>{text}</div>
      {list.map((item: any, index: number) => {
        return (
          <div className='select-text' key={index}>
            {item.label}
          </div>
        );
      })}
      <style jsx>{`
        .select-text-box {
          .select-text {
            height: 0px;
            font-size: 14px;
            padding-right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

const AffiliateSelect = ({
  value,
  onChange,
  onFocus,
  onBlur,
  list,
  renderItem,
  suffixIcon,
  placeholder,
  onSelect,
  popupClassName,
  className = '',
  showSearch = false,
  size = 'middle',
  onSearch,
  placement,
  style,
}: Props) => {
  return (
    <>
      <div className={`container ${className}`}>
        <Select
          style={style}
          size={size}
          value={value}
          showSearch={showSearch}
          onSearch={onSearch}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          suffixIcon={
            suffixIcon ? suffixIcon : <Svg src='/static/images/trade/header/arrow_down.svg' width={12} height={12} />
          }
          popupClassName={`asset-popup ${popupClassName ? popupClassName : ''}`}
          placeholder={placeholder}
          onSelect={onSelect}
          placement={placement || 'bottomRight'}
        >
          {list.map((item) => (
            <Select.Option value={item.value} key={item.value}>
              {renderItem ? renderItem(item) : selectText({ list, text: item.label })}
            </Select.Option>
          ))}
        </Select>
      </div>
      <RecoverAntdSelectStyle />
      <style jsx>{styles}</style>
    </>
  );
};

export default AffiliateSelect;

const styles = css`
  .container {
    height: 30px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    :global(.ant-select-selector) {
      border: none;
      box-shadow: none !important;
      height: 20px;
      background-color: inherit;
      color: var(--theme-font-color-1);
      :global(.ant-select-selection-item) {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--theme-font-color-1) !important;
        :global(img) {
          margin-right: 4px;
        }
      }
    }
  }
`;
