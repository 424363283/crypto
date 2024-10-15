import { PasswordInput } from '@/components/basic-input';
import { Svg } from '@/components/svg';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { getUrlQueryParams } from '@/core/utils/src/get';
import { useEffect } from 'react';
import { LoginButton } from '../login/login-btn';
import { store } from '../store';
import { ACCOUNT_TAB_KEY } from '../constants';

export const ThirdBind = ({ onLoginSuccess }: { onLoginSuccess: any }) => {
  const trace = getUrlQueryParams('trace');
  const email = getUrlQueryParams('email');
  const { isMobile } = useResponsive();
  const router = useRouter();
  useEffect(() => {
    if (!trace) {
      router.replace('/login');
    }
  }, []);

  useEffect(() => {
    store.curTab = ACCOUNT_TAB_KEY.THIRD_BIND;
    store.trace = trace || '';
    store.email = email || '';
  }, []);
  return (
    <>
      <div className='third-bind'>
        <div className='tips'>
          {LANG(
            '一个邮件地址只能创建一个{APP_NAME}账户，我们发现该邮件已经在{APP_NAME}系统中存在，请输入您的密码，与您的{APP_NAME}链接',
            { APP_NAME: process.env.NEXT_PUBLIC_APP_NAME }
          )}
        </div>
        <div className='account'>
          <Svg src='/static/images/account/login/account.svg' width={20} height={20} />
          <div>{email}</div>
        </div>
        <PasswordInput />
        <LoginButton shouldDisableBtn={false} onLoginSuccess={onLoginSuccess} />
      </div>
      <style jsx>{`
        .third-bind {
          .tips {
            padding-top: 12px;
            padding-right: ${isMobile ? '120px' : '0'};
            font-size: 12px;
            color: var(--theme-font-color-3);
          }
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
