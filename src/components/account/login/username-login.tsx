import { PasswordInput } from '../../basic-input';
import { InputUsername } from '../components/input-username';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { LoginButton } from './login-btn';

export const UsernameLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.USERNAME_LOGIN);
  return (
    <div>
      <InputUsername />
      <PasswordInput />
      <LoginButton shouldDisableBtn={shouldDisableBtn} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};
