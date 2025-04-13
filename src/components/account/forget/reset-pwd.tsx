import { BasicInput, PasswordInput } from '@/components/basic-input';
import { INPUT_TYPE } from '@/components/basic-input/types';
import { Button } from '@/components/button';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account, SENCE } from '@/core/shared/src/account';
import { LOCAL_KEY } from '@/core/store';
import { message } from '@/core/utils/src/message';
import { hidePartialOfPhoneOrEmail } from '@/core/utils/src/unknown';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { InputVerificationCode } from '../components/verification-code';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { store } from '../store';
import { TAB_TYPE } from '../types';
import { ACCOUNT_TAB_KEY } from '../constants';
import { Size } from '@/components/constants';
enum RESET_PW_STEP {
  STEP1 = 1,
  STEP2 = 2,
}
const ResetPwd = () => {
  const [step, setStep] = useState(RESET_PW_STEP.STEP1);
  const router = useRouter();
  const [inputState, setInputState] = useImmer({
    initPwd: '',
    confirmPwd: '',
    gaCode: '',
    initPwdError: false, // 新密码不符合要求
    confirmPwdError: false, // 确认密码不符合要求
  });
  const { initPwd, confirmPwd, initPwdError, confirmPwdError, gaCode } = inputState;
  const [shouldDisableReceiveCodeBtn] = useBtnStatus(TAB_TYPE.FORGET_RECEIVE_CAPTCHA);
  const [securityVerifiedToken, setSecurityVerifiedToken] = useState('');
  const { email, phone, curTab, emailCode, smsCode, password, countryCode, showGaVerify } = store;
  const passwordsMatch = initPwd === confirmPwd;
  const shouldDisableResetPwdBtn = !passwordsMatch || initPwdError || confirmPwdError || !password; //两次密码不匹配或者第一个密码无效或者第二个密码无效
  const account = curTab === ACCOUNT_TAB_KEY.EMAIL ? email : countryCode + phone;

  const handleConfirm = async () => {
    if (shouldDisableReceiveCodeBtn) {
      return;
    }
    const verifyParam: any = { account, sence: SENCE.FORGOT_PASSWORD };
    if (emailCode) {
      verifyParam['email_code'] = emailCode;
    }
    if (smsCode) {
      verifyParam['phone_code'] = smsCode;
    }
    if (gaCode) {
      verifyParam['ga_code'] = gaCode;
    }
    const result = await Account.securityVerify.verify(verifyParam);
    if (result.code === 200) {
      store.isVerifySuccess = true;
      setStep(RESET_PW_STEP.STEP2);
      setSecurityVerifiedToken(result.data.token);
    } else {
      store.isVerifySuccess = false;
      setStep(RESET_PW_STEP.STEP1);
      message.error(result.message || LANG('验证码错误'));
    }
  };
  // useEffect(() => {
  //   return () => {
  //     store.showGaVerify = true;
  //     store.showForgetEntry = true;
  //   };
  // }, []);
  useEffect(() => {
    if (showGaVerify) {
      gaCode.length === 6 && (smsCode.length === 6 || emailCode.length === 6) && handleConfirm();
    } else {
      (smsCode.length === 6 || emailCode.length === 6) && handleConfirm();
    }
  }, [emailCode, gaCode, smsCode]);
  const onInputGaCodeChange = (code: string) => {
    setInputState((draft) => {
      draft.gaCode = code;
    });
  };

  // 获取验证码阶段
  const renderVerificationCodePanel = () => {
    // 邮箱验证码
    if (curTab === ACCOUNT_TAB_KEY.EMAIL) {
      return (
        <div className='step2-reset-password'>
          <h4>{LANG('重置登录密码')}</h4>
          <InputVerificationCode
            type={LOCAL_KEY.INPUT_VERIFICATION_EMAIL}
            autoSend
            scene={SENCE.FORGOT_PASSWORD}
            withBorder
          />

          <p className='step2-tips'>
            {LANG('请输入{account}收到的验证码', { account: hidePartialOfPhoneOrEmail(email) })}
          </p>
          {showGaVerify ? (
            <BasicInput
              size = {Size.XL}
              label={LANG('谷歌验证码')}
              placeholder={LANG('请输入Google验证码')}
              type={INPUT_TYPE.CAPTCHA}
              value={gaCode}
              withBorder
              onInputChange={onInputGaCodeChange}
            />
          ) : null}

          <Button
            type='primary'
            style={{ width: '100%', padding: '14px 0' }}
            onClick={handleConfirm}
            disabled={shouldDisableReceiveCodeBtn}
          >
            {LANG('确定')}
          </Button>
        </div>
      );
    } else if (curTab === ACCOUNT_TAB_KEY.PHONE) {
      // 手机验证码
      return (
        <div className='step2-reset-password'>
          <h4>{LANG('重置登录密码')}</h4>
          <InputVerificationCode
            type={LOCAL_KEY.INPUT_VERIFICATION_PHONE}
            autoSend
            scene={SENCE.FORGOT_PASSWORD}
            withBorder
          />
          <p className='step2-tips'>
            {LANG('请输入{account}收到的验证码', { account: hidePartialOfPhoneOrEmail(account) })}
          </p>
          {showGaVerify ? (
            <BasicInput
              size = {Size.XL}
              label={LANG('谷歌验证码')}
              placeholder={LANG('请输入Google验证码')}
              type={INPUT_TYPE.CAPTCHA}
              withBorder
              value={gaCode}
              onInputChange={onInputGaCodeChange}
            />
          ) : null}
          <Button
            type='primary'
            style={{ width: '100%', padding: '14px 0' }}
            onClick={handleConfirm}
            disabled={shouldDisableReceiveCodeBtn}
          >
            {LANG('确定')}
          </Button>
        </div>
      );
    } else {
      return null;
    }
  };
  const onInputNewPwd = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.initPwd = value;
      draft.initPwdError = hasError;
    });
  };
  const onInputConfirmPwd = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.confirmPwd = value;
      draft.confirmPwdError = hasError;
    });
  };
  const handleSummitResetPwd = async () => {
    if (shouldDisableResetPwdBtn) {
      return;
    }
    const res = await Account.resetPassword({
      password: confirmPwd,
      token: securityVerifiedToken,
      account: account,
    });
    if (res.code === 200) {
      if (res.message === '') {
        message.success(LANG('密码重置成功'));
      } else {
        message.success(res.message);
      }
      router.push('/login');
    }
  };
  const getPasswordNotMatchTips = () => {
    if (initPwdError || confirmPwdError || confirmPwd.length === 0) return '';
    return !passwordsMatch ? LANG('两次输入密码不一致') : '';
  };

  // 重置密码输入框阶段
  const renderResetPwdPanel = () => {
    return (
      <div className='step3-reset-password'>
        <p className='title'>{LANG('重置密码')}</p>
        <div className='step3-input-wrapper'>
          <PasswordInput
            label={LANG('新密码')}
            value={initPwd}
            placeholder={LANG('请输入新密码')}
            type={INPUT_TYPE.RESET_PASSWORD}
            onInputChange={onInputNewPwd}
          />
          <PasswordInput
            label={LANG('确认密码')}
            placeholder={LANG('请再次输入密码')}
            type={INPUT_TYPE.RESET_PASSWORD}
            value={confirmPwd}
            onInputChange={onInputConfirmPwd}
            customErrorTips={getPasswordNotMatchTips()}
            className='confirm-pwd-wrapper'
          />
        </div>
        <Button
          type='primary'
          disabled={shouldDisableResetPwdBtn}
          className='confirm-btn'
          onClick={handleSummitResetPwd}
        >
          {LANG('提交')}
        </Button>
      </div>
    );
  };
  return (
    <>
      {step === RESET_PW_STEP.STEP1 ? renderVerificationCodePanel() : renderResetPwdPanel()}
      <style jsx>{styles}</style>
    </>
  );
};
export default ResetPwd;

const styles = css`
  :global(.step2-reset-password) {
    :global(h4) {
      color: var(--theme-font-color-1);
      font-size: 24px;
      margin-bottom: 35px;
      font-weight: 700;
    }
    :global(.step2-title) {
      font-size: 15px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 15px;
      padding-top: 40px;
    }
    :global(.step2-tips) {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-1);
    }
    :global(.step-2-reset-pwd-input) {
      :global(.input-container) {
        border: 1px solid #d8d8d8;
        margin-top: 8px;
        :global(input) {
          text-indent: 20px;
        }
      }
      :global(.focused) {
        border: 1px solid var(--skin-primary-color);
      }
    }
  }
  :global(.step3-reset-password) {
    :global(.title) {
      font-size: 24px;
      padding-bottom: 10px;
      font-weight: 700;
      margin-bottom: 40px;
      color: var(--theme-font-color-1);
    }
    :global(.step3-input-wrapper) {
      margin-top: 24px;
      :global(.error-input-tips) {
        font-size: 12px;
      }
    }
      
    :global(.step3-error-notice) {
      font-size: 12px;
      color: #ff6960;
      margin-top: 10px;
    }

    :global(.confirm-btn) {
      width: 100%;
      padding: 14px 0;
    }
  }
`;
