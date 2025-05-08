import { LANG, TrLink } from "@/core/i18n";
import { MediaInfo } from "@/core/utils";

export const RegisterSwitchLoginReg = () => {
  return (
    <>
      <p className='register-switch-login-reg-wrapper'>
        {LANG('已有账号')}？
        <TrLink href='/login' className='bottom-link'>
          {LANG('登录')}
        </TrLink>
        <style jsx>
          {`
            .register-switch-login-reg-wrapper {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 24px 0;
              color: var(--text_1);
              :global(.bottom-link) {
                font-size: 14px;
                font-weight: 400;
                color: var(--text_brand);
                margin-left: 8px;
              }
              .switch-login-reg-tips {
                text-align: center;
                font-size: 14px;
                font-weight: 400;
                color: var(--text_1);
                @media ${MediaInfo.mobile} {
                  margin-top: 16px;
                }
              }
              @media ${MediaInfo.mobile} {
                justify-content: flex-start;
              }
            }
          `}
        </style>
      </p>
    </>
  );
};
