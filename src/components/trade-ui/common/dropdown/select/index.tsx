import { Dropdown, DropdownProps } from 'antd';
import { ReactNode, useCallback, useState } from 'react';
import css from 'styled-jsx/css';

import { Svg } from '@/components/svg';
import { Option } from '@/components/trade-ui/common/dropdown/select/components/option';
import { useTheme } from '@/core/hooks';
import { clsxWithScope } from '@/core/utils';

export { Option } from '@/components/trade-ui/common/dropdown/select/components/option';

export type Props = {
  data?: any[];
  value?: any;
  isActive?: (item: any, index: number) => boolean;
  onChange?: (item: any, index: number) => any;
  formatOptionLabel?: (label: any) => any;
  renderOverlay?: (opts: { onClose: () => any }) => ReactNode;
} & DropdownProps;
export const Select: (props: Props) => any = ({
  data,
  value,
  isActive = (item, index) => [item, item?.id, index].filter((v) => v !== undefined).includes(value),
  onChange,
  formatOptionLabel = (v) => v,
  children,
  overlayClassName,
  align,
  trigger,
  renderOverlay,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const _handleVisible = useCallback(() => setVisible((v) => !v), []);

  const overlay = renderOverlay?.({ onClose: _handleVisible }) || (
    <Menus>
      {data?.map((item, index) => {
        const active = isActive(item, index);

        return (
          <Option
            key={index}
            className={clsx('menu', active && 'active')}
            onClick={() => {
              _handleVisible();
              onChange?.(item, index);
            }}
          >
            <div className={clsx('text')}>{formatOptionLabel(item)}</div>
          </Option>
        );
      })}
    </Menus>
  );

  return (
    <>
      <Dropdown
        align={align}
        menu={{ items: [] }}
        dropdownRender={(menu) => overlay}
        open={visible}
        onOpenChange={_handleVisible}
        trigger={trigger || ['click']}
        placement='bottomRight'
        overlayClassName={clsx(overlayClassName, 'dropdown-select-overlay')}
        {...props}
      >
        {children || <DefaultSelectView>{formatOptionLabel(data?.[value])}</DefaultSelectView>}
      </Dropdown>
      {styles}
    </>
  );
};

export const DefaultSelectView = ({ children, onClick }: any) => {
  const { isDark } = useTheme();
  return (
    <div className={clsx('dropdown-select-content ', !isDark && 'light')} onClick={onClick}>
      {children}
      <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />
    </div>
  );
};

export const Menus = ({ children, className }: { children: any; className?: string }) => {
  return <div className={clsx('menus', className)}>{children}</div>;
};

const { className, styles } = css.resolve`
  .dropdown-select-overlay {
    z-index: 100001;
  }
  .dropdown-select-content {
    position: relative;
    user-select: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    color: var(--theme-trade-text-color-1);
    padding-right: 13px;
    line-height: 20px;
    .arrow {
      position: absolute;
      top: 4px;
      right: 0;
    }
  }

  .menus {
    background: var(--theme-trade-select-bg-color);
    box-shadow: var(--theme-trade-select-shadow);
    border-radius: 4px;
    top: 100%;
    padding: 8px;
    border-radius: 8px;
    right: 0;
    min-width: 59px;
    position: relative;
    top: 5px;
    max-height: 250px;
    overflow: auto;
    .menu {
      cursor: pointer;
      text-align: left;
      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
      padding: 7px 16px;
      color: var(--theme-trade-text-color-1);
      margin-bottom: 1px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export default Select;
