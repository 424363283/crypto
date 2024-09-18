import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { Svg } from '@/components/svg';
import { postCommonOauthLoginApi, postCommonOauthRegisterApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { Account } from '@/core/shared/src/account';
import { getFParam, getUrlQueryParams } from '@/core/utils/src/get';
import { message } from '@/core/utils/src/message';
import { useEffect } from 'react';
import { InputInvitationCode } from '../components/invitation-code';
import { store } from '../store';

export const ThirdRegister = ({ onLoginSuccess }: { onLoginSuccess: any }) => {
  const { email } = useRouter().query || {};
  const trace = getUrlQueryParams('trace');
  const type = getUrlQueryParams('type');
  const idToken = getUrlQueryParams('idToken');
  const { ru, checked } = store;
  const router = useRouter();
  const f = getFParam();
  useEffect(() => {
    if (!trace) {
      router.replace('/login');
    }
  }, []);

  useEffect(() => {
    store.trace = trace || '';
  }, [trace]);

  const _register = async () => {
    try {
      Loading.start();
      const params: any = {
        token: idToken,
        scene: type === 'apple' ? 'APPLE_REGISTER' : 'GOOGLE_REGISTER',
        trace,
      };
      if (ru) {
        params.ru = ru;
      }
      if (f) {
        params.f = f;
      }
      const result = await postCommonOauthRegisterApi(params);

      if (result.code === 200) {
        const authResult: any = await postCommonOauthLoginApi({
          type: type || '',
          idToken: idToken || '',
          scene: type === 'apple' ? 'APPLE_LOGIN' : 'GOOGLE_LOGIN',
        });
        if (authResult.code === 200) {
          Account.setLoginStatus(true);
          onLoginSuccess();
          await Account.refreshUserInfo();
        } else {
          message.error(authResult);
        }
      } else {
        message.error(result);
      }
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };

  return (
    <>
      <div className='third-register'>
        <div className='account'>
          <Svg src='/static/images/account/login/account.svg' width={20} height={20} />
          <div>{email}</div>
        </div>
        <InputInvitationCode />
        <Button type='primary' height={50} style={{ width: '100%' }} onClick={_register} disabled={!checked}>
          {LANG('注册')}
        </Button>
      </div>
      <style jsx>{`
        .third-register {
          .account {
            padding: 36px 0 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            > div {
              color: var(--theme-font-color-1);
              margin-left: 4px;
            }
          }
        }
      `}</style>
    </>
  );
};
