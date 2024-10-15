import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import { ACCOUNT_TAB_KEY, ROUTE_PATH_KEY } from '../constants';
import { store } from '../store';

const LoginFooter = () => {
  const { curTab } = store;
  return (
    <div className={clsx('bottom-area', curTab !== ACCOUNT_TAB_KEY.QRCODE ? '' : 'bottom-qrcode')}>
      {curTab !== ACCOUNT_TAB_KEY.QRCODE ? (
        <TrLink href={`/${ROUTE_PATH_KEY.FORGET}`} className='bottom-link'>
          {LANG('忘记密码')}？
        </TrLink>
      ) : null}
      <span className='bottom-tips'>
        {LANG('还不是Y-MEX用户')}？
        <TrLink href={`/${ROUTE_PATH_KEY.REGISTER}`} className='bottom-link'>
          {LANG('立即注册')}
        </TrLink>
      </span>
      <style jsx>{styles}</style>
    </div>
  );
};
export { LoginFooter };

const styles = css`
  .bottom-area {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 36px;
    :global(.bottom-link) {
      font-size: 14px;
      font-weight: 400;
      color: var(--skin-main-font-color);
    }
    .bottom-tips {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      @media ${MediaInfo.mobile} {
        margin-top: 16px;
      }
    }
    @media ${MediaInfo.mobile} {
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .bottom-qrcode {
    justify-content: center;
  }
`;
