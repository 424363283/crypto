// 绑定email或phone
import { InputVerificationCode } from '@/components/account/components/verification-code';
import { store } from '@/components/account/store';
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import {
  postAccountInnerTransferApi,
  postAccountUnbindPhoneApi,
  setAntiPhishingCodeApi,
  toggleAccountWithdrawFastApi,
  toggleAccountWithdrawWhiteApi,
  transferWithdrawApi,
  unbindFundPasswordApi,
  updateFundPasswordApi,
  withdrawSellApi,
} from '@/core/api';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account, SENCE } from '@/core/shared/src/account';
import { Wallet } from '@/core/shared/src/wallet';
import { LOCAL_KEY } from '@/core/store';
import { clsx } from '@/core/utils/src/clsx';
import { getIdentity } from '@/core/utils/src/crypto';
import { MediaInfo } from '@/core/utils/src/media-info';
import { message } from '@/core/utils/src/message';
import { isCaptcha } from '@/core/utils/src/regexp';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { ACCOUNT_ROUTE_PATH } from '../constants';
import { BindEmailVerify } from './bind-email';
import { BindGaVerify } from './bind-ga';
import { BindPhoneVerify } from './bind-phone';
interface params {
  amount?: string;
  payment?: string;
  currency?: string;
  target?: string;
}
export interface ITransfer {
  currency: string;
  amount: number;
  note?: string;
  address: string;
}
export interface IWitdraw {
  address: string;
  amount: number;
  chain: string;
  currency: string;
  white: boolean;
  vToken: string;
  remark?: string;
  addressTag?: string;
  common?: boolean;
  id?: string;
}
const CUSTOM_MESSAGE_ERROR: any = {
  verify_email: LANG('邮箱验证码错误'),
  verify_phone: LANG('短信验证码错误'),
  verify_ga: LANG('Ga验证码错误'),
};

export const VerifyForm = (props: {
  prev?: (num?: number) => void;
  secret?: string;
  antiPhishingCode?: string;
  vToken?: string;
  onDone?: (data: any, status?: boolean) => void;
  params?: params;
  transferData?: ITransfer;
  withdrawData?: IWitdraw;
  modelSence?: string;
  autoSend?: boolean;
}) => {
  const { emailCode, smsCode } = store;
  const {
    prev,
    secret,
    antiPhishingCode = '',
    vToken = '',
    params,
    onDone,
    modelSence,
    transferData = {},
    withdrawData,
    autoSend = false,
  } = props;

  const router = useRouter();
  const { state: routerState, routerStore } = router || {};
  const { sence: _sence, countryCode, phone, email, countryId } = routerState || {};
  store.phone = phone;
  store.email = email;
  store.countryCode = countryCode;
  store.closeVerify = true;
  const [state, setState] = useImmer({
    vHash: '',
    securityOptions: [] as { type: string }[],
    gaCode: '',
    shouldDisableBtn: true,
    sence: '' as any,
    bindOptionsSize: 0,
    showBindGa: false, // 是否显示绑定谷歌验证
    showBindPhone: false,
    showBindEmail: false,
    verifyToken: '', // verify 接口返回的token
  });
  const {
    securityOptions,
    gaCode,
    shouldDisableBtn,
    vHash,
    sence,
    bindOptionsSize,
    showBindGa,
    showBindEmail,
    verifyToken,
    showBindPhone,
  } = state;
  const checkShouldDisableBtn = () => {
    return securityOptions.some((option) => {
      switch (option.type) {
        case 'email':
          return !isCaptcha(emailCode);
        case 'phone':
          return !isCaptcha(smsCode);
        case 'ga':
          return !isCaptcha(gaCode);
        default:
          return false;
      }
    });
  };
  useEffect(() => {
    if (modelSence) {
      setState((draft) => {
        draft.sence = modelSence === 'FIATSELL' ? SENCE.CREATE_WITHDRAW : modelSence; //快捷卖币调用的方法 和 提币不一样;但是他们传的场景 又是一样
      });
    } else {
      setState((draft) => {
        draft.sence = _sence;
      });
    }
  }, [modelSence, _sence]);

  useEffect(() => {
    if (securityOptions.length) {
      setState((draft) => {
        draft.shouldDisableBtn = checkShouldDisableBtn();
      });
    }
  }, [securityOptions, emailCode, smsCode, gaCode]);
  useEffect(() => {
    return () => routerStore.clearCache('state');
  }, []);
  const onGaInputChange = (value: string) => {
    setState((draft) => {
      draft.gaCode = value;
    });
  };
  // console.log('verify-sence', sence, routerState);
  const onAllSceneSuccess = async (result: { code: number; data: { token: string }; message: string }) => {
    // 解绑验证项相关
    const UNBIND_OPTIONS: any = {
      [SENCE.UNBIND_GA]: async () => {
        return await Account.googleSecret.unbindGoogleSecret({
          token: result?.data.token,
        });
      },
      [SENCE.UNBIND_PHONE]: async () => {
        return await postAccountUnbindPhoneApi({
          token: result?.data.token,
        });
      },
      // 修改资金密码
      [SENCE.CHANGE_WITHDRAW]: async () => {
        const { fundsPwd, originFundsPwd } = routerState;
        return await updateFundPasswordApi({
          token: result?.data.token,
          oldPassword: originFundsPwd,
          newPassword: fundsPwd,
        });
      },
    };
    if (UNBIND_OPTIONS.hasOwnProperty(sence)) {
      const res = await UNBIND_OPTIONS[sence]();
      if (res.code === 200) {
        store.isVerifySuccess = true;
        await Account.logout();
        router.replace('/login');
      } else {
        store.isVerifySuccess = false;
        message.error(res?.message);
      }
    }
    // 绑定相关
    // 绑定为一次验证即失效，所以绑定项需要单个一个UI处理，
    const BIND_OPTIONS: any = {
      [SENCE.BIND_PHONE]: async () => {
        setState((draft) => {
          draft.showBindPhone = true;
        });
        return false;
      }, //
      [SENCE.BIND_EMAIL]: async () => {
        setState((draft) => {
          draft.showBindEmail = true;
        });
        return false;
      },
      [SENCE.BIND_GA]: () => {
        setState((draft) => {
          draft.showBindGa = true;
        });
        return false;
      },
    };
    if (BIND_OPTIONS.hasOwnProperty(sence)) {
      const res = BIND_OPTIONS[sence]();
      if (res === false) {
        Loading.end();
        return;
      }
    }

    // 安全设置验证项绑定相关
    const SECURITY_SETTING_BIND_OPTIONS: {
      [key: string]: () => void | Promise<{ code: number; data: any; message: string }>;
    } = {
      [SENCE.CHANGE_PHISHING]: async () => {
        return await setAntiPhishingCodeApi({
          token: result?.data.token,
          antiPhishing: antiPhishingCode,
        });
      },
      [SENCE.WITHDRAW_FAST]: async () => {
        return await toggleAccountWithdrawFastApi({ enable: true, token: result?.data.token });
      },
      [SENCE.WITHDRAW_WHITE]: async () => {
        const { enable = true } = routerState;
        return await toggleAccountWithdrawWhiteApi({ enable: enable, token: result?.data.token });
      },
      [SENCE.UNBIND_WITHDRAW]: async () => {
        return await unbindFundPasswordApi({
          token: result?.data.token,
        });
      },
    };
    // 重置邮箱，手机验证码等 往下一步走
    const isResetPhoneOrEmail = routerState?.reset && (sence === SENCE.BIND_PHONE || sence === SENCE.BIND_EMAIL);
    if (SECURITY_SETTING_BIND_OPTIONS.hasOwnProperty(sence) && !isResetPhoneOrEmail) {
      const res = await SECURITY_SETTING_BIND_OPTIONS[sence]();
      if (res && res.code === 200) {
        store.isVerifySuccess = true;
        message.success(LANG('操作成功'));
        await router.push(
          {
            pathname: ACCOUNT_ROUTE_PATH.SECURITY_SETTING.PATHNAME,
            query: ACCOUNT_ROUTE_PATH.SECURITY_SETTING.QUERY,
          },
          undefined,
          { shallow: true }
        );
      } else {
        store.isVerifySuccess = false;
        message.error(res?.message || LANG('操作失败'));
      }
      Loading.end();
    }
    // 资产提币/内部转账绑定项相关
    const ASSETS_BIND_OPTIONS: { [key: string]: () => void } = {
      [SENCE.BIND_EMAIL]: () => {
        if (routerState?.reset) {
          router.push({
            pathname: ACCOUNT_ROUTE_PATH.RESET_EMAIL.PATHNAME,
            query: ACCOUNT_ROUTE_PATH.RESET_EMAIL.QUERY,
            state: {
              token: result?.data.token,
              hideResetType: true,
            },
          });
        }
      },
      [SENCE.BIND_PHONE]: () => {
        if (routerState?.reset) {
          router.push({
            pathname: ACCOUNT_ROUTE_PATH.RESET_PHONE.PATHNAME,
            query: ACCOUNT_ROUTE_PATH.RESET_PHONE.QUERY,
            state: {
              token: result?.data.token,
              hideResetType: true,
            },
          });
        }
      },
      [SENCE.FORGOT_WITHDRAW]: () => {
        router.push({
          pathname: ACCOUNT_ROUTE_PATH.RESET_FUND_PASSWORD.PATHNAME,
          query: ACCOUNT_ROUTE_PATH.RESET_FUND_PASSWORD.QUERY,
          state: {
            token: result?.data.token,
            sence,
          },
        });
      },
      [SENCE.CHANGE_PASSWORD]: () => {
        router.push({
          pathname: ACCOUNT_ROUTE_PATH.RESET_LOGIN_PASSWORD.PATHNAME,
          query: ACCOUNT_ROUTE_PATH.RESET_LOGIN_PASSWORD.QUERY,
          state: {
            token: result?.data.token,
            sence,
          },
        });
      },
      [SENCE.CREATE_WITHDRAW]: async () => {
        if (modelSence === 'FIATSELL') return;
        const res = await transferWithdrawApi({
          token: result?.data.token,
          version: '2',
          ...(withdrawData as IWitdraw),
        });
        if (res?.code === 200) {
          store.isVerifySuccess = true;
          onDone?.(true);
        } else {
          store.isVerifySuccess = false;
          message.error(res?.message);
          onDone?.(false);
        }
      },
      [SENCE.CREATE_TRANSFER]: async () => {
        const res = await postAccountInnerTransferApi(transferData as ITransfer);
        if (res?.code === 200) {
          store.isVerifySuccess = true;
          onDone?.(true);
        } else {
          store.isVerifySuccess = false;
          message.error(res?.message);
          onDone?.(false);
        }
      },
      [SENCE.CHANGE_ADDRESS_WHITE]: async () => {
        const data = { ...withdrawData, token: result?.data.token } as any;
        const handleAddress = data?.id ? Wallet.editAddress : Wallet.addAddress;
        const res = await handleAddress(data);
        if (res?.code === 200) {
          store.isVerifySuccess = true;
          onDone?.(true);
        } else {
          store.isVerifySuccess = false;
          message.error(res?.message);
          onDone?.(false);
        }
      },
    };
    if (ASSETS_BIND_OPTIONS.hasOwnProperty(sence)) {
      await ASSETS_BIND_OPTIONS[sence]();
    }

    // 快捷卖币  用的提币的场景
    if (modelSence === 'FIATSELL') {
      const res: any = await withdrawSellApi({
        token: result?.data.token,
        vToken,
        ...params,
      });
      if (res?.data?.redirectURL) {
        onDone?.(res.data.redirectURL, true);
      } else {
        message.error(res?.message);
      }
    }
    Loading.end();
  };
  //验证码校验
  const handleVerifyCode = async () => {
    Loading.start();
    const verifyCodeParams: any = {
      vHash,
      sence,
    };
    if (emailCode) {
      verifyCodeParams.email_code = emailCode;
    }
    if (smsCode) {
      verifyCodeParams.phone_code = smsCode;
    }
    if (gaCode) {
      verifyCodeParams.ga_code = gaCode;
    }
    if (vToken) {
      verifyCodeParams.vToken = vToken;
    }
    if (!verifyToken) {
      const result = await Account.securityVerify.referralVerifyCode(verifyCodeParams);
      if (result?.code === 200) {
        if (Object.values(result.data).includes(false)) {
          Object.keys(result.data).forEach((key) => {
            const value = (result.data as any)[key];
            if (!CUSTOM_MESSAGE_ERROR[key] || value) return;
            message.error(result.message || CUSTOM_MESSAGE_ERROR[key]);
          });
          Loading.end();
          return;
        } else {
          setState((draft) => {
            draft.verifyToken = result?.data.token;
          });
          onAllSceneSuccess(result);
        }
      } else {
        Loading.end();
        message.error(result?.message || LANG('验证码错误'));
        if (result.code === 515) {
          // vHash过期，返回上一步
          if (prev) {
            prev(1);
          } else {
            router.back();
          }
        }
      }
    }
  };
  const handleReset = () => {
    router.push({
      pathname: ACCOUNT_ROUTE_PATH.RESET_TYPE.PATHNAME,
      query: ACCOUNT_ROUTE_PATH.RESET_TYPE.QUERY,
    });
  };
  const onGetOptionsSuccess = (data: { type: string; target: string; option: number }[]) => {
    const securityOptions = data;
    const hasPhoneOption = securityOptions.some((option) => option.type === 'phone');
    const hasEmailOption = securityOptions.some((option) => option.type === 'email');
    const hasGaOption = securityOptions.some((option) => option.type === 'ga');
    const { reset = false } = routerState;
    if (sence === SENCE.UNBIND_PHONE && !hasPhoneOption && !reset) {
      securityOptions.unshift({ type: 'phone', target: '', option: 1 });
    }
    if (sence === SENCE.UNBIND_EMAIL && !hasEmailOption && !reset) {
      securityOptions.unshift({ type: 'email', target: '', option: 1 });
    }
    if (sence === SENCE.UNBIND_GA && !hasGaOption) {
      securityOptions.push({ type: 'ga', target: '', option: 1 });
    }
    securityOptions.sort(function (a, b) {
      if (a.type === 'phone') {
        return -1;
      } else if (a.type === 'email' && b.type !== 'phone') {
        return -1;
      } else {
        return 1;
      }
    });
    setState((draft) => {
      draft.securityOptions = securityOptions;
    });
  };

  // 获取验证场景
  useEffect(() => {
    if (sence) {
      Loading.start();
      const vHash = getIdentity(32);
      setState((draft) => {
        draft.vHash = vHash;
      });
      const getSecurityOptions = async () => {
        const options = await Account.securityVerify.getSecurityOptions({
          vHash,
          sence,
        });
        if (options.code === 200) {
          onGetOptionsSuccess(options.data);
        } else {
          message.error(options.message);
        }
      };
      //已绑定的数据
      const getBindOptions = async () => {
        const options = await Account.securityVerify.getBindOptions();
        if (options.code === 200) {
          setState((draft) => {
            draft.bindOptionsSize = options.data.length;
          });
        } else {
          message.error(options.message);
        }
      };
      (async () => {
        await getSecurityOptions();
        await getBindOptions();
        Loading.end();
      })();
    }
  }, [sence]);

  const renderContent = () => {
    if (securityOptions.length === 0) return null;
    if (showBindGa) {
      return <BindGaVerify token={verifyToken} secret={secret || ''} prev={prev} />;
    }
    if (showBindPhone) {
      return <BindPhoneVerify token={verifyToken} />;
    }
    if (showBindEmail) {
      return <BindEmailVerify token={verifyToken} />;
    }
    return securityOptions.map((item) => {
      if (item.type === 'ga' && sence !== SENCE.BIND_GA) {
        // 解绑时需要
        return (
          <div className='verification-item' key={item.type}>
            <BasicInput
              label={LANG('谷歌验证码')}
              placeholder={LANG('请输入Google验证码')}
              type={INPUT_TYPE.CAPTCHA}
              value={gaCode}
              withBorder
              onInputChange={onGaInputChange}
            />
          </div>
        );
      }
      return (
        <div className='verification-item' key={item.type}>
          <InputVerificationCode
            type={item.type === 'email' ? LOCAL_KEY.INPUT_VERIFICATION_EMAIL : LOCAL_KEY.INPUT_VERIFICATION_PHONE}
            scene={sence}
            withBorder
            withdrawData={{
              currency: withdrawData?.currency,
              amount: withdrawData?.amount,
              address: withdrawData?.address,
              memo: withdrawData?.addressTag,
            }}
            autoSend={autoSend}
          />
        </div>
      );
    });
  };
  const isSenceGa = sence === SENCE.BIND_GA;
  const renderResetButton = () => {
    const { hideResetType = false } = routerState || {};
    const resetHideType = isSenceGa ? false : hideResetType; // ga验证不隐藏，点击验证码不可用 跳转绑定手机和邮箱，hideResetType会被重置为true
    if (bindOptionsSize > 1 && !resetHideType) {
      return (
        <div className={clsx('reset-wrapper', isSenceGa && 'reset-ga-type-wrapper')}>
          <span onClick={handleReset}>{LANG('验证码不可用')}</span>
        </div>
      );
    }
    return null;
  };
  const PrevBtn = () => {
    if (prev && !showBindGa) {
      return (
        <Button type='light-border-2' className='btn-prev' onClick={() => prev(1)}>
          {LANG('上一步')}
        </Button>
      );
    }
    return null;
  };
  const shouldShowConfirmBtn = !showBindGa && !showBindEmail && !showBindPhone;
  const renderBottom = () => {
    return (
      <div className='verify-bottom'>
        <div className={clsx('verify-btn-wrapper', prev && 'fixed-width')}>
          <PrevBtn />
          {shouldShowConfirmBtn ? (
            <Button
              className={clsx('confirm-btn')}
              onClick={handleVerifyCode}
              disabled={shouldDisableBtn}
              height={40}
              width='100%'
              type='primary'
            >
              {LANG('确定')}
            </Button>
          ) : null}
        </div>
        {renderResetButton()}
      </div>
    );
  };
  return (
    <div className='verify-form'>
      {renderContent()}
      {renderBottom()}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .verify-form {
    width: 530px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .confirm-btn {
      width: 100%;
    }
    :global(.verify-bottom) {
      position: relative;
      margin-top: 10px;
      :global(.reset-wrapper) {
        margin: 20px 0 0;
        text-align: left;
        :global(span) {
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-6);
          border-bottom: 1px solid var(--theme-font-color-6);
          cursor: pointer;
        }
      }
      :global(.reset-ga-type-wrapper) {
        text-align: center;
      }
    }

    :global(.verify-btn-wrapper) {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      :global(.btn-prev) {
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        text-align: center;
        min-width: 200px;
        margin-right: 10px;
        @media ${MediaInfo.mobile} {
          min-width: auto;
          flex: 1;
        }
      }
      :global(.confirm-btn) {
        @media ${MediaInfo.mobile} {
          flex: 1;
        }
      }
    }
    :global(.fixed-width) {
      width: 100%;
    }
  }
`;
