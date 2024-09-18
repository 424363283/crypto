import { useTheme } from '@/core/hooks';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import css from 'styled-jsx/css';

interface Props {
  value: string;
  label?: string;
  onChange: (name: string) => void;
  list: { id: string; name: string }[];
}

const QuoteSelect = ({ value, label, onChange, list }: Props) => {
  const { theme } = useTheme();

  const items: MenuProps['items'] = list.map((item) => {
    return {
      id: item.id,
      key: item.name,
      label: <div onClick={() => onChange(item.id)}>{item.name}</div>,
    };
  });

  return (
    <div className={theme as string}>
      <Dropdown menu={{ items }} trigger={['click']} overlayClassName={theme}>
        <div className={`title ${label ? 'hasLabel' : ''}`}>
          {label && <span>{label}</span>}
          <span>{value}</span>
        </div>
      </Dropdown>
      <style jsx>{styles}</style>
    </div>
  );
};

export default QuoteSelect;
const styles = css`
  .title {
    background: var(--theme-trade-tips-color);
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    margin-bottom: 14px;
    padding: 0 30px 0 15px;
    display: flex;
    justify-content: center;
    color: var(--theme-font-color-1);
    font-weight: 500;
    cursor: pointer;
    &.hasLabel {
      justify-content: space-between;
    }
    > span:last-child {
      position: relative;
      &:before {
        content: '';
        display: block;
        position: absolute;
        top: 12px;
        right: -15px;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid #798296;
      }
    }
  }
  :global(.ant-dropdown) {
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  :global(.ant-dropdown.dark ul) {
    background: var(--theme-trade-tips-color);
  }
  :global(.ant-dropdown.dark li) {
    color: #fff !important;
  }
`;
