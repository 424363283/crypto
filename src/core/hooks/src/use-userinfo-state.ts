import { Account, UserInfo } from '@/core/shared';
import React from 'react';
import { useImmer } from 'use-immer';

export const useUserinfoState = () => {
  const [user, setUser] = useImmer({
    userInfo: null as UserInfo | null,
    isLead: false,
  });

  const updateUserInfo = async () => {
    const userInfo = await Account.getUserInfo();
    const isLead = [2, 3, 6].includes(Number(userInfo?.type));
    setUser((draft) => {
      draft.userInfo = userInfo;
      draft.isLead = isLead;
    });
  };

  React.useEffect(() => {
    updateUserInfo();
  }, []);

  return user;
};
