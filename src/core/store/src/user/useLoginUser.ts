import { useLoginEffect } from '@/core/hooks/src/use-login-effect';
import { Account, UserInfo } from '@/core/shared/src/account';
import { useEffect } from 'react';
import { useAppContext } from '../app-context';
import { LOCAL_KEY } from '../local-storage';
import { resso, useResso } from '../resso';

export const LOGIN_STORE = resso<{ user: UserInfo | null }>({ user: null }, { nameSpace: LOCAL_KEY.LOGIN_USER, auth: true });

export const useLoginUser = () => {
  const appContext = useAppContext();
  const fetchUserInfo = async () => {
    const userInfo = await Account.getUserInfo();
    LOGIN_STORE.user = userInfo;
    return userInfo;
  };

  useLoginEffect(async () => {
    await fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!appContext.isLogin) LOGIN_STORE.user = null;
  }, [appContext.isLogin]);

  return { user: useResso(LOGIN_STORE).user, fetchUserInfo };
};
