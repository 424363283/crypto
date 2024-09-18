import { Select } from 'antd';
import { ReactNode } from 'react';
import css from 'styled-jsx/css';
import { Svg } from '../svg';

type NS = number | string;

interface Props {
  value: NS;
  onChange: (val: NS) => void;
  list: { value: NS; label: string }[];
  renderItem?: (item: { value: NS; label: string }) => ReactNode;
}

const AffiliateTransferSelect = ({ value, onChange, list, renderItem }: Props) => {
  return (
    <>
      <div className='container'>
        <Select
          size='large'
          value={value}
          onChange={onChange}
          suffixIcon={<Svg src='/static/images/affiliate/transfer-select-arrow.svg' width={12} height={12} />}
          popupClassName='asset-popup'
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

export default AffiliateTransferSelect;

const styles = css`
  .container {
    height: 44px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    width: 100%;
    background-color: var(--theme-background-color-8);
    :global(.ant-select) {
      width: 100%;
    }
    :global(.ant-select-selector) {
      border: none;
      box-shadow: none !important;
      height: 20px;
      padding: 0 16px !important;
      background-color: inherit;
      color: var(--theme-font-color-1);
      :global(.ant-select-selection-item) {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--theme-font-color-1) !important;
        :global(img) {
          margin-right: 8px;
        }
      }
    }
  }
  :global(.asset-popup) {
    padding: 8px;
    background: var(--theme-background-color-2-3);
    :global(.ant-select-item) {
      min-height: 38px;
      min-width: 310px;
      font-weight: 400 !important;
      padding: 4px 12px !important;
      color: var(--theme-font-color-2);
      margin-bottom: 4px;
      :global(img) {
        margin-right: 8px;
      }
      &:hover {
        background: var(--skin-primary-bg-color-opacity-3) !important;
        color: var(--skin-color-active) !important;
      }
      :global(.ant-select-item-option-content) {
        display: flex;
        align-items: center;
      }
    }
    :global(.ant-select-item-option-selected) {
      background: var(--skin-primary-bg-color-opacity-3) !important;
      color: var(--skin-color-active) !important;
    }
  }
`;
