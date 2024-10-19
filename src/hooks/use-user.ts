import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context';
import { api, get } from '@/service';
import { read } from '@/utils';

export function useUser(init?: { locale: string }) {
  const { locale = '' } = init || {};
  const { isLogin } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({ isLogin, user: {} });

  useEffect(() => {
    if (read('account_id')) {
      get(api.userInfo, 3000, { body: { language: locale?.toLowerCase?.() } })
        .start()
        .then(res => {
          if (res.statusCode === 200) {
            setUserInfo({ isLogin: true, user: res?.data?.data });
          }
        });
    }
  }, [locale]);

  return {
    userInfo,
  };
}
