import { resso } from '@/core/store';

export const store = resso({
  curTab: 0, // 当前选择的tab
  password: '',
  email: '',
  phone: '',
  username: '',
  captcha: '', // 验证码
  smsCode: '',
  emailCode: '',
  gaCode: '',
  checked: true,
  countryCode: 0,
  countryId: '0',
  token: '',
  verificationToken: '', //滑块验证token
  closeVerify: false, // 是否关闭验证
  ru: '', // 注册时的邀请码
  showForgetEntry: true, //是否显示forget入口
  showVerifyModal: false, // 是否显示验证弹窗
  showGaVerify: false, // 是否显示ga验证
  trace: '', // 三方token
  isVerifySuccess: false, // 是否验证成功，用于安全认证成功后重置倒计时
  securityOptions: [
    {
      type: 'phone',
      target: '',
      option: 1,
    },
  ], // 安全验证项
  loginVhash: '', // 登录时的vhash
  withdrawData: {
    currency: '',
    amount: '',
    address: '',
  },
});
