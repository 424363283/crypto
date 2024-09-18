import { PasswordInput } from '../../basic-input/password-input';
import { InputPhone } from '../components/input-phone';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { LoginButton } from './login-btn';

export const PhoneLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.PHONE_LOGIN);
  return (
    <div>
      <InputPhone />
      <PasswordInput />
      <LoginButton shouldDisableBtn={shouldDisableBtn} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};
