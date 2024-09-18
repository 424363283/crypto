import { AntdLanguageConfigProvider } from '@/components/antd-config-provider/language-config-provider';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import css from 'styled-jsx/css';

interface Props {
  onChange: (value: Dayjs | null) => void;
  value: string | null;
  placeholder?: string;
}

const AffiliateDatePicker = ({ onChange, value, placeholder }: Props) => {
  return (
    <>
      <div className='date-container'>
        <AntdLanguageConfigProvider>
          <DatePicker
            format={'YYYY-MM-DD'}
            bordered={false}
            onChange={(value) => onChange(value)}
            value={value ? dayjs(value) : null}
            placeholder={placeholder}
            suffixIcon={null}
            showToday={false}
          />
        </AntdLanguageConfigProvider>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default AffiliateDatePicker;

const styles = css`
  .date-container {
    flex: 1;
    height: 28px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    padding-left: 9px;
    background-color: var(--theme-background-color-4);
    :global(.ant-picker) {
      width: 100%;
    }
    :global(.ant-picker-input) {
      :global(input) {
        color: var(--theme-font-color-1);
        &::placeholder {
          color: var(--theme-font-color-3);
        }
      }
    }
  }
  :global(.ant-picker-cell-today .ant-picker-cell-inner) {
    &:before {
      border-color: var(--skin-primary-color) !important;
    }
  }
  :global(.ant-picker-clear) {
    background: inherit !important;
    :global(svg) {
      fill: var(--theme-background-color-disabled-light) !important;
    }
  }
  :global(.ant-picker-cell-selected) {
    :global(.ant-picker-cell-inner) {
      background-color: var(--skin-primary-color) !important;
    }
  }
`;
