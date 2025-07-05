import { useLocalCountdown } from '@/core//hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account, SENCE } from '@/core/shared';
import { LOCAL_KEY, useLoginUser } from '@/core/store';
import { isEmail, isPhoneNumber, message } from '@/core/utils';
import { useEffect } from 'react';
import { store } from '../store';
export const useSendCaptchaCode = (type: LOCAL_KEY, scene: SENCE) => {
  const senceType = (scene ? type + '_' + scene : type) as LOCAL_KEY;
  const { countdown, isActive, startCountdown, resetCountdown } = useLocalCountdown(senceType);
  const { phone, email, countryCode, closeVerify, withdrawData, isVerifySuccess } = store;
  const { user } = useLoginUser();
  const defaultEmail = user?.email || '';
  const defaultPhone = user?.phone || '';
  // verificationToken作用：防止重复唤起验证码弹窗
  const verifyCodeBtnStatus = () => {
    if (type === LOCAL_KEY.INPUT_REGISTER_PHONE) {
      return isPhoneNumber(phone);
    }
    if (type === LOCAL_KEY.INPUT_REGISTER_EMAIL) {
      return isEmail(email);
    }
    return true;
  };
  const isValid = verifyCodeBtnStatus();
  useEffect(() => {
    if (isVerifySuccess) {
      resetCountdown();
    }
    const handleBeforeUnload = (e) => {
      resetCountdown();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      resetCountdown(); // 安全认证成功后重置倒计时
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isVerifySuccess]);
  // 在ui上让用户先选择国家再输入手机号的场景才需要拼接区号
  let newPhone: string = phone || defaultPhone;
  if (
    scene === SENCE.REGISTER ||
    scene === SENCE.BIND_PHONE ||
    scene === SENCE.FORGOT_PASSWORD ||
    scene === SENCE.LOGIN
  ) {
    newPhone = countryCode + phone;
  }
  const getVerificationCode = async () => {
    if (isActive) return;
    let res = {} as any;
    if (isValid) {
      if (withdrawData && scene === SENCE.CREATE_WITHDRAW) {
        res = await Account.verifyCode.sendWithDrawEmail(email || defaultEmail, withdrawData);
      } else if (type === LOCAL_KEY.INPUT_VERIFICATION_EMAIL || type === LOCAL_KEY.INPUT_REGISTER_EMAIL) {
        res = await Account.verifyCode.sendEmail(scene, email || defaultEmail, closeVerify);
      } else if (type === LOCAL_KEY.INPUT_VERIFICATION_PHONE || type === LOCAL_KEY.INPUT_REGISTER_PHONE) {
        res = await Account.verifyCode.sendPhone(scene, countryCode, newPhone, closeVerify);
      }
      if (res?.code === 200) {
        startCountdown();
      } else {
        message.error(res?.message || LANG('验证码发送失败'));
      }
    }
  };

  return {
    countdown,
    isActive,
    getVerificationCode,
    isValid,
  };
};
