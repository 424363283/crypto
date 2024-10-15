import { SENCE } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { PasswordInput } from '../../basic-input/password-input';
import { InputPhone } from '../components/input-phone';
import { InputInvitationCode } from '../components/invitation-code';
import { InputVerificationCode } from '../components/verification-code';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { RegisterButton } from './register-btn';
import { RegisterFooter } from './register-footer';
import { MediaInfo } from '@/core/utils';
import { Mobile, MobileOrTablet } from '@/components/responsive';
import { ThirdPartBtns } from '../components/third-part-btns';

export const PhoneRegister = () => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.PHONE_REGISTER);
  return (
    <>
      <InputPhone showLabel={MediaInfo.isMobileOrTablet} />
      <InputVerificationCode showLabel={MediaInfo.isMobileOrTablet} type={LOCAL_KEY.INPUT_REGISTER_PHONE} scene={SENCE.REGISTER} autoSend={false} />
      <PasswordInput showLabel={MediaInfo.isMobileOrTablet} />
      <InputInvitationCode />
      <RegisterButton shouldDisableBtn={shouldDisableBtn} type={LOCAL_KEY.INPUT_REGISTER_PHONE} />
      <ThirdPartBtns />
      <MobileOrTablet forceInitRender={false}>
        <RegisterFooter />
      </MobileOrTablet>
    </>
  );
};
