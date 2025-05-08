import { MediaInfo } from '@/core/utils';
import { InputEmail } from '../components/input-email';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { ForgetButton } from './forget-btn';
import { LANG, TrLink } from '@/core/i18n';
export const EmailForget = () => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.EMAIL_FORGET);
  return (
    <>
      <InputEmail showLabel={MediaInfo.isMobileOrTablet} />
      <ForgetButton shouldDisableBtn={shouldDisableBtn} />
      <div className={'login-btn'}>
        <TrLink href='/login' className='label'>
          {LANG('返回登录页面')}
        </TrLink>
      </div>
      <style jsx>{`
        :global(.login-btn) {
          padding:24px 0;
          text-align: center;
          :global(.label) {
            color: var(--text_brand);
            text-align: center;
            font-size: 14px;
            font-weight: 400;
          }

        }
      `}</style>
    </>
  );
};
