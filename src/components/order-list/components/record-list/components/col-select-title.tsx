import { Dropdown } from 'antd';

import { DropdownMenus, DropdownOption as Option } from '@/components/trade-ui/common/dropdown';

import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import { ReactNode, useState } from 'react';
import css from 'styled-jsx/css';

export const ColSelectTitle = ({
  options,
  children,
  value,
  onChange,
}: {
  options: { [key: string | number]: string };
  children?: ReactNode;
  value?: any;
  onChange?: (v: any) => any;
}) => {
  const [visible, setVisible] = useState(false);
  const overlay = (
    <DropdownMenus className={clsx('menus')}>
      <Option
        className={clsx('menu', !value && 'active')}
        onClick={() => {
          onChange?.(undefined);
          setVisible(false);
        }}
      >
        {LANG('全部')}
      </Option>
      {Object.keys(options).map((key, index) => {
        const active = key === value;

        return (
          <Option
            key={index}
            className={clsx('menu', active && 'active')}
            onClick={() => {
              onChange?.(key);
              setVisible(false);
            }}
          >
            {options[key]}
          </Option>
        );
      })}
    </DropdownMenus>
  );

  return (
    <>
      <Dropdown
        menu={{ items: [] }}
        dropdownRender={(menu) => overlay}
        trigger={['click']}
        placement='bottomLeft'
        open={visible}
        onOpenChange={(v) => setVisible(v)}
      >
        <span className={clsx('span')}>
          <div className={clsx('content')}>
            <div className={clsx('label', value !== undefined && 'active')}>
              {value !== undefined ? options[value] : children}
              <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} />
            </div>
          </div>
        </span>
      </Dropdown>
      {styles}
    </>
  );
};
const { className, styles } = css.resolve`
  .span {
    display: inline-block;
  }
  .content {
    display: flex;
    flex-direction: row;
  }

  .label {
    position: relative;
    cursor: pointer;

    padding-right: 10px;
    display: flex;
    align-items: center;
    &.active {
      color: var(--skin-primary-color);
    }
    .arrow {
      position: absolute;
      top: 7px;
      right: -3px;
    }
  }

  .menus {
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
      &.active {
        color: var(--skin-primary-color) !important;
        font-weight: 500;
      }

      .text {
        margin-right: 20px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &.active {
        color: var(--skin-primary-color) !important;
        font-weight: 500;
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
