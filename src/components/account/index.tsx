import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { SESSION_KEY } from '@/core/store/src/session-storage';
import { MediaInfo } from '@/core/utils/src/media-info';
import { message } from '@/core/utils/src/message';
import React, { useCallback } from 'react';
import css from 'styled-jsx/css';
import { Tabs } from './components/tabs';
import { ThirdPartAuthProvider, ThirdPartBtns } from './components/third-part-btns';
import { ROUTE_PATH_KEY } from './constants';
import { EmailForget } from './forget/email-forget';
import { PhoneForget } from './forget/phone-forget';
import ResetPwd from './forget/reset-pwd';
import { useLastPath } from './hooks/useLastPath';
import { EmailLogin } from './login/email-login';
import { LoginFooter } from './login/login-footer';
import { PhoneLogin } from './login/phone-login';
import { UsernameLogin } from './login/username-login';
import { LoginQrCode } from './login/qrcode-login';
import { EmailRegister } from './register/email-register';
import { PhoneRegister } from './register/phone-register';
import { SecurityVerify } from './security/security-verify';
import { store } from './store';
import { ThirdBind } from './third-part/third-bind';
import { ThirdRegister } from './third-part/third-register';

export const EntryPoint = () => {
  const { isMobile } = useResponsive();
  const lastPath = useLastPath();
  const { showForgetEntry } = store;
  const router = useRouter();
  // 设置登录成功回跳页面
  const onLoginSuccess = useCallback(() => {
    message.success(LANG('登录成功'));
    const backUrl = sessionStorage[SESSION_KEY.LOGIN_REDIRECT] || '';
    const ignorePathname = [ROUTE_PATH_KEY.LOGIN, ROUTE_PATH_KEY.FORGET, ROUTE_PATH_KEY.REGISTER, 'verify'];
    var isIgnored = ignorePathname.some((item) => backUrl.includes(item));
    if (isIgnored || !backUrl) {
      router.push('/');
    } else {
      window.location.href = backUrl; // 自带locale
    }
  }, []);
  const HEADER_TITLE_MAP: { [key: string]: string } = {
    [ROUTE_PATH_KEY.LOGIN]: LANG('登陆 YMEX'),
    // [ROUTE_PATH_KEY.REGISTER]: LANG('加入 YMEX'),
    [ROUTE_PATH_KEY.REGISTER]: '账号注册',
    [ROUTE_PATH_KEY.INVITE]: LANG('加入 YMEX'),
    [ROUTE_PATH_KEY.FORGET]: LANG('忘记密码'),
    [ROUTE_PATH_KEY.THIRD_REGISTER]: LANG('创建账号'),
    [ROUTE_PATH_KEY.THIRD_BIND]: LANG('关联账号'),
  };
  const singleTab = [ROUTE_PATH_KEY.THIRD_REGISTER, ROUTE_PATH_KEY.THIRD_BIND].includes(lastPath);

  const FOOTER_MAP: { [key: string]: React.ReactNode } = {
    [ROUTE_PATH_KEY.LOGIN]: <LoginFooter />,
  };
  const LOGIN_TABS = [
    {
      label: LANG('邮箱登录'),
      key: 'email',
      children: <EmailLogin onLoginSuccess={onLoginSuccess} />,
    },
    {
      label: LANG('手机登录'),
      key: 'phone',
      children: <PhoneLogin onLoginSuccess={onLoginSuccess} />,
    },
    {
      label: LANG('用户名登录'),
      key: 'username',
      children: <UsernameLogin onLoginSuccess={onLoginSuccess} />,
    },
    // { label: LANG('扫码登录'), key: 'qrcode', children: <LoginQrCode onLoginSuccess={onLoginSuccess} /> },
  ];
  // if (isMobile) {
  //   LOGIN_TABS.splice(2, 1);
  // }
  const FORGET_TABS = [
    {
      label: LANG('邮箱'),
      key: 'email',
      tips: LANG('重置登录密码后，24小时内禁止提币'),
      children: <EmailForget />,
    },
    {
      label: LANG('手机'),
      key: 'phone',
      tips: LANG('重置登录密码后，24小时内禁止提币'),
      children: <PhoneForget />,
    },
  ];
  const REGISTER_TABS = [
    { label: LANG('邮箱注册'), key: 'email', children: <EmailRegister /> },
    { label: LANG('手机注册'), key: 'phone', children: <PhoneRegister /> },
  ];
  const TABS_MAP: any = {
    [ROUTE_PATH_KEY.LOGIN]: LOGIN_TABS,
    [ROUTE_PATH_KEY.FORGET]: FORGET_TABS,
    [ROUTE_PATH_KEY.REGISTER]: REGISTER_TABS,
    [ROUTE_PATH_KEY.INVITE]: REGISTER_TABS,
    [ROUTE_PATH_KEY.THIRD_REGISTER]: [{ children: <ThirdRegister onLoginSuccess={onLoginSuccess} /> }],
    [ROUTE_PATH_KEY.THIRD_BIND]: [{ children: <ThirdBind onLoginSuccess={onLoginSuccess} /> }],
  };
  if (!showForgetEntry && lastPath === 'forget') {
    return (
      <div className='account-wrapper'>
        <ResetPwd />
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <ThirdPartAuthProvider value={{ onLoginSuccess: onLoginSuccess }}>
      <div className='account-wrapper'>
         
        <h1 className='title'>{HEADER_TITLE_MAP[lastPath]}</h1>
        {!singleTab ? <Tabs items={TABS_MAP[lastPath]} /> : TABS_MAP[lastPath][0].children}
        {ROUTE_PATH_KEY.LOGIN === lastPath && <ThirdPartBtns />}
        {FOOTER_MAP[lastPath]}
        <SecurityVerify />
        <style jsx>{styles}</style>
      </div>
    </ThirdPartAuthProvider>
  );
};
const styles = css`
  :global(.account-wrapper) {
    background-color: var(--theme-background-color-2);
    position: relative;
    @media ${MediaInfo.desktop} {
      width: 464px;
    }
    @media ${MediaInfo.tablet} {
      width: 464px;
    }
    @media ${MediaInfo.mobile} {
      padding: 16px;
    }
    border-radius: 12px;
    padding: 30px;
    .title {
      text-align: center;
      
      color: var(--theme-font-color-1);
      font-size: 24px;
      font-weight: 700;
    }
  }

   :global(.left-arrow) {
     background: #101012;
     position: absolute;
      left: 3.2vw;
      top: 4.266667vw;
      width: 6.4vw;
      height: 6.4vw;
  }
`;
