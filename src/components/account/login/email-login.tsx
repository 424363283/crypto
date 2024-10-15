import { MediaInfo } from '@/core/utils';
import { PasswordInput } from '../../basic-input';
import { InputEmail } from '../components/input-email';
import { useBtnStatus } from '../hooks/useBtnStatus';
import { TAB_TYPE } from '../types';
import { LoginButton } from './login-btn';
import { Desktop, Mobile, MobileOrTablet } from '@/components/responsive';
import { LoginFooter } from './login-footer';
import { ThirdPartBtns } from '../components/third-part-btns';
import { AutoLogin } from './auto-login';

export const EmailLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [shouldDisableBtn] = useBtnStatus(TAB_TYPE.EMAIL_LOGIN);
  return (
    <div>
    <MobileOrTablet forceInitRender={false}>
      <InputEmail showLabel={true} />
      <PasswordInput showLabel={true} />
    </MobileOrTablet>
    <Desktop>
      <InputEmail showLabel={false} />
      <PasswordInput showLabel={false} />
      <AutoLogin />
    </Desktop>
      <LoginButton shouldDisableBtn={shouldDisableBtn} onLoginSuccess={onLoginSuccess} />
      <ThirdPartBtns />
      <MobileOrTablet forceInitRender={false}>
        <LoginFooter />
      </MobileOrTablet>
    </div>
  );
};
