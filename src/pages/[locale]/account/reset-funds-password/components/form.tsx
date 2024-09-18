import { PasswordInput } from '@/components/basic-input';
import { Loading } from '@/components/loading';
import { resetFundPasswordApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo, clsx, message } from '@/core/utils';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

export const ResetFundPwdForm = () => {
  const router = useRouter();
  const { state } = router;
  const [inputState, setInputState] = useImmer({
    newPwd: '',
    confirmNewPwd: '',
    newPwdError: true,
    confirmPwdError: true,
  });
  const { newPwd, confirmNewPwd, newPwdError, confirmPwdError } = inputState;

  const onInputNewPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.newPwd = value;
      draft.newPwdError = hasError;
    });
  };
  const onInputConfirmPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.confirmNewPwd = value;
      draft.confirmPwdError = hasError;
    });
  };
  const passwordsMatch = newPwd === confirmNewPwd;
  const shouldDisableBtn = !passwordsMatch || newPwdError || confirmPwdError;
  const getPasswordNotMatchTips = () => {
    if (newPwdError || confirmPwdError) return '';
    return !passwordsMatch ? LANG('两次输入密码不一致') : '';
  };
  const submit = async () => {
    Loading.start();
    try {
      const token = state?.token;
      const result = await resetFundPasswordApi({
        password: newPwd,
        token,
      });
      Loading.end();
      if (result.code === 200) {
        await Account.logout();
        router.replace('/login');
      } else {
        message.error(result.message);
      }
    } catch (e) {
      Loading.end();
    }
  };
  return (
    <div className='reset-pwd-wrapper'>
      <PasswordInput
        label={LANG('新资金密码')}
        withBorder
        placeholder={LANG('请输入资金密码')}
        value={newPwd}
        onInputChange={onInputNewPassword}
      />
      <PasswordInput
        label={LANG('确认密码')}
        withBorder
        placeholder={LANG('请再次确认密码')}
        value={confirmNewPwd}
        customErrorTips={getPasswordNotMatchTips()}
        onInputChange={onInputConfirmPassword}
      />
      <button
        className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
        onClick={submit}
        style={{ marginTop: '10px' }}
      >
        {LANG('确定')}
      </button>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .reset-pwd-wrapper {
    width: 530px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
