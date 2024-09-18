import { PasswordInput } from '@/components/basic-input';
import { Loading } from '@/components/loading';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo, clsx, message } from '@/core/utils';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

export const ResetPwdForm = () => {
  const router = useRouter();
  const { state } = router;
  const [inputState, setInputState] = useImmer({
    originPwd: '',
    newPwd: '',
    confirmNewPwd: '',
    originPwdError: true,
    newPwdError: true,
    confirmPwdError: true,
  });
  const { originPwd, newPwd, confirmNewPwd, originPwdError, newPwdError, confirmPwdError } = inputState;
  const onInputOriginPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.originPwd = value;
      draft.originPwdError = false;
    });
  };
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
    if (value.length > 16) {
      message.error('密码不能超过16位');
      setInputState((draft) => {
        draft.confirmPwdError = true;
      });
    }
  };
  const passwordsMatch = newPwd === confirmNewPwd;
  const shouldDisableBtn = !passwordsMatch || originPwdError || newPwdError || confirmPwdError || !originPwd;
  const getPasswordNotMatchTips = () => {
    if (newPwdError || confirmPwdError) return '';
    return !passwordsMatch ? LANG('两次输入密码不一致') : '';
  };
  const submit = async (e: any) => {
    Loading.start();
    try {
      const token = state?.token;
      const result = await Account.updateLoginPassword({
        oldPassword: originPwd,
        newPassword: newPwd,
        token,
      });
      Loading.end();
      if (result.code === 200) {
        message.success(LANG('修改登录密码成功'));
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
      <PasswordInput label={LANG('原密码')} withBorder value={originPwd} onInputChange={onInputOriginPassword} />
      <PasswordInput label={LANG('新密码')} withBorder value={newPwd} onInputChange={onInputNewPassword} />
      <PasswordInput
        label={LANG('确认密码')}
        withBorder
        value={confirmNewPwd}
        customErrorTips={getPasswordNotMatchTips()}
        onInputChange={onInputConfirmPassword}
      />
      <button
        className={clsx('pc-v2-btn', shouldDisableBtn ? 'disabled' : '')}
        onClick={submit}
        style={{ marginTop: '10px' }}
      >
        {LANG('提交')}
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
