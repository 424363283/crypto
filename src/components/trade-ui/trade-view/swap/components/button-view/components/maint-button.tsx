import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

export const MaintButton = ({ className }: { className: string }) => {
  return (
    <>
      <div className={clsx(className, 'maint-button')}> {LANG('维护中')}</div>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .maint-button {
    color: var(--theme-trade-text-2) !important;
    cursor: not-allowed !important;
    background-color: var(--theme-trade-bg-color-4);
    &:hover {
      background-color: var(--theme-trade-bg-color-4);
    }
  }
`;
const clsx = clsxWithScope(className);
