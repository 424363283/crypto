import { useTheme } from '@/core/hooks';
import { clsxWithScope } from '@/core/utils';
import { useMemo } from 'react';

import css from 'styled-jsx/css';

import { Button } from './base';

export const SubButton = ({ className, ...props }: { onClick?: any; className?: any; children?: any }) => {
  const { isDark } = useTheme();
  const { clsx, styles } = useMemo(() => {
    const { className, styles } = css.resolve`
      .trade-sub-button {
        user-select: none;
        cursor: pointer;
        flex: 1;
        height: 28px;
        line-height: 28px;
        white-space: nowrap;
        text-align: center;
        background: var(--theme-trade-sub-button-bg);
        padding: 0 10px;
        border-radius: var(--theme-trade-btn-radius);
        color: var(--theme-trade-text-color-1);
        font-size: 12px;
        font-weight: 500;
      }
    `;
    return { clsx: clsxWithScope(className), styles };
  }, [isDark]);
  return (
    <>
      <Button className={clsx('trade-sub-button', className)} {...props}></Button>
      {styles}
    </>
  );
};
