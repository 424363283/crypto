import { 
  postCommonSendEmailCodeApi, 
  postCommonValidateEmailCodeApi,
  sendSmsCodeApi,
  validateSmsCodeApi,
  postSendEmailCodeApi_V2,
  sendSmsCodeApi_V2,
  postCommonValidateEmailCodeApi_V2,
  validateSmsCodeApi_V2,
 } from '@/core/api';
import { R } from '@/core/network';
import { Captcha } from '../captcha';
import { SENCE } from './types';

/**
* 验证类
* @class VerifyCode
* @extends {Captcha}
*/

// class VerifyCode extends Captcha {
//   // 调用verification接口获取token
//   public static getVerificationToken = async () => {
//     const { data } = await this.verification();
//     return data?.token;
//   };

//   // 发送邮箱验证码
//   public static sendEmail = async <T>(sence: SENCE, email: string, closeVerify: boolean = false): Promise<R<T> | void> => {
//     const param = {} as any;
//     param.account = email;
//     param.type = sence;
//     // if (sence === SENCE.BIND_EMAIL || sence === SENCE.LOGIN || sence === SENCE.REGISTER || sence === SENCE.FORGOT_PASSWORD || sence === SENCE.REACTIVATE_ACCOUNT) {  }
//     if (closeVerify) return postCommonSendEmailCodeApi<T>(param);
//     const { data } = await this.verification();
//     if (data?.token) {
//       return postCommonSendEmailCodeApi<T>({ ...param, geetestToken: data.token });
//     }
//   };

//   // 发送提币邮箱验证码
//   public static sendWithDrawEmail = async <T>(email: string, withDrawData: any): Promise<R<T> | void> => {
//     return postCommonSendEmailCodeApi<T>({
//       sence: SENCE.CREATE_WITHDRAW,
//       email: email,
//       params: withDrawData,
//     });
//   };

//    // 发送手机验证码
//   public static sendPhone = async <T>(sence: SENCE, countryCode: number | string, phone: string, closeVerify: boolean = false): Promise<R<T> | void> => {
//     const param = {  } as any;

//     param.countryCode = countryCode;
//     param.account = phone;
//     param.type = sence;
   
//     // if (sence === SENCE.BIND_PHONE || sence === SENCE.LOGIN || sence === SENCE.REGISTER || sence === SENCE.FORGOT_PASSWORD || sence === SENCE.REACTIVATE_ACCOUNT) {
//     // }
//     if (closeVerify) return sendSmsCodeApi<T>(param);
//     const { data } = await this.verification();
//     if (data?.token) {
//       return sendSmsCodeApi<T>({ ...param, geetestToken: data?.token });
//     }
//   };
 
//   // 校验邮箱验证码
//   public static checkEmail = async <T>(account: string, type: string, code: string): Promise<R<T> | void> => {
//     return postCommonValidateEmailCodeApi<T>({ account,  type, code });
//   };
//   // 校验短信验证码
//   public static checkSmsCode = async <T>(account: string, type: string, code: string): Promise<R<T>> => {
//     return validateSmsCodeApi<T>({ account, type, code });
//   };
//   // 获取图形验证码token
//   public static getCToken = async (): Promise<string> => {
//     const { data } = await this.verification();
//     return data?.token || '';
//   };
// }



/**
* 验证类-V2
* @class VerifyCode
* @extends {Captcha}
*/

class VerifyCode extends Captcha {
 // 调用verification接口获取token
 public static getVerificationToken = async () => {
   const { data } = await this.verification();
   return data?.token;
 };
 // 发送邮箱验证码
 public static sendEmail = async <T>(sence: SENCE, email: string, closeVerify: boolean = false): Promise<R<T> | void> => {
   const param = { sence } as any;
   if (sence === SENCE.BIND_EMAIL || sence === SENCE.LOGIN || sence === SENCE.REGISTER || sence === SENCE.FORGOT_PASSWORD || sence === SENCE.REACTIVATE_ACCOUNT) {
     param.email = email;
   }
   if (closeVerify) return postSendEmailCodeApi_V2<T>(param);
   const { data } = await this.verification();
   if (data?.token) {
     return postSendEmailCodeApi_V2<T>({ ...param, token: data.token });
   }
 };
 // 发送提币邮箱验证码
 public static sendWithDrawEmail = async <T>(email: string, withDrawData: any): Promise<R<T> | void> => {
   return postSendEmailCodeApi_V2<T>({
     sence: SENCE.CREATE_WITHDRAW,
     email: email,
     params: withDrawData,
   });
 };

 // 发送手机验证码
 public static sendPhone = async <T>(sence: SENCE, countryCode: number | string, phone: string, closeVerify: boolean = false): Promise<R<T> | void> => {
   const param = { sence } as any;
   if (sence === SENCE.BIND_PHONE || sence === SENCE.LOGIN || sence === SENCE.REGISTER || sence === SENCE.FORGOT_PASSWORD || sence === SENCE.REACTIVATE_ACCOUNT) {
     param.countryCode = countryCode;
     param.phone = phone;
   }
   if (closeVerify) return sendSmsCodeApi_V2<T>(param);
   const { data } = await this.verification();
   if (data?.token) {
     return sendSmsCodeApi_V2<T>({ ...param, token: data?.token });
   }
 };
 // 校验邮箱验证码
 public static checkEmail = async <T>(account: string,  type: string, code: string): Promise<R<T> | void> => {
   return postCommonValidateEmailCodeApi_V2<T>({ account, type: type, code });
 };
 // 校验短信验证码
 public static checkSmsCode = async <T>(account: string, type: string, code: string): Promise<R<T>> => {
   return validateSmsCodeApi_V2<T>({ account, type: type, code });
 }; 

 // 获取图形验证码token
 public static getCToken = async (): Promise<string> => {
   const { data } = await this.verification();
   return data?.token || '';
 };
}

export { VerifyCode };
