import { AccountBox } from '@/components/account/components/account-box';
import { PasswordInput } from '@/components/basic-input';
import { Loading } from '@/components/loading';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo, clsx, message } from '@/core/utils';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

export default function SettingPasswordForm() {
  const router = useRouter();
  const [inputState, setInputState] = useImmer({
    loginPwd: '',
    fundsPwd: '',
    confirmFundsPwd: '',
    loginPwdError: true,
    fundsPwdError: true,
    confirmFundsPwdError: true,
  });
  const { fundsPwd, confirmFundsPwd, fundsPwdError, confirmFundsPwdError, loginPwd, loginPwdError } = inputState;
  const onInputLoginPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.loginPwd = value;
      draft.loginPwdError = hasError;
    });
  };
  const onInputFundsPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.fundsPwd = value;
      draft.fundsPwdError = hasError;
    });
  };
  const onInputConfirmPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.confirmFundsPwd = value;
      draft.confirmFundsPwdError = hasError;
    });
  };
  const passwordsMatch = fundsPwd === confirmFundsPwd;
  const shouldDisableBtn = !passwordsMatch || fundsPwdError || confirmFundsPwdError || loginPwdError || !loginPwd;
  const getPasswordNotMatchTips = () => {
    if (fundsPwdError || confirmFundsPwdError) return '';
    return !passwordsMatch ? LANG('两次输入密码不一致') : '';
  };
  const handleBindPassword = async () => {
    Loading.start();
    if (shouldDisableBtn) return;
    const result = await Account.settingFundPassword({
      password: loginPwd,
      withdrawPw: confirmFundsPwd,
    });
    if (result.code !== 200) {
      message.error(result.message);
      Loading.end();
      return;
    }
    message.success(LANG('设置成功'));
    router.push(
      {
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
        },
      },
      undefined,
      { shallow: true }
    );
    Loading.end();
  };
  return (
    <AccountBox title={LANG('开启资金密码')}>
      <div className='funds-wrapper'>
        <div className='title'>{ LANG('设置资金密码')} </div>
        <PasswordInput label={LANG('登录密码')} withBorder value={loginPwd} onInputChange={onInputLoginPassword} />
        <PasswordInput
          label={LANG('资金密码')}
          withBorder
          value={fundsPwd}
          placeholder={LANG('请输入资金密码')}
          onInputChange={onInputFundsPassword}
        />
        <PasswordInput
          label={LANG('确认资金密码')}
          withBorder
          value={confirmFundsPwd}
          placeholder={LANG('请再次确认资金密码')}
          customErrorTips={getPasswordNotMatchTips()}
          onInputChange={onInputConfirmPassword}
        />
        <button
          className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
          onClick={handleBindPassword}
          style={{ marginTop: '10px' }}
        >
          {LANG('确定')}
        </button>
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .funds-wrapper {
    width: 530px;
    margin:auto;
    .title{
     margin:50px 0 30px 0;
     font-size:20px;
     color:var(--text-primary);
     font-weight:700;
    }
     :global(.basic-input-container){
      :global(.label){
        font-size:14px;
        color:var(--text-tertiary);
      }
     }
   
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .funds-password {
      padding: 15px 0;
      span {
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        color: #333333;
        border-bottom: 1px dashed #333;
      }
    }
  }
`;
