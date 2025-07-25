import { Account, SENCE } from '@/core/shared/src/account';
import { getIdentity } from '@/core/utils/src/crypto';
import { getPlatform } from '@/core/utils/src/get';
import { message } from '@/core/utils/src/message';
import { removeCountryCode } from '@/core/utils/src/unknown';

import { store } from '../store';
import { ACCOUNT_TAB_KEY } from '../constants';

export const useLogin = (onLoginSuccess: () => void) => {
  const { email, password, countryCode, phone, username, curTab, trace } = store;
  // const account = curTab === ACCOUNT_TAB_KEY.EMAIL ? countryCode + phone : email;
  //  curTab === ACCOUNT_TAB_KEY.EMAIL ? countryCode + phone : email;
   const account = (() => {
    if (curTab === ACCOUNT_TAB_KEY.EMAIL) {
      return email
    } else if (curTab === ACCOUNT_TAB_KEY.PHONE) {
      return countryCode + phone
    } else {
      return username;
    }
  })();

  const handleLogin = async () => {
    const cToken = await Account.verifyCode.getCToken();
    const loginVhash = getIdentity(32);
    store.loginVhash = loginVhash;
    const platform = getPlatform();
    const loginParam: any  = (() => {
      if (curTab === ACCOUNT_TAB_KEY.EMAIL) {
        return {
          username: email,
          password,
          vHash: loginVhash,
          terminal: platform,
          trust: false,
          version: '2.0',
          cToken,
        };
      } else if (curTab === ACCOUNT_TAB_KEY.PHONE) {
        return {
          username: account,
          password,
          vHash: loginVhash,
          terminal: platform,
          trust: false,
          version: '2.0',
          cToken,
          countryCode,
        };
      } else {
        return {
          username: username,
          password,
          vHash: loginVhash,
          terminal: platform,
          trust: false,
          version: '2.0',
          cToken
        };
      }
    })(); 

    if (trace) {
      loginParam.trace = trace;
    }
    const res = await Account.login(loginParam);
    if (res.code === 200) {
      if (res.data.next) {
        const { email, phone, countryCode, account } = res.data;
        const _account = res.data['account'];

        store.email = email || '';
        store.phone = removeCountryCode(countryCode, phone || '');
        store.countryCode = countryCode || '';
        const options = await Account.securityVerify.getSecurityOptions({
          vHash: loginVhash,
          account: _account,
          sence: SENCE.LOGIN,
        });
        if (options.code === 200) {
          store.securityOptions = options.data;
          store.showVerifyModal = true;
          store.closeVerify = true;
        } else {
          message.error(options.message);
        }
      } else {
        await Account.refreshUserInfo();

        onLoginSuccess();
      }
    } else {
      message.error(res.message);
    }
  };
  return [handleLogin];
};
