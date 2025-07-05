import { useTheme } from '@/core/hooks';

export * from './components/margin-type';
export * from './components/position-type';
export * from './components/quote-select';

import { Svg } from '@/components/svg';
import { DropdownMenus } from '@/components/trade-ui/common/dropdown';
import { Option } from '@/components/trade-ui/common/dropdown/select';
import { Dropdown } from 'antd';
import { useState } from 'react';
import { clsx, styles } from './styled';
import CommonIcon from '@/components/common-icon';
import { Layer } from '@/components/constants';

/**
 * @prop {{value:any, label:string}} options 选项
 * @prop {any} value
 * @prop {function} onChange
 */
const Select = ({
  options,
  value: selectValue,
  onChange,
  className,
  layer = Layer.Default
}: {
  options: any;
  value: any;
  onChange: (v: any) => any;
  className?: string;
  layer?: Layer;
}) => {
  const [open, setOpen] = useState(false);
  const { isDark } = useTheme();

  const overlay = (
    <DropdownMenus className={clsx('menus', !isDark && 'light')}>
      {options.map(({ label, value }: any, index: number) => {
        return (
          <Option
            key={index}
            className={clsx('menu')}
            onClick={() => {
              const next = value !== undefined ? value : index;
              selectValue !== next && onChange?.(next);
              setOpen(false);
            }}
          >
            {label}
          </Option>
        );
      })}
    </DropdownMenus>
  );
  const option = options.find((v: any) => v.value === selectValue);
  const onlyOne = options.length === 1;
  const content = (
    <div className={clsx('content', className, !isDark && 'light')}>
      {option && <span className={clsx(onlyOne && 'no-arrow')}>{option?.label}</span>}
      {option && !onlyOne && (
        <CommonIcon name='common-tiny-triangle-down' size={16} />
      )}
    </div>
  );
  if (onlyOne) {
    return content;
  }
  return (
    <>
      <Dropdown
        overlayClassName={clsx('dropdown-select-overlay', `overlay-layer${layer}`)}
        open={open}
        onOpenChange={setOpen}
        menu={{ items: [] }}
        dropdownRender={() => overlay}
        trigger={['click']}
        placement='bottom'
      >
        {content}
      </Dropdown>
      {styles}
    </>
  );
};

export default Select;
