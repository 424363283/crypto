import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SESSION_KEY } from '@/core/store';
import Image from 'next/image';

export const LoginWrap = () => {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const handleLogin = () => {
    const pathname = router.asPath;
    sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
  };
  return (
    <>
      <div className={`${theme} login-wrap`}>
        <Image
          className='logo'
          src={isDark ? '/static/images/header/logo.svg' : '/static/images/header/logo_light.svg'}
          height='50'
          width='100'
          alt='logo'
        />
        <div style={{ height: 50 }}></div>
        <div className='btn-warp'>
          <TrLink href='/login' className='pc-v2-btn-yellow login-btn' onClick={handleLogin}>
            {LANG('登录交易账户')}
          </TrLink>
          <TrLink href='/register' className='pc-v2-btn register-btn'>
            {LANG('注册交易账户')}
          </TrLink>
        </div>
      </div>
      <style jsx>
        {`
          .login-wrap {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            :global(.logo) {
              width: 100%;
            }
            .btn-warp {
              width: 100%;
              padding: 0 20px;
              height: 110px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              :global(.login-btn) {
                width: 100%;
                background-color: transparent;
                color: var(--skin-primary-color);
                border: 1px solid var(--skin-primary-color);
                height: 40px;
                line-height: 38px;
                font-size: 14px;
                max-width: 350px;
              }
              :global(.register-btn) {
                opacity: 1;
                width: 100%;
                height: 40px;
                font-size: 14px;
                max-width: 350px;
                color: var(--theme-font-color-light-1);
                line-height: 38px;
              }
            }
          }
        `}
      </style>
    </>
  );
};
