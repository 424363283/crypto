import { SENCE } from '@/core/shared';
import { LOCAL_KEY } from '@/core/store';
import { PasswordInput } from '../../basic-input/password-input';
import { InputEmail } from '../components/input-email';
import { InputInvitationCode } from '../components/invitation-code';
import { InputVerificationCode } from '../components/verification-code';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { RegisterButton } from './register-btn';
import { RegisterFooter } from './register-footer';

export const EmailRegister = () => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.EMAIL_REGISTER);
  return (
    <>
      <InputEmail />
      <InputVerificationCode type={LOCAL_KEY.INPUT_REGISTER_EMAIL} scene={SENCE.REGISTER} autoSend={false} />
      <PasswordInput />
      <InputInvitationCode />
      <RegisterButton shouldDisableBtn={shouldDisableBtn} type={LOCAL_KEY.INPUT_REGISTER_EMAIL} />
      <RegisterFooter />
    </>
  );
};
