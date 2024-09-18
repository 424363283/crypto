import { Loading } from '@/components/loading';
import { Svg } from '@/components/svg';
import { postCommonOauthLoginApi } from '@/core/api';
import { useResponsive, useTheme } from '@/core/hooks';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n/src/page-lang';
import { AppleLogin, AppleLoginType } from '@/core/shared';
import { Account } from '@/core/shared/src/account';
import { GoogleLogin } from '@/core/shared/src/account/google-login';
import { colorMap } from '@/core/styles/src/theme/global/color';
import { MediaInfo } from '@/core/utils';
import { clsx } from '@/core/utils/src/clsx';
import { message } from '@/core/utils/src/message';
import React, { useContext, useEffect } from 'react';

export type ThirdPartAuthContextValue = {
  onLoginSuccess: () => any;
};
export const ThirdPartAuthContext = React.createContext<ThirdPartAuthContextValue>({
  onLoginSuccess: () => {},
});
export const useThirdPartAuth = () => useContext(ThirdPartAuthContext);
export const ThirdPartAuthProvider = ({ children, value }: { children: any; value: ThirdPartAuthContextValue }) => {
  return <ThirdPartAuthContext.Provider value={value}>{children}</ThirdPartAuthContext.Provider>;
};

export const ThirdPartBtns = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const { onLoginSuccess } = useThirdPartAuth();
  const { isMobile } = useResponsive(false);

  useEffect(() => {
    GoogleLogin(_GoogleLogin);
  }, []);
  const _AppleLogin = async () => {
    try {
      const idToken: string = await AppleLogin(AppleLoginType.LOGIN);
      if (!idToken) {
        return message.error(LANG('登录失败'));
      }
      await postOauthLogin({ type: 'apple', idToken, scene: 'APPLE_LOGIN' });
    } catch (e) {
      console.error(e);
    }
  };
  const _GoogleLogin = async (idToken: string) => {
    try {
      // const idToken: string = await GoogleLogin();
      if (!idToken) {
        return message.error(LANG('登录失败'));
      }
      await postOauthLogin({ type: 'google', idToken, scene: 'GOOGLE_LOGIN' });
    } catch (e) {
      console.error(e);
    }
  };
  const postOauthLogin = async (data: { type: string; idToken: string; scene: string }) => {
    try {
      Loading.start();
      const result: any = await postCommonOauthLoginApi(data);
      if (result.code === 200) {
        Account.setLoginStatus(true);
        onLoginSuccess();
        await Account.refreshUserInfo();
      } else if (result.code == 5011) {
        // 账号不存在
        const trace: string = result.data['trace'];
        const email: string = result.data['email'];
        router.push({
          pathname: '/register/third-register',
          query: {
            trace,
            email,
            type: data.type,
            idToken: data.idToken,
          },
        });
      } else if (result.code == 5012) {
        // 账号已存在
        const trace: string = result.data['trace'];
        const email: string = result.data['email'];
        router.push({
          pathname: '/login/third-bind',
          query: {
            trace,
            type: data.type,
            email,
          },
        });
      } else {
        message.error(result);
      }
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };
  return (
    <>
      <div className={clsx('third-part-btns', isMobile && 'mobile')}>
        <div className='or'>
          <div>{LANG('or')}</div>
        </div>
        <div className='btns'>
          <div>
            <div id='my-google-login-btn' style={{ opacity: 0 }} className='google-login'>
              <div
                id='g_id_onload'
                data-client_id='363115651692-05nsq5pjhj73q7jo89evlsk8ed63vk14.apps.googleusercontent.com'
                data-context='signin'
                data-ux_mode='popup'
                data-callback='google_login_callback'
                data-auto_prompt='false'
              ></div>
              <div
                className='g_id_signin'
                data-type='standard'
                data-shape='rectangular'
                data-theme='outline'
                data-text='signin_with'
                data-size='large'
                data-logo_alignment='left'
                data-width='726'
                data-height='60'
              ></div>
            </div>
            <Svg src='/static/images/account/login/google.svg' width={24} height={24} />
            <div>{LANG('Continue with Google')}</div>
          </div>
          <div onClick={_AppleLogin} className='apple-login'>
            <Svg
              src={isDark ? '/static/images/account/login/apple.svg' : '/static/images/account/login/apple_balck.svg'}
              width={24}
              height={24}
              color={isDark ? colorMap['--theme-font-color-1'].dark : colorMap['--theme-font-color-1'].light}
            />
            <div>{LANG('Continue with Apple')}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .third-part-btns {
          .or {
            margin: 32px 0 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            &::before,
            &::after {
              content: '';
              display: block;
              flex: 1;
              height: 1px;
              background-color: var(--skin-border-color-1);
            }
            > div {
              color: var(--theme-font-color-3);
              padding: 0 24px;
            }
          }
          .btns {
            display: flex;
            justify-content: center;
            align-items: center;

            #my-google-login-btn {
              position: absolute;

              width: 100%;
              height: 100%;
              overflow: hidden;

              :global(*) {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              :global(#g_id_onload) {
                width: 0;
                height: 0;
              }
            }
            > div {
              position: relative;
              cursor: pointer;
              background: var(--theme-background-color-8);
              flex: 1;
              height: 48px;
              padding: 10px 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 6px;
              color: var(--theme-font-color-1);
              &:first-child {
                margin-right: 12px;
              }
              > *:last-child {
                margin-left: 6px;
              }
            }
            @media ${MediaInfo.mobile} {
              flex-direction: column;
              > div {
                flex: none;
                width: 100%;
                margin-right: 0;
                &:first-child {
                  margin-bottom: 12px;
                  margin-right: 0;
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
