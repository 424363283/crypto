import { Select } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { ReactNode } from 'react';
import css from 'styled-jsx/css';
import { Svg } from '../svg';

type NS = number | string;

interface Props {
  value: NS;
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
}: Props) => {
  return (
    <>
      <div className={`container ${className}`}>
        <Select
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
              {renderItem ? renderItem(item) : <span>{item.label}</span>}
            </Select.Option>
          ))}
        </Select>
      </div>
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
    padding-left: 9px;
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
  :global(.asset-popup) {
    padding: 8px;
    background: var(--theme-background-color-2-3);
    :global(.ant-select-item) {
      min-height: auto;
      font-weight: 400 !important;
      padding: 4px 12px !important;
      color: var(--theme-font-color-3);
      :global(img) {
        margin-right: 4px;
      }
      &:hover {
        background: var(--skin-primary-bg-color-opacity-3) !important;
        color: var(--skin-primary-color) !important;
      }
      :global(.ant-select-item-option-content) {
        display: flex;
        align-items: center;
      }
    }
    :global(.ant-select-item-option-selected) {
      background: var(--skin-primary-bg-color-opacity-3) !important;
      color: var(--skin-primary-color) !important;
    }
  }
`;
