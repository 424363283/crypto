import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import { ROUTE_PATH_KEY } from '../constants';

const LoginSwitchLoginReg = () => {
  return (
    <div className={clsx('login-switch-login-reg-wrapper')}>
      <span className='switch-login-reg-tips'>
        {LANG('还没有账号吗')}？
        <TrLink href={`/${ROUTE_PATH_KEY.REGISTER}`} className='bottom-link'>
          {LANG('立即注册')}
        </TrLink>
      </span>
      <style jsx>{styles}</style>
    </div>
  );
};
export { LoginSwitchLoginReg };

const styles = css`
  .login-switch-login-reg-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
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
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;
