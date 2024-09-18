import { AccountBox } from '@/components/account/components/account-box';
import { PasswordInput } from '@/components/basic-input';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

export const UpdatePasswordForm = () => {
  const router = useRouter();
  const [inputState, setInputState] = useImmer({
    originFundsPwd: '',
    fundsPwd: '',
    confirmFundsPwd: '',
    originFundsPwdError: true,
    fundsPwdError: true,
    confirmFundsPwdError: true,
  });
  const { fundsPwd, confirmFundsPwd, fundsPwdError, confirmFundsPwdError, originFundsPwd, originFundsPwdError } =
    inputState;
  const onInputLoginPassword = (value: string, hasError: boolean = false) => {
    setInputState((draft) => {
      draft.originFundsPwd = value;
      draft.originFundsPwdError = hasError;
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
  const shouldDisableBtn =
    !passwordsMatch || fundsPwdError || confirmFundsPwdError || originFundsPwdError || !originFundsPwd;
  const getPasswordNotMatchTips = () => {
    if (fundsPwdError || confirmFundsPwdError) return '';
    return !passwordsMatch ? LANG('两次输入密码不一致') : '';
  };
  const handleBindPassword = async () => {
    if (shouldDisableBtn) return;
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        sence: SENCE.CHANGE_WITHDRAW,
        originFundsPwd,
        fundsPwd,
      },
    });
  };
  const goToFoundFundsPassword = async () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        sence: SENCE.FORGOT_WITHDRAW,
      },
    });
  };
  return (
    <AccountBox title={LANG('修改资金密码')} prompt={LANG('为了您的资产安全，修改密码后24h内不允许提币')}>
      <div className='funds-wrapper'>
        <PasswordInput
          label={LANG('原资金密码')}
          placeholder={LANG('请输入原资金密码')}
          withBorder
          value={originFundsPwd}
          onInputChange={onInputLoginPassword}
        />
        <PasswordInput
          label={LANG('新资金密码')}
          placeholder={LANG('请输入资金密码')}
          withBorder
          value={fundsPwd}
          onInputChange={onInputFundsPassword}
        />
        <PasswordInput
          label={LANG('确认资金密码')}
          withBorder
          placeholder={LANG('请再次确认资金密码')}
          value={confirmFundsPwd}
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
        <div className='funds-password'>
          <span onClick={goToFoundFundsPassword}>{LANG('忘记密码')}</span>
        </div>
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
};
const styles = css`
  .funds-wrapper {
    width: 530px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .funds-password {
      padding: 15px 0;
      cursor: pointer;
      span {
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        color: var(--theme-font-color-1);
        border-bottom: 1px dashed var(--theme-font-color-1);
      }
    }
  }
`;
