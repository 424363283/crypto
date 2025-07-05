// 验证邮箱
export const isEmail = (email: string): boolean => {
    return /^[a-z0-9A-Z]+([._\\-]*[a-z0-9A-Z_])*@([a-z0-9A-Z]+[-a-z0-9A-Z]*[a-z0-9A-Z]+.){1,63}[a-z0-9A-Z]+$/.test(email);
  };
  
  // 手机号
  export const isPhoneNumber = (phone: string): boolean => {
    return /^\d{5,15}$/.test(phone);
  };
  
  // 密码验证
  export const isPassword = (password: string): boolean => {
    return /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*?"'()+,-./:;<>[\]_`{|}~]{6,16}$/.test(password);
  };
  
  // 6位验证码
  export const isCaptcha = (captcha: string): boolean => {
    return /^\d{6}$/.test(captcha);
  };
  
  // 4-20位防钓鱼码
  export const isPhishing = (phishing: string): boolean => {
    return /^[0-9a-zA-z]{4,20}$/.test(phishing);
  };
  
  // 地址地址
  export const isUrl = (url: string): boolean => {
    return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(url);
  };

  // 用户UID
  export const isUserId = (uid: string): boolean => {
    return /^\d+$/.test(uid);
  };
  
