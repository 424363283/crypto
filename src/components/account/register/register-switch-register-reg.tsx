import { LANG, TrLink } from "@/core/i18n";

export const RegisterSwitchLoginReg = () => {
  return (
    <>
      <p className='register-switch-login-reg-wrapper'>
        {LANG('已有账号')}？
        <TrLink href='/login'>&nbsp;&nbsp;{LANG('登录')}</TrLink>
        <style jsx>
          {`
            .register-switch-login-reg-wrapper {
              text-align: center;
              display: block;
              text-align: center;
              font-size: 14px;
              font-weight: 400;
              color: var(--theme-font-color-3);
              :global(a) {
                font-size: 14px;
                font-weight: 700;
                color: var(--skin-primary-color);
              }
            }
          `}
        </style>
      </p>
    </>
  );
};
