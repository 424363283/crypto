import { isCaptcha, isEmail, isPassword, isPhoneNumber } from '@/core/utils/src/regexp';
import { store } from '../store';
import { TAB_TYPE } from '../types';

export const useBtnStatus = (type: TAB_TYPE) => {
  const { email, password, phone, smsCode, emailCode, checked } = store;
  const captcha = smsCode || emailCode;
  // login
  const isEmailOrPwdEmpty = !email || !password;
  const isPhoneOrPwdEmpty = !password || !phone;
  const shouldDisableEmailLoginBtn = isEmailOrPwdEmpty || !isEmail(email) || !isPassword(password);
  const shouldDisablePhoneLoginBtn = isPhoneOrPwdEmpty || !isPhoneNumber(phone) || !isPassword(password);
  // forget
  const isPhoneEmpty = !phone;
  const isEmailEmpty = !email;
  const shouldDisableEmailForgetBtn = isEmailEmpty || !isEmail(email);
  const shouldDisablePhoneForgetBtn = isPhoneEmpty || !isPhoneNumber(phone);
  // register
  const isRegisterEmailEmpty = !password || !captcha || !email;
  const isRegisterPhoneEmpty = !password || !captcha || !phone;

  const shouldDisableEmailRegisterBtn =
    isRegisterEmailEmpty || !isCaptcha(captcha) || !isEmail(email) || !isPassword(password) || !checked; // email
  const shouldDisablePhoneRegisterBtn =
    isRegisterPhoneEmpty || !isCaptcha(captcha) || !isPhoneNumber(phone) || !isPassword(password) || !checked; //phone
  // forget receive  captcha
  const shouldDisableForgetReceiveCaptchaBtn = !captcha || !isCaptcha(captcha);

  const BTN_TAB_MAP: { [key: string]: boolean } = {
    [TAB_TYPE.EMAIL_LOGIN]: shouldDisableEmailLoginBtn,
    [TAB_TYPE.PHONE_LOGIN]: shouldDisablePhoneLoginBtn,
    [TAB_TYPE.EMAIL_FORGET]: shouldDisableEmailForgetBtn,
    [TAB_TYPE.PHONE_FORGET]: shouldDisablePhoneForgetBtn,
    [TAB_TYPE.EMAIL_REGISTER]: shouldDisableEmailRegisterBtn,
    [TAB_TYPE.PHONE_REGISTER]: shouldDisablePhoneRegisterBtn,
    [TAB_TYPE.FORGET_RECEIVE_CAPTCHA]: shouldDisableForgetReceiveCaptchaBtn,
  };

  return [BTN_TAB_MAP[type]];
};
