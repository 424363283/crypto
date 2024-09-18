import React from 'react';

import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { Svg } from '../svg';

export const CheckboxV2 = React.memo(
    ({
       className,
       checked,
       onClick = () => {},
       ...props
     }: {
      className?: string;
      checked?: boolean;
      onClick?: Function;
    }) => {
      return (
          <>
            <div
                className={clsx('checkbox', className, checked && 'checkbox-v2-active')}
                {...props}
                onClick={() => onClick()}
            >
              {checked && <Svg src={'/static/images/common/checkbox_circle_active.svg'} width='12' height='12' />}
            </div>
            {styles}
          </>
      );
    }
);
const { className, styles } = css.resolve`
  .checkbox {
    width: 12px;
    height: 12px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid #737473;
    &.checkbox-v2-active {
      border: 0;
      border: none;
    }
  }
`;
const clsx = clsxWithScope(className);
export default CheckboxV2;
