import { Dropdown, DropdownProps } from 'antd';
import { ReactNode, useCallback, useState } from 'react';
import css from 'styled-jsx/css';

import { Svg } from '@/components/svg';
import { Option } from '@/components/trade-ui/common/dropdown/select/components/option';
import { useTheme } from '@/core/hooks';
import { clsxWithScope, MediaInfo } from '@/core/utils';
import CommonIcon from '@/components/common-icon';

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
  isActive = (item, index) => [item, item?.id, index].filter(v => v !== undefined).includes(value),
  onChange,
  formatOptionLabel = v => v,
  children,
  overlayClassName,
  align,
  trigger,
  renderOverlay,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const _handleVisible = useCallback(() => setVisible(v => !v), []);

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
            <>{formatOptionLabel(item)}</>
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
        dropdownRender={menu => overlay}
        open={visible}
        onOpenChange={_handleVisible}
        trigger={trigger || ['click']}
        placement="bottomRight"
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
      <CommonIcon className={clsx('arrow')} name="common-tiny-triangle-down-2" size={10} />
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
    color: var(--text-secondary);
    padding-right: 14px;
    line-height: 20px;
    @media ${MediaInfo.mobile} {
      padding-right: 2rem;
    }
    .arrow {
      position: absolute;
      top: 4px;
      right: 0;
      @media ${MediaInfo.mobile} {
        right: 1rem;
      }
    }
  }

  .menus {
    display: flex;
    padding: 8px 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    background: var(--fill-3);
    top: 100%;
    border-radius: 4px;
    right: 0;
    min-width: 80px;
    position: relative;
    top: 5px;
    max-height: 250px;
    overflow: auto;
    .menu {
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      display: flex;
      height: 24px;
      padding: 0px 8px;
      justify-content: center;
      align-items: center;
      width: 100%;
      &.active {
        color: var(--text-brand) !important;
      }
      &:hover {
        background: transparent !important;
        color: var(--text-brand) !important;
      }
    }
  }
  @media ${MediaInfo.mobile} {
    .menus {
      background: var(--fill-pop);
      box-shadow: 0px 0px 8px 0px var(--fill-projection);
      min-width: 5rem;
      border-radius: 8px;
      .menu {
        padding: 0;
        height: 1.5rem;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export default Select;
