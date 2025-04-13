import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { SESSION_KEY } from '@/core/store/src/session-storage';
import { MediaInfo } from '@/core/utils/src/media-info';
import { message } from '@/core/utils/src/message';
import React, { useCallback } from 'react';
import css from 'styled-jsx/css';
import { Tab, Tabs } from './components/tabs';
import { ThirdPartAuthProvider, ThirdPartBtns } from './components/third-part-btns';
import { ACCOUNT_TAB_KEY, ROUTE_PATH_KEY } from './constants';
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
import { Desktop, Mobile } from '../responsive';
import { RegisterSwitchLoginReg } from './register/register-switch-register-reg';
import { LoginSwitchLoginReg } from './login/login-switch-register-reg';

export const EntryPoint = () => {
  const phoneEnable = process.env.NEXT_PUBLIC_PHONE_ENABLE === 'true';
  const { isMobile } = useResponsive();
  const lastPath = useLastPath();
  const { showForgetStep } = store;
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
    [ROUTE_PATH_KEY.LOGIN]: LANG('账号登录'),
    // [ROUTE_PATH_KEY.REGISTER]: LANG('加入 YMEX'),
    [ROUTE_PATH_KEY.REGISTER]: LANG('账号注册'),
    [ROUTE_PATH_KEY.INVITE]: LANG('加入 YMEX'),
    [ROUTE_PATH_KEY.FORGET]: LANG('重置密码'),
    [ROUTE_PATH_KEY.THIRD_REGISTER]: LANG('创建账号'),
    [ROUTE_PATH_KEY.THIRD_BIND]: LANG('关联账号'),
  };
  const singleTab = [ROUTE_PATH_KEY.THIRD_REGISTER, ROUTE_PATH_KEY.THIRD_BIND].includes(lastPath);

  const FOOTER_MAP: { [key: string]: React.ReactNode } = {
    [ROUTE_PATH_KEY.LOGIN]: <LoginFooter />,
  };
  const SWITCH_LOGIN_REG_MAP: { [key: string]: React.ReactNode } = {
    [ROUTE_PATH_KEY.LOGIN]: <LoginSwitchLoginReg />,
    [ROUTE_PATH_KEY.REGISTER]: <RegisterSwitchLoginReg />
  }
  const LOGIN_TABS: Tab[] = [
    {
      label: LANG('手机'),
      key: ACCOUNT_TAB_KEY.PHONE,
      children: <PhoneLogin onLoginSuccess={onLoginSuccess} />,
    },
    {
      label: LANG('邮箱'),
      key: ACCOUNT_TAB_KEY.EMAIL,
      children: <EmailLogin onLoginSuccess={onLoginSuccess} />,
    },
    // {
    //   label: LANG('用户名登录'),
    // key: ACCOUNT_TAB_KEY.USERNAME,
    //   children: <UsernameLogin onLoginSuccess={onLoginSuccess} />,
    // },
    // { label: LANG('扫码登录'), key: ACCOUNT_TAB_KEY.QRCODE, children: <LoginQrCode onLoginSuccess={onLoginSuccess} /> },
  ];

  // if (isMobile) {
  //   LOGIN_TABS.splice(2, 1);
  // }
  const FORGET_TABS: Tab[] = [
    {
      label: LANG('手机'),
      key: ACCOUNT_TAB_KEY.PHONE,
      tips: '',
      children: <PhoneForget />,
    },
    {
      label: LANG('邮箱'),
      key: ACCOUNT_TAB_KEY.EMAIL,
      tips: '',
      children: <EmailForget />,
    },
  ];
  const REGISTER_TABS: Tab[] = [
    { label: LANG('手机'), key: ACCOUNT_TAB_KEY.PHONE, children: <PhoneRegister /> },
    { label: LANG('邮箱'), key: ACCOUNT_TAB_KEY.EMAIL, children: <EmailRegister /> },
  ];
  const THIRD_REGISTER_TABS: Tab[] = [
    { label: LANG('创建账号'), key: ACCOUNT_TAB_KEY.THIRD_REGISTER, children: <ThirdRegister onLoginSuccess={onLoginSuccess} /> }
  ]
  const THIRD_BIND_TABS: Tab[] = [
    { label: LANG('关联账号'), key: ACCOUNT_TAB_KEY.THIRD_BIND, children: <ThirdBind onLoginSuccess={onLoginSuccess} /> }
  ]
  const TABS_MAP: any = {
    [ROUTE_PATH_KEY.LOGIN]: LOGIN_TABS,
    [ROUTE_PATH_KEY.FORGET]: FORGET_TABS,
    [ROUTE_PATH_KEY.REGISTER]: REGISTER_TABS,
    [ROUTE_PATH_KEY.INVITE]: REGISTER_TABS,
    [ROUTE_PATH_KEY.THIRD_REGISTER]: THIRD_REGISTER_TABS,
    [ROUTE_PATH_KEY.THIRD_BIND]: THIRD_BIND_TABS,
  };
  if (showForgetStep && lastPath === 'forget') {
    return (
      <div className='account-wrapper'>
        <div className='account-content'>
          <ResetPwd />
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <ThirdPartAuthProvider value={{ onLoginSuccess: onLoginSuccess }}>
      <div className='account-wrapper'>
        <div className='account-content'>
          <h1 className='title'>{HEADER_TITLE_MAP[lastPath]}</h1>
          {lastPath === ROUTE_PATH_KEY.FORGET && <div className='sub-title'>{LANG('重置登录密码后，24小时内禁止提币')}</div>}
          {!singleTab ?
            <Tabs items={TABS_MAP[lastPath]?.filter((item:{key:string}) => item.key !== ACCOUNT_TAB_KEY.PHONE || phoneEnable)} ></Tabs>
            : TABS_MAP[lastPath][0].children
          }
          <SecurityVerify />
          <style jsx>{styles}</style>
        </div>
      </div>
    </ThirdPartAuthProvider>
  );
};
const styles = css`
  :global(.account-wrapper) {
    display: flex;
    flex: 1 auto;
    position: relative;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 16px;
    @media ${MediaInfo.mobile} {
      padding: 24px 16px;
    }
    .account-content {
      @media ${MediaInfo.desktop} {
        width: 840px;
        padding: 0 120px;
      }
      @media ${MediaInfo.tablet} {
        width: 464px;
      }
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
    }
    .title {
      text-align: center;
      color: var(--text-primary);
      font-size: 24px;
      font-weight: 700;
      @media ${MediaInfo.desktop} {
        font-size: 40px;
        line-height: 40px;
        text-align: left;
      }
    }
    .sub-title {
      margin-top: 16px;
      font-size: 16px;
      font-weight: 400;
      color: var(--text-tertiary);
      text-align: center;
      @media ${MediaInfo.desktop} {
        text-align: left;
      }
    }
    :global(.tabs) {
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line-2);
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
