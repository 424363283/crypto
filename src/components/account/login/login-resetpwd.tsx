import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import css from 'styled-jsx/css';
import { ROUTE_PATH_KEY } from '../constants';
import { MediaInfo } from '@/core/utils';

const LoginForgetButton = () => {
  return (
    <div className={clsx('auto-login-wrapper')}>
      <span className='bottom-tips'>
        <TrLink href={`/${ROUTE_PATH_KEY.FORGET}`} className='bottom-link'>
          {LANG('忘记密码')}？
        </TrLink>
      </span>
      <style jsx>{styles}</style>
    </div>
  );
};
export { LoginForgetButton };

const styles = css`
  .auto-login-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 24px;
    @media ${MediaInfo.mobile}{
      justify-content: flex-start;
    }
    :global( .bottom-link ) {
      color: var(--text_brand);
    }
  }

`;
