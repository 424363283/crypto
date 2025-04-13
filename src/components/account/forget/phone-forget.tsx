import { InputPhone } from '../components/input-phone';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { ForgetButton } from './forget-btn';
import { LANG, TrLink } from '@/core/i18n';

export const PhoneForget = () => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.PHONE_FORGET);
  return (
    <>
      <InputPhone />
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
            color: var(--text-brand);
            text-align: center;
            font-size: 14px;
            font-weight: 400;
          }

        }
      `}</style>
    </>
  );
};
