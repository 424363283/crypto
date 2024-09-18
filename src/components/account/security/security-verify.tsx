import { INPUT_TYPE } from '@/components/basic-input';
import { Loading } from '@/components/loading';
import { BasicModal } from '@/components/modal';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account, SENCE } from '@/core/shared/src/account';
import { LOCAL_KEY } from '@/core/store';
import { message } from '@/core/utils/src/message';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { InputVerificationCode } from '../components/verification-code';
import { store } from '../store';
export const SecurityVerify = () => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const [gaCode, setGaCode] = useState('');
  const {
    securityOptions = [],
    showVerifyModal,
    phone,
    email,
    password,
    countryCode,
    emailCode,
    smsCode,
    loginVhash,
    curTab,
  } = store;
  if (!showVerifyModal) return null;
  const onChange = (e: CheckboxChangeEvent) => {
    setIsChecked(!isChecked);
  };
  const onInputChange = (value: string) => {
    setGaCode(value);
  };
  const renderContent = () => {
    return securityOptions.map((item) => {
      if (item.type === 'ga') {
        return (
          <div className='verification-item' key={item.type}>
            <BasicInput
              label={LANG('谷歌验证码')}
              placeholder={LANG('请输入Google验证码')}
              type={INPUT_TYPE.CAPTCHA}
              value={gaCode}
              withBorder
              onInputChange={onInputChange}
            />
          </div>
        );
      }
      return (
        <div className='verification-item' key={item.type}>
          <InputVerificationCode
            type={item.type === 'email' ? LOCAL_KEY.INPUT_VERIFICATION_EMAIL : LOCAL_KEY.INPUT_VERIFICATION_PHONE}
            scene={SENCE.LOGIN}
            withBorder
            autoSend
          />
        </div>
      );
    });
  };
  const resetStore = () => {
    store.smsCode = '';
    store.emailCode = '';
    store.gaCode = '';
    store.showVerifyModal = false;
    setGaCode('');
    setIsChecked(false);
  };

  const onConfirm = async () => {
    Loading.start();
    const basicParams = {
      account: curTab === 1 ? countryCode + phone : email,
      vHash: loginVhash,
      sence: SENCE.LOGIN,
      ...(gaCode && { ga_code: gaCode }),
      ...(emailCode && { email_code: emailCode }),
      ...(smsCode && { phone_code: smsCode }),
    };

    const result = await Account.securityVerify.referralVerifyCode(basicParams);
    const vToken = result?.data?.token || '';
    const CUSTOM_MESSAGE_ERROR: any = {
      verify_email: LANG('邮箱验证码错误'),
      verify_phone: LANG('短信验证码错误'),
      verify_ga: LANG('Ga验证码错误'),
    };
    const onVerifyDone = async () => {
      if (Object.values(result.data || {}).includes(false)) {
        if (result.message) {
          message.error(result.message);
        } else {
          Object.keys(result.data).forEach((key) => {
            const value = (result.data as any)[key];
            if (!CUSTOM_MESSAGE_ERROR[key] || value) return;
            message.error(CUSTOM_MESSAGE_ERROR[key]);
          });
        }
      } else {
        resetStore();
        const loginParam: any = {
          terminal: 'pc',
          version: '2.0',
          vHash: loginVhash,
          password,
          trust: isChecked,
          vToken,
          ...(countryCode && { countryCode }),
          username: curTab === 1 ? phone : email,
        };
        if (store.trace) {
          loginParam.trace = store.trace;
        }
        const result = await Account.login(loginParam);
        if (result?.code === 200) {
          router.push('/');
        }
      }
    };
    if (result.code === 200) {
      onVerifyDone();
    } else {
      message.error(result.message);
    }
    Loading.end();
  };
  const onCancel = () => {
    resetStore();
  };
  return (
    <>
      <BasicModal
        title={LANG('安全验证')}
        open={showVerifyModal}
        onCancel={onCancel}
        onOk={onConfirm}
        width={464}
        className='security-modal'
      >
        {renderContent()}
        <Checkbox onChange={onChange} className='security-checkbox' checked={isChecked}>
          <span className='security-tips'>{LANG('信任该设备，30天内登录将不再需要验证')}</span>
        </Checkbox>
        <style jsx>{styles}</style>
      </BasicModal>
    </>
  );
};

const styles = css`
  :global(.security-modal) {
    :global(.security-checkbox) {
      color: var(--theme-font-color-1);
      :global(.security-tips) {
        color: var(--theme-font-color-1);
        font-size: 14px;
        font-weight: 400;
      }
    }
    :global(.ant-modal-title) {
      font-weight: 700;
    }
  }
`;
