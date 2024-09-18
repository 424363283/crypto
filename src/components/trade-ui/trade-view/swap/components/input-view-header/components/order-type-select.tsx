import { useState } from 'react';
import css from 'styled-jsx/css';

import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { clsxWithScope } from '@/core/utils';

const Index = ({ options, value, onChange }: { options: any[]; value?: string; onChange?: any }) => {
  const [selected, setSelected] = useState(0);

  const item = options[selected];

  return (
    <>
      <div className={clsx('order-type-select')}>
        <div
          className={clsx('text', value === item[1] && 'active')}
          onClick={() => {
            onChange(item[1]);
          }}
        >
          {item[0]}
        </div>
        <DropdownSelect
          data={options}
          onChange={(item, index) => {
            onChange(item[1]);
            setSelected(index);
          }}
          isActive={(v, index) => v[1] === value}
          formatOptionLabel={(v) => v[0]}
          overlayClassName={clsx('overlay')}
          trigger={['hover', 'click']}
          align={{ offset: [10, 0] }}
        >
          <div className={clsx('arrow')}>
            <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} />
          </div>
        </DropdownSelect>
      </div>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .order-type-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    .text {
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-trade-text-color-2);
      line-height: 20px;
      cursor: pointer;
      &.active {
        color: var(--skin-primary-color);
      }
    }
    .arrow {
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 20px;
      width: 16px;
      top: 0px;
    }
  }
`;
const clsx = clsxWithScope(className);

export default Index;
