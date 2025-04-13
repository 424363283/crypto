import CommonIcon from '@/components/common-icon';
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
      label: <div className='select-item' onClick={() => onChange(item.id)}>{item.name}</div>,
    };
  });

  return (
    <div className={theme as string}>
      <Dropdown menu={{ items }} trigger={['click']} overlayClassName={theme}>
        <div className={`title ${label ? 'hasLabel' : ''}`}>
          {label && <span className='label'>{label}</span>}
          <div className='content'>
            <span className='value'>{value}</span>
            <CommonIcon name='common-tiny-triangle-down' size={10} />
          </div>
        </div>
      </Dropdown>
      <style jsx>{styles}</style>
    </div>
  );
};

export default QuoteSelect;
const styles = css`
  .title {
    background: var(--fill-3);
    height: 40px;
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    justify-content: center;
    color: var(--text-primary);
    font-weight: 500;
    cursor: pointer;
    .content {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
      flex: 1 0 0;
      .value {
        color: var(--text-primary);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        flex: 1 0 0;
      }
    }
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
  :global(.select-item) {
    height: 28px;
    cursor: pointer;
    text-align: left;
    line-height: 28px;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
    margin-bottom: 1px;
    padding: 0 16px;
    &:hover,
    &.active {
      color: var(--text-brand);
      font-weight: 500;
    }
  }
  :global(.ant-dropdown) {
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
`;
