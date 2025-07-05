import { kChartEmitter } from '@/core/events';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SESSION_KEY } from '@/core/store';
import { clsx, MediaInfo } from '@/core/utils';
import { useLayoutEffect } from 'react';

export const UnLoginView = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const handleLogin = () => {
    const pathname = router.asPath;
    sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
    router.push('/login');
  };

  useLayoutEffect(() => {
    kChartEmitter.emit(kChartEmitter.K_CHART_COMMISSION_VISIBLE, false);
    kChartEmitter.emit(kChartEmitter.K_CHART_POSITION_VISIBLE, false);
  }, []);
  return (
    <>
      <div className={clsx('un-login-view', !isDark && 'light')}>
        <div className="text">
          <TrLink href="/login" onClick={handleLogin}>
            {LANG('立即登录')}
          </TrLink>
          <span>{LANG('或')}</span>
          <TrLink href="/register">{LANG('立即注册')}</TrLink>
          <span>{LANG('进行交易')}</span>
        </div>
      </div>
      <style jsx>{`
        .un-login-view {
          width: 100%;
          display: flex;
          padding: 150px 0;
          justify-content: center;
          align-items: center;
          .text {
            display: flex ;
            gap: 8px;
            color: var(--text_2);
            font-size: 14px;
            span {
              font-weight: 300;
            }
            :global(a) {
              font-weight: 500;
            }
          }
          :global(a) {
            color: var(--text_brand);
          }
          @media ${MediaInfo.mobile} {
            padding: 40px 0;
          }
        }
      `}</style>
    </>
  );
};
