import { MediaInfo } from '@/core/utils';
import { PasswordInput } from '../../basic-input';
import { InputEmail } from '../components/input-email';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { LoginButton } from './login-btn';

export const EmailLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.EMAIL_LOGIN);
  return (
    <div>
      <InputEmail showLabel={MediaInfo.isMobileOrTablet} />
      <PasswordInput showLabel={MediaInfo.isMobileOrTablet} />
      <LoginButton shouldDisableBtn={shouldDisableBtn} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};
