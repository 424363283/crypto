import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { useLocalStorage, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account ,VerifyCode,SENCE} from '@/core/shared/src/account';
import { LOCAL_KEY } from '@/core/store';
import { getOtherLink } from '@/core/utils';
import { encryptPassport, getIdentity } from '@/core/utils/src/crypto';
import { getFParam, getPlatform } from '@/core/utils/src/get';
import { message } from '@/core/utils/src/message';
import { useEffect } from 'react';
import { store } from '../store';

export const RegisterButton = (props: { shouldDisableBtn: boolean; type: LOCAL_KEY }) => {
  const { shouldDisableBtn, type } = props;
  const router = useRouter();
  const [, setState] = useLocalStorage(LOCAL_KEY.FIRST_REGISTER_MODAL_VISIBLE, false);
  const { email, password, countryCode, phone, countryId, smsCode, emailCode, ru } = store;
  const account = type === LOCAL_KEY.INPUT_REGISTER_PHONE ? countryCode + phone : email;
  const phoneNumber = countryCode + (phone || '').replace(/^0*/, '');
  const terminal = getPlatform();
  const f = getFParam();

  const loginParam = {
    username: account,
    password,
    vHash: getIdentity(32),
    terminal,
  };
  const onRegisterDone = async () => {
    store.isVerifySuccess = true;
    setState(true);
    await Account.refreshUserInfo();

    // 特殊判断
    if (getOtherLink() !== null) {
      window.location.href = getOtherLink() as string;
    }
  };
  useEffect(() => {
    return () => {
      store.ru = '';
    };
  }, []);
  const _registerByPhone = async () => {
    if (password?.length > 16) {
      message.error(LANG('密码不能超过16位'));
      Loading.end();
      return;
    }
    const params: any = {
      password,
      countryCode: String(countryCode),
      phone: phoneNumber,
      countryId,
      terminal,
      code: smsCode,
    };
    if (ru) {
      params.ru = ru;
    }
    if (f) {
      params.f = f;
    }
    await VerifyCode.checkSmsCode(phoneNumber,SENCE.REGISTER,smsCode);

    const registerResult = await Account.registerUser({
      sign: encryptPassport(params),
      ...params,
    });
    if (registerResult?.code === 200) {
      const res = await Account.login({ ...loginParam,  countryCode});
      if (res.code === 200) {
        router.push('/');
        onRegisterDone();
      }
    } else {
      store.isVerifySuccess = false;
      message.error(registerResult.message);
    }
    Loading.end();
  };
  const _registerByEmail = async () => {
    if (password?.length > 16) {
      message.error(LANG('密码不能超过16位'));
      Loading.end();
      return;
    }
    const resetParam = { password, email, terminal, code: emailCode } as any;
    if (ru) {
      resetParam.ru = ru;
    }
    if (f) {
      resetParam.f = f;
    }
    const data = {
      sign: encryptPassport(resetParam),
      ...resetParam,
    };
    
    await VerifyCode.checkEmail(email,SENCE.REGISTER,emailCode);

    const res = await Account.registerUser(data);
    if (res?.code === 200) {
      const res = await Account.login(loginParam);
      if (res.code === 200) {
        router.push('/');
        onRegisterDone();
      }
    } else {
      store.isVerifySuccess = false;
      message.error(res.message);
    }
    Loading.end();
  };
  const handleRegisterUser = async () => {
    try {
      Loading.start();
      if (type === LOCAL_KEY.INPUT_REGISTER_PHONE) {
        await _registerByPhone();
      } else {
        await _registerByEmail();
      }
    } catch (err: any) {
      Loading.end();
      message.error(err.message);
    }
  };
  return (
    <Button
      type='primary'
      className={shouldDisableBtn ? 'disabled' : ''}
      style={{ width: '100%', height: '50px', borderRadius: '56px'}}
      onClick={handleRegisterUser}
    >
      {LANG('注册')}
    </Button>
  );
};
