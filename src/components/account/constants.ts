export const ROUTE_PATH_KEY = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGET: 'forget',
  INVITE: 'invite',
  THIRD_BIND: 'third-bind',
  THIRD_REGISTER: 'third-register',
};
export const ACCOUNT_ROUTE_PATH = {
  SECURITY_SETTING: {
    PATHNAME: '/account/dashboard',
    QUERY: {
      type: 'security-setting',
    },
  },
  RESET_EMAIL: {
    PATHNAME: '/account/dashboard',
    QUERY: {
      type: 'security-setting',
      option: 'reset-email',
    },
  },
  RESET_PHONE: {
    PATHNAME: '/account/dashboard',
    QUERY: {
      type: 'security-setting',
      option: 'reset-phone',
    },
  },
  RESET_FUND_PASSWORD: {
    PATHNAME: '/account/dashboard',
    QUERY: {
      type: 'security-setting',
      option: 'reset-funds-password',
    },
  },
  RESET_LOGIN_PASSWORD: {
    PATHNAME: '/account/dashboard',
    QUERY: {
      type: 'security-setting',
      option: 'reset-login-password',
    },
  },
  RESET_TYPE: {
    PATHNAME: '/account/dashboard',
    QUERY: {
      type: 'security-setting',
      option: 'reset-type',
    },
  },
};

export const ACCOUNT_TAB_KEY = {
  PHONE: 'phone',
  EMAIL: 'email',
  USERNAME: 'username',
  QRCODE: 'qrcode',
  THIRD_REGISTER: 'third_register',
  THIRD_BIND: 'third_bind',
}
