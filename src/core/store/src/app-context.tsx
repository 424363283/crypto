import { getCookie, getUrlQueryParams, setCookie } from '@/core/utils';
import { useRouter } from 'next/router';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { SESSION_KEY } from './session-storage';
import { AppContextState, SKIN, THEME } from './types';
import { defaultLang } from '@/core/i18n/src/constants';

const initialState: AppContextState = {
  isLogin: false,
  token: null,
  locale: defaultLang,
  theme: THEME.LIGHT,
  skin: SKIN.DEFAULT,
};

const AppContext = createContext(initialState);
export const useAppContext = () => useContext(AppContext);
export let appContextSetState = (nextState: object) => {};

export const AppProvider = ({ children, auth }: { children: React.ReactNode; auth: boolean }) => {
  const initFunc = useCallback(() => {
    const token = getUrlQueryParams('token') || getCookie('TOKEN');
    const ru = getUrlQueryParams('ru') || '';
    const f = getUrlQueryParams('f') || '';
    if (token) setCookie('TOKEN', token, 30);
    if (ru) setCookie('ru', ru, 365); // 推广码
    if (f) setCookie('f', f, 365); //  渠道码
    // debugger
    const locale = document.documentElement.getAttribute('lang') || 'en';
    const isLogin = !!token;
    const theme = document.documentElement.getAttribute('theme') as THEME;
    return { token, locale, isLogin, theme };
  }, []);

  const [state, _setState] = useState<AppContextState>(initialState);
  const setState = (appContextSetState = (nextState: object) => _setState({ ...state, ...nextState }));
  const router = useRouter();

  if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect;
  }

  React.useLayoutEffect(() => {
    const { token, locale, isLogin, theme } = initFunc();
    setState({ isLogin, token, locale, theme });
  
    if (auth && !token) {
      const pathname = router.asPath;
      sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
      // window.location.replace(`/${locale}/login`);
    }
  }, [state.isLogin, auth]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
