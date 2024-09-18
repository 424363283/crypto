import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { ReactNode } from 'react';
import { useLocation } from 'react-use';

export const WalletName = ({ children }: { children: ReactNode }) => {
  const isDemo = isSwapDemo(useLocation().pathname);
  return (
    <>
      <span className={clsx(isDemo && 'active')}>{!isDemo ? children : LANG('模拟交易账户')}</span>
      <style jsx>{`
        .active {
          color: var(--skin-main-font-color);
        }
      `}</style>
    </>
  );
};
