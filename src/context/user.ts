'use client';

import { createContext } from 'react';
import { isServerSideRender, read } from '@/utils';

const accountId = isServerSideRender() ? '' : read('account_id');

export const UserContext = createContext<{
  isLogin: boolean,
  user: {
    accountId: string | null,
    userId: string,
    [key: string]: any
  },
  refreshUserInfo: () => void,
}>({
  isLogin: !!accountId,
  user: {
    accountId,
    userId: ''
  },
  refreshUserInfo: () => { }
});
